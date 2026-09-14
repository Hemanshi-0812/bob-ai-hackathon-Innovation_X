import { Router } from "express";
import { generateDisruptionBrief, chatWithBob, isWatsonxEnabled } from "../services/bobCopilotService.js";

const router = Router();

// 10. Bob AI Copilot — full brief for a disruption
router.get("/brief/:disruptionId", async (req, res) => {
  const brief = await generateDisruptionBrief(req.params.disruptionId);
  if (!brief) return res.status(404).json({ error: "Disruption not found" });
  res.json(brief);
});

// 10. Bob AI Copilot — free-form chat
router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });
  const result = await chatWithBob(message);
  res.json(result);
});

router.get("/status", (req, res) => {
  res.json({ watsonxEnabled: isWatsonxEnabled });
});

export default router;
