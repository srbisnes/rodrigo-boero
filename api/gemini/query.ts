import { GoogleGenAI } from '@google/genai';
import { validateAgentQuery } from '../../src/lib/swarm';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'alerta-mundial-gemini-query',
      model: MODEL,
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { systemInstruction, prompt } = req.body ?? {};
  const validationError = validateAgentQuery(prompt);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ success: false, error: 'GEMINI_API_KEY is not configured.' });

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt.trim(),
      config: {
        systemInstruction: typeof systemInstruction === 'string' && systemInstruction.trim()
          ? systemInstruction
          : 'Eres un analista de inteligencia para decisiones empresariales. Responde en español, distingue hechos de inferencias y marca incertidumbre.',
        temperature: 0.4,
      },
    });
    return res.status(200).json({ success: true, model: MODEL, text: response.text || 'No analysis returned.' });
  } catch (error: any) {
    console.error('Gemini query error', error);
    return res.status(502).json({ success: false, error: error?.message || 'AI provider error' });
  }
}
