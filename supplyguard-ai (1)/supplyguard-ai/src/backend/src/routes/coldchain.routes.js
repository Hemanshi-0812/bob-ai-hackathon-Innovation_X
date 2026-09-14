import { Router } from "express";
import { getColdChainReadings } from "../services/dataStore.js";
import { detectExcursions } from "../services/coldchainService.js";

const router = Router();

// 8. IoT Cold-Chain Monitoring (raw simulated sensor readings)
router.get("/readings", async (req, res) => {
  res.json(await getColdChainReadings(req.query.shipmentId));
});

// 9. Temperature Excursion + Severity Detection
router.get("/excursions", async (req, res) => {
  res.json(await detectExcursions(req.query.shipmentId));
});

export default router;
