import { getShipments } from "./dataStore.js";

const SEVERITY_BASE_RISK = { low: 20, medium: 40, high: 65, critical: 85 };

export async function findImpactedShipments(disruption) {
  const shipments = await getShipments();
  const baseRisk = SEVERITY_BASE_RISK[disruption.severity] ?? 30;
  const impacted = [];

  for (const shipment of shipments) {
    const touchesRegion = shipment.routeRegions.includes(disruption.region);
    if (!touchesRegion) continue;

    let proximityBonus = 0;
    let reason;
    if (shipment.currentLocation === disruption.region) {
      proximityBonus = 15;
      reason = `Shipment is currently located in ${disruption.region}, directly inside the disruption zone.`;
    } else if ([shipment.origin, shipment.destination].includes(disruption.region)) {
      proximityBonus = 5;
      const which = disruption.region === shipment.origin ? "origin" : "destination";
      reason = `Shipment's ${which} (${disruption.region}) is inside the disruption zone.`;
    } else {
      reason = `Shipment's planned route passes through ${disruption.region}.`;
    }

    const coldChainBonus = shipment.isColdChain ? 10 : 0;
    const riskScore = Math.min(100, baseRisk + proximityBonus + coldChainBonus);
    const delayEstimateHours = Math.round(
      disruption.estimatedDurationHours * (shipment.currentLocation === disruption.region ? 0.9 : 0.5)
    );

    impacted.push({
      shipment,
      disruptionId: disruption.disruptionId,
      impactReason: reason,
      delayEstimateHours,
      riskScore,
    });
  }

  return impacted.sort((a, b) => b.riskScore - a.riskScore);
}
