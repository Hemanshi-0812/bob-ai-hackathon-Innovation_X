import { getColdChainReadings } from "./dataStore.js";

const CLASSIFICATION_BANDS = [
  { max: 0.5, severity: "low", action: "Minor excursion — log and continue monitoring" },
  { max: 2.0, severity: "medium", action: "Moderate excursion — QA review required before delivery" },
  { max: 5.0, severity: "high", action: "Major excursion — quarantine cargo pending lab assessment" },
  { max: Infinity, severity: "critical", action: "Critical excursion — cargo likely compromised, notify regulatory affairs" },
];

function classify(delta) {
  return CLASSIFICATION_BANDS.find((b) => delta <= b.max);
}

export async function detectExcursions(shipmentId) {
  const readings = await getColdChainReadings(shipmentId);
  const excursions = [];

  for (const r of readings) {
    let delta = 0;
    if (r.temperatureC < r.requiredMinC) delta = r.requiredMinC - r.temperatureC;
    else if (r.temperatureC > r.requiredMaxC) delta = r.temperatureC - r.requiredMaxC;
    else continue; // within range

    const { severity, action } = classify(delta);
    excursions.push({
      shipmentId: r.shipmentId,
      timestamp: r.timestamp,
      temperatureC: r.temperatureC,
      allowedRangeC: [r.requiredMinC, r.requiredMaxC],
      severity,
      regulatoryClassification: action.split(" — ")[0],
      recommendedAction: action,
    });
  }

  return excursions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
