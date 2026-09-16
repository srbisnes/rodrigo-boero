/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Users, ShieldAlert, CircleDot, Radio } from 'lucide-react';

interface LiveChatProps {
  systemMessages: string[];
  onAddSystemLogMsg: (msg: string) => void;
}

export default function LiveChat({ systemMessages, onAddSystemLogMsg }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeUsersCount, setActiveUsersCount] = useState(14);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages from backend cache
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  // Poll messages every 4 seconds to check if simulated operators sent anything back
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
      // Randomly fluctuate online operator count slightly for immersion
      setActiveUsersCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 8 && next <= 18 ? next : prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Submit new message to Express
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    setLoading(true);
    setInputText('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Operador_Nacional_01',
          text,
          role: 'user'
        })
      });

      if (response.ok) {
        onAddSystemLogMsg('Mensaje de frecuencia táctica retransmitido.');
        await fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0d16] border border-gray-800 rounded-xl p-4 flex flex-col h-[520px]" id="live_operative_chat_room">
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-gray-900 pb-3 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" /> CANAL DE ENLACE TÁCTICO
            </h4>
            <p className="text-[10px] text-gray-500 font-mono">Enlace Encriptado de Operadores Globales</p>
          </div>
        </div>

        {/* Online Count */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-gray-800 font-mono text-[9px] text-emerald-400">
          <Users className="w-3 h-3 text-emerald-400" />
          <span>{activeUsersCount} EN LÍNEA</span>
        </div>
      </div>

      {/* Two panels: Left is Chat feed, Right is system diagnostic logging */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* CHAT MESSAGES COLUMN */}
        <div className="md:col-span-8 flex flex-col justify-between h-full min-h-0 bg-[#05070c] border border-gray-900 rounded-lg p-3">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-3.5 pr-1 select-text scrollbar-thin text-[11px] font-mono leading-relaxed"
          >
            {messages.map((msg) => {
              const isSystem = msg.role === 'system';
              const isUser = msg.sender === 'Operador_Nacional_01';
              
              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center text-gray-500 py-1 border-y border-gray-950 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                    <CircleDot className="w-2.5 h-2.5 text-gray-600" />
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {!isUser && msg.avatarColor && (
                      <span className={`w-2 h-2 rounded-full ${msg.avatarColor}`} />
                    )}
                    <span className={`text-[10px] font-bold ${isUser ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[8px] text-gray-600">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg max-w-[85%] border ${
                    isUser
                      ? 'bg-emerald-950/15 border-emerald-900/40 text-emerald-300 rounded-tr-none'
                      : 'bg-slate-900/80 border-slate-800 text-gray-300 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission block */}
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Escribir mensaje en la frecuencia dApp..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="w-full bg-[#080b12] text-xs font-mono text-white placeholder-gray-600 border border-gray-800 rounded-lg py-2.5 pl-3 pr-10 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 text-emerald-500 hover:text-white p-2 transition rounded-md top-1/2 -translate-y-1/2"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* DIAGNOSTIC SYSTEM LOGGING PANEL (Immersion & tracking) */}
        <div className="md:col-span-4 bg-[#070a13] border border-gray-900 rounded-lg p-3 flex flex-col h-full min-h-0 justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold border-b border-gray-900 pb-2 mb-2 tracking-widest uppercase">
              <Radio className="w-3.1 h-3.1 animate-pulse" /> TELEMETRÍA DE SEGURIDAD
            </div>
            
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] scrollbar-thin text-[9px] font-mono text-gray-400 leading-snug">
              {systemMessages.map((log, idx) => (
                <div key={idx} className="flex gap-2 border-b border-gray-950 pb-1.5 last:border-0">
                  <span className="text-emerald-500 select-none">&gt;</span>
                  <span className="break-words font-mono">{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-950 pt-2 text-[8px] font-mono text-gray-600 flex items-center justify-between">
            <span>SATELLITE SECTOR RESILIENCE</span>
            <span>SECURE PROT 404</span>
          </div>

        </div>
      </div>
    </div>
  );
}
