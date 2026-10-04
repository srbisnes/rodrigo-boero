import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSwarmPrompt, normalizeSwarmResult, validateAgentQuery, validateSwarmRequest } from '../src/lib/swarm';

test('rejects empty single-agent prompts', () => {
  assert.equal(validateAgentQuery('   '), 'Prompt is required');
});

test('accepts a valid single-agent prompt', () => {
  assert.equal(validateAgentQuery('Assess cable outage risk'), null);
});

test('rejects a swarm without agents', () => {
  assert.equal(validateSwarmRequest('Assess the crisis', []), 'Prompt and agents list are required.');
});

test('rejects malformed swarm agents', () => {
  assert.equal(validateSwarmRequest('Assess the crisis', [{ name: 'Aegis' }]), 'Each agent must include id and name.');
});

test('builds a bounded decision-intelligence prompt', () => {
  const prompt = buildSwarmPrompt('  Cable outage near a port  ');
  assert.match(prompt, /three concise, decision-relevant findings/i);
  assert.match(prompt, /Cable outage near a port/);
});

test('normalizes successful and failed agent results', () => {
  const agent = { id: 'aegis', name: 'Aegis Sentinel', role: 'Tactical' };
  const ok = normalizeSwarmResult(agent, 'Hallazgo', true);
  const failed = normalizeSwarmResult(agent, '', false, 'provider timeout');

  assert.equal(ok.ok, true);
  assert.equal(ok.text, 'Hallazgo');
  assert.equal(failed.ok, false);
  assert.equal(failed.error, 'provider timeout');
  assert.equal(failed.text, '[Agent unavailable]');
});
