export interface SwarmAgentInput {
  id: string;
  name: string;
  role: string;
  systemInstruction?: string;
}

export interface SwarmAnalysis {
  agentId: string;
  agentName: string;
  role: string;
  text: string;
  timestamp: string;
  ok: boolean;
  error?: string;
}

export function validateAgentQuery(prompt: unknown): string | null {
  if (typeof prompt !== 'string' || !prompt.trim()) return 'Prompt is required';
  return null;
}

export function validateSwarmRequest(prompt: unknown, agents: unknown): string | null {
  if (typeof prompt !== 'string' || !prompt.trim()) return 'Prompt is required';
  if (!Array.isArray(agents) || agents.length === 0) return 'Prompt and agents list are required.';
  for (const agent of agents) {
    if (!agent || typeof agent !== 'object' || typeof (agent as SwarmAgentInput).id !== 'string' || typeof (agent as SwarmAgentInput).name !== 'string') {
      return 'Each agent must include id and name.';
    }
  }
  return null;
}

export function normalizeSwarmResult(agent: SwarmAgentInput, text: string, ok = true, error?: string): SwarmAnalysis {
  return {
    agentId: agent.id,
    agentName: agent.name,
    role: agent.role || 'Analyst',
    text: text || (ok ? 'No analysis returned.' : '[Agent unavailable]'),
    timestamp: new Date().toISOString(),
    ok,
    ...(error ? { error } : {})
  };
}

export function buildSwarmPrompt(prompt: string): string {
  return [
    'Analyze the following global risk scenario.',
    'Return exactly three concise, decision-relevant findings in Spanish.',
    'Separate facts/inferences from assumptions and explicitly flag uncertainty.',
    'Do not invent live sources, coordinates, events, market prices, or classified information.',
    'Scenario:',
    prompt.trim()
  ].join('\\n');
}
