/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgentPersona, AgentAnalysis, ChatMessage } from '../types';
import { Sparkles, BrainCircuit, MessageSquare, Terminal, RefreshCw, Send, ShieldCheck, AlertCircle } from 'lucide-react';

interface AgentSwarmProps {
  agents: AgentPersona[];
  onAddSystemLogMsg: (msg: string) => void;
}

export default function AgentSwarm({ agents, onAddSystemLogMsg }: AgentSwarmProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentPersona>(agents[0]);
  const [agentQueries, setAgentQueries] = useState<{ [agentId: string]: string }>({});
  const [agentChats, setAgentChats] = useState<{ [agentId: string]: ChatMessage[] }>({});
  const [loadingAgentQuery, setLoadingAgentQuery] = useState<{ [agentId: string]: boolean }>({});

  // Swarm simulation state
  const [swarmPrompt, setSwarmPrompt] = useState<string>(
    'Foco de hostilidad militar en el Estrecho de Bab al-Mandab compromete físicamente el cable de fibra óptica EIES y genera pánico en el mercado de materias primas.'
  );
  const [swarmAnalyses, setSwarmAnalyses] = useState<AgentAnalysis[]>([]);
  const [loadingSwarm, setLoadingSwarm] = useState<boolean>(false);
  const [swarmError, setSwarmError] = useState<string | null>(null);

  // Send a custom prompt to a single agent
  const handleQueryAgent = async (e: React.FormEvent, agent: AgentPersona) => {
    e.preventDefault();
    const queryText = agentQueries[agent.id]?.trim();
    if (!queryText) return;

    // Append user message to chat history
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'Operador',
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentChats = agentChats[agent.id] || [];
    setAgentChats({
      ...agentChats,
      [agent.id]: [...currentChats, userMsg]
    });

    setAgentQueries({ ...agentQueries, [agent.id]: '' });
    setLoadingAgentQuery({ ...loadingAgentQuery, [agent.id]: true });

    try {
      const response = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          agentName: agent.name,
          systemInstruction: agent.systemInstruction,
          prompt: queryText
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fallo general de comunicación.');
      }

      const agentReply: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: agent.name,
        role: 'agent',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarColor: agent.avatarColor
      };

      setAgentChats(prev => ({
        ...prev,
        [agent.id]: [...(prev[agent.id] || []), agentReply]
      }));
      onAddSystemLogMsg(`Enlace resuelto con ${agent.name} con éxito.`);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'DISPOSITIVO DE SEGURIDAD',
        role: 'system',
        text: `Error de canal cuántico: ${err.message}. Verifique la configuración de secreto de su API.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAgentChats(prev => ({
        ...prev,
        [agent.id]: [...(prev[agent.id] || []), errorMsg]
      }));
    } finally {
      setLoadingAgentQuery(prev => ({ ...prev, [agent.id]: false }));
    }
  };

  // Run the multi-agent Crisis Swarm Simulation concurrently
  const handleRunSwarmSimulation = async () => {
    if (!swarmPrompt.trim()) return;
    setLoadingSwarm(true);
    setSwarmError(null);
    setSwarmAnalyses([]);
    onAddSystemLogMsg(`Orden del Enjambre de agentes: Analizando crisis global concurrentemente...`);

    try {
      const response = await fetch('/api/gemini/swarm-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: swarmPrompt,
          agents: agents
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Fallo en la resolución simultánea del enjambre.');
      }

      setSwarmAnalyses(data.analyses || []);
      onAddSystemLogMsg(`Operación Synthesis completa. Se han integrado 6 reportes de seguridad.`);
    } catch (err: any) {
      console.error(err);
      setSwarmError(err.message || 'Error general unificando los canales cibernéticos.');
    } finally {
      setLoadingSwarm(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="agent_swarm_central_module">
      {/* LEFT COLUMN: Agent Directory and specialized details */}
      <div className="lg:col-span-4 bg-[#0a0d16] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4" /> RECTORIO DE ENJAMBRE DE AGENTES
          </h4>
          <p className="text-[11px] text-gray-400 mb-4">
            Cada agente de IA posee un entrenamiento heurístico y directiva particular.
          </p>

          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition ${
                  selectedAgent.id === agent.id
                    ? 'bg-slate-900 border-emerald-500/50'
                    : 'bg-transparent border-gray-900 hover:bg-slate-950 hover:border-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${agent.avatarColor}`} />
                  <div>
                    <p className={`text-xs font-mono font-bold ${selectedAgent.id === agent.id ? 'text-emerald-400' : 'text-gray-200'}`}>
                      {agent.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono italic">{agent.role}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                  agent.status === 'monitoring' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {agent.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Agent card info */}
        <div className="mt-5 border-t border-gray-900 pt-4">
          <div className="bg-[#05070c] p-3 rounded-lg border border-gray-900 text-xs text-gray-300 font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400">ENFOQUE DE INTELIGENCIA:</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <ul className="space-y-1 list-disc list-inside text-gray-400 text-[11px]">
              {selectedAgent.focus.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MID COLUMN: Selected Agent Real-time Terminal Chat */}
      <div className="lg:col-span-4 bg-[#0a0d16] border border-gray-800 rounded-xl p-4 flex flex-col justify-between min-h-[420px]">
        <div className="flex flex-col h-full justify-between">
          {/* Channel Header */}
          <div className="border-b border-gray-900 pb-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${selectedAgent.avatarColor} animate-pulse`} />
              <div>
                <h5 className="text-xs font-mono font-bold text-emerald-400">{selectedAgent.name}</h5>
                <p className="text-[9px] text-gray-500 font-mono">Canal Encriptado • Directo</p>
              </div>
            </div>
            <Terminal className="w-3.5 h-3.5 text-gray-600" />
          </div>

          {/* Chat text panel */}
          <div className="flex-1 overflow-y-auto mb-3 space-y-3 max-h-[290px] pr-1 select-text scrollbar-thin">
            {/* Standard prefilled agent greeting */}
            <div className="bg-slate-950/40 p-2.5 rounded border border-gray-950 text-gray-400 text-[11px] font-mono">
              <span className="text-emerald-500 font-bold">[{selectedAgent.name}] </span>
              Conexión bidireccional segura. Listo para evaluar vectores de riesgo sobre {selectedAgent.focus[0].toLowerCase()} y adyacentes. ¿A qué coordenadas o informe requiere dar revisión?
            </div>

            {/* Custom state chat histories */}
            {(agentChats[selectedAgent.id] || []).map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded border ${
                  msg.role === 'user'
                    ? 'bg-emerald-950/10 border-emerald-900/40 ml-4'
                    : 'bg-slate-900/60 border-slate-800/60 mr-4'
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-[9px] font-mono text-gray-500">
                  <span className={msg.role === 'user' ? 'text-emerald-400 font-bold' : 'text-gray-300 font-bold'}>
                    {msg.sender === 'Operador' ? '👤 OPERADOR' : `🤖 ${msg.sender}`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            ))}

            {loadingAgentQuery[selectedAgent.id] && (
              <div className="flex gap-2 items-center text-[10px] text-gray-500 font-mono pl-3 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>DESCIFRANDO ENLACE SATELITAL...</span>
              </div>
            )}
          </div>

          {/* Prompt Entry Form */}
          <form onSubmit={(e) => handleQueryAgent(e, selectedAgent)} className="mt-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={`Consultar a ${selectedAgent.name}...`}
                value={agentQueries[selectedAgent.id] || ''}
                onChange={(e) => setAgentQueries({ ...agentQueries, [selectedAgent.id]: e.target.value })}
                disabled={loadingAgentQuery[selectedAgent.id]}
                className="w-full bg-[#05070a] text-xs font-mono text-white placeholder-gray-600 border border-gray-800 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-emerald-500/70"
              />
              <button
                type="submit"
                disabled={loadingAgentQuery[selectedAgent.id]}
                className="absolute right-1 text-emerald-500 hover:text-white p-2 transition rounded-md top-1/2 -translate-y-1/2 disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Crisis Swarm Simulation (Enjambre Simultáneo) */}
      <div className="lg:col-span-4 bg-[#0a0d16] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-mono text-emerald-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> SÍNTESIS DE RESILIENCIA EN ENJAMBRE
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            Inyecte un escenario de crisis múltiple para que todos los agentes computen sus reportes tácticos en paralelo.
          </p>

          <textarea
            value={swarmPrompt}
            onChange={(e) => setSwarmPrompt(e.target.value)}
            disabled={loadingSwarm}
            rows={3}
            className="w-full bg-[#05070a] border border-gray-800 rounded-lg p-3 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 mb-3 resize-none"
            placeholder="Describa el incidente de seguridad global..."
          />

          <button
            onClick={handleRunSwarmSimulation}
            disabled={loadingSwarm}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white py-2.5 px-4 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 border border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.30)] active:scale-95 disabled:opacity-40"
          >
            {loadingSwarm ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> PROCESANDO ENJAMBRE CONCUERRENTE...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 animate-pulse" /> EJECUTAR ANÁLISIS EN ENJAMBRE
              </>
            )}
          </button>
        </div>

        {/* Swarm Result Feed */}
        <div className="mt-4 flex-1 overflow-y-auto max-h-[200px] border border-gray-900 rounded-lg p-2.5 bg-[#05070c] scrollbar-thin font-mono text-[11px]">
          {swarmError && (
            <div className="text-red-400 flex items-start gap-2 p-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{swarmError}</span>
            </div>
          )}

          {swarmAnalyses.length === 0 && !loadingSwarm && !swarmError && (
            <p className="text-gray-500 text-center py-6 italic">
              Ningún escenario de enjambre ejecutado en esta sesión. Configure la emergencia y presione ejecutar.
            </p>
          )}

          {loadingSwarm && (
            <div className="space-y-3 py-2">
              <div className="h-6 bg-slate-900/50 rounded animate-pulse" />
              <div className="h-10 bg-slate-900/50 rounded animate-pulse" />
              <div className="h-8 bg-slate-900/50 rounded animate-pulse" />
            </div>
          )}

          {swarmAnalyses.map((item, index) => (
            <div key={item.agentId} className="border-b border-gray-900/40 pb-3 mb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-bold">{item.agentName}</span>
                <span className="text-gray-500 text-[9px] uppercase">({item.role})</span>
              </div>
              <p className="text-gray-300 leading-relaxed italic text-[11px] pr-1">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
