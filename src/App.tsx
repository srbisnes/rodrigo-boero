/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_WAR_ZONES,
  INITIAL_CABLES,
  INITIAL_EARTHQUAKES,
  INITIAL_CLIMATE_ANOMALIES,
  INITIAL_ECONOMY,
  INITIAL_TRAVEL_WARNINGS,
  INSTALLED_AGENTS
} from './data/intelligence';
import {
  WarZone,
  UnderseaCable,
  EarthquakeData,
  ClimateAnomaly,
  TravelWarning,
  EconomyCryptoInfo
} from './types';
import GlobalMap from './components/GlobalMap';
import AgentSwarm from './components/AgentSwarm';
import LiveChat from './components/LiveChat';

import {
  ShieldAlert,
  Coins,
  Cpu,
  Activity,
  Compass,
  Zap,
  Globe,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Ship,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Database State
  const [warZones, setWarZones] = useState<WarZone[]>(INITIAL_WAR_ZONES);
  const [cables, setCables] = useState<UnderseaCable[]>(INITIAL_CABLES);
  const [earthquakes, setEarthquakes] = useState<EarthquakeData[]>(INITIAL_EARTHQUAKES);
  const [climateAnomalies, setClimateAnomalies] = useState<ClimateAnomaly[]>(INITIAL_CLIMATE_ANOMALIES);
  const [travelWarnings, setTravelWarnings] = useState<TravelWarning[]>(INITIAL_TRAVEL_WARNINGS);
  const [economy, setEconomy] = useState<EconomyCryptoInfo>(INITIAL_ECONOMY);
  const [agents, setAgents] = useState(INSTALLED_AGENTS);

  // Selected asset state for Viewfinder
  const [selectedAsset, setSelectedAsset] = useState<{
    type: 'war' | 'cable' | 'earthquake' | 'climate' | 'travel' | 'none';
    data: any;
  }>({
    type: 'war',
    data: INITIAL_WAR_ZONES[0] // default with a high-impact war zone
  });

  // Action logs for system display
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Iniciando terminal receptor táctico bionavegable...',
    'Actualizados feeds de materias primas y criptodivisas.',
    'Canales de enlace del enjambre de agentes Aegis, Kratos, Midas, Poseidón, Gaia e Hermes calibrados.'
  ]);

  const addSystemLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 30));
  };

  // Sync selected map elements to viewfinder
  const handleSelectMapNode = (type: 'war' | 'cable' | 'earthquake' | 'climate' | 'travel', data: any) => {
    setSelectedAsset({ type, data });
    addSystemLog(`Foco de atención operacional reubicado: "${data.name || data.location || data.region}" (${type.toUpperCase()})`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-3 md:p-6 selection:bg-emerald-500 selection:text-black">
      
      {/* 1. APP BAR HEADER SYSTEM */}
      <header className="border-b border-gray-900 pb-4 mb-6" id="ops-header-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Logo and Core State Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-mono font-bold tracking-wider text-white uppercase">
                  SWARM INTEL PLATFORM
                </h1>
                <span className="bg-red-500/10 text-red-500 text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest animate-pulse">
                  Alerta Global Nivel III
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Enjambre de 6 agentes analíticos de IA co-monitoreando conflictos e infraestructura crítica
              </p>
            </div>
          </div>

          {/* Satellite Telemetry indicators */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px]">
            <div className="bg-[#0b0f19] border border-gray-900 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-gray-400">SAT STATUS:</span>
              <span className="text-emerald-400 font-bold">CONECTADO</span>
            </div>
            <div className="bg-[#0b0f19] border border-gray-900 px-3 py-1.5 rounded-lg text-gray-400">
              UTC TIME: <span className="text-white font-bold">{new Date().toISOString().substring(11, 19)}</span>
            </div>
          </div>

        </div>

        {/* 2. LIVE ECONOMIC & COMMODITIES FEEDS TICKER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4" id="live_economic_ticker_widget">
          {/* Brent Oil */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">MATERIA PRIMA (PETRÓLEO)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-white tracking-tight">{economy.commodities.oil}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+1.4%</span>
            </div>
          </div>

          {/* Gold */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">MATERIA PRIMA (ORO REF.)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-white tracking-tight">{economy.commodities.gold}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+1.6%</span>
            </div>
          </div>

          {/* Copper */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">MATERIA PRIMA (COBRE CAT.)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-white tracking-tight">{economy.commodities.copper}</span>
              <span className="text-[9px] text-gray-500 font-mono">ESTABLE</span>
            </div>
          </div>

          {/* Gas */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">COMBUSTIBLE (GAS NAT.)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-white tracking-tight">{economy.commodities.gas}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+2.8%</span>
            </div>
          </div>

          {/* Bitcoin */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">CRIPTO INTEL (BTC/USD)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-emerald-400 tracking-tight">{economy.crypto.btc}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+0.5%</span>
            </div>
          </div>

          {/* Ethereum */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">CRIPTO INTEL (ETH/USD)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-emerald-400 tracking-tight">{economy.crypto.eth}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+0.8%</span>
            </div>
          </div>

          {/* Solana */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">CRIPTO INTEL (SOL/USD)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-sm font-bold text-emerald-400 tracking-tight">{economy.crypto.sol}</span>
              <span className="text-[9px] text-green-400 font-mono flex items-center"><TrendingUp className="w-2 h-2 mr-0.5" />+2.1%</span>
            </div>
          </div>

          {/* Stable Volume */}
          <div className="bg-[#0b101c] p-2.5 rounded-lg border border-gray-800 flex flex-col justify-between hover:border-emerald-500/30 transition col-span-2 sm:col-span-1">
            <span className="text-[9px] font-mono text-gray-500 tracking-wider">LIQUIDEZ GUERRA (USDT VOL)</span>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs font-mono font-bold text-teal-400 font-bold">{economy.crypto.usdtVolume}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD SPLIT: INTERACTIVE TACTICAL WORLD MAP & DATA VIEWFINDER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6" id="tactical_map_viewfinder_row">
        
        {/* Geographic Map overlay (8cols on desktop) */}
        <div className="lg:col-span-8">
          <GlobalMap
            warZones={warZones}
            cables={cables}
            earthquakes={earthquakes}
            climateAnomalies={climateAnomalies}
            travelWarnings={travelWarnings}
            onSelectNode={handleSelectMapNode}
          />
        </div>

        {/* Tactical data Viewfinder monitor side-car (4cols on desktop) */}
        <div className="lg:col-span-4 bg-[#0a0d16] border border-gray-850 rounded-xl p-4 flex flex-col justify-between min-h-[420px]" id="data_tactical_viewfinder">
          <div className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="border-b border-gray-900 pb-3 mb-4 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400 animate-spin duration-3000" /> VISOR TÁCTICO DE SECTOR
                </span>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                  {selectedAsset.type}
                </span>
              </div>

              {/* Dynamic asset layout based on what was selected in the map nodes */}
              {selectedAsset.type === 'war' && (
                <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-rose-400 border-l-2 border-red-500 pl-2 leading-tight">
                    {selectedAsset.data.name}
                  </h4>
                  <p className="text-gray-400 italic text-[11px]">"{selectedAsset.data.description}"</p>
                  
                  <div className="bg-slate-950 p-2.5 rounded border border-gray-900 space-y-1 text-[11px]">
                    <span className="text-rose-400 font-bold block uppercase tracking-wider text-[10px]">&gt; SISTEMAS DE ARMAMENTO MILITAR:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                      {selectedAsset.data.weaponsInvolved.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[11px]"><span className="text-emerald-400">&gt; DAÑO ECONÓMICO DIRECTO:</span> {selectedAsset.data.economicImpact}</p>
                    <p className="text-[11px]"><span className="text-amber-500">&gt; SECTOR DE TRÁFICO DE ARMAS:</span> {selectedAsset.data.trafficSector}</p>
                    <p className="text-[11px]"><span className="text-gray-400">&gt; BELIGERANTES CONSTATADOS:</span> {selectedAsset.data.parties.join(' vs ')}</p>
                  </div>
                </div>
              )}

              {selectedAsset.type === 'cable' && (
                <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-blue-400 border-l-2 border-blue-500 pl-2 leading-tight">
                    Cable: {selectedAsset.data.name}
                  </h4>
                  <p className="text-[11px]"><span className="text-blue-400">&gt; TIPO DE LÍNEA:</span> {selectedAsset.data.type === 'fiber-optic' ? 'Transmisión de Fibra Óptica' : 'Distribución Eléctrica'}</p>
                  <p className="text-[11px]"><span className="text-blue-400">&gt; CAPACIDAD DE TRÁFICO:</span> {selectedAsset.data.speed}</p>

                  <div className="bg-slate-950 p-2.5 rounded border border-gray-900 text-[11px] space-y-1">
                    <span className="text-amber-400 font-bold block text-[10px]">&gt; ANÁLISIS DE VULNERABILIDAD SUBMARINA:</span>
                    <p className="text-gray-400 italic">"{selectedAsset.data.riskFactor}"</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">&gt; PUNTOS DE DESEMBARQUE CRÍTICOS:</span>
                    <p className="text-gray-300 text-[11px] italic">{selectedAsset.data.landingPoints.join(' • ')}</p>
                  </div>
                </div>
              )}

              {selectedAsset.type === 'earthquake' && (
                <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-indigo-400 border-l-2 border-indigo-500 pl-2 leading-tight">
                    Sismo: {selectedAsset.data.location}
                  </h4>
                  <div className="flex justify-between items-center bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                    <span className="text-indigo-400 font-bold text-xs">MAGNITUD: {selectedAsset.data.magnitude} Richter</span>
                    <span className="text-gray-400 text-[10px]">Profundidad: {selectedAsset.data.depthStr}</span>
                  </div>
                  <p className="text-gray-400 text-[11px] italic">Sucedido hace: {selectedAsset.data.timestamp}</p>

                  <div className="bg-slate-950 p-2.5 rounded border border-gray-900 text-[11px] space-y-1.5">
                    <span className="text-indigo-400 font-semibold block text-[10px] uppercase">&gt; IMPACTO CLIMÁTICO Y MAREMOTRIZ:</span>
                    <p className="text-gray-300 leading-snug">"{selectedAsset.data.climateImpact}"</p>
                  </div>
                </div>
              )}

              {selectedAsset.type === 'climate' && (
                <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-rose-400 border-l-2 border-rose-500 pl-2 leading-tight">
                    Anomalía: {selectedAsset.data.name}
                  </h4>
                  <div className="bg-slate-950 p-2.5 rounded border border-gray-950 text-[11px] space-y-1">
                    <span className="text-rose-400 font-bold block text-[10px]">&gt; DIAGNÓSTICO METEOROLÓGICO:</span>
                    <p className="text-gray-300">"{selectedAsset.data.statusDescription}"</p>
                  </div>
                </div>
              )}

              {selectedAsset.type === 'travel' && (
                <div className="space-y-3 font-mono text-xs text-gray-300 leading-relaxed">
                  <h4 className="text-sm font-bold text-amber-400 border-l-2 border-amber-500 pl-2 leading-tight font-sans">
                    Región: {selectedAsset.data.region}
                  </h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedAsset.data.status === 'critical-avoid' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    }`}>
                      EVITAR - CRÍTICO
                    </span>
                    <span className="bg-slate-900 text-gray-400 px-2 py-0.5 rounded text-[10px] uppercase border border-gray-800">
                      CÓDIGO: {selectedAsset.data.countryCode}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block">&gt; RUTA SECO DE DESVIACIÓN RECOMENDADA:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px]">
                      {selectedAsset.data.safeRoutes.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 p-2 text-[11px] rounded border border-gray-900 space-y-1">
                    <span className="text-amber-500 font-bold text-[10px] uppercase block">&gt; MEDIDAS DE PRECAUCIÓN CORPORALES:</span>
                    <ul className="list-decimal list-inside space-y-0.5">
                      {selectedAsset.data.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-gray-300">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Quick help diagnostic line */}
            <div className="mt-4 pt-3 border-t border-gray-900 text-[10px] font-mono text-gray-500 leading-normal">
              <p className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Presione sobre los nodos de color en el radar global para actualizar este panel.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* 4. SHARP ACTION CENTRE: INTERACTIVE AGENT SWARM SYSTEM */}
      <section className="mb-6" id="intelligent_agent_swarm_central_panel">
        <AgentSwarm
          agents={agents}
          onAddSystemLogMsg={addSystemLog}
        />
      </section>

      {/* 5. LIVE FREQUENCY CHAT ROOM & DIAGNOSTIC DIRECT ACTION FEEDS */}
      <section className="mb-6 grid grid-cols-1 gap-5" id="live_interactive_chat_operators_board">
        <LiveChat
          systemMessages={systemLogs}
          onAddSystemLogMsg={addSystemLog}
        />
      </section>

      {/* 6. IMMERSIVE COMPREHENSIVE RECON DATA ACCORDION / GRID */}
      <section className="bg-[#0a0d16] border border-gray-800 rounded-xl p-5" id="extended_strategic_catalogs">
        <div className="flex items-center gap-2 border-b border-gray-900 pb-3 mb-4 shrink-0">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-widest">
              DIAGRAMADO DETALLADO DE VECTORES DE SEGURIDAD
            </h4>
            <p className="text-xs text-gray-500">Mapeado de activos, cables marítimos de datos y rutas a evitar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Wars catalogue */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-rose-400 font-bold border-b border-rose-950/40 pb-1.5 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> &gt; TERRITORIOS EN GUERRA
            </div>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {warZones.map(w => (
                <div key={w.id} className="bg-slate-950/70 p-2.5 rounded border border-red-950/20 hover:border-red-500/20 cursor-pointer transition" onClick={() => handleSelectMapNode('war', w)}>
                  <p className="font-bold text-gray-200 mb-0.5">{w.name}</p>
                  <p className="text-[10px] text-gray-400 leading-normal mb-1">{w.description.substring(0, 60)}...</p>
                  <p className="text-[9px] text-rose-400 font-semibold uppercase">Severidad: {w.severity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Undersea cables catalogue */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-blue-400 font-bold border-b border-blue-950/40 pb-1.5 uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> &gt; CABLES SUBMARINOS NET
            </div>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {cables.map(c => (
                <div key={c.id} className="bg-slate-950/70 p-2.5 rounded border border-blue-950/20 hover:border-blue-500/20 cursor-pointer transition" onClick={() => handleSelectMapNode('cable', c)}>
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold text-gray-200">{c.name}</p>
                    <span className="text-[8px] bg-slate-900 border border-gray-800 px-1 py-0.2 rounded font-bold text-gray-400">{c.speed}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal mb-1">Puntos: {c.landingPoints.slice(0, 2).join(', ')}...</p>
                  <span className={`text-[9px] font-bold uppercase ${
                    c.status === 'operational' ? 'text-emerald-400' : c.status === 'under-threat' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    Estado: {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Earthquakes catalogue */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-indigo-400 font-bold border-b border-indigo-950/40 pb-1.5 uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> &gt; ACTIVIDAD SÍSMICA RECIENTE
            </div>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {earthquakes.map(eq => (
                <div key={eq.id} className="bg-slate-950/70 p-2.5 rounded border border-indigo-950/20 hover:border-indigo-500/20 cursor-pointer transition" onClick={() => handleSelectMapNode('earthquake', eq)}>
                  <p className="font-bold text-gray-200 mb-0.5">{eq.location}</p>
                  <p className="text-[10px] text-gray-400 leading-normal mb-1">{eq.climateImpact.substring(0, 60)}...</p>
                  <div className="flex justify-between text-[9px] text-indigo-400 font-semibold">
                    <span>MAGNITUD: {eq.magnitude} Richter</span>
                    <span>{eq.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Travel warning catalogue */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold border-b border-amber-950/40 pb-1.5 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> &gt; RECOMENDACIONES DE VIAJE
            </div>
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {travelWarnings.map(warn => (
                <div key={warn.id} className="bg-slate-950/70 p-2.5 rounded border border-amber-950/20 hover:border-amber-500/20 cursor-pointer transition" onClick={() => handleSelectMapNode('travel', warn)}>
                  <p className="font-bold text-gray-200 mb-0.5">{warn.region}</p>
                  <p className="text-[10px] text-gray-400 leading-normal mb-1">Ruta segura: {warn.safeRoutes[0]}</p>
                  <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">{warn.status.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER SYSTEM CREDIT */}
      <footer className="mt-8 text-center text-gray-600 font-mono text-[10px] border-t border-gray-950 pt-5">
        <p>Centro Satelital dApp de Reconocimiento Global • Encriptación de enlace cuántico SHA-256</p>
        <p className="mt-1">© 2026 Plataforma de Enjambre de Agentes de Seguridad Geopolítica</p>
      </footer>

    </div>
  );
}
