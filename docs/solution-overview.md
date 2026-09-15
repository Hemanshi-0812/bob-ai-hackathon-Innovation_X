# Solution Overview

<<<<<<< HEAD
**SupplyGuard AI** is a Bob copilot covering all ten modules of the L2
problem statement, end to end.

## Modules

| # | Module | Backend route | Frontend page |
|---|---|---|---|
| 1 | Executive Dashboard | `GET /api/dashboard/summary` | `pages/Dashboard.jsx` |
| 2 | Shipment Management | `GET /api/shipments` | `pages/Shipments.jsx` |
| 3 | Disruption Detection | `GET /api/disruptions` | `pages/Disruptions.jsx` |
| 4 | Affected Shipment + Risk Analysis | `GET /api/disruptions/:id/impacted-shipments` | `pages/RiskAnalysis.jsx` |
| 5 | AI Rerouting Recommendation | `GET /api/disruptions/:id/reroute-recommendations` | `pages/Rerouting.jsx` |
| 6 | Idle Fleet Detection | `GET /api/fleet/idle` | `pages/Fleet.jsx` |
| 7 | Fleet Redeployment Recommendation | `GET /api/fleet/idle?disruptionId=...` | `pages/Fleet.jsx` |
| 8 | IoT Cold-Chain Monitoring | `GET /api/coldchain/readings` | `pages/ColdChain.jsx` |
| 9 | Temperature Excursion + Severity Detection | `GET /api/coldchain/excursions` | `pages/ColdChain.jsx` |
| 10 | Bob AI Copilot | `GET /api/copilot/brief/:id`, `POST /api/copilot/chat` | `pages/Copilot.jsx` |

## How each requirement is addressed

- **Impacted shipments (4):** `disruptionService.findImpactedShipments` cross-references
  a disruption's region against each shipment's origin, destination, current
  location, and planned route, producing a 0–100 risk score from severity,
  proximity, and cold-chain sensitivity.
- **Rerouting (5):** `routingService.recommendReroutes` gives high-risk or
  high-value shipments an active reroute with an alternate region and
  carrier; lower-risk shipments get a "monitor" recommendation instead.
- **Idle fleet + redeployment (6, 7):** `fleetService.findIdleAssets` flags
  assets idle past a threshold and suggests repositioning them toward the
  region absorbing re-routed volume.
- **Cold-chain monitoring (8, 9):** `coldchainService.detectExcursions`
  compares simulated IoT temperature readings against each shipment's
  required range and classifies excursions into regulatory severity tiers
  (minor/moderate/major/critical), each with a recommended action.
- **Bob AI Copilot (10):** `bobCopilotService` aggregates modules 4–9 into a
  single natural-language brief via IBM watsonx.ai, and answers free-form
  operator questions in a chat interface. Falls back to a deterministic
  rule-based summary when no watsonx credentials are configured, so the
  whole system still runs fully offline.

## Auth

JWT-based login (`POST /api/auth/login`) gates every module behind
`requireAuth` middleware. A demo user is auto-seeded on first run (see
`.env.example`).

## Data

MongoDB is the primary datastore (Shipment, FleetAsset, Disruption,
TempReading, User collections via Mongoose). Simulated JSON sensor and
shipment data (`src/data/mockData.js`) seeds the database on first run —
representing the ingestion boundary from a real TMS, fleet telematics, and
an IoT cold-chain platform. If MongoDB isn't reachable, every service reads
directly from that same in-memory data, so the app still works fully
offline for local development and demos.
=======
## What We Built

[Describe your solution in plain language. Avoid jargon — write as if explaining to a smart colleague unfamiliar with your tech stack.]

## How It Works

[Explain the core mechanism step by step. A numbered list or simple flow works well here.]

1. [Step 1: e.g., "User connects their GitHub repository via OAuth"]
2. [Step 2: e.g., "The system ingests pipeline logs and feeds them to watsonx.ai"]
3. [Step 3: e.g., "An anomaly score is computed and displayed on the dashboard"]
4. [Step 4: e.g., "Alerts are sent to Slack when the score exceeds a threshold"]

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed diagram.

[Optionally include a simple ASCII or Mermaid diagram here for quick reference.]

```
[User] → [Frontend: React] → [API: FastAPI] → [watsonx.ai] → [Dashboard]
                                    ↓
                             [PostgreSQL DB]
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| [e.g., Used watsonx.ai for anomaly detection] | [e.g., Pre-trained models reduced time-to-value vs. building from scratch] |
| [Decision 2] | [Rationale 2] |
| [Decision 3] | [Rationale 3] |

## IBM Technologies Used

[Explain specifically HOW you used each IBM technology — not just that you used it.]

- **[IBM Tech 1, e.g., watsonx.ai]:** [How it was used — e.g., "Used the `ibm/granite-13b-instruct-v2` model via the Python SDK to classify anomaly types from log text."]
- **[IBM Tech 2]:** [How it was used]
>>>>>>> origin/main
