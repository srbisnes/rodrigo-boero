import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, CircleDot, Cpu, FileText, Globe2, Layers3, LockKeyhole, Network, Radar, ShieldCheck, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import {
  INITIAL_WAR_ZONES, INITIAL_CABLES, INITIAL_EARTHQUAKES,
  INITIAL_CLIMATE_ANOMALIES, INITIAL_ECONOMY, INITIAL_TRAVEL_WARNINGS, INSTALLED_AGENTS
} from './data/intelligence';
import GlobalMap from './components/GlobalMap';
import AgentSwarm from './components/AgentSwarm';
import { healthScore } from './lib/platform';

type AssetType = 'war' | 'cable' | 'earthquake' | 'climate' | 'travel';

const pillars = [
  { icon: Radar, title: 'Detect', text: 'Normaliza señales geopolíticas, ambientales, económicas e infraestructura crítica.' },
  { icon: Cpu, title: 'Reason', text: 'Seis agentes especializados analizan la misma situación desde perspectivas distintas.' },
  { icon: Network, title: 'Correlate', text: 'Cruza eventos para encontrar relaciones, dependencia y concentración de riesgo.' },
  { icon: Target, title: 'Decide', text: 'Convierte señales complejas en escenarios, prioridades y acciones verificables.' }
];

const roadmap = [
  ['0–3 meses', 'Foundation', 'Fuentes reales, data contracts, observabilidad, autenticación y audit trail.'],
  ['3–6 meses', 'Pilot', 'Piloto con 2–3 clientes, alertas, workflows y evaluación de precisión.'],
  ['6–12 meses', 'Enterprise', 'Multi-tenant, APIs, RBAC, SLA, billing y conectores de inteligencia.'],
  ['12–18 meses', 'Scale', 'Modelos de riesgo propios, marketplace de agentes y expansión regional.']
];

