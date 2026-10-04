import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, BellRing, Bot,
  ChevronRight, CircleDot, Globe2, Layers3, MapPinned, Newspaper, Radio, Search,
  ShieldCheck, TrendingDown, TrendingUp, WalletCards, Waves, Zap
} from 'lucide-react';
import {
  INITIAL_WAR_ZONES, INITIAL_CABLES, INITIAL_EARTHQUAKES,
  INITIAL_CLIMATE_ANOMALIES, INITIAL_ECONOMY, INITIAL_TRAVEL_WARNINGS, INSTALLED_AGENTS
} from './data/intelligence';
import GlobalMap from './components/GlobalMap';
import AgentSwarm from './components/AgentSwarm';
import { classifyOperation, consensusSentiment, heatBucket } from './lib/alerta';
import { healthScore } from './lib/platform';

type Tone = 'up' | 'down' | 'flat';

const news = [
  { source: 'Reuters', title: 'Shipping routes repriced as operators assess Red Sea risk', age: '18m', tone: 'negative', impact: 86 },
  { source: 'AP', title: 'Markets monitor new diplomatic signals across key corridors', age: '31m', tone: 'neutral', impact: 61 },
  { source: 'Bloomberg', title: 'Energy desks lift volatility assumptions after supply alert', age: '43m', tone: 'negative', impact: 79 },
  { source: 'Al Jazeera', title: 'Regional authorities issue updated maritime guidance', age: '52m', tone: 'negative', impact: 74 },
  { source: 'BBC', title: 'Infrastructure operators review contingency routes', age: '1h', tone: 'neutral', impact: 57 }
];

const xSignals = [
  { handle: '@marketwatcher', score: -0.72, reach: '2.1M', topic: 'energy' },
  { handle: '@macroalpha', score: -0.38, reach: '840K', topic: 'markets' },
  { handle: '@shippingintel', score: -0.61, reach: '410K', topic: 'logistics' },
  { handle: '@geopulse', score: 0.08, reach: '1.2M', topic: 'diplomacy' },
  { handle: '@cryptoquant', score: 0.31, reach: '670K', topic: 'crypto' }
];

const operations = [
  { time: '17:42', text: 'Naval traffic rerouted after port disruption', region: 'Red Sea', severity: 88 },
  { time: '17:35', text: 'Central bank emergency liquidity action', region: 'Europe', severity: 71 },
  { time: '17:29', text: 'Fiber cable outage reported near landing station', region: 'Mediterranean', severity: 93 },
  { time: '17:18', text: 'Earthquake triggers coastal warning', region: 'Japan', severity: 68 },
  { time: '17:04', text: 'New diplomatic corridor announced', region: 'Eastern Europe', severity: 44 }
];

const market = [
  ['BRENT', '$78.42', '+2.8%', 'up'], ['GOLD', '$2,412.50', '+1.1%', 'up'],
  ['BTC', '$69,120', '+3.4%', 'up'], ['ETH', '$3,542', '+2.1%', 'up'],
  ['COPPER', '$4.42', '-0.6%', 'down'], ['DXY', '104.20', '+0.3%', 'up']
] as [string,string,string,Tone][];

const riskRegions = [
  ['Red Sea / Gulf of Aden', 92, 'critical'], ['Eastern Europe', 81, 'high'],
  ['South China Sea', 73, 'high'], ['Japan Pacific Rim', 58, 'elevated'],
  ['Mediterranean', 46, 'elevated'], ['South Atlantic', 21, 'watch']
] as [string,number,string][];

