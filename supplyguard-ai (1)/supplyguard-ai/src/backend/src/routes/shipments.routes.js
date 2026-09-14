import { Router } from "express";
import { getShipments, addShipment, deleteShipment, updateShipment } from "../services/dataStore.js";
import { REGION_COORDS } from "../data/mockData.js";
import { filterUserVisibleShipments, isAdmin } from "../utils/access.js";

const router = Router();

router.get("/", async (req, res) => {
  const allShipments = await getShipments();
  let shipments = filterUserVisibleShipments(allShipments, req.user || { role: "admin", region: "global" });

  // If admin specifies a filter for a specific shipper email
  if (isAdmin(req.user) && req.query.shipper) {
    shipments = allShipments.filter(
      (s) => (s.createdBy || "").toLowerCase() === req.query.shipper.toLowerCase()
    );
  }

  res.json(shipments);
});

router.get("/:id", async (req, res) => {
  const shipments = filterUserVisibleShipments(await getShipments(), req.user || { role: "admin", region: "global" });
  const shipment = shipments.find((s) => s.shipmentId === req.params.id);
  if (!shipment) return res.status(404).json({ error: "Shipment not found" });
  res.json(shipment);
});

router.get("/map/coords", async (req, res) => {
  res.json(REGION_COORDS);
});

// Create new shipment
router.post("/", async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Authentication required to add shipment" });
  }

  const {
    shipmentId,
    origin,
    destination,
    mode = "truck",
    carrier = "DHL Freight",
    cargoType = "General Goods",
    cargoValueUsd = 100000,
    isColdChain = false,
    eta,
    deadlineAt,
    priority = "Standard",
    notes = "",
  } = req.body || {};

  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and Destination are required" });
  }

  const now = new Date();
  const generatedId = shipmentId && shipmentId.trim() !== ""
    ? shipmentId.trim().toUpperCase()
    : `SHP-${Math.floor(100000 + Math.random() * 900000)}`;

  const routeRegions = [origin, destination];
  const etaDate = eta ? new Date(eta) : new Date(now.getTime() + 72 * 3600 * 1000);
  const deadlineDate = deadlineAt ? new Date(deadlineAt) : new Date(etaDate.getTime() + 24 * 3600 * 1000);

  const newShipment = {
    shipmentId: generatedId,
    origin,
    destination,
    currentLocation: origin,
    routeRegions,
    mode,
    carrier,
    cargoType,
    cargoValueUsd: Number(cargoValueUsd) || 0,
    isColdChain: Boolean(isColdChain),
    eta: etaDate,
    deadlineAt: deadlineDate,
    startedAt: now,
    hoursElapsed: 0,
    createdBy: user.email,
    userId: user.sub || user.email,
    status: "In Transit",
    priority,
    notes,
  };

  try {
    const created = await addShipment(newShipment);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create shipment: " + err.message });
  }
});

// Update shipment
router.patch("/:id", async (req, res) => {
  const user = req.user;
  const allShipments = await getShipments();
  const existing = allShipments.find((s) => s.shipmentId === req.params.id);

  if (!existing) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  // Ensure user owns this shipment or is admin
  if (!isAdmin(user) && existing.createdBy !== user.email && existing.userId !== user.sub) {
    return res.status(403).json({ error: "You can only modify your own shipments" });
  }

  const { status, notes, priority, currentLocation } = req.body || {};
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (priority !== undefined) updates.priority = priority;
  if (currentLocation !== undefined) updates.currentLocation = currentLocation;

  try {
    const updated = await updateShipment(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update shipment" });
  }
});

// Delete shipment
router.delete("/:id", async (req, res) => {
  const user = req.user;
  const allShipments = await getShipments();
  const existing = allShipments.find((s) => s.shipmentId === req.params.id);

  if (!existing) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  // Ensure user owns this shipment or is admin
  if (!isAdmin(user) && existing.createdBy !== user.email && existing.userId !== user.sub) {
    return res.status(403).json({ error: "You can only delete your own shipments" });
  }

  try {
    const success = await deleteShipment(req.params.id);
    if (success) {
      res.json({ message: "Shipment deleted successfully", shipmentId: req.params.id });
    } else {
      res.status(404).json({ error: "Shipment not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete shipment" });
  }
});

export default router;
