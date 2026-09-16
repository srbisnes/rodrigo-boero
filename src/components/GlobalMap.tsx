/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WarZone, UnderseaCable, EarthquakeData, ClimateAnomaly, TravelWarning } from '../types';
import { ShieldAlert, Radio, Activity, CloudLightning, Compass, Info, HelpCircle } from 'lucide-react';

interface GlobalMapProps {
  warZones: WarZone[];
  cables: UnderseaCable[];
  earthquakes: EarthquakeData[];
  climateAnomalies: ClimateAnomaly[];
  travelWarnings: TravelWarning[];
  onSelectNode: (type: 'war' | 'cable' | 'earthquake' | 'climate' | 'travel', data: any) => void;
}

export default function GlobalMap({
  warZones,
  cables,
  earthquakes,
  climateAnomalies,
  travelWarnings,
  onSelectNode
}: GlobalMapProps) {
  const [hoveredItem, setHoveredItem] = useState<{
    type: string;
    name: string;
    desc: string;
    x: number;
    y: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'wars' | 'cables' | 'seismic' | 'travel'>('all');

  // SVG dimensions for the equirectangular projection
  const width = 800;
  const height = 400;

  // Convert Latitude & Longitude to SVG coordinates (X: [0, 800], Y: [0, 400])
  const projectCoordinates = (lat: number, lng: number) => {
    // x range from -180 to 180 projected to 0 to 800
    const x = ((lng + 180) * width) / 360;
    // y range from 90 to -90 (lat is north positive) projected to 0 to 400
    const y = ((90 - lat) * height) / 180;
    return { x, y };
  };

  // Simplified high-tech polygon outlines of continents (for structural background styling)
  const continents = [
    // North America
    { name: 'N_America', coords: [[-125, 60], [-105, 65], [-70, 60], [-55, 48], [-80, 25], [-100, 20], [-115, 30]] },
    // South America
    { name: 'S_America', coords: [[-80, 10], [-50, -5], [-35, -5], [-40, -20], [-70, -50], [-75, -40], [-70, -15]] },
    // Eurasia / Africa
    { name: 'Eurasia', coords: [[-10, 60], [30, 70], [60, 75], [100, 75], [135, 70], [130, 35], [105, 15], [75, 10], [45, 15], [35, 30], [25, 45], [0, 50]] },
    // Africa
    { name: 'Africa', coords: [[-15, 15], [15, 30], [32, 30], [50, 10], [40, -15], [20, -34], [10, -30], [8, -10], [-10, 5]] },
    // Australia
    { name: 'Australia', coords: [[113, -25], [115, -15], [145, -15], [150, -34], [140, -38], [115, -35]] },
    // Greenland
    { name: 'Greenland', coords: [[-60, 80], [-30, 80], [-40, 60], [-55, 60]] }
  ];

  const handleMouseMove = (e: React.MouseEvent, type: string, name: string, desc: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.ownerDocument.getElementById('geopolitical-svg')?.getBoundingClientRect();
    if (svgRect) {
      setHoveredItem({
        type,
        name,
        desc,
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top - 10
      });
    }
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-5 shadow-2xl relative overflow-hidden" id="global_tactical_map_panel">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse" /> MONITOREO GEOPOLÍTICO GLOBAL
          </h3>
          <p className="text-xs text-gray-400">Enlace satelital de vectores de riesgo en tiempo real</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-1 bg-[#070a13] p-1 rounded-lg border border-gray-800 text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-1 rounded transition ${activeTab === 'all' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            TODOS
          </button>
          <button
            onClick={() => setActiveTab('wars')}
            className={`px-2 py-1 rounded transition ${activeTab === 'wars' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            GUERRAS
          </button>
          <button
            onClick={() => setActiveTab('cables')}
            className={`px-2 py-1 rounded transition ${activeTab === 'cables' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            CABLES NET
          </button>
          <button
            onClick={() => setActiveTab('seismic')}
            className={`px-2 py-1 rounded transition ${activeTab === 'seismic' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            SÍSMICO/CLIMA
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`px-2 py-1 rounded transition ${activeTab === 'travel' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            RESTRICCIONES
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative border border-gray-950 bg-[#060810] rounded-lg overflow-x-auto overflow-y-hidden scrollbar-thin">
        <svg
          id="geopolitical-svg"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[700px] h-auto block select-none"
        >
          {/* Grid lines (High-tech layout lines) */}
          <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3">
            {/* Latitudinal lines */}
            {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(xVal => (
              <line key={`lat-${xVal}`} x1={xVal * (width / 360)} y1="0" x2={xVal * (width / 360)} y2={height} />
            ))}
            {/* Longitudinal lines */}
            {[30, 60, 90, 120, 150].map(yVal => (
              <line key={`lng-${yVal}`} x1="0" y1={yVal * (height / 180)} x2={width} y2={yVal * (height / 180)} />
            ))}
          </g>

          {/* Continent Outlines */}
          <g fill="#111827" stroke="#1f2937" strokeWidth="1" opacity="0.8">
            {continents.map((continent) => {
              const pointsString = continent.coords
                .map(([lng, lat]) => {
                  const p = projectCoordinates(lat, lng);
                  return `${p.x},${p.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={continent.name}
                  id={`map-con-${continent.name}`}
                  points={pointsString}
                  className="hover:fill-gray-800/60 transition duration-300"
                />
              );
            })}
          </g>

          {/* Glowing maritime cables (Lines) */}
          {(activeTab === 'all' || activeTab === 'cables') && (
            <g id="cables-group">
              {cables.map((cable) => {
                const points = cable.coordinates.map(c => projectCoordinates(c.lat, c.lng));
                const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                let strokeColor = '#3b82f6'; // operational blue
                if (cable.status === 'under-threat') strokeColor = '#f5a623'; // threatened yellow
                else if (cable.status === 'compromised') strokeColor = '#ef4444'; // compromised red

                const midPoint = points[Math.floor(points.length / 2)];

                return (
                  <g key={cable.id} className="cursor-pointer">
                    {/* Shadow wider hover path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="12"
                      className="transition opacity-0 hover:opacity-10"
                      onMouseMove={(e) => handleMouseMove(e, 'Cable Submarino', cable.name, `Estado: ${cable.status.toUpperCase()} | Vel: ${cable.speed}`)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => onSelectNode('cable', cable)}
                    />
                    {/* Glowing Cable Path */}
                    <path
                      id={`cable-path-${cable.id}`}
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeDasharray={cable.status === 'operational' ? 'none' : '4,4'}
                      className="transition duration-300 hover:stroke-white hover:stroke-[3px]"
                      onClick={() => onSelectNode('cable', cable)}
                    />
                    {/* Cable Info Marker */}
                    {midPoint && (
                      <circle
                        cx={midPoint.x}
                        cy={midPoint.y}
                        r="3"
                        fill={strokeColor}
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* War Zones (Red targets / circles) */}
          {(activeTab === 'all' || activeTab === 'wars') && (
            <g id="warzones-group">
              {warZones.map((war) => {
                const p = projectCoordinates(war.lat, war.lng);
                return (
                  <g
                    key={war.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectNode('war', war)}
                    onMouseMove={(e) => handleMouseMove(e, 'Zona de Conflicto', war.name, `${war.description.substring(0, 70)}...`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Pulsating danger rings */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="16"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1"
                      className="animate-ping opacity-30"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="8"
                      fill="#ef4444"
                      className="opacity-20 group-hover:opacity-40 transition-opacity"
                    />
                    {/* Main tactical crosshair star or dot */}
                    <circle
                      id={`war-dot-${war.id}`}
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    {/* Little cross lines */}
                    <line x1={p.x - 7} y1={p.y} x2={p.x + 7} y2={p.y} stroke="#ef4444" strokeWidth="1" />
                    <line x1={p.x} y1={p.y - 7} x2={p.x} y2={p.y + 7} stroke="#ef4444" strokeWidth="1" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Seismological and Climate (Indigo/Purple waves) */}
          {(activeTab === 'all' || activeTab === 'seismic') && (
            <g id="seismic-group">
              {/* Earthquakes */}
              {earthquakes.map((eq) => {
                const p = projectCoordinates(eq.lat, eq.lng);
                return (
                  <g
                    key={eq.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectNode('earthquake', eq)}
                    onMouseMove={(e) => handleMouseMove(e, 'Evento Sísmico', eq.location, `Magnitud: ${eq.magnitude} Richter | Magnitud: ${eq.depthStr}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="12"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#818cf8"
                    />
                    {/* Visual waves rings representing s-waves */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="22"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      opacity="0.5"
                    />
                  </g>
                );
              })}

              {/* Climate Anomalies */}
              {climateAnomalies.map((clim) => {
                const p = projectCoordinates(clim.lat, clim.lng);
                const color = clim.severity === 'extreme' ? '#f43f5e' : '#a855f7';
                return (
                  <g
                    key={clim.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectNode('climate', clim)}
                    onMouseMove={(e) => handleMouseMove(e, 'Anomalía Climática', clim.name, clim.statusDescription)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Swirling meteorological hurricane paths drawn with circles */}
                    <path
                      d={`M ${p.x - 6} ${p.y} A 6 6 0 1 1 ${p.x + 6} ${p.y} A 6 6 0 1 1 ${p.x - 6} ${p.y}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      className="animate-spin duration-1000"
                      style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      fill={color}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Travel Warning hazard shade regions */}
          {(activeTab === 'all' || activeTab === 'travel') && (
            <g id="travel-group">
              {travelWarnings.map((warn) => {
                // Pinpoints the warnings
                // We'll map the warning to roughly estimate coordinates matching its region
                let dummyLat = 0;
                let dummyLng = 0;
                if (warn.id === 't1') { dummyLat = 28.0; dummyLng = 34.5; }
                else if (warn.id === 't2') { dummyLat = 35.8; dummyLng = 140.2; }
                else if (warn.id === 't3') { dummyLat = 54.0; dummyLng = 22.0; }

                const p = projectCoordinates(dummyLat, dummyLng);
                const isCritical = warn.status === 'critical-avoid';
                const ringColor = isCritical ? '#f43f5e' : '#f59e0b';

                return (
                  <g
                    key={warn.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectNode('travel', warn)}
                    onMouseMove={(e) => handleMouseMove(e, 'Alerta de Tránsito', warn.region, `Riesgo: ${warn.status.toUpperCase()} | Recomendación: ${warn.recommendations[0]}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Triangle Hazard badge */}
                    <polygon
                      points={`${p.x},${p.y - 7} ${p.x - 7},${p.y + 6} ${p.x + 7},${p.y + 6}`}
                      fill={ringColor}
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      className="opacity-90 hover:scale-125 transition-transform"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Information Tooltip Overlay */}
        {hoveredItem && (
          <div
            className="absolute z-50 pointer-events-none bg-slate-950 border border-slate-800 text-white rounded-lg p-3 text-[11px] font-mono shadow-2xl max-w-xs"
            style={{
              left: `${hoveredItem.x}px`,
              top: `${hoveredItem.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1 gap-4">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{hoveredItem.type}</span>
              <span className="text-gray-500 text-[8px]">SAT-LIVE</span>
            </div>
            <p className="font-bold text-gray-200 mb-0.5">{hoveredItem.name}</p>
            <p className="text-gray-400 leading-normal">{hoveredItem.desc}</p>
          </div>
        )}
      </div>

      {/* Legend and operational notes */}
      <div className="mt-4 flex flex-wrap gap-4 justify-between text-[10px] font-mono border-t border-gray-900 pt-3">
        <div className="flex flex-wrap gap-3 items-center text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 block"></span> Guerras / Zonas Hostiles
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-blue-500 block"></span> Cables Internet Submarinos
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 block"></span> Focos de Terremotos
          </span>
          <span className="flex items-center gap-1">
            <polygon points="5,0 0,10 10,10" className="fill-amber-500 text-white stroke-none" /> Alertas de Restricción
          </span>
        </div>
        <div className="text-gray-500">
          Coordenadas de Proyección Elíptica Rectangular • WGS-84
        </div>
      </div>
    </div>
  );
}
