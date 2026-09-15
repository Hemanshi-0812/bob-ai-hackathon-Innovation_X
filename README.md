# 🚀 Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

> An AI-powered decision-support platform for detecting supply-chain disruptions, analysing shipment risk, recommending alternative routes, optimising fleet utilisation, and monitoring cold-chain conditions.
---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Innovation X |
| **Track** | AI |
| **Team Lead** | Hemanshi Bhayani — [email@ibm.com] |
| **Members** | Vedi Dhameliya, Heta Rajani, Tushya Patel |

---

## 🎯 Problem Statement

Supply-chain disruptions such as severe weather, road closures, port delays, accidents, and other transportation events can affect multiple active shipments at the same time, making manual tracking and decision-making difficult. Fleet assets may remain idle while other routes are overloaded, while cold-chain shipments are vulnerable to temperature excursions that can damage temperature-sensitive cargo.

Supply-chain managers, logistics operators, fleet managers, and shipment coordinators need a faster way to identify affected shipments, assess risk, find alternative routes, redeploy available fleet assets, and detect cold-chain temperature issues before delivery.

---

## 💡 Solution

We built an AI-powered supply-chain decision-support platform that brings shipment, disruption, fleet, route, and IoT cold-chain information into one system. The platform detects affected shipments, calculates risk, recommends alternative routes and fleet redeployment, monitors temperature excursions, and provides an AI Copilot for natural-language decision support.

Core workflow

Detect → Analyse → Recommend → Act

The system helps users move from a disruption event to an actionable operational recommendation through a unified executive dashboard.

## ✨ Key Features

- **📊 Executive Dashboard:** Provides a centralized real-time overview of shipments, active disruptions, high-risk shipments, fleet utilization, idle vehicles, and cold-chain conditions.
- **📦 Shipment Management:** Enables users to view, track, and manage shipment details including origin, destination, status, ETA, priority, cargo type, and assigned vehicle.
- **🚨 Disruption Detection:** Detects potential supply-chain disruptions such as severe weather, road closures, port delays, accidents, and other events that may affect transportation routes.
- **🎯 Affected Shipment & Risk Analysis:** Identifies shipments affected by a disruption and calculates their risk based on factors such as disruption severity, shipment priority, delay, route impact, and cargo sensitivity.
- **🛣️ AI Rerouting Recommendation:**Analyzes affected routes and recommends alternative routes to reduce delays, disruption impact, and transportation risk.
- **🚚 Idle Fleet Detection:** Identifies vehicles that are idle, underutilized, or available for redeployment based on their current location, status, and assigned workload.
- **🔄 Fleet Redeployment Recommendation:** Recommends suitable available vehicles for affected or high-priority shipments by considering factors such as vehicle location, capacity, availability, and shipment requirements.
- **❄️ IoT Cold-Chain Monitoring:** Monitors IoT sensor data such as temperature and other environmental conditions for temperature-sensitive shipments.
- **🌡️ Temperature Excursion & Severity Detection:** Detects temperature values outside the acceptable range and classifies the excursion based on severity and potential impact on the cargo.
- **🤖 IBM Bob AI Copilot:** Provides an interactive AI assistant that allows users to ask questions about shipments, disruptions, fleet utilization, risks, and recommended actions using natural language.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | JavaScript, HTML, CSS |
| **Frontend** | React |
| **Backend** | Node.js, Express.js |
| **IBM Technologies** | IBM watsonx.ai, IBM Bob |
| **AI** | Claude, Antigravity |
| **Databases** | MongoDB |
| **Maps** | Leaflet+React-Leaflet |
| **Other** | Docker, GitHub, Vite |

---

## 📁 Repository Structure