export default function App() {
  const [warZones] = useState(INITIAL_WAR_ZONES);
  const [cables] = useState(INITIAL_CABLES);
  const [earthquakes] = useState(INITIAL_EARTHQUAKES);
  const [climateAnomalies] = useState(INITIAL_CLIMATE_ANOMALIES);
  const [travelWarnings] = useState(INITIAL_TRAVEL_WARNINGS);
  const [economy] = useState(INITIAL_ECONOMY);
  const [agents] = useState(INSTALLED_AGENTS);
  const [now, setNow] = useState(new Date());
  const [selectedAsset, setSelectedAsset] = useState({ type: 'war' as AssetType, data: INITIAL_WAR_ZONES[0] });
  const [systemLogs, setSystemLogs] = useState(['Demo dataset loaded.', 'Agent swarm ready: 6 analytical roles.', 'Production adapters: planned / not connected.']);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const health = useMemo(() => healthScore({ sourceAdapters: 2, agents: agents.length, observability: true, auditTrail: false }), [agents.length]);

  const addSystemLog = (msg: string) => {
    setSystemLogs(prev => [('[' + new Date().toLocaleTimeString() + '] ' + msg), ...prev].slice(0, 30));
  };

  const selectNode = (type: AssetType, data: any) => {
    setSelectedAsset({ type, data });
    addSystemLog('Focus changed: ' + (data.name || data.location || data.region || type));
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-slate-100 font-sans selection:bg-emerald-400 selection:text-black">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#05070b]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-emerald-400/30 bg-emerald-400/10 grid place-items-center"><Radar className="h-5 w-5 text-emerald-300" /></div>
            <div><div className="text-sm font-black tracking-[0.18em]">SWARM INTEL</div><div className="text-[10px] text-slate-500 tracking-wider">DECISION INTELLIGENCE PLATFORM</div></div>
          </a>
          <nav className="hidden md:flex items-center gap-5 text-[11px] text-slate-400">
            <a href="#overview" className="hover:text-white">Overview</a><a href="#intelligence" className="hover:text-white">Intelligence</a>
            <a href="#agents" className="hover:text-white">Agents</a><a href="#roadmap" className="hover:text-white">Roadmap</a><a href="#docs" className="hover:text-white">Docs</a>
          </nav>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-1 rounded-md border border-amber-400/30 bg-amber-400/10 text-amber-300">DEMO DATA</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-400/20 bg-emerald-400/5 text-emerald-300"><CircleDot className="h-3 w-3" /> SYSTEM {health}%</span>
          </div>
        </div>
      </div>

      <main id="top" className="mx-auto max-w-[1600px] px-4 py-8 md:py-12">
        <section id="overview" className="grid lg:grid-cols-[1.25fr_.75fr] gap-8 items-end mb-10 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-mono text-emerald-300 mb-5"><Sparkles className="h-3.5 w-3.5" /> AI-ASSISTED RISK OPERATIONS</div>
            <h1 className="max-w-5xl text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.95]">From global signals to <span className="text-emerald-300">decision-ready intelligence.</span></h1>
            <p className="max-w-3xl mt-5 text-base md:text-lg leading-7 text-slate-400">Una plataforma de inteligencia operativa que correlaciona eventos globales, infraestructura crítica y variables económicas para ayudar a equipos a detectar riesgo, evaluar escenarios y actuar antes.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href="#intelligence" className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-bold text-black hover:bg-emerald-200">Abrir command center <ArrowUpRight className="h-4 w-4" /></a>
              <a href="#roadmap" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5">Ver roadmap</a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex justify-between items-center mb-5"><span className="text-[10px] font-mono tracking-[0.18em] text-slate-500">SYSTEM TELEMETRY</span><span className="text-[10px] font-mono text-slate-500">{now.toISOString().replace('T',' ').slice(0,19)}Z</span></div>
            <div className="grid grid-cols-2 gap-3">
              {['6|specialist agents','5|risk domains','4|decision layers','24/7|target operation'].map(item => {
                const parts = item.split('|');
                return <div key={parts[1]} className="rounded-xl border border-white/5 bg-black/20 p-4"><div className="text-2xl font-black text-white">{parts[0]}</div><div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{parts[1]}</div></div>;
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-300"><AlertTriangle className="h-3.5 w-3.5" /> Demo mode: replace synthetic feeds with authenticated source adapters before production use.</div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-3 mb-8">
          {pillars.map(({icon: Icon, title, text}) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-emerald-400/20 transition"><Icon className="h-5 w-5 text-emerald-300 mb-4" /><h2 className="font-bold">{title}</h2><p className="text-xs leading-5 text-slate-500 mt-2">{text}</p></article>)}
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
          {[
            ['BRENT', economy.commodities.oil], ['GOLD', economy.commodities.gold], ['COPPER', economy.commodities.copper], ['GAS', economy.commodities.gas],
            ['BTC', economy.crypto.btc], ['ETH', economy.crypto.eth], ['SOL', economy.crypto.sol], ['USDT VOL', economy.crypto.usdtVolume]
          ].map(([label,value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#090c12] p-3"><div className="text-[9px] text-slate-600 font-mono">{label}</div><div className="mt-1 text-sm font-bold text-slate-200">{value}</div><div className="mt-1 text-[9px] text-emerald-300 flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" /> reference</div></div>)}
        </section>

        <section id="intelligence" className="scroll-mt-24 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div><div className="text-[10px] font-mono tracking-[0.18em] text-emerald-300">01 / INTELLIGENCE FABRIC</div><h2 className="text-2xl md:text-3xl font-black mt-1">Global risk command center</h2><p className="text-sm text-slate-500 mt-2">Mapa + evidencia contextual + catálogo operacional. Seleccioná un evento para inspeccionarlo.</p></div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-300" /> SOURCE GOVERNANCE: DEMO</div>
          </div>
          <div className="grid lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8"><GlobalMap warZones={warZones} cables={cables} earthquakes={earthquakes} climateAnomalies={climateAnomalies} travelWarnings={travelWarnings} onSelectNode={selectNode} /></div>
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#090c12] p-5 min-h-[420px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5"><div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-emerald-300"><Globe2 className="h-4 w-4" /> EVIDENCE VIEWER</div><span className="text-[9px] uppercase text-amber-300 border border-amber-300/20 bg-amber-300/5 rounded px-2 py-1">synthetic</span></div>
              <AssetPanel asset={selectedAsset} />
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] leading-5 text-slate-600">Production requirement: every observation must carry source, observedAt, confidence, freshness and provenance metadata.</div>
            </div>
          </div>
        </section>

        <section id="agents" className="scroll-mt-24 mb-8">
          <div className="mb-4"><div className="text-[10px] font-mono tracking-[0.18em] text-emerald-300">02 / AGENT ORCHESTRATION</div><h2 className="text-2xl md:text-3xl font-black mt-1">Six specialists. One operational picture.</h2></div>
          <AgentSwarm agents={agents} onAddSystemLogMsg={addSystemLog} />
        </section>

        <section className="grid lg:grid-cols-[1fr_.8fr] gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#090c12] p-5"><div className="flex items-center gap-2 mb-5"><Activity className="h-4 w-4 text-emerald-300" /><h3 className="font-bold">Operational log</h3></div><div className="space-y-2 max-h-48 overflow-auto font-mono text-[10px] text-slate-500">{systemLogs.map((log, i) => <div key={i} className="border-l border-white/10 pl-3">{log}</div>)}</div></div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-transparent p-5"><div className="flex items-center gap-2 mb-3"><LockKeyhole className="h-4 w-4 text-emerald-300" /><h3 className="font-bold">Enterprise trust layer</h3></div><ul className="space-y-3 text-xs text-slate-400"><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" /> Source provenance and confidence scoring.</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" /> Human-in-the-loop approval for critical actions.</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" /> Immutable audit events planned for production.</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" /> RBAC, tenant isolation and API controls planned.</li></ul></div>
        </section>

        <section id="roadmap" className="scroll-mt-24 mb-8">
          <div className="mb-4"><div className="text-[10px] font-mono tracking-[0.18em] text-emerald-300">03 / DELIVERY ROADMAP</div><h2 className="text-2xl md:text-3xl font-black mt-1">From demo to enterprise product</h2></div>
          <div className="grid md:grid-cols-4 gap-3">{roadmap.map(([period,title,text], i) => <article key={period} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"><div className="text-[10px] font-mono text-emerald-300">0{i + 1}</div><div className="text-xs font-mono text-slate-500 mt-4">{period}</div><h3 className="text-lg font-bold mt-1">{title}</h3><p className="text-xs leading-5 text-slate-500 mt-2">{text}</p></article>)}</div>
        </section>

        <section id="docs" className="scroll-mt-24 grid md:grid-cols-3 gap-3 mb-8">
          {[
            [FileText, 'Technical architecture', 'System boundaries, data contracts, agent orchestration and production controls.', 'docs/architecture.md'],
            [Layers3, 'Investor roadmap', 'Milestones, team model, budget bands, KPIs and commercial strategy.', 'docs/roadmap.md'],
            [Users, 'Competitive positioning', 'Decision-intelligence positioning, target customers and differentiation.', 'docs/comparison.md']
          ].map(([Icon,title,text,path]) => <article key={title} className="rounded-2xl border border-white/10 bg-[#090c12] p-5"><Icon className="h-5 w-5 text-emerald-300" /><h3 className="font-bold mt-4">{title}</h3><p className="text-xs text-slate-500 leading-5 mt-2">{text}</p><div className="mt-4 text-[10px] font-mono text-slate-600">{path}</div></article>)}
        </section>

        <footer className="border-t border-white/10 pt-6 text-[10px] text-slate-600 flex flex-col md:flex-row justify-between gap-2"><span>SWARM INTEL PLATFORM • 2026 • Decision intelligence prototype</span><span>Demo data ≠ operational intelligence. Production requires verified sources and governance.</span></footer>
      </main>
    </div>
  );
}

function AssetPanel({ asset }: { asset: { type: AssetType; data: any } }) {
  const d = asset.data;
  if (!d) return <p className="text-sm text-slate-500">No event selected.</p>;
  if (asset.type === 'war') return <Info title={d.name} accent="text-rose-300"><p>{d.description}</p><Metric label="Severity" value={d.severity} /><Metric label="Economic impact" value={d.economicImpact} /><Metric label="Parties" value={d.parties.join(' vs ')} /></Info>;
  if (asset.type === 'cable') return <Info title={d.name} accent="text-sky-300"><Metric label="Status" value={d.status} /><Metric label="Capacity" value={d.speed} /><Metric label="Landing points" value={d.landingPoints.join(' • ')} /><p>{d.riskFactor}</p></Info>;
  if (asset.type === 'earthquake') return <Info title={d.location} accent="text-violet-300"><Metric label="Magnitude" value={String(d.magnitude)} /><Metric label="Depth" value={d.depthStr} /><Metric label="Timestamp" value={d.timestamp} /><p>{d.climateImpact}</p></Info>;
  if (asset.type === 'climate') return <Info title={d.name} accent="text-pink-300"><Metric label="Type" value={d.type} /><Metric label="Severity" value={d.severity} /><p>{d.statusDescription}</p></Info>;
  return <Info title={d.region} accent="text-amber-300"><Metric label="Risk" value={d.status} /><Metric label="Type" value={d.riskType} /><Metric label="Routes" value={d.safeRoutes.join(' • ')} /></Info>;
}

function Info({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return <div className="space-y-4 text-xs leading-5 text-slate-400"><h3 className={'text-base font-bold ' + accent}>{title}</h3>{children}</div>;
}
function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/5 bg-black/20 p-3"><div className="text-[9px] uppercase tracking-wider text-slate-600">{label}</div><div className="text-xs text-slate-200 mt-1">{value}</div></div>;
}
