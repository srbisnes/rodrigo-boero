import { GoogleGenAI } from '@google/genai';

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const agents = Array.isArray(body.agents) ? body.agents : [];
    if (!prompt || !agents.length) return Response.json({ success: false, error: 'Prompt and agents list are required.' }, { status: 400 });
    const key = process.env.GEMINI_API_KEY;
    if (!key) return Response.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 503 });
    const client = new GoogleGenAI({ apiKey: key });
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    const analyses = await Promise.all(agents.map(async (agent: any) => {
      try {
        const response = await client.models.generateContent({
          model,
          contents: 'Analyze this risk scenario: "' + prompt + '". Return three concise decision-relevant findings. Explicitly mark uncertainty.',
          config: { systemInstruction: agent.systemInstruction || 'You are a specialist risk analyst.', temperature: 0.3 }
        });
        return { agentId: agent.id, agentName: agent.name, role: agent.role, text: response.text || '', timestamp: new Date().toISOString() };
      } catch (_error) {
        return { agentId: agent.id, agentName: agent.name, role: agent.role, text: '[Agent unavailable]', timestamp: new Date().toISOString() };
      }
    }));
    return Response.json({ success: true, model, analyses });
  }
};
