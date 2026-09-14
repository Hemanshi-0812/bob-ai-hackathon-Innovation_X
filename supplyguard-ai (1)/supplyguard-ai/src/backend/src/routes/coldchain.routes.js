import { Router } from "express";
import { getColdChainReadings, getShipments } from "../services/dataStore.js";
import { detectExcursions } from "../services/coldchainService.js";
import { filterUserVisibleShipments } from "../utils/access.js";

const router = Router();

async function getVisibleShipmentIdsForUser(user) {
  return new Set(
    filterUserVisibleShipments(await getShipments(), user || { role: "admin", region: "global" }).map((shipment) => shipment.shipmentId)
  );
}

// 8. IoT Cold-Chain Monitoring (raw simulated sensor readings)
router.get("/readings", async (req, res) => {
  const visibleShipmentIds = await getVisibleShipmentIdsForUser(req.user);
  if (req.query.shipmentId && !visibleShipmentIds.has(req.query.shipmentId)) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }

  const readings = await getColdChainReadings(req.query.shipmentId);
  const filteredReadings = readings.filter((reading) => visibleShipmentIds.has(reading.shipmentId));
  res.json(filteredReadings);
});

// 9. Temperature Excursion + Severity Detection
router.get("/excursions", async (req, res) => {
  const visibleShipmentIds = await getVisibleShipmentIdsForUser(req.user);
  if (req.query.shipmentId && !visibleShipmentIds.has(req.query.shipmentId)) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }

  const excursions = await detectExcursions(req.query.shipmentId);
  const filteredExcursions = excursions.filter((excursion) => visibleShipmentIds.has(excursion.shipmentId));
  res.json(filteredExcursions);
});

export default router;
