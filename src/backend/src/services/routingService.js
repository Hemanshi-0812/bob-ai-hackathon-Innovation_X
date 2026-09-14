import { REGIONS, CARRIERS } from "../data/mockData.js";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function recommendReroutes(disruption, impacted) {
  const alternateRegionPool = REGIONS.filter((r) => r !== disruption.region);

  return impacted.map(({ shipment, riskScore }) => {
    const highRisk = riskScore >= 70 || shipment.cargoValueUsd > 400000;

    if (highRisk) {
      const altRegion = pickRandom(alternateRegionPool);
      const altRoute = shipment.routeRegions.map((r) => (r === disruption.region ? altRegion : r));
      const altCarrier = pickRandom(CARRIERS.filter((c) => c !== shipment.carrier));

      return {
        shipmentId: shipment.shipmentId,
        recommendedAction: "reroute",
        alternateCarrier: altCarrier,
        alternateRoute: altRoute,
        rationale: `Risk score ${riskScore}/100 and cargo value $${shipment.cargoValueUsd.toLocaleString()} justify an active reroute via ${altRegion} with ${altCarrier} to avoid the ${disruption.type.replace("_", " ")} in ${disruption.region}.`,
        confidence: 0.78,
      };
    }

    return {
      shipmentId: shipment.shipmentId,
      recommendedAction: "monitor",
      alternateCarrier: null,
      alternateRoute: null,
      rationale: `Risk score ${riskScore}/100 is below the reroute threshold; continue monitoring the ${disruption.type.replace("_", " ")} for escalation before incurring carrier-swap costs.`,
      confidence: 0.6,
    };
  });
}
