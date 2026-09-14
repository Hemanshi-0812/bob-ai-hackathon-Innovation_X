/**
 * Simulated JSON sensor & operational data.
 *
 * In production this represents the ingestion boundary from real systems:
 * a TMS export for shipments/routes, fleet telematics for asset status, and
 * an IoT platform for cold-chain temperature logs (commonly delivered as
 * JSON or CSV batches). Here it's generated deterministically so the whole
 * stack runs end-to-end without any external integration.
 *
 * On startup, if MongoDB is reachable, this data seeds the database. If
 * MongoDB is not reachable, services read directly from these arrays so the
 * app still works fully offline.
 */

const REGIONS = [
  "US-West", "US-East", "US-Gulf", "EU-North", "EU-Med",
  "Asia-SE", "Asia-East", "LatAm-East", "Middle-East", "Africa-North",
];

// Approximate lat/lng per region, used for the React Leaflet map.
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

const CARRIERS = ["Maersk", "MSC", "CMA CGM", "DHL Freight", "XPO Logistics", "J.B. Hunt"];
const MODES = ["truck", "vessel", "rail", "air"];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) & 0x7fffffff;
    return value / 0x7fffffff;
  };
}
const rand = seededRandom(42);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min, max, decimals = 1) {
  return Number((rand() * (max - min) + min).toFixed(decimals));
}

const now = Date.now();
const HOUR = 3600 * 1000;

export const disruptions = [
  {
    disruptionId: "DIS-1001",
    type: "port_strike",
    region: "EU-North",
    description: "Dockworker strike at Rotterdam and Antwerp terminals",
    startedAt: new Date(now - 30 * HOUR),
    estimatedDurationHours: 96,
    severity: "critical",
  },
  {
    disruptionId: "DIS-1002",
    type: "weather",
    region: "Asia-SE",
    description: "Typhoon approaching Singapore Strait shipping lanes",
    startedAt: new Date(now - 6 * HOUR),
    estimatedDurationHours: 48,
    severity: "high",
  },
  {
    disruptionId: "DIS-1003",
    type: "geopolitical",
    region: "Middle-East",
    description: "Escalation restricting Red Sea transit corridor",
    startedAt: new Date(now - 120 * HOUR),
    estimatedDurationHours: 720,
    severity: "critical",
  },
];

export const shipments = Array.from({ length: 25 }, (_, i) => {
  const [origin, destination] = sample(REGIONS, 2);
  const route = [origin, pick(REGIONS), destination];
  const isColdChain = i % 4 === 0;
  return {
    shipmentId: `SHP-${2000 + i + 1}`,
    origin,
    destination,
    currentLocation: pick(route),
    routeRegions: route,
    mode: pick(MODES),
    carrier: pick(CARRIERS),
    cargoType: isColdChain
      ? "Pharmaceuticals (cold chain)"
      : pick(["Electronics", "Automotive parts", "Retail goods", "Industrial equipment"]),
    cargoValueUsd: randFloat(50000, 750000, 2),
    isColdChain,
    eta: new Date(now + randInt(12, 240) * HOUR),
  };
});

export const fleetAssets = Array.from({ length: 40 }, (_, i) => {
  const statusRoll = rand();
  const status = statusRoll < 0.35 ? "idle" : statusRoll < 0.8 ? "in_transit" : statusRoll < 0.9 ? "loading" : "maintenance";
  return {
    assetId: `AST-${3000 + i + 1}`,
    type: pick(MODES),
    homeRegion: pick(REGIONS),
    currentRegion: pick(REGIONS),
    status,
    capacityUnits: randInt(20, 200),
    lastActiveHoursAgo: status === "idle" ? randFloat(0.5, 96) : randFloat(0, 6),
  };
});

const coldChainShipmentIds = shipments.filter((s) => s.isColdChain).map((s) => s.shipmentId);

export const coldChainReadings = coldChainShipmentIds.flatMap((shipmentId) => {
  const isOk = rand() > 0.3; // ~30% of cold-chain shipments show an excursion
  return Array.from({ length: 6 }, (_, h) => ({
    shipmentId,
    timestamp: new Date(now - (6 - h) * HOUR),
    temperatureC: isOk ? randFloat(2.0, 8.0) : randFloat(-4.0, 14.0),
    requiredMinC: 2.0,
    requiredMaxC: 8.0,
  }));
});

export { REGIONS, CARRIERS };
