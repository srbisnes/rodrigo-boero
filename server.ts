/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = 3000;

// Shared state for the Live Operator Chat
interface ChatMessage {
  id: string;
  sender: string;
  role: 'operator' | 'system' | 'agent' | 'user';
  text: string;
  timestamp: string;
  avatarColor?: string;
}

const operatorAvatars = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-amber-600'
];

const operatorNames = [
  'Vanguard_Alpha',
  'Echo_Lima_2',
  'Tango_Risk_9',
  'Nexus_Core',
  'Sentry_Zero',
  'Delta_Tactical'
];

const operatorPhrases = [
  "Confirmada anomalía térmica en Suez. El canal reporta disminución de velocidad en tránsitos de crudo.",
  "Reportes satelitales confirman desvíos masivos en Bab al-Mandab. Las navieras evitan el estrecho.",
  "Detectadas interferencias menores en las balizas submarinas del cable PFH-3. Monitoreando espectro.",
  "Nuevo seísmo de baja escala detectado frente a la costa de Japón. No se ha generado advertencia de tsunami mayor.",
  "Índices de materias primas estables, pero el crudo spot Brent sube un 1.2% preventivo por tensiones navales.",
  "Se recomienda desviar rutas terrestres de carga en la región báltica secundaria. Rutas verdes del suroeste operativas."
];

let chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'SISTEMA DE ENLACE',
    role: 'system',
    text: 'Enlace satelital de seguridad global en línea. Canales encriptados activos.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'm2',
    sender: 'Vanguard_Alpha',
    role: 'operator',
    text: 'Sentry, ¿tienen confirmación de reubicación de la flotilla en el Mar Rojo?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'm3',
    sender: 'Sentry_Zero',
    role: 'operator',
    text: 'Positivo. Siete portacontenedores han modificado su curso en las últimas 2 horas. El enjambre Aegis está computando rutas de escape seguras.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    avatarColor: 'bg-teal-600'
  }
];

// Helper to lazy-initialize Gemini API safely without crashing on load
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not defined. Please configure secrets.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // 1. Live Operator Chat list
  app.get('/api/chat/messages', (req, res) => {
    res.json(chatMessages);
  });

  // 2. Post Chat Message and Auto-simulate Operator activity
  app.post('/api/chat/messages', (req, res) => {
    const { sender, text, role } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const userMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: sender || 'Anónimo',
      role: role || 'user',
      text,
      timestamp: new Date().toISOString(),
      avatarColor: 'bg-emerald-600'
    };

    chatMessages.push(userMsg);

    // Limit kept messages
    if (chatMessages.length > 50) {
      chatMessages = chatMessages.slice(-50);
    }

    // Trigger an automated simulated response from another operator after a brief gap (run in background)
    setTimeout(() => {
      const isAgentResponse = Math.random() > 0.4;
      const opIndex = Math.floor(Math.random() * operatorNames.length);
      const phraseIndex = Math.floor(Math.random() * operatorPhrases.length);
      
      const newSimMsg: ChatMessage = {
        id: `m_sim_${Date.now()}`,
        sender: operatorNames[opIndex],
        role: 'operator',
        text: isAgentResponse 
          ? `Procediendo a la evaluación logística. Con el enlace del usuario de: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}" recopilamos monitoreos en directo.`
          : operatorPhrases[phraseIndex],
        timestamp: new Date().toISOString(),
        avatarColor: operatorAvatars[opIndex]
      };
      chatMessages.push(newSimMsg);
    }, 1200);

    res.json({ success: true, message: userMsg });
  });

  // 3. Gemini Intelligent Agent Query System
  app.post('/api/gemini/query', async (req, res) => {
    const { agentId, agentName, systemInstruction, prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || 'You are an intelligence agent. Answer in Spanish.',
          temperature: 0.7,
        }
      });

      res.json({
        success: true,
        text: response.text || 'Sin respuesta del agente encriptado.'
      });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      // Give a highly readable operational error payload instead of crashing
      res.status(500).json({
        success: false,
        error: err.message || 'Error de conexión con la red de inteligencia artificial.'
      });
    }
  });

  // 4. Swarm Synthesis API: Ask ALL active agents on the same crisis concurrently
  app.post('/api/gemini/swarm-synthesize', async (req, res) => {
    const { prompt, agents } = req.body;
    if (!prompt || !agents || !Array.isArray(agents)) {
      return res.status(400).json({ error: 'Prompt and agents list are required.' });
    }

    try {
      const client = getGeminiClient();
      
      // Run queries concurrently for all active agents to make a full defensive layout
      const promises = agents.map(async (agent: any) => {
        try {
          // Adjust length constraints for swarm replies to save response budget and keep layout sharp
          const response = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: `Analiza esta emergencia global: "${prompt}". Responde con un resumen militar/estratégico de máximo 3 oraciones concisas y detalladas en base a tu rol.`,
            config: {
              systemInstruction: agent.systemInstruction,
              temperature: 0.5,
            }
          });
          return {
            agentId: agent.id,
            agentName: agent.name,
            role: agent.role,
            text: response.text || 'Análisis no disponible en este sector.',
            timestamp: new Date().toISOString()
          };
        } catch (e: any) {
          return {
            agentId: agent.id,
            agentName: agent.name,
            role: agent.role,
            text: `[Canal Desconectado] Error al establecer enlace cuántico: ${e.message}`,
            timestamp: new Date().toISOString()
          };
        }
      });

      const results = await Promise.all(promises);
      res.json({ success: true, analyses: results });
    } catch (err: any) {
      console.error("Swarm Synthesis Error:", err);
      res.status(500).json({
        success: false,
        error: err.message || 'Error general enlazando el enjambre.'
      });
    }
  });

  // --- Serve Frontend Application ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OPERACIONAL] Servidor dApp Geopolítica corriendo en puerto: ${PORT}`);
  });
}

startServer();
