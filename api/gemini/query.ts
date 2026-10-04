import { GoogleGenAI } from '@google/genai';

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) return Response.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    const key = process.env.GEMINI_API_KEY;
    if (!key) return Response.json({ success: false, error: 'GEMINI_API_KEY is not configured.' }, { status: 503 });
    try {
      const client = new GoogleGenAI({ apiKey: key });
      const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: body.systemInstruction || 'You are a decision-intelligence analyst. Answer in Spanish. Separate evidence, assumptions and recommendations.',
          temperature: 0.4
        }
      });
      return Response.json({ success: true, model, text: response.text || 'No analysis returned.' });
    } catch (error) {
      return Response.json({ success: false, error: error instanceof Error ? error.message : 'AI provider error' }, { status: 502 });
    }
  }
};
