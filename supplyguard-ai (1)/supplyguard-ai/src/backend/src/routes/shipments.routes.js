import { Router } from "express";
import { getShipments } from "../services/dataStore.js";
import { REGION_COORDS } from "../data/mockData.js";

const router = Router();

router.get("/", async (req, res) => {
  const shipments = await getShipments();
  res.json(shipments);
});

router.get("/:id", async (req, res) => {
  const shipments = await getShipments();
  const shipment = shipments.find((s) => s.shipmentId === req.params.id);
  if (!shipment) return res.status(404).json({ error: "Shipment not found" });
  res.json(shipment);
});

router.get("/map/coords", async (req, res) => {
  res.json(REGION_COORDS);
});

export default router;
