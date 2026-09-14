import { Router } from "express";
import { getShipments, getFleetAssets, getDisruptions } from "../services/dataStore.js";
import { findImpactedShipments } from "../services/disruptionService.js";
import { findIdleAssets } from "../services/fleetService.js";
import { detectExcursions } from "../services/coldchainService.js";

const router = Router();

router.get("/summary", async (req, res) => {
  const [shipments, fleet, disruptions, excursions] = await Promise.all([
    getShipments(),
    getFleetAssets(),
    getDisruptions(),
    detectExcursions(),
  ]);

  let totalImpacted = 0;
  let totalAtRiskValue = 0;
  const impactedByDisruption = [];
  for (const d of disruptions) {
    const impacted = await findImpactedShipments(d);
    totalImpacted += impacted.length;
    totalAtRiskValue += impacted.reduce((sum, i) => sum + i.shipment.cargoValueUsd, 0);
    impactedByDisruption.push({ disruptionId: d.disruptionId, region: d.region, severity: d.severity, impactedCount: impacted.length });
  }

  const idleAssets = await findIdleAssets(null);
  const criticalExcursions = excursions.filter((e) => ["high", "critical"].includes(e.severity));

  res.json({
    totals: {
      shipments: shipments.length,
      fleetAssets: fleet.length,
      activeDisruptions: disruptions.length,
      impactedShipments: totalImpacted,
      atRiskCargoValueUsd: Math.round(totalAtRiskValue),
      idleAssets: idleAssets.length,
      coldChainExcursions: excursions.length,
      criticalColdChainExcursions: criticalExcursions.length,
    },
    fleetStatusBreakdown: Object.entries(
      fleet.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {})
    ).map(([status, count]) => ({ status, count })),
    impactedByDisruption,
  });
});

export default router;
