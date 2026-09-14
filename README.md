# 🚀  Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

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
- **🎯 Affected Shipment & Risk Analysis:**Identifies shipments affected by a disruption and calculates their risk based on factors such as disruption severity, shipment priority, delay, route impact, and cargo sensitivity.
- **🛣️ AI Rerouting Recommendation:** Analyzes affected routes and recommends alternative routes to reduce delays, disruption impact, and transportation risk.
- **🚚 Idle Fleet Detection:** Identifies vehicles that are idle, underutilized, or available for redeployment based on their current location, status, and assigned workload.
- **🔄 Fleet Redeployment Recommendation::** Recommends suitable available vehicles for affected or high-priority shipments by considering factors such as vehicle location, capacity, availability, and shipment requirements.
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
| **IBM Technologies** |  Claude, IBM watsonx.ai, IBM Bob |
| **Databases** | MongoDB |
| **Other** | GitHub, Vite, IBM Bob |

---

## 📁 Repository Structure

```
├── src/                  # All source code
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt  # Link to demo video
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

```bash
# 1. Clone the repo
git clone https://github.com/https://github.com/Hemanshi-0812/bob-ai-hackathon-Innovation_X.git.git
cd [your-repo]

# 2. Install dependencies
Install frontend dependencies
cd frontend
npm install

Install backend dependencies
Open another terminal:
cd backend
npm install

# 3. Configure environment
Create .env files based on the provided .env.example.
Example:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_api_key
# Edit .env with your values

# 4. Run the project
Start the backend
cd backend
npm run dev

Start the frontend
In another terminal:
cd frontend
npm run dev

# 7. Open the application
Open the local URL displayed by Vite in your browser.

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

- The current prototype uses simulated/sample security alert data rather than direct production SIEM and sensor integrations.
- Threat correlation and risk scoring are designed as a hackathon prototype and would require further validation with real-world security datasets.
- AI-generated explanations and recommendations should be reviewed by a qualified security analyst before being used for real incident-response decisions.
- Authentication and access control may be simplified for the hackathon prototype.
- The system has been tested primarily in a development environment and may require additional testing and optimization before production deployment.
- Real-time integrations with external security platforms are not included in the initial prototype.
  
---

## 🏅 What We're Most Proud Of

We are most proud of transforming a large and complex security-alert problem into an analyst-friendly workflow that combines alert correlation, risk-based prioritisation, and AI-assisted explanations in a single dashboard.

Instead of requiring analysts to investigate every alert independently, our solution helps them quickly identify the most important incidents, understand why they matter, discover related alerts, and receive actionable recommendations — demonstrating how AI can support faster and more informed security operations.

---
