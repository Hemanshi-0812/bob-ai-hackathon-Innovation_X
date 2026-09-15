<<<<<<< HEAD
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
=======
# 🚀 [Your Project Title Here]

> ⚠️ **Replace everything in `[ ]` brackets with your actual content before submission.**

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | [Your Team Name] |
| **Track** | [AI / DevOps / Sustainability / Open] |
| **Team Lead** | [Name] — [email@ibm.com] |
| **Members** | [Name 1], [Name 2], [Name 3] |

---

## 🎯 Problem Statement

> In 2–3 sentences: What problem does your project solve? Who experiences this problem?

[Describe the real-world problem your project addresses. Be specific about who the user is and what pain point they face.]

---

## 💡 Solution

> In 2–3 sentences: What did you build? How does it solve the problem above?

[Describe your solution clearly. Explain the core mechanism — what makes it work.]

---

## ✨ Key Features

- **Feature 1:** [Brief description — e.g., "Real-time anomaly detection using watsonx.ai"]
- **Feature 2:** [Brief description]
- **Feature 3:** [Brief description]
- **Feature 4:** [Optional]
- **Feature 5:** [Optional]

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | [e.g., Python, TypeScript] |
| **Frameworks** | [e.g., FastAPI, React] |
| **IBM Technologies** | [e.g., watsonx.ai, IBM Bob, IBM Cloud] |
| **Databases** | [e.g., PostgreSQL, Redis] |
| **Other** | [e.g., Docker, GitHub Actions] |

---
>>>>>>> origin/main

## 📁 Repository Structure

```
<<<<<<< HEAD
├── src/                    # All source code
│   ├── backend/            # Node.js + Express + MongoDB API, Bob AI layer
│   └── frontend/           # React + MUI + Recharts + Leaflet dashboard
├── docs/                   # Written documentation
=======
├── src/                  # All source code
├── docs/                 # Written documentation
>>>>>>> origin/main
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
<<<<<<< HEAD
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
=======
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt  # Link to demo video
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# 1. Clone the repo
git clone https://github.com/[your-repo].git
cd [your-repo]

# 2. Install dependencies
[your install command here]

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Run the project
[your run command here]
```

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |

---

## ⚠️ Known Limitations

> Be honest — judges appreciate transparency over overclaiming.

- [Limitation 1: e.g., "Authentication is mocked — not production-ready"]
- [Limitation 2: e.g., "Only tested on Chrome"]
- [Limitation 3: e.g., "Feature X is scaffolded but not fully implemented"]

---

## 🏅 What We're Most Proud Of

[Tell the judges what part of your submission is strongest and worth paying close attention to.]

---
>>>>>>> origin/main
