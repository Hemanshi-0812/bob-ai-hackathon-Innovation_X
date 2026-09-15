# 🚀 Threat Intelligence Correlation & Alert Prioritisation Assistant

> An AI-powered security operations assistant that helps analysts correlate security alerts, identify high-risk incidents, prioritize threats, and understand recommended actions from a unified dashboard.
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

Security analysts receive a large number of alerts every day from different sources such as SIEM systems, cyber sensors, intelligence feeds, and security monitoring tools. Because these alerts are often fragmented, duplicated, and difficult to prioritize, analysts can spend significant time manually investigating them and may miss critical threats.

Our project addresses this problem by providing a centralized intelligent assistant that correlates related alerts, identifies potentially important incidents, prioritizes them according to risk, and provides understandable insights for security analysts.

---

## 💡 Solution

We built an AI-powered Threat Intelligence Correlation & Alert Prioritisation Assistant that collects security alerts from multiple sources, normalizes and correlates related events, and assigns a risk-based priority to help analysts focus on the most important incidents first.

The system combines rule-based correlation, risk scoring, and AI-assisted analysis to provide alert explanations, incident summaries, and recommended next actions through an interactive security dashboard.

---

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
| **IBM Technologies** | IBM Bob |
| **IBM Technologies** | Claude, Antigravity |
| **Databases** | MongoDB |
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

- The current prototype uses simulated/sample security alert data rather than direct  production SIEM and sensor integrations.
-Threat correlation and risk scoring are designed as a hackathon prototype and would require further validation with real-world security datasets.
-AI-generated explanations and recommendations should be reviewed by a qualified security analyst before being used for real incident-response decisions.
-Authentication and access control may be simplified for the hackathon prototype.
-The system has been tested primarily in a development environment and may require additional testing and optimization before production deployment.
-Real-time integrations with external security platforms are not included in the initial prototype.
---

## 🏅 What We're Most Proud Of

We are most proud of transforming a large and complex security-alert problem into an analyst-friendly workflow that combines alert correlation, risk-based prioritisation, and AI-assisted explanations in a single dashboard.

Instead of requiring analysts to investigate every alert independently, our solution helps them quickly identify the most important incidents, understand why they matter, discover related alerts, and receive actionable recommendations — demonstrating how AI can support faster and more informed security operations.

---
