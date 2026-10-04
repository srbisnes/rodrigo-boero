import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyOperation, consensusSentiment, heatBucket } from '../src/lib/alerta';

test('classifies operational events for executive view', () => {
  assert.equal(classifyOperation('Naval traffic rerouted after port disruption'), 'LOGISTICS');
  assert.equal(classifyOperation('Central bank emergency liquidity action'), 'MARKET');
  assert.equal(classifyOperation('Fiber cable outage reported near landing station'), 'INFRASTRUCTURE');
  assert.equal(classifyOperation('Earthquake triggers coastal warning'), 'NATURAL');
});

test('computes weighted sentiment consensus', () => {
  const result = consensusSentiment([
    { source: 'X', label: 'negative', score: -0.8, weight: 0.5 },
    { source: 'X', label: 'neutral', score: 0.1, weight: 0.3 },
    { source: 'news', label: 'negative', score: -0.4, weight: 0.2 }
  ]);
  assert.equal(result.label, 'negative');
  assert.ok(result.score < -0.4);
  assert.equal(result.coverage, 3);
});

test('maps risk score to heat bucket', () => {
  assert.equal(heatBucket(91), 'critical');
  assert.equal(heatBucket(74), 'high');
  assert.equal(heatBucket(48), 'elevated');
  assert.equal(heatBucket(21), 'watch');
  assert.equal(heatBucket(5), 'low');
});
