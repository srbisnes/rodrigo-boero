import test from 'node:test';
import assert from 'node:assert/strict';
import { healthScore } from '../src/lib/platform';

test('production controls can reach 100%', () => {
  assert.equal(healthScore({ sourceAdapters: 4, agents: 6, observability: true, auditTrail: true }), 100);
});

test('demo configuration is intentionally below production readiness', () => {
  assert.equal(healthScore({ sourceAdapters: 2, agents: 6, observability: true, auditTrail: false }), 63);
});
