# SupplyGuard AI

**Supply Chain Disruption Assistant & Fleet Utilisation Optimizer**
Problem statement: **L2 — Logistics & Ports (Ongoing Pain)**
Powered by **IBM Bob** (watsonx.ai reasoning layer)

Supply chain disruptions cascade across hundreds of active shipments in ways
that are impossible to track manually, while idle fleet assets sit unused
and cold-chain cargo silently spoils in transit. SupplyGuard AI is a
ten-module Bob copilot that covers the full operational loop.

## 🧩 Modules

1. 📊 Executive Dashboard
2. 📦 Shipment Management
3. 🚨 Disruption Detection
4. 🎯 Affected Shipment + Risk Analysis
5. 🛣️ AI Rerouting Recommendation
6. 🚚 Idle Fleet Detection
7. 🔄 Fleet Redeployment Recommendation
8. ❄️ IoT Cold-Chain Monitoring
9. 🌡️ Temperature Excursion + Severity Detection
10. 🤖 Bob AI Copilot

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| UI | MUI |
| Charts | Recharts |
| Maps | React Leaflet |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| AI | IBM Bob Copilot (watsonx.ai) |
| AI data/tools | REST APIs / structured data |
| Business logic | JavaScript/Node.js |
| IoT | Simulated JSON/CSV sensor data |
| Authentication | JWT |
| Other | Docker, Docker Compose, GitHub Actions |

## 🏗️ Architecture

```
FRONTEND (React.js)  ⇄  AI LAYER (IBM Bob Copilot)
              \\        //
             REST APIs (JWT-secured)
                   |
           Node.js + Express
              /          \\
        MongoDB       Analytics (JS)
              \\          /
   Shipment/Disruption/Route Data · IoT Sensor Data/Fleet Data/Regulatory Rules
```

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown.

## 📁 Repository Structure

```
├── src/                    # All source code
│   ├── backend/            # Node.js + Express + MongoDB API, Bob AI layer
│   └── frontend/           # React + MUI + Recharts + Leaflet dashboard
├── docs/                   # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                   # Demo artifacts
│   ├── screenshots/
│   └── demo-video-link.txt
├── presentation/           # Slide deck
└── submission.yaml         # Structured submission metadata
```

## 🚀 Quick Start

```bash
docker compose up --build
```

- Dashboard: http://localhost:5173
- API: http://localhost:5000 (health check at `/health`)
- **Demo login:** `[email protected]` / `supplyguard123`

See [`docs/setup-guide.md`](docs/setup-guide.md) for full setup (including
running without Docker and enabling real watsonx.ai credentials),
[`docs/solution-overview.md`](docs/solution-overview.md) for how each module
maps to the problem statement, and [`docs/architecture.md`](docs/architecture.md)
for the system design.

## License

MIT
