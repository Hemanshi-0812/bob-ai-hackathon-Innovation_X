import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Shipment from "../models/Shipment.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import TempReading from "../models/TempReading.js";
import * as mock from "../data/mockData.js";

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
  const [shipmentCount, fleetCount, disruptionCount, readingCount, userCount] = await Promise.all([
    Shipment.countDocuments(),
    FleetAsset.countDocuments(),
    Disruption.countDocuments(),
    TempReading.countDocuments(),
    User.countDocuments(),
  ]);

  if (shipmentCount === 0) await Shipment.insertMany(mock.shipments);
  if (fleetCount === 0) await FleetAsset.insertMany(mock.fleetAssets);
  if (disruptionCount === 0) await Disruption.insertMany(mock.disruptions);
  if (readingCount === 0) await TempReading.insertMany(mock.coldChainReadings);

  if (userCount === 0) {
    const email = process.env.DEMO_USER_EMAIL || "[email protected]";
    const password = process.env.DEMO_USER_PASSWORD || "supplyguard123";
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name: "Demo Operator", email, passwordHash, role: "operator" });
    console.log(`[db] Seeded demo user: ${email} / ${password}`);
  }

  console.log("[db] Seed check complete.");
}
