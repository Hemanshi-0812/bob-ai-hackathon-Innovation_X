import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import TempReading from "../models/TempReading.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const REGIONS = [
  "US-West", "US-East", "US-Gulf", "EU-North", "EU-Med",
  "Asia-SE", "Asia-East", "LatAm-East", "Middle-East", "Africa-North",
];

export const REGION_COORDS = {
  "US-West": [37.77, -122.42],
  "US-East": [40.71, -74.01],
  "US-Gulf": [29.76, -95.37],
  "EU-North": [51.92, 4.48],
  "EU-Med": [41.9, 12.5],
  "Asia-SE": [1.35, 103.82],
  "Asia-East": [31.23, 121.47],
  "LatAm-East": [-23.55, -46.63],
  "Middle-East": [25.2, 55.27],
  "Africa-North": [30.04, 31.24],
};

const CARRIERS = [
  "Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen Marine",
  "DHL Global Forwarding", "Kuehne+Nagel", "FedEx Freight", "J.B. Hunt", "DB Schenker"
];

const MODES = ["vessel", "truck", "rail", "air"];

const COLD_CARGOS = [
  "Insulin & Biologics (2-8°C)",
  "mRNA Vaccines & Injectables (-20°C)",
  "Oncology Biotherapeutics (2-8°C)",
  "Fresh Specialty Perishables (0-4°C)",
  "Clinical Trial Specimens (2-8°C)",
  "Enzyme Injections & Blood Plasma (-15°C)"
];

const GENERAL_CARGOS = [
  "Next-Gen AI GPU Accelerators",
  "Automotive Powertrain Assemblies",
  "EV Lithium-Ion Battery Packs",
  "Aviation Avionics & Sensor Arrays",
  "Semiconductor Fabrication Wafers",
  "Precision Surgical Robotics",
  "High-End Consumer Electronics",
  "Industrial Automation Turbines",
  "Solar PV Microinverters",
  "Specialty Polymers & Resins"
];

