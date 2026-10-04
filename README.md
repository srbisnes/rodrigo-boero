# ALERTA MUNDIAL

> **Global Risk Operating System** — una aplicación mobile-first de inteligencia operativa que convierte señales globales en una vista ejecutiva accionable.

[![Live](https://img.shields.io/badge/live-Vercel-black)](https://rodrigo-boero.vercel.app/)
[![Stack](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Gemini-4285f4)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/status-MVP%20%2B%20production%20roadmap-emerald)](https://github.com/srbisnes/rodrigo-boero)

## 1. Vision

**Alerta Mundial** no es un agregador de noticias ni un mapa geopolítico.

Es una capa de **Decision Intelligence** que combina:

- riesgo geopolítico;
- operaciones y eventos;
- mercados e instrumentos;
- infraestructura crítica;
- noticias multi-fuente;
- señales sociales de X;
- agentes de IA especializados;
- escenarios y recomendaciones.

La experiencia está diseñada para responder cuatro preguntas ejecutivas:

1. **¿Qué está pasando?**
2. **¿Dónde está concentrándose el riesgo?**
3. **¿Qué señales coinciden y cuáles contradicen?**
4. **¿Qué debería mirar o decidir ahora?**

### Product loop

```
DETECT → CORRELATE → REASON → PRIORITIZE → DECIDE
```

## 2. Product experience

### Command Center
- Global Risk Score.
- Operations feed.
- Heatmap.
- Market terminal.
- News flow.
- X + News sentiment consensus.
- Executive decision layer.

### Geospatial intelligence
- Interactive global map.
- War/conflict events.
- Undersea cable risk.
- Seismic activity.
- Climate anomalies.
- Travel/route warnings.
- Evidence inspection.

### Market intelligence
Instrumentos de referencia:

- Brent;
- Gold;
- Copper;
- Natural Gas;
- BTC;
- ETH;
- DXY;
- volatility/risk-premium indicators.

**Importante:** los valores del MVP son datos demo. La arquitectura está preparada para conectar feeds autenticados.

### Social consensus
X se trata como **leading signal**, no como fuente de verdad.

El motor pondera:

```
Consensus = Σ(signal_score × source_weight) / Σ(source_weight)
```

La producción deberá incorporar:
- volumen;
- engagement;
- autoridad de cuenta;
- diversidad de fuentes;
- bot/spam detection;
- idioma;
- geografía;
- ventana temporal;
- topic clustering.

### AI agent swarm

| Agent | Dominio |
|---|---|
| Aegis Sentinel | Geopolítica / conflicto |
| Kratos Armaments | Defensa / supply chains |
| Midas Ledger | Macro / mercados / cripto |
| Poseidón Net | Infraestructura submarina |
| Gaia | Clima / sismología |
| Hermes | Movilidad / logística |

Los agentes **no son fuentes de verdad**. Razonan sobre observaciones gobernadas.

## 3. Architecture

```text
                    ┌──────────────────────────┐
                    │       DATA SOURCES       │
                    │ News • Markets • X • GIS │
                    │ Weather • Seismic • AIS  │
                    └────────────┬─────────────┘
                                 ↓
                    ┌──────────────────────────┐
                    │     SOURCE ADAPTERS      │
                    │ auth • rate limit • SLA   │
                    └────────────┬─────────────┘
                                 ↓
                    ┌──────────────────────────┐
                    │   CANONICAL EVENT MODEL  │
                    │ time • geo • confidence   │
                    │ provenance • domain       │
                    └────────────┬─────────────┘
                                 ↓
                    ┌──────────────────────────┐
                    │  CORRELATION / RISK ENG. │
                    │ graph • heat • scoring    │
                    └────────────┬─────────────┘
                                 ↓
                    ┌──────────────────────────┐
                    │       AGENT SWARM        │
                    │  6 specialists + Hermes   │
                    └────────────┬─────────────┘
                                 ↓
                    ┌──────────────────────────┐
                    │ EVIDENCE + CONSENSUS     │
                    │ confidence • disagreement │
                    └────────────┬─────────────┘
                                 ↓
               ┌─────────────────┴─────────────────┐
               ↓                                   ↓
      COMMAND CENTER                         ALERT ENGINE
               ↓                                   ↓
      HUMAN DECISION                         MOBILE PUSH
               └─────────────────┬─────────────────┘
                                 ↓
                           AUDIT TRAIL
```

Full architecture: [docs/architecture.md](docs/architecture.md)

## 4. Canonical event contract

Every production event must contain:

```json
{
  "id": "evt_01",
  "tenantId": "org_01",
  "source": "provider_01",
  "sourceType": "news",
  "observedAt": "2026-10-04T17:45:00Z",
  "ingestedAt": "2026-10-04T17:45:04Z",
  "domain": "logistics",
  "operationType": "reroute",
  "severity": 84,
  "confidence": 0.91,
  "freshnessSeconds": 4,
  "geo": {
    "lat": 12.58,
    "lng": 43.33,
    "region": "Red Sea"
  },
  "entities": ["shipping", "energy"],
  "provenance": {
    "providerEventId": "abc123",
    "url": "https://provider.example/event",
    "hash": "sha256:..."
  }
}
```

## 5. Source strategy

### News
Production adapter targets:
- licensed news APIs;
- RSS/official feeds where permitted;
- publisher APIs;
- customer-owned feeds.

Do not scrape protected content without permission.

### X
Production integration should use the official X API or an authorized provider.

Pipeline:

```
X posts → collection → spam/bot filtering → language detection
       → entity/topic extraction → sentiment → clustering
       → source diversity → consensus
```

### Markets
Use licensed market-data providers with explicit redistribution rights.

### Geospatial / natural events
Target:
- seismic providers;
- weather providers;
- maritime/AIS providers;
- satellite/earth observation providers;
- infrastructure datasets.

## 6. AI governance

Every generated analysis should expose:

- model;
- generation time;
- input event IDs;
- evidence references;
- confidence;
- assumptions;
- conflicting signals;
- human approval state.

The model must never silently turn an uncertain signal into a fact.

## 7. Current MVP vs production

| Capability | MVP | Production target |
|---|---|---|
| Mobile-first UI | ✓ | PWA / native shell |
| Heatmap | ✓ demo | real-time risk tiles |
| Market terminal | ✓ demo | licensed live feeds |
| News | ✓ synthetic | multi-source adapters |
| X sentiment | ✓ synthetic | official API + anti-spam |
| Agents | ✓ Gemini | model router + evals |
| Persistence | planned | PostgreSQL |
| Auth | planned | SSO/OIDC + RBAC |
| Alerts | planned | push/SMS/email/webhooks |
| Audit | planned | immutable event log |
| Tenancy | planned | enterprise isolation |

## 8. Roadmap

### Phase 0 — 0–3 months
Production foundation:
- PostgreSQL;
- authentication;
- source adapters;
- canonical event model;
- alert engine;
- observability;
- audit trail;
- PWA shell.

### Phase 1 — 3–6 months
Design partners:
- 2–3 pilots;
- live market feeds;
- licensed news;
- X API;
- alert rules;
- saved investigations;
- executive exports.

### Phase 2 — 6–12 months
Enterprise:
- multi-tenant;
- SSO;
- RBAC;
- billing;
- API;
- SLA;
- customer-specific risk models;
- mobile push.

### Phase 3 — 12–18 months
Scale:
- proprietary risk index;
- scenario simulation;
- dependency graph;
- agent marketplace;
- partner ecosystem;
- regional expansion.

Full roadmap: [docs/roadmap.md](docs/roadmap.md)

## 9. Target customers

Initial beachheads:

1. logistics / maritime;
2. energy and commodities;
3. insurance / risk;
4. financial institutions;
5. multinational operations;
6. critical infrastructure;
7. security / intelligence consultancies.

## 10. Business model

### Starter
For individual analysts and small teams.

### Professional
Per analyst / workspace with alerts and historical investigations.

### Enterprise
Annual contract with:
- SSO;
- RBAC;
- API;
- custom feeds;
- customer-specific agents;
- SLA;
- audit;
- private deployment options.

### Data/API
Usage-based pricing for:
- event API;
- risk scores;
- premium connectors;
- webhooks.

## 11. North Star metric

**Verified Decision Value (VDV)**

Measure:

- analyst time saved;
- time-to-detection;
- time-to-decision;
- alert precision;
- false-positive rate;
- percentage of decisions with evidence.

The goal is not “more alerts”.

The goal is **better decisions with less time and less uncertainty**.

## 12. Local development

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run lint
npm run build
```

Environment:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash
DATA_MODE=demo
```

Never commit API keys.

## 13. API surface

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | service health |
| GET | /api/config | readiness |
| GET | /api/chat/messages | demo operator channel |
| POST | /api/chat/messages | operator message |
| POST | /api/gemini/query | specialist analysis |
| POST | /api/gemini/swarm-synthesize | swarm analysis |

Production APIs should add authentication, tenant context, rate limiting and audit IDs.

## 14. Security

Minimum production controls:

- OIDC/SSO;
- RBAC;
- tenant isolation;
- secret manager;
- encryption at rest/in transit;
- signed webhooks;
- API rate limiting;
- dependency scanning;
- SAST/DAST;
- immutable audit events;
- incident response;
- human approval for high-impact workflows.

See [docs/security.md](docs/security.md).

## 15. Investor material

- [Investor pitch deck](docs/pitch-deck.md)
- [Roadmap](docs/roadmap.md)
- [Competitive positioning](docs/comparison.md)
- [Metrics](docs/metrics.md)
- [Demo script](docs/demo-script.md)

## 16. Product principle

**Alerta Mundial should feel like Bloomberg Terminal + crisis command center + AI analyst, not a static news website.**

The moat is not the map.

The moat is:

```
proprietary event schema
+ source reliability
+ customer dependency graphs
+ evaluation datasets
+ historical decisions
+ agent workflows
+ enterprise integrations
```

## 17. Disclaimer

Current demo screens intentionally use synthetic data. Nothing in the demo should be interpreted as live intelligence, investment advice, military intelligence or an operational security instruction.

Production claims must be backed by verifiable sources, licensing and governance.
