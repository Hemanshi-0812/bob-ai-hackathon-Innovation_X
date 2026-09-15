# Architecture

<<<<<<< HEAD
```
             ┌───────────────────────────┐
             │       SUPPLYGUARD AI       │
             └─────────────┬─────────────┘
          ┌─────────────────┴─────────────────┐
   ┌──────▼──────┐                     ┌───────▼───────┐
   │  FRONTEND    │                     │   AI LAYER     │
   │  React.js    │                     │ IBM Bob Copilot│
   │  + Vite      │                     │ (watsonx.ai)   │
   │  MUI/Recharts│                     │                │
   │  React Leaflet│                    │                │
   └──────┬──────┘                     └───────┬───────┘
          └─────────────────┬─────────────────┘
                    ┌────────▼────────┐
                    │    REST APIs     │
                    │  (JWT-secured)   │
                    └────────┬────────┘
                    ┌────────▼────────┐
                    │  Node.js + Express│
                    └────────┬────────┘
          ┌─────────────────┴─────────────────┐
   ┌──────▼──────┐                    ┌────────▼────────┐
   │  MongoDB     │                    │    Analytics     │
   │  Database    │                    │  (JS business    │
   │              │                    │   logic layer)   │
   └──────┬──────┘                    └────────┬────────┘
          └─────────────────┬─────────────────┘
       ┌───────────┬────────┴────────┬───────────┐
       ▼           ▼                 ▼           ▼
 Shipment Data  Disruption Data  IoT Sensor   Fleet Data /
                                 Data (JSON/   Regulatory
                                 CSV, simulated) Rules
=======
## System Architecture

[Describe the overall architecture of your system. Replace the Mermaid diagram below with your actual architecture.]

```mermaid
graph TD
    A[User / Browser] -->|HTTP| B[Frontend - React]
    B -->|REST API| C[Backend - FastAPI]
    C -->|SDK| D[watsonx.ai]
    C -->|Query| E[PostgreSQL]
    C -->|Publish| F[Slack Webhook]
    D -->|Inference Result| C
>>>>>>> origin/main
```

## Components

<<<<<<< HEAD
- **Frontend (`src/frontend`)** — React.js + Vite. MUI for layout and
  components, Recharts for the dashboard's fleet-status and impact charts,
  React Leaflet for the disruption map. JWT stored in `localStorage`,
  attached to every API call by `src/api/client.js`.

- **AI Layer (`src/backend/src/services/bobCopilotService.js`)** — Wraps
  IBM watsonx.ai to generate the Bob brief summary and answer free-form
  chat questions. Falls back to a deterministic rule-based response when no
  watsonx credentials are configured.

- **REST APIs (`src/backend/src/routes/`)** — Express routers, one per
  module, all behind `requireAuth` (JWT) except `/api/auth/login`.

- **Business logic (`src/backend/src/services/`)** — Plain JavaScript
  modules: `disruptionService`, `routingService`, `fleetService`,
  `coldchainService`, each single-purpose and independently testable.

- **Database** — MongoDB via Mongoose (`src/backend/src/models/`). Falls
  back transparently to in-memory simulated data
  (`src/backend/src/data/mockData.js`) when MongoDB isn't reachable, via the
  `dataStore.js` abstraction every service reads through.

- **IoT sensor data** — Simulated JSON temperature readings represent the
  ingestion boundary from a real cold-chain IoT platform; seeded into
  MongoDB on first run.

## Request flow — Bob's disruption brief

1. Frontend (`pages/Copilot.jsx` or `pages/Dashboard.jsx`) calls
   `GET /api/copilot/brief/:disruptionId` with a JWT.
2. `requireAuth` validates the token.
3. `bobCopilotService.generateDisruptionBrief` calls, in order:
   `disruptionService.findImpactedShipments` →
   `routingService.recommendReroutes` →
   `fleetService.findIdleAssets` →
   `coldchainService.detectExcursions`.
4. All four results are passed to watsonx.ai (or the rule-based fallback)
   to produce the natural-language summary.
5. The full JSON brief is returned and rendered across the frontend's
   panels.

## Deployment

`docker-compose.yml` runs `mongo`, `backend`, and `frontend` together.
`.github/workflows/ci.yml` runs an import/build sanity check on every push
and pull request.
=======
| Component | Technology | Responsibility |
|---|---|---|
| Frontend | [e.g., React 18] | [e.g., Dashboard UI, user interaction] |
| Backend API | [e.g., FastAPI] | [e.g., Business logic, orchestration] |
| AI / ML | [e.g., watsonx.ai] | [e.g., Anomaly scoring, classification] |
| Database | [e.g., PostgreSQL] | [e.g., Storing pipeline events and scores] |
| Notifications | [e.g., Slack API] | [e.g., Alerting on threshold breaches] |

## Data Flow

[Describe how data moves through your system from input to output.]

1. [e.g., Pipeline logs are ingested via a webhook from GitHub Actions]
2. [e.g., Logs are preprocessed and chunked into 512-token segments]
3. [e.g., Each chunk is sent to the watsonx.ai inference endpoint]
4. [e.g., Anomaly scores are stored in PostgreSQL]
5. [e.g., The React dashboard polls the API every 30 seconds to refresh]

## Security Considerations

[Note any security decisions relevant to the architecture — even if basic.]

- [e.g., API keys stored in environment variables, never committed to git]
- [e.g., All API routes require a Bearer token]
- [e.g., Database credentials rotated via IBM Secrets Manager]

## Scalability Notes

[Optional: how would this scale beyond the hackathon prototype?]

[e.g., "The FastAPI backend is stateless and could be horizontally scaled behind a load balancer. The watsonx.ai calls are the bottleneck and would benefit from request batching."]
>>>>>>> origin/main
