import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Shipment from "../models/Shipment.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import TempReading from "../models/TempReading.js";
import * as mock from "../data/mockData.js";
import { seedFullDatabase } from "../scripts/seedDatabase.js";

// Tracks whether MongoDB is actually reachable. When false, every service
// reads directly from the in-memory mock data instead of querying Mongoose
// models, so the app keeps working fully offline (e.g. local dev without
// Docker/Mongo running).
export const state = { mongoConnected: false };

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/supplyguard";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    state.mongoConnected = true;
    console.log("[db] Connected to MongoDB at", uri);
    await seedIfEmpty();
  } catch (err) {
    state.mongoConnected = false;
    console.warn("[db] MongoDB unreachable — falling back to in-memory mock data.", err.message);
  }
}

async function seedIfEmpty() {
  const shipmentCount = await Shipment.countDocuments();

  if (shipmentCount < 100) {
    console.log(`[db] Detected ${shipmentCount} shipments (< 100). Auto-seeding full 100+ dynamic intermodal database...`);
    await seedFullDatabase();
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@supplyguard.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "SupplyGuard@2026";
  const shipmentUserEmail = process.env.SHIPMENT_USER_EMAIL || "shipmentuser@supplyguard.ai";
  const shipmentUserPassword = process.env.SHIPMENT_USER_PASSWORD || "Shipment@2026";

  const seedUsers = [
    {
      name: "System Administrator",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      region: "global",
    },
    {
      name: "Shipment User",
      email: shipmentUserEmail,
      password: shipmentUserPassword,
      role: "shipment_user",
      region: "US-West",
    },
  ];

  for (const seedUser of seedUsers) {
    const passwordHash = await bcrypt.hash(seedUser.password, 10);
    await User.findOneAndUpdate(
      { email: seedUser.email },
      {
        $set: {
          name: seedUser.name,
          email: seedUser.email,
          passwordHash,
          role: seedUser.role,
          region: seedUser.region,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`[db] Ensured admin user: ${adminEmail} / ${adminPassword}`);
  console.log(`[db] Ensured shipment user: ${shipmentUserEmail} / ${shipmentUserPassword}`);

  console.log("[db] Seed check complete.");
}
