import { Router } from "express";
import { generateDisruptionBrief, chatWithBob, isWatsonxEnabled, getCopilotEngineStatus } from "../services/bobCopilotService.js";
import { getDisruptionById } from "../services/dataStore.js";
import { getUserRegion, isRegionalManager } from "../utils/access.js";

const router = Router();

// 10. Bob AI Copilot — full brief for a disruption
router.get("/brief/:disruptionId", async (req, res) => {
  const disruption = await getDisruptionById(req.params.disruptionId);
  if (!disruption) return res.status(404).json({ error: "Disruption not found" });
  if (isRegionalManager(req.user) && getUserRegion(req.user) !== disruption.region) {
    return res.status(403).json({ error: "You do not have access to this region" });
  }

  const brief = await generateDisruptionBrief(req.params.disruptionId);
  if (!brief) return res.status(404).json({ error: "Disruption not found" });
  res.json(brief);
});

// 10. Bob AI Copilot — free-form chat
router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });
  const result = await chatWithBob(message, req.user);
  res.json(result);
});

router.get("/status", (req, res) => {
  const status = getCopilotEngineStatus();
  res.json({
    watsonxEnabled: isWatsonxEnabled,
    ...status,
  });
});

export default router;
