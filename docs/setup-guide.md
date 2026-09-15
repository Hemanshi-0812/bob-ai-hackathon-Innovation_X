# Setup Guide

<<<<<<< HEAD
## Option A — Docker Compose (recommended)

```bash
git clone <this-repo>
cd supplyguard-ai
docker compose up --build
```

- Backend API: http://localhost:5000 (health check at `/health`)
- Frontend dashboard: http://localhost:5173

**Demo login:** `[email protected]` / `supplyguard123`
(seeded automatically on first run — see `.env.example`), or click
**Create one** on the login screen to register your own account.

If you customize `DEMO_USER_EMAIL`/`DEMO_USER_PASSWORD` (via a root-level
`.env` — see `.env.example`), do this on a **fresh** database, since the
demo user is only seeded once. If you already have a running Mongo volume
from an earlier attempt with different credentials, either register a new
account instead, or reset the volume with `docker compose down -v` before
starting again.

## Option B — Run locally without Docker

### Backend

```bash
cd src/backend
npm install
cp .env.example .env
npm run dev
```

If MongoDB isn't running locally, the backend automatically falls back to
in-memory simulated data — you'll see `MongoDB unreachable — falling back to
in-memory mock data` in the logs, and everything still works, including
login (a fallback demo user is used).

To use real MongoDB: install MongoDB locally or point `MONGO_URI` in `.env`
at any reachable instance (e.g. MongoDB Atlas).

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```

The dashboard proxies `/api/*` requests to `http://localhost:5000` (see
`vite.config.js`).

## Enabling real IBM watsonx.ai reasoning (optional)

By default Bob runs with a deterministic rule-based summary so it works
fully offline. To use a real watsonx.ai foundation model:

1. Create a watsonx.ai project and an API key in IBM Cloud.
2. In `src/backend/.env`, set:
   ```
   WATSONX_API_KEY=<your-key>
   WATSONX_PROJECT_ID=<your-project-id>
   WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
   ```
3. Restart the backend. `GET /api/copilot/status` will report
   `watsonxEnabled: true`.

## Key endpoints

| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Create a new account, returns a JWT |
| `POST /api/auth/login` | Log in, returns a JWT |
| `GET /api/dashboard/summary` | Executive dashboard stats |
| `GET /api/shipments` | Shipment management list |
| `GET /api/disruptions` | Active disruptions (with map coords) |
| `GET /api/disruptions/:id/impacted-shipments` | Risk-scored affected shipments |
| `GET /api/disruptions/:id/reroute-recommendations` | AI rerouting suggestions |
| `GET /api/fleet/idle?disruptionId=...` | Idle fleet + redeployment suggestions |
| `GET /api/coldchain/readings` | Raw simulated IoT temperature readings |
| `GET /api/coldchain/excursions` | Classified temperature excursions |
| `GET /api/copilot/brief/:disruptionId` | Full Bob AI Copilot brief |
| `POST /api/copilot/chat` | Free-form chat with Bob |

All routes except `/api/auth/login` and `/health` require
`Authorization: Bearer <token>`.

## Sanity checks

```bash
cd src/backend && node -e "import('./src/app.js').then(() => console.log('backend OK'))"
cd ../frontend && npm run build
```

Both run automatically in CI (`.github/workflows/ci.yml`).
=======
> **This file is read by the automated evaluation pipeline. Be precise and complete.**

## Prerequisites

Before you begin, ensure you have the following installed:

- [ ] [e.g., Python 3.11+]
- [ ] [e.g., Node.js 18+]
- [ ] [e.g., Docker Desktop]
- [ ] [e.g., An IBM Cloud account with watsonx.ai access]

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|---|---|---|
| `WATSONX_API_KEY` | Your IBM watsonx.ai API key | Yes |
| `WATSONX_PROJECT_ID` | Your watsonx.ai project ID | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SLACK_WEBHOOK_URL` | Slack webhook for alerts | No |

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/[your-org]/[your-repo].git
cd [your-repo]

# 2. Install backend dependencies
[your command — e.g.: pip install -r requirements.txt]

# 3. Install frontend dependencies (if applicable)
[your command — e.g.: cd frontend && npm install]

# 4. Set up the database (if applicable)
[your command — e.g.: python manage.py migrate]
```

## Running the Application

```bash
# Start the backend
[your command — e.g.: uvicorn app.main:app --reload]

# Start the frontend (in a separate terminal, if applicable)
[your command — e.g.: cd frontend && npm run dev]
```

The application will be available at: `http://localhost:[PORT]`

## Running Tests

```bash
[your test command — e.g.: pytest tests/ -v]
```

## Quick Demo (Optional)

If you have a demo script or sample data to showcase the project quickly:

```bash
[e.g.: python demo/seed_demo_data.py]
[e.g.: open http://localhost:8000/demo]
```

## Troubleshooting

| Issue | Solution |
|---|---|
| [e.g., `ModuleNotFoundError`] | [e.g., Run `pip install -r requirements.txt` again] |
| [e.g., Database connection refused] | [e.g., Ensure PostgreSQL is running: `docker compose up db`] |
| [e.g., watsonx.ai 401 error] | [e.g., Check `WATSONX_API_KEY` in your `.env` file] |
>>>>>>> origin/main
