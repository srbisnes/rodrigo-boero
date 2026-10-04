# Security & Governance

## Current demo posture

The demo is intentionally not presented as production intelligence.

Current limitations:

- synthetic/static datasets;
- in-memory chat state;
- no tenant isolation;
- no persistent audit database;
- API key supplied through environment secrets;
- AI outputs are not authoritative facts.

## Production security baseline

### Identity
- SSO/OIDC;
- MFA through identity provider;
- RBAC;
- service accounts;
- short-lived tokens.

### Data
- encryption in transit;
- encryption at rest;
- tenant-scoped queries;
- retention policies;
- customer data deletion workflow.

### AI
- prompt isolation;
- provider abstraction;
- model allowlist;
- input/output validation;
- evidence-required responses;
- human approval for high-impact actions.

### Infrastructure
- secret manager;
- dependency scanning;
- CI checks;
- runtime monitoring;
- rate limiting;
- WAF;
- incident response.

### Auditability

Record:

- who viewed an event;
- who changed a severity;
- which sources supported an alert;
- which model generated an analysis;
- which prompt/context version was used;
- who approved an action;
- when the decision was made.

## Security roadmap

**0–3 months:** secrets, validation, logging, dependency scanning.

**3–6 months:** tenant isolation, RBAC, audit trail, security review.

**6–12 months:** SSO, formal threat model, external penetration test.

**12–18 months:** continuous control monitoring and enterprise compliance program.
