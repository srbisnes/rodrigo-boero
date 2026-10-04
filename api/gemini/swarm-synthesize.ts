import { GoogleGenAI } from '@google/genai';
import { buildSwarmPrompt, normalizeSwarmResult, validateSwarmRequest, type SwarmAgentInput } from '../../src/lib/swarm';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'alerta-mundial-gemini-swarm',
      model: MODEL,
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { prompt, agents } = req.body ?? {};
  const validationError = validateSwarmRequest(prompt, agents);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ success: false, error: 'GEMINI_API_KEY is not configured.' });

  const client = new GoogleGenAI({ apiKey });
  const results = await Promise.all(
    (agents as SwarmAgentInput[]).map(async (agent) => {
      try {
        const response = await client.models.generateContent({
          model: MODEL,
          contents: buildSwarmPrompt(prompt),
          config: {
            systemInstruction: agent.systemInstruction || 'Eres un analista de riesgo. Responde en español.',
            temperature: 0.3,
          },
        });
        return normalizeSwarmResult(agent, response.text || '', true);
      } catch (error: any) {
        const message = error?.message || 'Agent provider error';
        console.error('Swarm agent error', { agentId: agent.id, message });
        return normalizeSwarmResult(agent, '', false, message);
      }
    }),
  );

  const successful = results.filter((result) => result.ok).length;
  return res.status(successful > 0 ? 200 : 502).json({
    success: successful > 0,
    partial: successful > 0 && successful < results.length,
    model: MODEL,
    analyses: results,
    summary: { total: results.length, successful, failed: results.length - successful },
    ...(successful === 0 ? { error: 'All swarm agents failed.' } : {}),
  });
}
