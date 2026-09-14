import { Router } from "express";
import { getShipments, getFleetAssets, getDisruptions } from "../services/dataStore.js";
import { findImpactedShipments } from "../services/disruptionService.js";
import { detectExcursions } from "../services/coldchainService.js";
import { filterUserVisibleDisruptions, filterUserVisibleFleetAssets, filterUserVisibleShipments, getUserRegion, isRegionalManager } from "../utils/access.js";

const router = Router();
const dashboardEntries = [];

router.get("/summary", async (req, res) => {
  const user = req.user || { role: "admin", region: "global" };
  const [shipments, fleet, disruptions, excursions] = await Promise.all([
    getShipments(),
    getFleetAssets(),
    getDisruptions(),
    detectExcursions(),
  ]);

  const visibleShipments = filterUserVisibleShipments(shipments, user);
  const visibleFleetAssets = filterUserVisibleFleetAssets(fleet, user);
  const visibleDisruptions = filterUserVisibleDisruptions(disruptions, user, visibleShipments);
  const visibleShipmentIds = new Set(visibleShipments.map((shipment) => shipment.shipmentId));
  const visibleExcursions = excursions.filter((excursion) => visibleShipmentIds.has(excursion.shipmentId));

  let totalImpacted = 0;
  let totalAtRiskValue = 0;
  const impactedByDisruption = [];
  for (const d of visibleDisruptions) {
    const impacted = (await findImpactedShipments(d)).filter((item) => visibleShipmentIds.has(item.shipment.shipmentId));
    totalImpacted += impacted.length;
    totalAtRiskValue += impacted.reduce((sum, i) => sum + i.shipment.cargoValueUsd, 0);
    impactedByDisruption.push({ disruptionId: d.disruptionId, region: d.region, severity: d.severity, impactedCount: impacted.length });
  }

  const idleAssets = visibleFleetAssets.filter((asset) => asset.status === "idle").length;
  const criticalExcursions = visibleExcursions.filter((excursion) => ["high", "critical"].includes(excursion.severity));

  const totalUserCargoValue = visibleShipments.reduce((sum, s) => sum + (Number(s.cargoValueUsd) || 0), 0);
  const inTransitCount = visibleShipments.filter((s) => s.status === "In Transit").length;
  const deliveredCount = visibleShipments.filter((s) => s.status === "Delivered").length;
  const delayedCount = visibleShipments.filter((s) => s.status === "Delayed").length;
  const coldChainCount = visibleShipments.filter((s) => s.isColdChain).length;

  res.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region || "global",
    },
    isAdmin: user.role === "admin",
    totals: {
      shipments: visibleShipments.length,
      inTransitShipments: inTransitCount,
      deliveredShipments: deliveredCount,
      delayedShipments: delayedCount,
      coldChainShipments: coldChainCount,
      totalCargoValueUsd: Math.round(totalUserCargoValue),
      fleetAssets: visibleFleetAssets.length,
      activeDisruptions: visibleDisruptions.length,
      impactedShipments: totalImpacted,
      atRiskCargoValueUsd: Math.round(totalAtRiskValue),
      idleAssets,
      coldChainExcursions: visibleExcursions.length,
      criticalColdChainExcursions: criticalExcursions.length,
    },
    fleetStatusBreakdown: Object.entries(
      visibleFleetAssets.reduce((acc, asset) => ({ ...acc, [asset.status]: (acc[asset.status] || 0) + 1 }), {})
    ).map(([status, count]) => ({ status, count })),
    impactedByDisruption,
    recentShipments: visibleShipments.slice(0, 6),
    relevantDisruptions: visibleDisruptions,
    dashboardEntries: dashboardEntries.filter((entry) => {
      if (!entry.region) return true;
      if (isRegionalManager(user) && getUserRegion(user) !== entry.region) return false;
      return true;
    }),
  });
});

router.post("/data", async (req, res) => {
  const user = req.user || { role: "admin", region: "global" };
  const { region, type, note, shipmentId } = req.body || {};

  if (!region || !type || !note) {
    return res.status(400).json({ error: "region, type, and note are required" });
  }

  if (isRegionalManager(user) && getUserRegion(user) !== region) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }

  const entry = {
    id: `DASH-${Date.now()}`,
    region,
    type,
    note,
    shipmentId: shipmentId || null,
    createdBy: user.email || user.role || "system",
    createdAt: new Date().toISOString(),
  };

  dashboardEntries.push(entry);
  res.status(201).json(entry);
});

export default router;
