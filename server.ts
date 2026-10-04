import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = Number(process.env.PORT || 3000);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

interface ChatMessage { id: string; sender: string; role: 'operator' | 'system' | 'agent' | 'user'; text: string; timestamp: string; avatarColor?: string; }
const operatorNames = ['Vanguard_Alpha','Echo_Lima_2','Tango_Risk_9','Nexus_Core','Sentry_Zero','Delta_Tactical'];
const operatorPhrases = ['Signal cross-check requested: validate source freshness before escalation.','Infrastructure dependency detected; monitoring for correlated disruption.','Risk concentration increased in the current synthetic scenario.','Scenario engine recommends human review before an operational action.'];
let chatMessages: ChatMessage[] = [{ id: 'm1', sender: 'SYSTEM', role: 'system', text: 'SWARM INTEL demo channel online. Synthetic data is enabled.', timestamp: new Date().toISOString() }];
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is not configured.');
    geminiClient = new GoogleGenAI({ apiKey: key, httpOptions: { headers: { 'User-Agent': 'swarm-intel-platform' } } });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'swarm-intel-api', mode: process.env.DATA_MODE || 'demo', model: GEMINI_MODEL, timestamp: new Date().toISOString() }));
  app.get('/api/config', (_req, res) => res.json({ dataMode: process.env.DATA_MODE || 'demo', model: GEMINI_MODEL, productionReadiness: { sourceAdapters: false, persistentStore: false, auditTrail: false, humanApproval: true } }));
  app.get('/api/chat/messages', (_req, res) => res.json(chatMessages));

  app.post('/api/chat/messages', (req, res) => {
    const { sender, text, role } = req.body;
    if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    const message: ChatMessage = { id: 'm_' + Date.now(), sender: typeof sender === 'string' ? sender : 'Anonymous', role: role || 'user', text: text.trim(), timestamp: new Date().toISOString(), avatarColor: 'bg-emerald-600' };
    chatMessages = [...chatMessages, message].slice(-50);
    setTimeout(() => {
      const name = operatorNames[Math.floor(Math.random() * operatorNames.length)];
      const phrase = operatorPhrases[Math.floor(Math.random() * operatorPhrases.length)];
      chatMessages = [...chatMessages, { id: 'm_sim_' + Date.now(), sender: name, role: 'operator', text: phrase, timestamp: new Date().toISOString(), avatarColor: 'bg-indigo-600' }].slice(-50);
    }, 900);
    res.json({ success: true, message });
  });

  app.post('/api/gemini/query', async (req, res) => {
    const { systemInstruction, prompt } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error: 'Prompt is required' });
    try {
      const response = await getGeminiClient().models.generateContent({ model: GEMINI_MODEL, contents: prompt, config: { systemInstruction: systemInstruction || 'You are a decision-intelligence analyst. Answer in Spanish.', temperature: 0.4 } });
      res.json({ success: true, model: GEMINI_MODEL, text: response.text || 'No analysis returned.' });
    } catch (error: any) {
      console.error('Gemini query error', error);
      res.status(502).json({ success: false, error: error?.message || 'AI provider error' });
    }
  });

  app.post('/api/gemini/swarm-synthesize', async (req, res) => {
    const { prompt, agents } = req.body;
    if (typeof prompt !== 'string' || !Array.isArray(agents) || !agents.length) return res.status(400).json({ error: 'Prompt and agents list are required.' });
    const client = getGeminiClient();
    const results = await Promise.all(agents.map(async (agent: any) => {
      try {
        const response = await client.models.generateContent({ model: GEMINI_MODEL, contents: 'Analyze this risk scenario: "' + prompt + '". Return three concise decision-relevant findings.', config: { systemInstruction: agent.systemInstruction, temperature: 0.3 } });
        return { agentId: agent.id, agentName: agent.name, role: agent.role, text: response.text || '', timestamp: new Date().toISOString() };
      } catch (_error) {
        return { agentId: agent.id, agentName: agent.name, role: agent.role, text: '[Agent unavailable]', timestamp: new Date().toISOString() };
      }
    }));
    res.json({ success: true, model: GEMINI_MODEL, analyses: results });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log('SWARM INTEL listening on ' + PORT));
}
startServer();
