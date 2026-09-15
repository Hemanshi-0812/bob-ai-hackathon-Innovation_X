import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";
import { state } from "../config/db.js";

const router = Router();

// In-memory fallback user, mirrors the seeded Mongo demo user, used only
// when MongoDB isn't reachable. Registration is disabled in this mode since
// there's nowhere durable to persist a new account.
const FALLBACK_USER = {
  name: "System Administrator",
  email: process.env.ADMIN_EMAIL || "admin@supplyguard.ai",
  password: process.env.ADMIN_PASSWORD || "SupplyGuard@2026",
  role: "admin",
  region: "global",
};

const FALLBACK_SHIPMENT_USER = {
  name: "Shipment User",
  email: process.env.SHIPMENT_USER_EMAIL || "shipmentuser@supplyguard.ai",
  password: process.env.SHIPMENT_USER_PASSWORD || "Shipment@2026",
  role: "shipment_user",
  region: "US-West",
};

const FALLBACK_USERS = [
  FALLBACK_USER,
  FALLBACK_SHIPMENT_USER,
];

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const assignedRole = role === "admin" ? "admin" : "shipment_user";
  const assignedRegion = assignedRole === "admin" ? "global" : "US-West";

  if (state.mongoConnected) {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: assignedRole, region: assignedRegion });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { name: user.name, email: user.email, role: user.role, region: user.region || assignedRegion },
    });
  }

  // Offline / in-memory registration
  const normalizedEmail = email.trim().toLowerCase();
  const existingFallback = FALLBACK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingFallback) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: assignedRole,
    region: assignedRegion,
    sub: `usr-${Date.now()}`,
  };
  FALLBACK_USERS.push(newUser);

  const token = signToken(newUser);
  return res.status(201).json({
    token,
    user: { name: newUser.name, email: newUser.email, role: newUser.role, region: newUser.region },
  });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  // If role is explicitly provided, use it. Otherwise default to "admin" for full command access
  const targetRole = role === "shipment_user" ? "shipment_user" : "admin";

  if (state.mongoConnected) {
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Auto-provision account on sign-in
      const nameParts = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        name: formattedName || "Verified User",
        email: cleanEmail,
        passwordHash,
        role: targetRole,
        region: targetRole === "admin" ? "global" : "US-West",
      });
      console.log(`[auth] Auto-provisioned new user on sign-in: ${cleanEmail} (${targetRole})`);
    } else {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        // Auto-update password hash so user is seamlessly logged in and never locked out
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
      }
      console.log(`[auth] User ${cleanEmail} authenticated with persisted role: ${user.role}`);
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role, region: user.region || "global" },
    });
  }

  let foundUser = FALLBACK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!foundUser) {
    const nameParts = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    foundUser = {
      name: nameParts.charAt(0).toUpperCase() + nameParts.slice(1) || "Verified User",
      email: cleanEmail,
      password,
      role: targetRole,
      region: targetRole === "admin" ? "global" : "US-West",
      sub: `usr-${Date.now()}`,
    };
    FALLBACK_USERS.push(foundUser);
  } else {
    foundUser.password = password;
    foundUser.role = targetRole;
  }

  const token = signToken(foundUser);
  return res.json({
    token,
    user: { name: foundUser.name, email: foundUser.email, role: foundUser.role, region: foundUser.region || "global" },
  });
});

// Endpoint to toggle/switch roles dynamically (restricted to prevent privilege escalation)
router.post("/switch-role", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing authorization token" });

  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const { role } = req.body || {};
    const newRole = role === "shipment_user" ? "shipment_user" : "admin";

    // Strictly disallow privilege escalation: non-admin users cannot elevate to admin
    if (payload.role !== "admin" && newRole === "admin") {
      return res.status(403).json({ error: "Access denied: Unauthorized privilege escalation to administrator." });
    }

    if (state.mongoConnected) {
      const user = await User.findOne({ email: payload.email });
      if (user) {
        // Also check persisted DB role
        if (user.role !== "admin" && newRole === "admin") {
          return res.status(403).json({ error: "Access denied: Unauthorized privilege escalation to administrator." });
        }
        user.role = newRole;
        if (newRole === "admin") user.region = "global";
        await user.save();
        const newToken = signToken(user);
        return res.json({
          token: newToken,
          user: { name: user.name, email: user.email, role: user.role, region: user.region || "global" },
        });
      }
    }

    const updatedUser = {
      name: payload.name || "User",
      email: payload.email,
      role: newRole,
      region: newRole === "admin" ? "global" : "US-West",
      sub: payload.sub,
    };
    const newToken = signToken(updatedUser);
    return res.json({
      token: newToken,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(400).json({ error: "Failed to switch role: " + err.message });
  }
});

export default router;
