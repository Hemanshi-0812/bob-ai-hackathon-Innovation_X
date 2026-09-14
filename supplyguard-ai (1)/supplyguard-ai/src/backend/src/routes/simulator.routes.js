import { Router } from "express";
import { simulator } from "../services/simulatorService.js";
import { seedFullDatabase } from "../scripts/seedDatabase.js";
import Shipment from "../models/Shipment.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import TempReading from "../models/TempReading.js";

const router = Router();

// GET /api/simulator/status
router.get("/status", async (req, res) => {
  try {
    const status = simulator.getStatus();
    const [shipmentCount, fleetCount, disruptionCount, tempReadingCount] = await Promise.all([
      Shipment.countDocuments(),
      FleetAsset.countDocuments(),
      Disruption.countDocuments(),
      TempReading.countDocuments(),
    ]);

    res.json({
      ...status,
      databaseCounts: {
        shipments: shipmentCount,
        fleetAssets: fleetCount,
        disruptions: disruptionCount,
        tempReadings: tempReadingCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/simulator/tick - Trigger an immediate simulation cycle
router.post("/tick", async (req, res) => {
  try {
    const result = await simulator.tick();
    res.json({ message: "Simulation tick processed successfully", ...result });
  } catch (err) {
    res.status(500).json({ error: "Failed to process simulation tick: " + err.message });
  }
});

// POST /api/simulator/toggle - Start or Pause background simulation
router.post("/toggle", (req, res) => {
  if (simulator.isRunning) {
    simulator.stop();
  } else {
    simulator.start();
  }
  res.json({ isRunning: simulator.isRunning, message: simulator.isRunning ? "Simulator started" : "Simulator paused" });
});

// POST /api/simulator/reset - Re-seed 100+ clean dynamic records
router.post("/reset", async (req, res) => {
  try {
    const result = await seedFullDatabase();
    res.json({ message: "Database re-seeded successfully with 100+ dynamic records", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed database: " + err.message });
  }
});

export default router;