function MiniSparkline({ tone = 'up' }: { tone?: Tone }) {
  const points = tone === 'down' ? '0,22 12,18 24,20 36,12 48,16 60,8 72,11 84,4' : '0,20 12,22 24,15 36,17 48,9 60,12 72,5 84,7';
  return <svg viewBox="0 0 84 24" className="w-20 h-6"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function HeatGrid() {
  const cells = useMemo(() => Array.from({ length: 48 }, (_, i) => {
    const wave = Math.sin(i * 1.7) * 18 + Math.cos(i / 3) * 12;
    return Math.max(8, Math.min(96, Math.round(48 + wave + (i % 7 === 0 ? 32 : 0))));
  }), []);
  return <div className="grid grid-cols-12 gap-1.5">{cells.map((v, i) => {
    const b = heatBucket(v);
    const cls = b === 'critical' ? 'bg-rose-500/80' : b === 'high' ? 'bg-orange-400/75' : b === 'elevated' ? 'bg-yellow-300/55' : b === 'watch' ? 'bg-sky-400/35' : 'bg-slate-700/60';
    return <button title={'Risk ' + v} key={i} className={'h-7 rounded-md transition hover:scale-105 ' + cls} />;
  })}</div>;
}

function App() {
  const [tab, setTab] = useState<'overview'|'map'|'markets'|'agents'>('overview');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [liveMode, setLiveMode] = useState(false);
  const health = healthScore({ sourceAdapters: 2, agents: 6, observability: true, auditTrail: false });
  const sentiment = consensusSentiment([
    ...xSignals.map(x => ({ source: 'X' as const, label: x.score < -0.18 ? 'negative' as const : x.score > .18 ? 'positive' as const : 'neutral' as const, score: x.score, weight: Number(x.reach.replace('M','')) || .5 })),
    { source: 'news', label: 'negative', score: -.35, weight: .7 }
  ]);

  const selectNode = (type: string, data: any) => setSelectedAsset({ type, data });

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070b]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1700px] px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-max">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-400 flex items-center justify-center text-black"><Radio className="h-5 w-5"/></div>
            <div><div className="font-black tracking-tight">ALERTA MUNDIAL</div><div className="text-[9px] font-mono text-slate-500 tracking-[.2em]">GLOBAL RISK OPERATING SYSTEM</div></div>
          </div>
          <div className="hidden md:flex flex-1 max-w-xl mx-auto relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600"/><input placeholder="Buscar país, activo, operación, noticia o agente..." className="w-full rounded-xl border border-white/10 bg-white/[.03] py-2 pl-9 pr-4 text-xs outline-none focus:border-emerald-400/40"/></div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setLiveMode(v=>!v)} className={'hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-mono border ' + (liveMode ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/10 text-slate-400') }><CircleDot className="h-3 w-3"/> {liveMode ? 'LIVE CONNECTORS' : 'DEMO FEEDS'}</button>
            <button className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center"><BellRing className="h-4 w-4 text-slate-400"/></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1700px] px-3 sm:px-5 py-5 pb-24">
        <section className="grid xl:grid-cols-[1.45fr_.55fr] gap-4 mb-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.05] to-transparent p-5">
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono mb-4"><span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-300">EXECUTIVE COMMAND CENTER</span><span className="text-slate-600">04 OCT 2026 • 17:45 UTC</span></div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div><h1 className="text-3xl sm:text-5xl font-black tracking-[-.045em]">Lo que está pasando.<br/><span className="text-emerald-300">Lo que puede pasar.</span></h1><p className="mt-3 max-w-2xl text-sm text-slate-400 leading-6">Una vista empresarial que cruza riesgo geopolítico, operaciones, mercados, noticias y sentimiento social para transformar señales dispersas en decisiones.</p></div>
              <div className="grid grid-cols-3 gap-2 min-w-[300px]">
                <Kpi label="GLOBAL RISK" value="74" delta="+6.2%" tone="down"/>
                <Kpi label="OPERATIONS" value="27" delta="+4" tone="up"/>
                <Kpi label="SENTIMENT" value={sentiment.score.toFixed(2)} delta="X + NEWS" tone="down"/>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#090c12] p-5">
            <div className="flex items-center justify-between"><span className="text-[9px] font-mono tracking-[.18em] text-slate-500">SYSTEM STATUS</span><span className="text-[9px] text-amber-300">DEMO DATA</span></div>
            <div className="mt-4 text-4xl font-black">{health}%</div><div className="text-xs text-slate-500">production readiness</div>
            <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden"><div style={{width: health+'%'}} className="h-full bg-emerald-300 rounded-full"/></div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono text-slate-500"><span>6 agents online</span><span>2 source adapters</span><span>AI synthesis ready</span><span>audit: planned</span></div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
          {market.map(([label,value,delta,tone]) => <div key={label} className="rounded-xl border border-white/10 bg-[#090c12] p-3 hover:border-emerald-400/20 transition"><div className="flex justify-between text-[9px] font-mono text-slate-500"><span>{label}</span><span className={tone==='down'?'text-rose-300':'text-emerald-300'}>{delta}</span></div><div className="mt-1 flex items-end justify-between"><span className="font-bold text-sm">{value}</span><span className={tone==='down'?'text-rose-300':'text-emerald-300'}><MiniSparkline tone={tone}/></span></div></div>)}
        </section>

        <section className="grid lg:grid-cols-12 gap-4 mb-4">
          <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#090c12] overflow-hidden">
            <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3"><div><div className="text-[9px] font-mono text-emerald-300">01 / WORLD HEATMAP</div><h2 className="font-black text-lg">Global Risk Surface</h2></div><div className="flex gap-1">{['24H','7D','30D'].map((x,i)=><button key={x} className={'px-2.5 py-1.5 rounded-md text-[9px] font-mono '+(i===0?'bg-emerald-300 text-black':'border border-white/10 text-slate-500')}>{x}</button>)}</div></div>
            <div className="p-4"><HeatGrid/><div className="grid md:grid-cols-2 gap-3 mt-4">{riskRegions.map(([name,value,bucket])=><div key={name} className="rounded-xl border border-white/5 bg-black/20 p-3"><div className="flex justify-between text-xs"><span>{name}</span><span className="font-mono text-slate-400">{value}</span></div><div className="mt-2 h-1.5 rounded-full bg-white/5"><div style={{width:value+'%'}} className={'h-full rounded-full '+(bucket==='critical'?'bg-rose-400':bucket==='high'?'bg-orange-300':bucket==='elevated'?'bg-yellow-300':'bg-sky-300')}/></div></div>)}</div></div>
          </div>
          <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#090c12]">
            <div className="p-4 border-b border-white/5 flex justify-between"><div><div className="text-[9px] font-mono text-emerald-300">02 / OPERATIONS</div><h2 className="font-black text-lg">Qué está sucediendo</h2></div><Activity className="h-5 w-5 text-emerald-300"/></div>
            <div className="p-3 space-y-2">{operations.map(op=>{const type=classifyOperation(op.text);return <div key={op.time} className="rounded-xl border border-white/5 bg-black/20 p-3 hover:border-emerald-400/20"><div className="flex justify-between text-[9px] font-mono text-slate-600"><span>{op.time} • {op.region}</span><span className={op.severity>84?'text-rose-300':op.severity>64?'text-orange-300':'text-sky-300'}>{type}</span></div><div className="mt-1 text-xs text-slate-200">{op.text}</div><div className="mt-2 flex items-center gap-2"><div className="flex-1 h-1 rounded-full bg-white/5"><div style={{width:op.severity+'%'}} className="h-full rounded-full bg-current opacity-70"/></div><span className="text-[9px] font-mono text-slate-500">{op.severity}</span></div></div>})}</div>
          </div>
        </section>

        <section className="grid xl:grid-cols-12 gap-4 mb-4">
          <div className="xl:col-span-7 rounded-2xl border border-white/10 bg-[#090c12] overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between"><div><div className="text-[9px] font-mono text-emerald-300">03 / GEOSPATIAL INTELLIGENCE</div><h2 className="font-black text-lg">Mapa operacional</h2></div><MapPinned className="h-5 w-5 text-emerald-300"/></div>
            <div className="p-3"><GlobalMap warZones={INITIAL_WAR_ZONES} cables={INITIAL_CABLES} earthquakes={INITIAL_EARTHQUAKES} climateAnomalies={INITIAL_CLIMATE_ANOMALIES} travelWarnings={INITIAL_TRAVEL_WARNINGS} onSelectNode={selectNode}/></div>
          </div>
          <div className="xl:col-span-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#090c12] p-4">
              <div className="flex items-center justify-between"><div><div className="text-[9px] font-mono text-emerald-300">04 / MARKET TERMINAL</div><h2 className="font-black text-lg">Risk & instruments</h2></div><BarChart3 className="h-5 w-5 text-emerald-300"/></div>
              <div className="mt-4 h-32 flex items-end gap-1">{[28,36,31,44,42,55,49,61,58,73,68,82,77,91,84,88,76,93,86,95,89,98].map((v,i)=><div key={i} style={{height:v+'%'}} className={'flex-1 rounded-t-sm '+(v>85?'bg-rose-400/75':v>65?'bg-orange-300/70':'bg-emerald-300/45')}/>)}</div>
              <div className="mt-3 flex justify-between text-[9px] font-mono text-slate-600"><span>00:00</span><span>12:00</span><span>17:45 UTC</span></div>
              <div className="grid grid-cols-2 gap-2 mt-4"><Metric label="Volatility index" value="28.4" delta="+12.7%"/><Metric label="Risk premium" value="184 bps" delta="+31 bps"/><Metric label="Energy stress" value="78/100" delta="+8.4"/><Metric label="Crypto liquidity" value="$62.8B" delta="+5.1%"/></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#090c12] p-4">
              <div className="flex justify-between items-center"><div><div className="text-[9px] font-mono text-emerald-300">05 / SOCIAL CONSENSUS</div><h2 className="font-black text-lg">X + News sentiment</h2></div><Waves className="h-5 w-5 text-cyan-300"/></div>
              <div className="mt-4 flex items-center gap-4"><div className="relative h-20 w-20 rounded-full border-[7px] border-rose-400/60 flex items-center justify-center"><span className="font-black text-lg">{sentiment.score}</span></div><div><div className="text-sm font-bold text-rose-300">NEGATIVE BIAS</div><div className="text-[10px] text-slate-500 mt-1">Consenso ponderado • {sentiment.coverage} señales</div><div className="text-[9px] text-slate-600 mt-2">X representa señal social, no verdad factual.</div></div></div>
              <div className="mt-4 space-y-2">{xSignals.map(x=><div key={x.handle} className="flex items-center gap-2 text-[10px]"><span className="w-2 h-2 rounded-full bg-cyan-300"/><span className="text-slate-300 flex-1">{x.handle}</span><span className="text-slate-600">{x.reach}</span><span className={x.score<0?'text-rose-300':'text-emerald-300'}>{x.score>0?'+':''}{x.score}</span></div>)}</div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-12 gap-4 mb-4">
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#090c12]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between"><div><div className="text-[9px] font-mono text-emerald-300">06 / NEWS INTELLIGENCE</div><h2 className="font-black text-lg">Multi-source news flow</h2></div><Newspaper className="h-5 w-5 text-emerald-300"/></div>
            <div className="divide-y divide-white/5">{news.map(n=><article key={n.title} className="p-4 flex gap-3 hover:bg-white/[.02]"><div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0"><Newspaper className="h-4 w-4 text-slate-500"/></div><div className="flex-1"><div className="flex gap-2 text-[9px] font-mono text-slate-600"><span className="text-slate-300">{n.source}</span><span>•</span><span>{n.age}</span></div><h3 className="text-xs mt-1 text-slate-200">{n.title}</h3></div><div className="w-16 text-right"><div className="text-[9px] font-mono text-slate-500">IMPACT</div><div className="text-sm font-bold text-orange-300">{n.impact}</div></div></article>)}</div>
          </div>
          <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-transparent p-5">
            <div className="text-[9px] font-mono text-emerald-300">07 / DECISION LAYER</div><h2 className="text-xl font-black mt-1">¿Qué debería mirar un ejecutivo ahora?</h2>
            <div className="mt-5 space-y-3">{[
              ['01','Supply chain','Red Sea disruption is the dominant cross-domain dependency.'],
              ['02','Market','Energy volatility is propagating into risk premium.'],
              ['03','Infrastructure','Cable incident has higher operational severity than news volume suggests.'],
              ['04','Reputation','Social sentiment is negative but should remain a leading indicator, not evidence.']
            ].map(([n,t,d])=><div key={n} className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-3"><span className="font-mono text-emerald-300 text-xs">{n}</span><div><div className="text-xs font-bold">{t}</div><p className="text-[10px] leading-4 text-slate-500 mt-1">{d}</p></div></div>)}</div>
            <button onClick={()=>setTab('agents')} className="mt-5 w-full rounded-xl bg-emerald-300 text-black py-2.5 text-xs font-black flex items-center justify-center gap-2">Pedir análisis al swarm <ChevronRight className="h-4 w-4"/></button>
          </div>
        </section>

        <section className="mb-4">
          <div className="rounded-2xl border border-white/10 bg-[#090c12] p-4">
            <div className="flex items-center justify-between mb-4"><div><div className="text-[9px] font-mono text-emerald-300">08 / AI COMMAND</div><h2 className="font-black text-lg">Agentes que convierten señales en escenarios</h2></div><Bot className="h-5 w-5 text-emerald-300"/></div>
            <AgentSwarm agents={INSTALLED_AGENTS} onAddSystemLogMsg={()=>{}}/>
          </div>
        </section>

        {selectedAsset && <section className="fixed bottom-20 right-3 z-40 w-[min(420px,calc(100vw-24px))] rounded-2xl border border-emerald-300/20 bg-[#090c12] shadow-2xl p-4"><div className="flex justify-between"><span className="text-[9px] font-mono text-emerald-300">SELECTED SIGNAL</span><button onClick={()=>setSelectedAsset(null)} className="text-slate-500">×</button></div><pre className="mt-3 whitespace-pre-wrap text-[10px] text-slate-400 max-h-52 overflow-auto">{JSON.stringify(selectedAsset.data,null,2)}</pre></section>}

        <div className="text-[9px] font-mono text-slate-600 border-t border-white/5 pt-4 flex flex-wrap gap-4"><span>ALERTA MUNDIAL • MOBILE-FIRST</span><span>DEMO DATA ≠ LIVE INTELLIGENCE</span><span>Production: authenticated source adapters + provenance + audit</span></div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/10 bg-[#05070b]/95 backdrop-blur-xl">
        <div className="grid grid-cols-4">{[['overview','Overview',Globe2],['map','Mapa',MapPinned],['markets','Mercados',WalletCards],['agents','Agentes',Bot]].map(([key,label,Icon]: any)=><button key={key} onClick={()=>setTab(key)} className={'py-3 text-[9px] font-mono flex flex-col items-center gap-1 '+(tab===key?'text-emerald-300':'text-slate-600')}><Icon className="h-4 w-4"/>{label}</button>)}</div>
      </nav>
    </div>
  );
}

function Kpi({label,value,delta,tone}:{label:string,value:string,delta:string,tone:Tone}) {
  return <div className="rounded-xl border border-white/5 bg-black/20 p-3"><div className="text-[8px] font-mono text-slate-600">{label}</div><div className="text-xl font-black mt-1">{value}</div><div className={'text-[9px] font-mono mt-1 '+(tone==='down'?'text-rose-300':'text-emerald-300')}>{tone==='down'?<TrendingDown className="inline h-3 w-3"/>:<TrendingUp className="inline h-3 w-3"/>} {delta}</div></div>;
}
function Metric({label,value,delta}:{label:string,value:string,delta:string}) {
  return <div className="rounded-xl border border-white/5 bg-black/20 p-3"><div className="text-[9px] text-slate-600">{label}</div><div className="flex items-end justify-between mt-1"><b>{value}</b><span className="text-[9px] text-emerald-300">{delta}</span></div></div>;
}
export default App;