function seededRandom(seed = 1337) {
  let value = seed;
  return () => {
    value = (value * 16807 + 0) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function generate100Data() {
  const rand = seededRandom(2026);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
  const randFloat = (min, max, dec = 2) => Number((rand() * (max - min) + min).toFixed(dec));

  const now = Date.now();
  const HOUR = 3600 * 1000;

  // 1. DISRUPTIONS
  const disruptionsList = [
    {
      disruptionId: "DIS-1001",
      type: "port_strike",
      region: "EU-North",
      description: "Dockworker labor action across Rotterdam and Antwerp container terminals",
      startedAt: new Date(now - 36 * HOUR),
      estimatedDurationHours: 96,
      severity: "critical",
    },
    {
      disruptionId: "DIS-1002",
      type: "weather",
      region: "Asia-SE",
      description: "Category 4 Typhoon navigating through the Singapore & Malacca Straits",
      startedAt: new Date(now - 14 * HOUR),
      estimatedDurationHours: 54,
      severity: "high",
    },
    {
      disruptionId: "DIS-1003",
      type: "geopolitical",
      region: "Middle-East",
      description: "Security corridor restrictions requiring Cape of Good Hope rerouting",
      startedAt: new Date(now - 140 * HOUR),
      estimatedDurationHours: 720,
      severity: "critical",
    },
    {
      disruptionId: "DIS-1004",
      type: "weather",
      region: "US-West",
      description: "Severe coastal fog and multi-vessel berth queues at LA / Long Beach",
      startedAt: new Date(now - 22 * HOUR),
      estimatedDurationHours: 68,
      severity: "high",
    },
    {
      disruptionId: "DIS-1005",
      type: "infrastructure",
      region: "LatAm-East",
      description: "Drought restrictions limiting daily neopanamax lock transits",
      startedAt: new Date(now - 72 * HOUR),
      estimatedDurationHours: 240,
      severity: "medium",
    },
    {
      disruptionId: "DIS-1006",
      type: "weather",
      region: "US-East",
      description: "Nor'easter storm bringing high winds to Newark and Norfolk intermodal yards",
      startedAt: new Date(now - 8 * HOUR),
      estimatedDurationHours: 36,
      severity: "medium",
    },
  ];

  // 2. 120 SHIPMENTS (>= 100)
  const shipmentsList = [];
  const TOTAL_SHIPMENTS = 120;

  for (let i = 1; i <= TOTAL_SHIPMENTS; i++) {
    const originIdx = randInt(0, REGIONS.length - 1);
    let destIdx = randInt(0, REGIONS.length - 1);
    while (destIdx === originIdx) {
      destIdx = randInt(0, REGIONS.length - 1);
    }
    const origin = REGIONS[originIdx];
    const destination = REGIONS[destIdx];

    // Build realistic route with 1-2 intermediate waypoints
    let waypoint = pick(REGIONS);
    while (waypoint === origin || waypoint === destination) {
      waypoint = pick(REGIONS);
    }
    const route = [origin, waypoint, destination];

    const isColdChain = i % 3 === 0;
    const cargoType = isColdChain ? pick(COLD_CARGOS) : pick(GENERAL_CARGOS);
    const mode = pick(MODES);
    const carrier = pick(CARRIERS);

    // Timing
    const elapsedHours = randInt(4, 180);
    const startedAt = new Date(now - elapsedHours * HOUR);
    const remainingHours = randInt(12, 280);
    const eta = new Date(now + remainingHours * HOUR);
    const deadlineAt = new Date(eta.getTime() + randInt(6, 48) * HOUR);

    // Current location along the corridor
    let currentLocation = origin;
    if (elapsedHours > 72) {
      currentLocation = rand() > 0.4 ? waypoint : destination;
    } else if (elapsedHours > 24) {
      currentLocation = waypoint;
    }

    // Assign owners
    let createdBy = "admin@supplyguard.ai";
    let userId = "system-admin";
    if (i <= 15) {
      createdBy = "shipmentuser@supplyguard.ai";
      userId = "demo-shipment-user";
    } else if (i <= 25) {
      createdBy = "hetarajani@gmail.com";
      userId = "user-hetarajani";
    } else if (i <= 35) {
      createdBy = "malay@gmail.com";
      userId = "user-malay";
    }

    // Status logic
    let status = "In Transit";
    const routeDisrupted = route.some((r) =>
      disruptionsList.some((d) => d.region === r && ["critical", "high"].includes(d.severity))
    );

    if (i % 8 === 0) {
      status = "Delivered";
      currentLocation = destination;
    } else if (routeDisrupted && rand() > 0.3) {
      status = "Delayed";
    }

    const priorities = ["Critical", "High", "Express", "Standard"];
    const priority = isColdChain ? (rand() > 0.4 ? "Critical" : "High") : pick(priorities);

    shipmentsList.push({
      shipmentId: `SHP-${1000 + i}`,
      origin,
      destination,
      currentLocation,
      routeRegions: route,
      mode,
      carrier,
      cargoType,
      cargoValueUsd: randFloat(75000, 1450000, 2),
      isColdChain,
      startedAt,
      eta,
      deadlineAt,
      hoursElapsed: elapsedHours,
      createdBy,
      userId,
      status,
      priority,
      notes: isColdChain
        ? `IoT cold-chain telematics active. Monitored thermal boundaries with automated alert triggers.`
        : `Intermodal priority manifest #${2000 + i}. Standard customs clearance corridor.`,
    });
  }

  // 3. 50 FLEET ASSETS
  const fleetAssetsList = [];
  const TOTAL_ASSETS = 50;
  for (let i = 1; i <= TOTAL_ASSETS; i++) {
    const statusRoll = rand();
    const status = statusRoll < 0.25 ? "idle" : statusRoll < 0.75 ? "in_transit" : statusRoll < 0.9 ? "loading" : "maintenance";
    const mode = pick(MODES);
    const homeRegion = pick(REGIONS);
    const currentRegion = status === "idle" ? homeRegion : pick(REGIONS);

    fleetAssetsList.push({
      assetId: `AST-${4000 + i}`,
      type: mode,
      homeRegion,
      currentRegion,
      status,
      capacityUnits: mode === "vessel" ? randInt(1200, 18000) : mode === "rail" ? randInt(120, 450) : randInt(24, 90),
      lastActiveHoursAgo: status === "idle" ? randFloat(1.5, 96, 1) : randFloat(0.1, 8.0, 1),
    });
  }

  // 4. COLD CHAIN READINGS
  const coldChainReadingsList = [];
  const coldShipments = shipmentsList.filter((s) => s.isColdChain);

  coldShipments.forEach((s) => {
    const isUltraCold = s.cargoType.includes("-20°C") || s.cargoType.includes("-15°C");
    const targetMin = isUltraCold ? -25.0 : 2.0;
    const targetMax = isUltraCold ? -15.0 : 8.0;
    const midPoint = (targetMin + targetMax) / 2;

    // Generate last 8 hourly readings for each cold shipment
    for (let h = 7; h >= 0; h--) {
      // 20% chance of a slight excursion spike on recent readings
      let temp = randFloat(midPoint - 1.5, midPoint + 1.5, 2);
      if (h <= 1 && s.status === "Delayed" && rand() > 0.4) {
        temp = isUltraCold ? targetMax + randFloat(1.5, 6.0, 2) : targetMax + randFloat(1.2, 4.8, 2);
      }

      coldChainReadingsList.push({
        shipmentId: s.shipmentId,
        timestamp: new Date(now - h * HOUR),
        temperatureC: temp,
        requiredMinC: targetMin,
        requiredMaxC: targetMax,
      });
    }
  });

  return {
    disruptions: disruptionsList,
    shipments: shipmentsList,
    fleetAssets: fleetAssetsList,
    coldChainReadings: coldChainReadingsList,
  };
}

export async function seedFullDatabase() {
  const { disruptions, shipments, fleetAssets, coldChainReadings } = generate100Data();

  console.log(`[Seed] Generated ${shipments.length} shipments, ${fleetAssets.length} fleet assets, ${disruptions.length} disruptions, ${coldChainReadings.length} cold chain readings.`);

  // Replace existing datasets with the comprehensive 100+ dataset
  await Promise.all([
    Shipment.deleteMany({}),
    FleetAsset.deleteMany({}),
    Disruption.deleteMany({}),
    TempReading.deleteMany({}),
  ]);

  await Promise.all([
    Shipment.insertMany(shipments),
    FleetAsset.insertMany(fleetAssets),
    Disruption.insertMany(disruptions),
    TempReading.insertMany(coldChainReadings),
  ]);

  // Ensure primary users exist
  const defaultUsers = [
    { email: "admin@supplyguard.ai", name: "System Administrator", role: "admin", region: "global", pass: "SupplyGuard@2026" },
    { email: "shipmentuser@supplyguard.ai", name: "Shipment User", role: "shipment_user", region: "US-West", pass: "Shipment@2026" },
    { email: "hetarajani@gmail.com", name: "Heta Rajani", role: "admin", region: "global", pass: "Heta@123" },
    { email: "malay@gmail.com", name: "Malay Admin", role: "admin", region: "global", pass: "Malay@123" },
  ];

  for (const u of defaultUsers) {
    const passwordHash = await bcrypt.hash(u.pass, 10);
    await User.findOneAndUpdate(
      { email: u.email },
      { $set: { name: u.name, email: u.email, passwordHash, role: u.role, region: u.region } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`[Seed] Successfully seeded ${shipments.length} dynamic shipments into MongoDB!`);
  return {
    shipmentCount: shipments.length,
    fleetCount: fleetAssets.length,
    disruptionCount: disruptions.length,
    tempReadingCount: coldChainReadings.length,
  };
}

// If executed directly: node seedDatabase.js
if (process.argv[1]?.endsWith("seedDatabase.js")) {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/supplyguard";
  mongoose.connect(uri)
    .then(async () => {
      console.log("[Seed] Connected to MongoDB at", uri);
      const res = await seedFullDatabase();
      console.log("[Seed] Seeding completed:", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Seed] Error:", err);
      process.exit(1);
    });
}
