/**
 * IBM Bob Copilot — the AI Layer in the architecture diagram.
 *
 * Wraps IBM watsonx.ai to turn structured findings into natural-language
 * operator answers, and to power a free-form chat endpoint. Falls back to a
 * deterministic rule-based response when watsonx credentials aren't
 * configured, so the copilot still works offline for local dev and demos.
 */
import { getDisruptions } from "./dataStore.js";
import { findImpactedShipments } from "./disruptionService.js";
import { recommendReroutes } from "./routingService.js";
import { findIdleAssets } from "./fleetService.js";
import { detectExcursions } from "./coldchainService.js";

const watsonxEnabled = Boolean(process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID);

async function callWatsonx(prompt) {
  if (!watsonxEnabled) return null;
  try {
    const tokenRes = await fetch(
      "https://iam.cloud.ibm.com/identity/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.WATSONX_API_KEY}`,
      }
    );
    const { access_token } = await tokenRes.json();

    const res = await fetch(
      `${process.env.WATSONX_URL}/ml/v1/text/generation?version=2024-05-01`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          model_id: process.env.WATSONX_MODEL_ID,
          project_id: process.env.WATSONX_PROJECT_ID,
          input: prompt,
          parameters: { max_new_tokens: 300 },
        }),
      }
    );
    const data = await res.json();
    return data?.results?.[0]?.generated_text?.trim() || null;
  } catch (err) {
    console.warn("[bobCopilot] watsonx call failed, using fallback:", err.message);
    return null;
  }
}

function fallbackBriefSummary({ disruption, impacted, idle, coldchain }) {
  const lines = [
    `${disruption.type.replace("_", " ")} in ${disruption.region} (${disruption.severity} severity) is affecting ${impacted.length} active shipment(s).`,
  ];
  if (impacted.length) {
    const worst = impacted.reduce((a, b) => (b.riskScore > a.riskScore ? b : a));
    lines.push(
      `Highest-risk: ${worst.shipment.shipmentId} (risk ${worst.riskScore}/100, est. delay ${worst.delayEstimateHours}h) — prioritise re-routing now.`
    );
  }
  if (idle.length) {
    lines.push(`${idle.length} fleet asset(s) sitting idle can be redeployed toward the affected corridor.`);
  }
  const critical = coldchain.filter((c) => ["high", "critical"].includes(c.severity));
  if (critical.length) {
    lines.push(`${critical.length} cold-chain excursion(s) require regulatory review before delivery — do not release without QA sign-off.`);
  }
  return lines.join(" ");
}

export async function generateDisruptionBrief(disruptionId) {
  const disruption = (await getDisruptions()).find((d) => d.disruptionId === disruptionId);
  if (!disruption) return null;

  const impacted = await findImpactedShipments(disruption);
  const reroutes = recommendReroutes(disruption, impacted);
  const idle = await findIdleAssets(disruption);
  const impactedColdChainIds = new Set(impacted.filter((i) => i.shipment.isColdChain).map((i) => i.shipment.shipmentId));
  const coldchain = (await detectExcursions()).filter((c) => impactedColdChainIds.has(c.shipmentId));

  const prompt = `You are Bob, a supply-chain operations copilot. Summarise this disruption brief in under 150 words, covering what's impacted, the single most urgent action, fleet redeployment opportunities, and any cold-chain regulatory risk.\n\nDisruption: ${JSON.stringify(disruption)}\nImpacted shipments: ${JSON.stringify(impacted.slice(0, 5))}\nIdle assets: ${idle.length}\nCold-chain alerts: ${JSON.stringify(coldchain)}`;

  const summary = (await callWatsonx(prompt)) || fallbackBriefSummary({ disruption, impacted, idle, coldchain });

  return {
    disruption,
    impactedShipments: impacted,
    rerouteRecommendations: reroutes,
    idleAssets: idle,
    coldchainAlerts: coldchain,
    summary,
    generatedAt: new Date(),
  };
}

/**
 * Free-form Bob Copilot chat. Answers questions about the current
 * operational picture using the same underlying services, falling back to
 * a rule-based answer when watsonx isn't configured.
 */
export async function chatWithBob(message) {
  const disruptions = await getDisruptions();
  const lower = message.toLowerCase();

  const mentioned = disruptions.find(
    (d) => lower.includes(d.disruptionId.toLowerCase()) || lower.includes(d.region.toLowerCase())
  );

  if (mentioned) {
    const brief = await generateDisruptionBrief(mentioned.disruptionId);
    return { reply: brief.summary, groundedIn: mentioned.disruptionId };
  }

  const prompt = `You are Bob, a supply-chain operations copilot for SupplyGuard AI. Active disruptions right now: ${disruptions
    .map((d) => `${d.disruptionId} (${d.region}, ${d.severity})`)
    .join("; ")}. Operator asked: "${message}". Reply in under 100 words, referencing relevant disruptions by ID where useful.`;

  const watsonxReply = await callWatsonx(prompt);
  if (watsonxReply) return { reply: watsonxReply, groundedIn: null };

  return {
    reply: `I'm running in offline mode (no watsonx.ai credentials configured), so I can't do open-ended reasoning yet. Ask me about a specific disruption — active ones right now: ${disruptions
      .map((d) => `${d.disruptionId} (${d.region})`)
      .join(", ")}.`,
    groundedIn: null,
  };
}

export const isWatsonxEnabled = watsonxEnabled;
