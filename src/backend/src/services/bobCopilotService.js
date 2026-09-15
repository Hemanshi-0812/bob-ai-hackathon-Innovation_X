/**
 * Bob Copilot — AI & Domain Intelligence Layer for SupplyGuard AI.
 *
 * Supports IBM watsonx.ai, Google Gemini, and OpenAI when cloud API keys are
 * configured in .env. When running locally without cloud API keys, it uses the
 * SupplyGuard Intelligent Domain Engine to answer questions about shipments,
 * active disruptions, cold-chain telemetry, fleet redeployment, and rerouting.
 */
import { getDisruptions, getShipments } from "./dataStore.js";
import { findImpactedShipments } from "./disruptionService.js";
import { recommendReroutes } from "./routingService.js";
import { findIdleAssets } from "./fleetService.js";
import { detectExcursions } from "./coldchainService.js";

const watsonxEnabled = Boolean(process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID);
const geminiEnabled = Boolean(process.env.GEMINI_API_KEY);
const openaiEnabled = Boolean(process.env.OPENAI_API_KEY);

export function getCopilotEngineStatus() {
  if (watsonxEnabled) {
    return {
      connected: true,
      provider: "watsonx",
      mode: "cloud",
      label: "watsonx.ai Online",
      model: process.env.WATSONX_MODEL_ID || "granite-13b-instruct-v2",
      watsonxEnabled: true,
    };
  }
  if (geminiEnabled) {
    return {
      connected: true,
      provider: "gemini",
      mode: "cloud",
      label: "Gemini AI Online",
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      watsonxEnabled: false,
    };
  }
  if (openaiEnabled) {
    return {
      connected: true,
      provider: "openai",
      mode: "cloud",
      label: "OpenAI Online",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      watsonxEnabled: false,
    };
  }
  return {
    connected: true,
    provider: "local",
    mode: "local",
    label: "Copilot Engine Active",
    model: "SupplyGuard Domain Brain",
    watsonxEnabled: false,
  };
}

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
      `${process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com"}/ml/v1/text/generation?version=2024-05-01`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          model_id: process.env.WATSONX_MODEL_ID || "ibm/granite-13b-instruct-v2",
          project_id: process.env.WATSONX_PROJECT_ID,
          input: prompt,
          parameters: { max_new_tokens: 300 },
        }),
      }
    );
    const data = await res.json();
    return data?.results?.[0]?.generated_text?.trim() || null;
  } catch (err) {
    console.warn("[bobCopilot] watsonx call failed:", err.message);
    return null;
  }
}

async function callGemini(prompt) {
  if (!geminiEnabled) return null;
  try {
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
        }),
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (err) {
    console.warn("[bobCopilot] Gemini call failed:", err.message);
    return null;
  }
}

async function callOpenAI(prompt) {
  if (!openaiEnabled) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.warn("[bobCopilot] OpenAI call failed:", err.message);
    return null;
  }
}

async function callLLM(prompt) {
  if (watsonxEnabled) {
    const reply = await callWatsonx(prompt);
    if (reply) return reply;
  }
  if (geminiEnabled) {
    const reply = await callGemini(prompt);
    if (reply) return reply;
  }
  if (openaiEnabled) {
    const reply = await callOpenAI(prompt);
    if (reply) return reply;
  }
  return null;
}

function fallbackBriefSummary({ disruption, impacted, idle, coldchain }) {
  const lines = [
    `⚠️ **${disruption.type.replace(/_/g, " ").toUpperCase()}** in **${disruption.region}** (${disruption.severity} severity) is affecting **${impacted.length}** active shipment(s).`,
  ];
  if (impacted.length) {
    const worst = impacted.reduce((a, b) => (b.riskScore > a.riskScore ? b : a));
    lines.push(
      `🚨 **Highest-Risk**: \`${worst.shipment.shipmentId}\` (risk score ${worst.riskScore}/100, estimated delay +${worst.delayEstimateHours}h) — immediate rerouting advised.`
    );
  }
  if (idle.length) {
    lines.push(`🚚 **Fleet Assets**: ${idle.length} idle asset(s) available for immediate corridor redeployment.`);
  }
  const critical = coldchain.filter((c) => ["high", "critical"].includes(c.severity));
  if (critical.length) {
    lines.push(`❄️ **Cold-Chain Alert**: ${critical.length} temperature excursion(s) require QA regulatory inspection prior to customer handoff.`);
  }
  return lines.join("\n\n");
}

