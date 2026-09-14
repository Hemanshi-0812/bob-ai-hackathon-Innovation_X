import { Router } from "express";
import { getFleetAssets, getDisruptionById } from "../services/dataStore.js";
import { findIdleAssets } from "../services/fleetService.js";
import { filterUserVisibleFleetAssets } from "../utils/access.js";

const router = Router();

router.get("/", async (req, res) => {
  const fleet = filterUserVisibleFleetAssets(await getFleetAssets(), req.user || { role: "admin", region: "global" });
  res.json(fleet);
});

// 6 & 7. Idle Fleet Detection + Fleet Redeployment Recommendation
router.get("/idle", async (req, res) => {
  const { disruptionId } = req.query;
  const disruption = disruptionId ? await getDisruptionById(disruptionId) : null;
  const fleet = filterUserVisibleFleetAssets(await getFleetAssets(), req.user || { role: "admin", region: "global" });
  const idle = await findIdleAssets(disruption);
  res.json(idle.filter((asset) => fleet.some((item) => item.assetId === asset.assetId)));
});

export default router;
