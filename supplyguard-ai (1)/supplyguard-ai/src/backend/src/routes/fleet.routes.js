import { Router } from "express";
import { getFleetAssets, getDisruptionById } from "../services/dataStore.js";
import { findIdleAssets } from "../services/fleetService.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await getFleetAssets());
});

// 6 & 7. Idle Fleet Detection + Fleet Redeployment Recommendation
router.get("/idle", async (req, res) => {
  const { disruptionId } = req.query;
  const disruption = disruptionId ? await getDisruptionById(disruptionId) : null;
  const idle = await findIdleAssets(disruption);
  res.json(idle);
});

export default router;
