export interface PlatformHealthInput {
  sourceAdapters: number;
  agents: number;
  observability: boolean;
  auditTrail: boolean;
}

export function healthScore(input: PlatformHealthInput): number {
  const adapterScore = Math.min(input.sourceAdapters / 4, 1) * 35;
  const agentScore = Math.min(input.agents / 6, 1) * 25;
  const observabilityScore = input.observability ? 20 : 0;
  const auditScore = input.auditTrail ? 20 : 0;
  return Math.round(adapterScore + agentScore + observabilityScore + auditScore);
}
