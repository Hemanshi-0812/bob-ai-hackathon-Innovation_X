# 🚀  Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

> ⚠️ **Replace everything in `[ ]` brackets with your actual content before submission.**

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

> In 2–3 sentences: What problem does your project solve? Who experiences this problem?

Security analysts receive a large number of alerts every day from different sources such as SIEM systems, cyber sensors, intelligence feeds, and security monitoring tools. Because these alerts are often fragmented, duplicated, and difficult to prioritize, analysts can spend significant time manually investigating them and may miss critical threats.

Our project addresses this problem by providing a centralized intelligent assistant that correlates related alerts, identifies potentially important incidents, prioritizes them according to risk, and provides understandable insights for security analysts.

---

## 💡 Solution

> In 2–3 sentences: What did you build? How does it solve the problem above?

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
| **Languages** | [e.g., Python, TypeScript] |
| **Frameworks** | [e.g., FastAPI, React] |
| **IBM Technologies** | [e.g., watsonx.ai, IBM Bob, IBM Cloud] |
| **Databases** | [e.g., PostgreSQL, Redis] |
| **Other** | [e.g., Docker, GitHub Actions] |

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
