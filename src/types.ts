/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WarZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: 'critical' | 'high' | 'moderate';
  parties: string[];
  weaponsInvolved: string[];
  description: string;
  economicImpact: string;
  trafficSector: string; // weapon trafficking sector info
}

export interface UnderseaCable {
  id: string;
  name: string;
  type: 'fiber-optic' | 'power';
  status: 'operational' | 'compromised' | 'under-threat';
  coordinates: { lat: number; lng: number }[]; // line path
  speed: string; // e.g. "120 Tbps"
  landingPoints: string[];
  riskFactor: string;
}

export interface EarthquakeData {
  id: string;
  location: string;
  lat: number;
  lng: number;
  magnitude: number;
  depthStr: string;
  timestamp: string;
  climateImpact: string; // connections to weather/sea anomalies
  status: 'recent' | 'active-aftershocks';
}

export interface ClimateAnomaly {
  id: string;
  name: string;
  type: 'cyclone' | 'drought' | 'flooding' | 'heatwave';
  lat: number;
  lng: number;
  severity: 'extreme' | 'moderate';
  statusDescription: string;
}

export interface EconomyCryptoInfo {
  commodities: {
    oil: string;    // e.g. "$74.50 / bbl"
    gas: string;    // e.g. "$2.45 / MMBtu"
    gold: string;   // e.g. "$2,340 / oz"
    copper: string; // e.g. "$4.20 / lb"
  };
  crypto: {
    btc: string;    // e.g. "$68,400"
    eth: string;    // e.g. "$3,450"
    sol: string;    // e.g. "$142.50"
    usdtVolume: string; // e.g. "$55B 24h"
  };
  narrative: string;
}

export interface TravelWarning {
  id: string;
  region: string;
  countryCode: string;
  status: 'critical-avoid' | 'extreme-caution' | 'safe';
  riskType: 'military' | 'climate' | 'seismic' | 'social';
  recommendations: string[];
  safeRoutes: string[];
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: 'monitoring' | 'analyzing' | 'idle';
  focus: string[];
  systemInstruction: string;
}

export interface AgentAnalysis {
  agentId: string;
  agentName: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'operator' | 'system' | 'agent' | 'user';
  text: string;
  timestamp: string;
  avatarColor?: string;
}
