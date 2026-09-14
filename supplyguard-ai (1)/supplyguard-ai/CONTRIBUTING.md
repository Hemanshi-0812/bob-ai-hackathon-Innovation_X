# Contributing

Thanks for your interest in SupplyGuard AI — the Supply Chain Disruption
Assistant & Fleet Utilisation Optimizer (problem statement L2).

## Getting started

See [`docs/setup-guide.md`](docs/setup-guide.md) for full setup instructions.

Quick start:

```bash
docker compose up --build
```

## Project structure

```
├── src/            # All source code (Express backend, React frontend)
├── docs/            # Written documentation
├── demo/            # Demo artifacts (screenshots, video link)
├── presentation/    # Slide deck
└── submission.yaml  # Structured submission metadata
```

## Making changes

1. Create a branch off `main` for your change.
2. Backend changes go in `src/backend/src/`, following the existing
   one-service-per-capability pattern under `services/`.
3. Frontend changes go in `src/frontend/src/`, with one page per module
   under `pages/` and shared UI under `components/`.
4. Run the sanity checks before opening a pull request:
   ```bash
   cd src/backend && node -e "import('./src/app.js').then(() => console.log('backend OK'))"
   cd ../frontend && npm run build
   ```
5. Update the relevant file under `docs/` if your change affects setup,
   architecture, or the solution's behaviour.

## Code style

- Backend: ES modules, one Express router per module, one service module
  per capability (disruption detection, routing, fleet, cold chain, Bob
  copilot).
- Frontend: functional components only, one page per module under
  `pages/`, shared pieces (sidebar, top bar, severity chip, disruption
  selector) under `components/`.

## Reporting issues

Open a GitHub issue describing the problem, steps to reproduce, and (if
relevant) which endpoint or page is affected.

## Questions

For anything related to the problem statement itself, see
[`docs/problem-statement.md`](docs/problem-statement.md) and
[`docs/solution-overview.md`](docs/solution-overview.md).