export async function generateDisruptionBrief(disruptionId) {
  const disruption = (await getDisruptions()).find((d) => d.disruptionId === disruptionId);
  if (!disruption) return null;

  const impacted = await findImpactedShipments(disruption);
  const reroutes = recommendReroutes(disruption, impacted);
  const idle = await findIdleAssets(disruption);
  const impactedColdChainIds = new Set(impacted.filter((i) => i.shipment.isColdChain).map((i) => i.shipment.shipmentId));
  const coldchain = (await detectExcursions()).filter((c) => impactedColdChainIds.has(c.shipmentId));

  const prompt = `You are Bob, an intelligent supply-chain operations copilot. Summarise this disruption brief in under 150 words using clean markdown, covering what is impacted, the single most urgent action, fleet redeployment opportunities, and cold-chain risk.\n\nDisruption: ${JSON.stringify(disruption)}\nImpacted shipments: ${JSON.stringify(impacted.slice(0, 5))}\nIdle assets: ${idle.length}\nCold-chain alerts: ${JSON.stringify(coldchain)}`;

  const summary = (await callLLM(prompt)) || fallbackBriefSummary({ disruption, impacted, idle, coldchain });

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
 * operational picture using live telemetry, with LLM augmentation if keys
 * are configured, and a rich domain intelligence engine when offline/local.
 */
export async function chatWithBob(message, user = null) {
  const disruptions = await getDisruptions();
  const allShipments = await getShipments();
  const lower = (message || "").toLowerCase().trim();

  // 1. Specific Shipment Reference ID (e.g., SHP-2001 or SHP-4326)
  const shpMatch = message.match(/SHP-\d+/i);
  if (shpMatch) {
    const targetId = shpMatch[0].toUpperCase();
    const found = allShipments.find((s) => s.shipmentId === targetId);
    if (found) {
      const etaStr = found.eta ? new Date(found.eta).toLocaleDateString() : "TBD";
      const coldChainNote = found.isColdChain
        ? `❄️ **Cold-Chain**: Monitored standard (2°C - 8°C)`
        : `📦 Standard ambient cargo`;

      // Check if this shipment is impacted by any active disruption
      const impactingDisruptions = [];
      for (const d of disruptions) {
        if (d.region === found.origin || d.region === found.destination) {
          impactingDisruptions.push(`${d.disruptionId} (${d.region} ${d.type})`);
        }
      }

      let impactAlert = "";
      if (impactingDisruptions.length > 0) {
        impactAlert = `\n\n⚠️ **Corridor Advisory**: Affected by active disruption ${impactingDisruptions.join(", ")}. Review reroute recommendations in Disruption Management.`;
      }

      return {
        reply: `📦 **Shipment Details for \`${found.shipmentId}\`**\n• **Route**: ${found.origin} ➔ ${found.destination}\n• **Carrier**: ${found.carrier || "DHL"} (${found.mode || "Truck"})\n• **Cargo**: ${found.cargoType || "General Cargo"} ($${(found.cargoValueUsd || 0).toLocaleString()})\n• **Status**: **${found.status || "In Transit"}**\n• **ETA**: ${etaStr}\n• **Telemetry**: ${coldChainNote}${impactAlert}`,
        groundedIn: found.shipmentId,
      };
    } else {
      return {
        reply: `🔍 Shipment \`${targetId}\` was not found in active tracking. Please verify the shipment reference or check the Shipments registry.`,
        groundedIn: null,
      };
    }
  }

  // 2. Greetings, Identity & Bot Capabilities
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower.startsWith("hi ") ||
    lower.startsWith("hello ") ||
    lower.includes("who are you") ||
    lower.includes("what can you do") ||
    lower.includes("help") ||
    lower.includes("capabilities") ||
    lower.includes("how does this work")
  ) {
    const activeCount = allShipments.length;
    const disCount = disruptions.length;
    return {
      reply: `👋 **Hello! I'm Bob, your SupplyGuard AI Operations Copilot.**\n\nI continuously analyze real-time logistics telemetry across our multi-modal freight network.\n\nCurrently monitoring **${activeCount} active shipment(s)** and **${disCount} active disruption(s)**.\n\n**Here's what you can ask me:**\n• 📊 *"Give me an operational summary"*\n• ⚠️ *"What disruptions are active right now?"*\n• 📦 *"Show delayed shipments"* or *"Status of SHP-2001"*\n• ❄️ *"Are there any cold-chain temperature excursions?"*\n• 🚚 *"What fleet assets are idle for redeployment?"*\n• 🔄 *"Recommend alternate routes for high-risk cargo"*`,
      groundedIn: null,
    };
  }

  // 3. Operational Overview / Executive Situation Report
  if (
    lower.includes("summary") ||
    lower.includes("overview") ||
    lower.includes("situation report") ||
    lower.includes("status report") ||
    lower.includes("sitrep") ||
    lower.includes("overall status") ||
    lower.includes("system status")
  ) {
    const delayedShipments = allShipments.filter((s) => s.status === "Delayed");
    const coldChainShipments = allShipments.filter((s) => s.isColdChain);
    const excursions = await detectExcursions();
    const idle = await findIdleAssets();

    return {
      reply: `📋 **SupplyGuard Operational Situation Report**\n\n` +
        `• 📦 **Freight Volume**: **${allShipments.length} active shipments** (${delayedShipments.length} delayed, ${allShipments.length - delayedShipments.length} on-track)\n` +
        `• ⚠️ **Disruptions**: **${disruptions.length} active event(s)** (${disruptions.map((d) => `\`${d.disruptionId}\` in ${d.region}`).join(", ") || "None"})\n` +
        `• ❄️ **Cold-Chain Telemetry**: **${coldChainShipments.length} monitored cargo** (${excursions.length} active excursion alerts)\n` +
        `• 🚚 **Fleet Capacity**: **${idle.length} idle asset(s)** available for rapid redeployment\n\n` +
        `Ask me for details on any specific corridor, shipment, or cold-chain excursion!`,
      groundedIn: disruptions[0]?.disruptionId || null,
    };
  }

  // 4. Cold-Chain & Temperature Telemetry Inquiries
  if (
    lower.includes("cold chain") ||
    lower.includes("coldchain") ||
    lower.includes("temperature") ||
    lower.includes("excursion") ||
    lower.includes("sensor") ||
    lower.includes("pharma") ||
    lower.includes("vaccine") ||
    lower.includes("telemetry")
  ) {
    const excursions = await detectExcursions();
    const coldChainShipments = allShipments.filter((s) => s.isColdChain);

    if (excursions.length > 0) {
      const topExcursions = excursions.slice(0, 3).map(
        (e) => `• \`${e.shipmentId}\`: **${e.recordedTemp}°C** (Safe: 2°C–8°C) — severity: **${e.severity.toUpperCase()}**`
      ).join("\n");

      return {
        reply: `❄️ **Cold-Chain Alert: Active Excursion(s) Detected**\n\n` +
          `We have **${excursions.length} excursion event(s)** recorded across **${coldChainShipments.length} cold-chain shipments**:\n\n` +
          `${topExcursions}\n\n` +
          `⚠️ **Regulatory Advisory**: Excursions above 8°C or below 2°C require QA quarantine and temperature logging certification before final release.`,
        groundedIn: excursions[0]?.shipmentId || null,
      };
    } else {
      return {
        reply: `❄️ **Cold-Chain Telemetry: 100% Compliant**\n\n` +
          `All **${coldChainShipments.length} cold-chain shipments** are operating strictly within the designated safe pharmaceutical range (**2.0°C to 8.0°C**). Zero excursion events detected across all active sensor streams.`,
        groundedIn: null,
      };
    }
  }

  // 5. Delayed Shipments Inquiries
  if (
    lower.includes("delay") ||
    lower.includes("late") ||
    lower.includes("behind schedule") ||
    lower.includes("delayed shipment")
  ) {
    const delayed = allShipments.filter((s) => s.status === "Delayed");
    if (delayed.length === 0) {
      return {
        reply: `✅ **All Routes On-Track**: None of your active shipments are currently flagged as delayed. All transit milestones are proceeding according to scheduled ETA.`,
        groundedIn: null,
      };
    }

    const list = delayed.slice(0, 5).map(
      (s) => `• \`${s.shipmentId}\` (${s.origin} ➔ ${s.destination}): Carrier ${s.carrier || "DHL"}, Cargo: ${s.cargoType}`
    ).join("\n");

    return {
      reply: `⚠️ **Delayed Freight Summary (${delayed.length} shipment(s) affected)**\n\n` +
        `${list}\n\n` +
        `You can ask for the status of any shipment (e.g. *"status of ${delayed[0].shipmentId}"*) or view reroute options.`,
      groundedIn: delayed[0].shipmentId,
    };
  }

  // 6. Fleet & Redeployment Inquiries
  if (
    lower.includes("fleet") ||
    lower.includes("idle") ||
    lower.includes("truck") ||
    lower.includes("asset") ||
    lower.includes("redeployment") ||
    lower.includes("driver") ||
    lower.includes("vehicle")
  ) {
    const idle = await findIdleAssets();
    if (idle.length === 0) {
      return {
        reply: `🚚 **Fleet Utilization**: All company freight assets and subcontracted carriers are currently deployed on active corridors. No idle reserves available.`,
        groundedIn: null,
      };
    }

    const preview = idle.slice(0, 4).map(
      (a) => `• **${a.asset?.assetId || a.assetId || "Asset"}**: ${a.asset?.type || a.type || "Truck"} stationed at **${a.asset?.currentRegion || a.currentRegion || "Hub"}** (${a.asset?.status || a.status || "Idle"})`
    ).join("\n");

    return {
      reply: `🚚 **Fleet Readiness (${idle.length} idle asset(s) available)**\n\n` +
        `${preview}\n\n` +
        `These idle units can be dispatched immediately to relieve delayed freight or bypass active regional disruptions.`,
      groundedIn: idle[0].asset?.assetId || idle[0].assetId || null,
    };
  }

  // 7. Disruption Search (by region or disruption ID)
  const mentioned = disruptions.find(
    (d) =>
      lower.includes(d.disruptionId.toLowerCase()) ||
      lower.includes(d.region.toLowerCase()) ||
      lower.includes(d.type.toLowerCase().replace(/_/g, " "))
  );

  if (mentioned) {
    const brief = await generateDisruptionBrief(mentioned.disruptionId);
    return { reply: brief.summary, groundedIn: mentioned.disruptionId };
  }

  // 8. General Disruption Inquiries
  if (
    lower.includes("disruption") ||
    lower.includes("weather") ||
    lower.includes("strike") ||
    lower.includes("congestion") ||
    lower.includes("storm") ||
    lower.includes("incident")
  ) {
    if (disruptions.length === 0) {
      return {
        reply: `🟢 **No Active Disruptions**: All global transit corridors, shipping lanes, and border crossings are operating under normal conditions.`,
        groundedIn: null,
      };
    }

    const list = disruptions.map(
      (d) => `• **\`${d.disruptionId}\`** — **${d.region}** (${d.type.replace(/_/g, " ")}, severity: **${d.severity}**)`
    ).join("\n");

    return {
      reply: `⚠️ **Active Regional Disruptions (${disruptions.length} events logged)**\n\n` +
        `${list}\n\n` +
        `To inspect a detailed response brief, ask about any specific disruption ID (e.g. *"tell me about ${disruptions[0].disruptionId}"*).`,
      groundedIn: disruptions[0].disruptionId,
    };
  }

  // 9. Rerouting & Optimization Inquiries
  if (
    lower.includes("reroute") ||
    lower.includes("rerouting") ||
    lower.includes("alternate route") ||
    lower.includes("detour") ||
    lower.includes("bypass")
  ) {
    if (disruptions.length > 0) {
      const d = disruptions[0];
      const impacted = await findImpactedShipments(d);
      const reroutes = recommendReroutes(d, impacted);
      if (reroutes.length > 0) {
        const preview = reroutes.slice(0, 3).map(
          (r) => `• \`${r.shipmentId}\`: Detour via **${r.recommendedRoute || "Secondary Highway Corridor"}** (Est. +${r.delayDeltaHours || 2}h delay, ${r.fuelImpact || "Optimal"})`
        ).join("\n");

        return {
          reply: `🔄 **AI Reroute Recommendations for Corridor ${d.region}**\n\n${preview}\n\nHead to the Disruption Management page to approve automated dispatch reroutes.`,
          groundedIn: d.disruptionId,
        };
      }
    }
    return {
      reply: `🔄 **Route Optimization**: No urgent reroutes required at this time. All primary transport paths are clearing within acceptable delivery margins.`,
      groundedIn: null,
    };
  }

  // 10. General "My Shipments" / Cargo List Inquiry
  if (
    lower.includes("my shipment") ||
    lower.includes("my cargo") ||
    lower.includes("active shipments") ||
    lower.includes("all shipments") ||
    lower.includes("list shipments")
  ) {
    const userEmail = (user?.email || "").toLowerCase();
    const myShipments =
      user?.role === "admin"
        ? allShipments.slice(0, 6)
        : allShipments.filter((s) => (s.createdBy || "").toLowerCase() === userEmail || s.userId === user?.sub);

    const pool = myShipments.length > 0 ? myShipments : allShipments.slice(0, 6);
    const count = pool.length;
    const delayed = pool.filter((s) => s.status === "Delayed").length;
    const listPreview = pool
      .map((s) => `• \`${s.shipmentId}\` (${s.origin} ➔ ${s.destination}) · ${s.carrier || "Carrier"} · **${s.status || "In Transit"}**`)
      .join("\n");

    return {
      reply: `📦 **Monitored Freight Manifest (${count} shipment(s))**\n${delayed > 0 ? `⚠️ *${delayed} delayed due to transit conditions*\n\n` : "\n"}${listPreview}\n\nAsk me about any specific shipment ID (e.g. \`${pool[0]?.shipmentId}\`) for detailed cargo telemetry.`,
      groundedIn: pool[0]?.shipmentId || null,
    };
  }

  // 11. If Cloud LLM (Gemini, Watsonx, OpenAI) is configured, query the model
  const prompt = `You are Bob, an intelligent supply-chain operations copilot for SupplyGuard AI.
Active disruptions: ${disruptions.map((d) => `${d.disruptionId} (${d.region}, ${d.severity})`).join("; ") || "None"}.
Active shipments count: ${allShipments.length}.
Operator question: "${message}".
Provide a concise, professional answer in under 120 words using markdown formatting.`;

  const llmReply = await callLLM(prompt);
  if (llmReply) return { reply: llmReply, groundedIn: null };

  // 12. Smart Fallback for ANY other query (never generic "offline mode" error)
  const delayedCount = allShipments.filter((s) => s.status === "Delayed").length;
  const coldCount = allShipments.filter((s) => s.isColdChain).length;
  const idleAssets = await findIdleAssets();

  return {
    reply: `💡 **SupplyGuard Operations Telemetry Snapshot**\n\n` +
      `Here is a quick overview of our current logistics picture:\n` +
      `• **Active Shipments**: ${allShipments.length} (${delayedCount > 0 ? `⚠️ ${delayedCount} delayed` : "✅ all on schedule"})\n` +
      `• **Cold-Chain Monitored**: ${coldCount} cargo streams\n` +
      `• **Active Regional Disruptions**: ${disruptions.length > 0 ? disruptions.map((d) => `\`${d.disruptionId}\` (${d.region})`).join(", ") : "None"}\n` +
      `• **Idle Fleet Units**: ${idleAssets.length} assets ready for dispatch\n\n` +
      `You can ask me to *"show delayed shipments"*, *"check cold-chain telemetry"*, *"give me a disruption brief"*, or *"status of ${allShipments[0]?.shipmentId || "SHP-2001"}"*!`,
    groundedIn: null,
  };
}

export const isWatsonxEnabled = watsonxEnabled;
