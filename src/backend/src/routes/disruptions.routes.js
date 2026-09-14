import { Router } from "express";
import { getDisruptions, getDisruptionById } from "../services/dataStore.js";
import { findImpactedShipments } from "../services/disruptionService.js";
import { recommendReroutes } from "../services/routingService.js";
import { REGION_COORDS } from "../data/mockData.js";
import { filterUserVisibleDisruptions, getUserRegion, isRegionalManager } from "../utils/access.js";

const router = Router();

// 3. Disruption Detection
router.get("/", async (req, res) => {
  const disruptions = filterUserVisibleDisruptions(await getDisruptions(), req.user || { role: "admin", region: "global" });
  const withCoords = disruptions.map((d) => ({ ...d, coords: REGION_COORDS[d.region] }));
  res.json(withCoords);
});

router.get("/:id", async (req, res) => {
  const disruption = await getDisruptionById(req.params.id);
  if (!disruption) return res.status(404).json({ error: "Disruption not found" });
  if (isRegionalManager(req.user) && getUserRegion(req.user) !== disruption.region) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }
  res.json({ ...disruption, coords: REGION_COORDS[disruption.region] });
});

// 4. Affected Shipment + Risk Analysis
router.get("/:id/impacted-shipments", async (req, res) => {
  const disruption = await getDisruptionById(req.params.id);
  if (!disruption) return res.status(404).json({ error: "Disruption not found" });
  if (isRegionalManager(req.user) && getUserRegion(req.user) !== disruption.region) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }
  const impacted = await findImpactedShipments(disruption);
  res.json(impacted);
});

// 5. AI Rerouting Recommendation
router.get("/:id/reroute-recommendations", async (req, res) => {
  const disruption = await getDisruptionById(req.params.id);
  if (!disruption) return res.status(404).json({ error: "Disruption not found" });
  if (isRegionalManager(req.user) && getUserRegion(req.user) !== disruption.region) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }
  const impacted = await findImpactedShipments(disruption);
  const reroutes = recommendReroutes(disruption, impacted);
  res.json(reroutes);
});

export default router;
