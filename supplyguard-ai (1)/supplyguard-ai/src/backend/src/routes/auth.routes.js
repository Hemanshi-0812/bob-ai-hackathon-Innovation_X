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
  name: "Demo Operator",
  email: process.env.DEMO_USER_EMAIL || "[email protected]",
  password: process.env.DEMO_USER_PASSWORD || "supplyguard123",
  role: "operator",
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  if (!state.mongoConnected) {
    return res.status(503).json({
      error: "Registration requires a database connection. The app is currently running in offline mode — only the demo account is available. Start MongoDB (e.g. via docker compose) and try again.",
    });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "operator" });

  const token = signToken(user);
  return res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  if (state.mongoConnected) {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    return res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  }

  // Offline fallback — only the seeded demo account works
  if (email !== FALLBACK_USER.email || password !== FALLBACK_USER.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = signToken(FALLBACK_USER);
  return res.json({ token, user: { name: FALLBACK_USER.name, email: FALLBACK_USER.email, role: FALLBACK_USER.role } });
});

export default router;