```
supplyguard-ai/
├── docker-compose.yml
├── submission.yaml
├── README.md
├── CONTRIBUTING.md
│
├── docs/
│   ├── architecture.md
│   ├── problem-statement.md
│   ├── setup-guide.md
│   ├── solution-overview.md
│   └── template-guide.md
│
├── demo/
│   ├── live-demo-url.txt
│   ├── demo-video-link.txt
│   └── screenshots/
│
├── presentation/
│   └── slides.pptx
│
└── src/
    ├── backend/
    │   ├── src/
    │   │   ├── config/
    │   │   │   └── db.js
    │   │   ├── data/
    │   │   │   └── mockData.js
    │   │   ├── middleware/
    │   │   │   └── auth.js
    │   │   ├── models/
    │   │   │   ├── Disruption.js
    │   │   │   ├── FleetAsset.js
    │   │   │   ├── Shipment.js
    │   │   │   ├── TempReading.js
    │   │   │   └── User.js
    │   │   ├── routes/
    │   │   │   ├── auth.routes.js
    │   │   │   ├── coldchain.routes.js
    │   │   │   ├── copilot.routes.js
    │   │   │   ├── dashboard.routes.js
    │   │   │   ├── disruptions.routes.js
    │   │   │   ├── fleet.routes.js
    │   │   │   ├── shipments.routes.js
    │   │   │   └── simulator.routes.js
    │   │   ├── scripts/
    │   │   │   └── seedDatabase.js
    │   │   ├── services/
    │   │   │   ├── bobCopilotService.js
    │   │   │   ├── coldchainService.js
    │   │   │   ├── dataStore.js
    │   │   │   ├── disruptionService.js
    │   │   │   ├── fleetService.js
    │   │   │   ├── routingService.js
    │   │   │   └── simulatorService.js
    │   │   ├── utils/
    │   │   │   └── access.js
    │   │   └── app.js
    │   ├── test/
    │   │   └── access.test.js
    │   ├── Dockerfile
    │   ├── package.json
    │   └── server.js
    │
    └── frontend/
        ├── public/
        │   └── logo.png
        ├── src/
        │   ├── api/
        │   │   └── client.js
        │   ├── assets/
        │   │   └── logo.png
        │   ├── components/
        │   │   ├── AddShipmentModal.jsx
        │   │   ├── AdminRoute.jsx
        │   │   ├── AppLayout.jsx
        │   │   ├── AuthShowcase.jsx
        │   │   ├── DisruptionSelect.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   ├── SeverityChip.jsx
        │   │   ├── ShipmentDetailsModal.jsx
        │   │   ├── Sidebar.jsx
        │   │   └── TopBar.jsx
        │   ├── context/
        │   │   ├── AuthContext.jsx
        │   │   └── ThemeContext.jsx
        │   ├── pages/
        │   │   ├── ColdChain.jsx
        │   │   ├── Copilot.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── Disruptions.jsx
        │   │   ├── Fleet.jsx
        │   │   ├── Home.jsx
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── Rerouting.jsx
        │   │   ├── RiskAnalysis.jsx
        │   │   ├── Shipments.jsx
        │   │   ├── UserDashboard.jsx
        │   │   └── UserProfile.jsx
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── theme.js
        ├── Dockerfile
        ├── index.html
        ├── nginx.conf
        ├── package.json
        └── vite.config.js
```

---

## ⚡ How to Run

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# Docker Compose (recommended)
git clone <this-repo>
cd supplyguard-ai
docker compose up --build

-Backend API: http://localhost:5000 (health check at /health)
-Frontend dashboard: http://localhost:5173
-Demo login: [email protected] / supplyguard123 (seeded automatically on first run — see .env.example), or click Create one on the login screen to register your own account.

-If you customize DEMO_USER_EMAIL/DEMO_USER_PASSWORD (via a root-level .env — see .env.example), do this on a fresh database, since the demo user is only seeded once. If you already have a running Mongo volume from an earlier attempt with different credentials, either register a new account instead, or reset the volume with docker compose down -v before starting again.

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

-The prototype uses simulated/sample operational data rather than live enterprise supply-chain feeds.
-Route recommendations are based on available route and disruption information and would require integration with real-time mapping and traffic services for production deployment.
-Fleet redeployment recommendations depend on the accuracy and availability of fleet location, capacity, and status data.
-IoT cold-chain monitoring currently depends on available/simulated sensor readings rather than direct physical IoT devices.
-Risk scoring and temperature severity classification are designed for prototype decision support and would require validation against real operational and regulatory datasets before production use.
-Authentication, security, scalability, and enterprise integrations would require additional hardening for production deployment.

---

## 🏅 What We're Most Proud Of

We are most proud of building an end-to-end decision-support platform that connects disruption detection, shipment risk analysis, route recommendations, fleet optimisation, and cold-chain monitoring into one workflow.

Instead of only showing supply-chain data, our solution focuses on the next operational decision:

Detect → Analyse → Recommend → Act

The integration of an IBM Bob AI Copilot further allows users to interact with the system naturally and understand why a particular shipment, route, or fleet action requires attention.

---
