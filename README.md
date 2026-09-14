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

- **Unified Alert Dashboard:** View security alerts from different sources in one centralized interface.
- **Alert Normalization:** Converts alerts with different structures and fields into a common format for consistent processing.
- **Threat Correlation:** Identifies relationships between alerts using factors such as source IP, destination IP, affected assets, alert type, and time proximity.
- **Incident Grouping:** Groups related alerts into a single incident to reduce duplicate investigation work.
- **Risk-Based Alert Prioritisation:** Calculates a risk score using factors such as severity, affected assets, recurrence, and related alerts and categorizes alerts as Critical, High, Medium, or Low.
- **AI-Powered Alert Explanation:** Generates a simple explanation of why an alert or incident is considered important.
- **Recommended Actions:** Provides suggested investigation or response actions based on the detected threat context.
- **Incident Investigation View:** Allows analysts to inspect an incident, view related alerts, understand the risk score, and review the AI-generated analysis.
- **Search and Filtering:** Analysts can filter alerts by severity, source, status, alert type, and priority.
- **Security Analytics:** Dashboard metrics and visualizations provide an overview of alert volumes, priorities, and incidents.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | JavaScript, HTML, CSS |
| **Frameworks** | React |
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

> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

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

> Be honest — judges appreciate transparency over overclaiming.

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
