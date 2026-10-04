# SWARM INTEL PLATFORM

> Decision Intelligence para riesgo geopolítico, infraestructura crítica y señales económicas.

![Status](https://img.shields.io/badge/status-demo--enterprise--roadmap-emerald)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Express-blue)
![AI](https://img.shields.io/badge/AI-Gemini%203.5%20Flash-purple)
![License](https://img.shields.io/badge/license-Apache--2.0-lightgrey)

**Live demo:** https://rodrigo-boero.vercel.app/

## Executive summary

Swarm Intel is an AI-assisted operational intelligence platform. It ingests heterogeneous signals, correlates them across risk domains, asks specialist agents to analyze the same situation from different perspectives, and presents a decision-ready operating picture.

The current release is a **demonstration system**. Its synthetic datasets are intentionally labelled as demo data. Production deployment requires authenticated source adapters, provenance metadata, persistence, RBAC, auditability and human approval controls.

### The problem

Organizations often have data, but not a coherent operating picture:

- signals live in different systems;
- analysts spend time normalizing and correlating events;
- alerts are difficult to prioritize;
- AI outputs can be hard to audit;
- critical decisions need evidence, confidence and human accountability.

### The product

**Detect → Reason → Correlate → Decide**

1. Detect signals and normalize them.
2. Reason with specialist AI agents.
3. Correlate events and dependencies.
4. Produce scenarios, priorities and recommended actions.

## Current architecture

```text
[External sources]
     |
     v
[Source adapters] --> [Normalization / data contracts]
     |                         |
     v                         v
[Event store] ----------> [Correlation engine]
                                  |
                                  v
                    +-----------------------------+
                    | Specialist agent swarm      |
                    | Geopolitical | Infrastructure|
                    | Economy      | Climate       |
                    | Mobility     | Synthesis      |
                    +-----------------------------+
                                  |
                                  v
                    [Evidence + confidence + provenance]
                                  |
                                  v
                    [Command Center / API / Alerts]
```

See [technical architecture](docs/architecture.md).

## Product surfaces

- Global risk map
- Critical infrastructure view
- Economic and crypto reference panel
- Six-agent analysis swarm
- Evidence viewer
- Operational event log
- Gemini-powered single-agent analysis
- Gemini-powered swarm synthesis
- Health/readiness endpoint
- Enterprise roadmap and governance model

## Technology

| Layer | Current | Production target |
|---|---|---|
| Frontend | React 19 + Vite | React/Next.js + design system |
| UI | Tailwind CSS + Lucide | Design tokens + accessibility |
| Backend | Express | Vercel Functions / service boundary |
| AI | Gemini 3.5 Flash | Model router + evaluation layer |
| Data | Synthetic in-memory fixtures | PostgreSQL + event store |
| Auth | Planned | Enterprise SSO + RBAC |
| Observability | Basic logs | traces + metrics + audit events |
| Deployment | Vercel | Vercel + managed data services |

Gemini 3.5 Flash is a current stable production model for agentic and coding workloads. Model selection should remain configurable rather than hard-coded. See Google's current model documentation. 

## Development

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm test
npm run build
```

Environment:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash
DATA_MODE=demo
```

## API

| Method | Route | Purpose |
|---|---|---|
| GET | /api/health | Runtime health |
| GET | /api/config | Demo/production readiness |
| GET | /api/chat/messages | Operator channel |
| POST | /api/chat/messages | Add operator message |
| POST | /api/gemini/query | Single-agent analysis |
| POST | /api/gemini/swarm-synthesize | Multi-agent synthesis |

## Production data contract

Every observation should carry:

```json
{
  "id": "event-123",
  "source": "provider-id",
  "observedAt": "2026-10-04T12:00:00Z",
  "ingestedAt": "2026-10-04T12:00:03Z",
  "domain": "infrastructure",
  "severity": "high",
  "confidence": 0.87,
  "freshnessSeconds": 3,
  "location": { "lat": 0, "lng": 0 },
  "provenance": {
    "rawReference": "provider-event-id",
    "hash": "sha256:..."
  }
}
```

## 18-month roadmap

- **0–3 months:** production foundation, source adapters, observability, audit model.
- **3–6 months:** 2–3 design partners, alerting, workflows and evaluation.
- **6–12 months:** multi-tenant enterprise SaaS, RBAC, API, billing and SLA.
- **12–18 months:** proprietary risk scoring, agent marketplace and regional scale.

Full plan: [docs/roadmap.md](docs/roadmap.md)

## Commercial model

Initial target customers:

1. logistics and supply-chain operators;
2. maritime and critical-infrastructure companies;
3. insurers and risk teams;
4. financial institutions and commodity desks;
5. security and intelligence consultancies;
6. multinational companies with distributed operations.

Potential monetization:

- SaaS per analyst/workspace;
- enterprise annual contracts;
- API usage;
- premium source connectors;
- managed intelligence workflows.

## Security principles

- least privilege;
- secret management;
- tenant isolation;
- provenance on every observation;
- human approval for high-impact actions;
- audit trail for critical decisions;
- rate limits and abuse protection;
- model/provider abstraction;
- no claim of real-time intelligence without a verified source.

See [docs/security.md](docs/security.md).

## Investor / enterprise material

- [Roadmap + milestones](docs/roadmap.md)
- [Competitive positioning](docs/comparison.md)
- [Pitch deck](docs/pitch-deck.md)
- [Demo script](docs/demo-script.md)
- [Metrics](docs/metrics.md)
- [Architecture](docs/architecture.md)

## Important product rule

**The UI must never imply that synthetic/demo data is live intelligence.** This distinction is a feature, not a weakness: enterprise buyers need to know exactly where a signal came from, how fresh it is, and how confident the system is.

---

Built as an AI-assisted decision-intelligence prototype by ElCryptoBoy.
