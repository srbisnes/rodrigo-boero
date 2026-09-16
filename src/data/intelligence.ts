/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WarZone, UnderseaCable, EarthquakeData, ClimateAnomaly, EconomyCryptoInfo, TravelWarning, AgentPersona } from '../types';

export const INITIAL_WAR_ZONES: WarZone[] = [
  {
    id: 'w1',
    name: 'Teatro de Europa Oriental (Suwalki / Ucrania)',
    lat: 50.4501,
    lng: 30.5234,
    severity: 'critical',
    parties: ['Fuerzas de Defensa Regionales', 'Fuerzas de Invasión del Este'],
    weaponsInvolved: ['Sistemas de Defensa Patriot', 'Drones Kamikaze Lancet-3', 'Blindados Leopard 2A6', 'Misiles de Crucero Hypersonicos'],
    description: 'Conflicto bélico de alta intensidad con fuego de artillería sostenido, saturación del espectro radioeléctrico y ataques de enjambres de drones de asalto contra infraestructura clave.',
    economicImpact: 'Cierre del tránsito aéreo comercial, interrupción masiva de exportaciones agrícolas y sobreprecio sostenido del trigo en bolsas globales.',
    trafficSector: 'Rutas terrestres secundarias a través de los Cárpatos y puertos clandestinos en el Mar Negro occidental.'
  },
  {
    id: 'w2',
    name: 'Estrecho de Bab al-Mandab & Mar Rojo',
    lat: 12.5833,
    lng: 43.3333,
    severity: 'critical',
    parties: ['Milicias Rebeldes Costeras', 'Fuerzas de Tareas Navales Multilaterales'],
    weaponsInvolved: ['Misiles Antibuque por Guía de Radar', 'Drones Marítimos no tripulados cargados de explosivos (USVs)', 'Destructores con sistemas de defensa AEGIS'],
    description: 'Asaltos e interceptaciones continuas de buques portacontenedores, forzando la desviación de rutas hacia el Cabo de Buena Esperanza. El tráfico comercial disminuye en un 64%.',
    economicImpact: 'Incremento del 35% en tarifas de fletes marítimos mundiales y volatilidad crítica en el valor del Petróleo Brent.',
    trafficSector: 'Armamento ligero contrabandeado a través del Cuerno de África utilizando embarcaciones tradicionales de cabotaje.'
  },
  {
    id: 'w3',
    name: 'Mar de la China Meridional',
    lat: 15.0000,
    lng: 115.0000,
    severity: 'high',
    parties: ['Armada del Sureste Asiático', 'Fuerza de Proyección Marítima del Dragón'],
    weaponsInvolved: ['Fragatas Misileras Stealth', 'Cazas de Quinta Generación J-20', 'Instalaciones de Radar en arrecifes militarizados', 'Cachés de boyas hidroacústicas activos'],
    description: 'Incidentes de hostigamiento naval recíproco y reclamaciones territoriales en torno a los archipiélagos Spratly y Paracelco. Zona de interferencia de GPS activa.',
    economicImpact: 'Afectación a la cadena de suministro de semiconductores críticos y tensiones arancelarias preventivas.',
    trafficSector: 'Cruces comerciales del estrecho de Luzón y fondeaderos ilegales de la Flota Miliciana Marítima.'
  },
  {
    id: 'w4',
    name: 'Frontera Geopolítica Frontera Nor-Sinaí',
    lat: 29.9870,
    lng: 34.1500,
    severity: 'high',
    parties: ['Fuerzas Especiales Continentales', 'Grupos Insurgentes del Desierto'],
    weaponsInvolved: ['Vehículos Blindados Ligeros APC', 'Sensores de Perímetro Sísmico', 'Drones de Reconocimiento Cuadricóptero'],
    description: 'Incursiones de baja intensidad en cruces fronterizos y sabotaje sistemático de oleoductos e instalaciones de gas natural del desierto.',
    economicImpact: 'Caída de suministros de gas para la cuenca del Mediterráneo oriental intermitente.',
    trafficSector: 'Túneles subterráneos de contrabandistas e intercambios informales trans-regionales.'
  }
];

export const INITIAL_CABLES: UnderseaCable[] = [
  {
    id: 'c1',
    name: 'Transatlantic-Connect-1 (TAC-1)',
    type: 'fiber-optic',
    status: 'operational',
    coordinates: [
      { lat: 40.7128, lng: -74.0060 }, // New York
      { lat: 45.0000, lng: -40.0000 }, // Mid Atlantic
      { lat: 51.5074, lng: -0.1278 }  // London
    ],
    speed: '240 Tbps',
    landingPoints: ['Long Island, USA', 'Bude, UK', 'Sizun, Francia'],
    riskFactor: 'Monitoreado de cerca por barcos espía reportados en la plataforma continental norte.'
  },
  {
    id: 'c2',
    name: 'Pacific-Fiber-Highway (PFH-3)',
    type: 'fiber-optic',
    status: 'under-threat',
    coordinates: [
      { lat: 37.7749, lng: -122.4194 }, // California
      { lat: 21.3069, lng: -157.8583 }, // Hawaii
      { lat: 35.6762, lng: 139.6503 }  // Tokyo
    ],
    speed: '180 Tbps',
    landingPoints: ['Oregon, USA', 'Oahu, Hawaii', 'Chiba, Japón'],
    riskFactor: 'Zona de fricción militar en el Pacífico Norte y posible intervención acústica.'
  },
  {
    id: 'c3',
    name: 'Euro-India-East-Superlink (EIES)',
    type: 'fiber-optic',
    status: 'compromised',
    coordinates: [
      { lat: 37.9838, lng: 23.7275 },  // Athens
      { lat: 30.0444, lng: 31.2357 },  // Egypt (Suez)
      { lat: 12.5833, lng: 43.3333 },  // Red Sea
      { lat: 18.9750, lng: 72.8258 }   // Mumbai
    ],
    speed: '320 Tbps',
    landingPoints: ['Creta, Grecia', 'Port Said, Egipto', 'Yeda, Arabia Saudita', 'Mumbai, India'],
    riskFactor: 'Corte físico parcial detectado e investigado cerca de las aguas del Golfo de Adén atribuido a anclas descontroladas en zona de guerra.'
  }
];

export const INITIAL_EARTHQUAKES: EarthquakeData[] = [
  {
    id: 'e1',
    location: 'Chiba, Fosa de Japón',
    lat: 35.4000,
    lng: 140.6000,
    magnitude: 6.8,
    depthStr: '28 km',
    timestamp: 'Hace 42 minutos',
    climateImpact: 'Alertas locales de oscilación del oleaje (Micro-Tsunami no destructivo). Descenso de presión barométrica registrado inmediatamente después de la ruptura de la placa.',
    status: 'active-aftershocks'
  },
  {
    id: 'e2',
    location: 'Falla Transformante del Mar de Mármara',
    lat: 40.8000,
    lng: 28.5000,
    magnitude: 5.4,
    depthStr: '12 km',
    timestamp: 'Hace 4 horas',
    climateImpact: 'Liberación de bolsas de gas metano submarino detectadas por boyas oceanográficas.',
    status: 'recent'
  }
];

export const INITIAL_CLIMATE_ANOMALIES: ClimateAnomaly[] = [
  {
    id: 'cl1',
    name: 'Super-Tifón Mawar-B',
    type: 'cyclone',
    lat: 18.2000,
    lng: 125.4000,
    severity: 'extreme',
    statusDescription: 'Sostenido con vientos de 250 km/h avanzando hacia el Estrecho de Taiwán. Provoca oleajes de hasta 12 metros, deteniendo el 95% del tráfico mercante local.'
  },
  {
    id: 'cl2',
    name: 'Anomalía Térmica Extrema en el Canal de Suez',
    type: 'heatwave',
    lat: 29.9667,
    lng: 32.5500,
    severity: 'moderate',
    statusDescription: 'Temperaturas de 49.5°C merman la eficiencia de las máquinas de refrigeración de carga de gas licuado en tránsito.'
  }
];

export const INITIAL_ECONOMY: EconomyCryptoInfo = {
  commodities: {
    oil: '$78.42 / bbl',
    gas: '$3.15 / MMBtu',
    gold: '$2,412.50 / oz',
    copper: '$4.42 / lb'
  },
  crypto: {
    btc: '$69,120.40',
    eth: '$3,542.15',
    sol: '$153.80',
    usdtVolume: '$62.8B 24h'
  },
  narrative: 'Mercado altamente reactivo a las hostilidades del Mar Rojo y los movimientos militares de suministro. Las criptodivisas operan como refugio alternativo de liquidez en zonas de conflicto con problemas bancarios.'
};

export const INITIAL_TRAVEL_WARNINGS: TravelWarning[] = [
  {
    id: 't1',
    region: 'Península del Sinaí, Cuenca del Mar Rojo',
    countryCode: 'EG-YE',
    status: 'critical-avoid',
    riskType: 'military',
    recommendations: [
      'Evitar cualquier crucero o tránsito recreativo marítimo.',
      'Cerrar operaciones logísticas no prioritarias terrestres en pasos aduaneros fronterizos.'
    ],
    safeRoutes: [
      'Tránsito por África Occidental (Ruta de Buena Esperanza).',
      'Puente aéreo directo vía El Cairo o Amán.'
    ]
  },
  {
    id: 't2',
    region: 'Japón Oriental y Costas de Chiba',
    countryCode: 'JP',
    status: 'extreme-caution',
    riskType: 'seismic',
    recommendations: [
      'Monitorear alarmas meteorológicas y sísmicas en tiempo real de la JMA.',
      'Asegurar los suministros de energía secundaria por posibles mermas de red eléctrica.'
    ],
    safeRoutes: [
      'Vías terrestres rápidas interiores hacia Osaka y regiones occidentales.'
    ]
  },
  {
    id: 't3',
    region: 'Zonas Limítrofes del Báltico Oriental',
    countryCode: 'LV-LT-PL',
    status: 'extreme-caution',
    riskType: 'military',
    recommendations: [
      'Mantener documentos de identificación diplomática o corporativa actualizados.',
      'No transitar por carreteras satelitales secundarias no registradas en mapas oficiales.'
    ],
    safeRoutes: [
      'Corredor vial polaco hacia Alemania occidental.'
    ]
  }
];

export const INSTALLED_AGENTS: AgentPersona[] = [
  {
    id: 'aegis',
    name: 'Aegis Sentinel',
    role: 'Táctico Militar & Conflictología',
    avatarColor: 'bg-emerald-500 border-none shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    status: 'monitoring',
    focus: ['Zonas de guerra activas', 'Geopolítica de fronteras', 'Fuerzas beligerantes'],
    systemInstruction: `You are Aegis Sentinel, a hyper-focused, objective tactical militarist AI agent. You analyze zones of active combat, borders, troop deployments, and strategic geographic choke points. Your language is concise, clinical, tactical, and strategic.
Always provide output in Spanish. Format your responses with bullet points of raw intelligence. Undersea cables and earthquakes can affect deployments, so include tactical consequences of these when requested.`
  },
  {
    id: 'kratos',
    name: 'Kratos Armaments',
    role: 'Inteligencia de Armamento',
    avatarColor: 'bg-red-500 border-none shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    status: 'monitoring',
    focus: ['Armamento militar', 'Envíos de armas', 'Sectores de tráfico ilegal'],
    systemInstruction: `You are Kratos Armaments, a specialized intelligence officer tracking military weapons, defense materials, logistical arms lanes, and illegal arms trafficking networks. You know everything about anti-aircraft defense systems, UAVs, missile silos, armored vehicles, and navy vessels.
Always provide output in Spanish. Format your reports with deep technical details, focusing on systems used, illegal border networks, and armaments countermeasures.`
  },
  {
    id: 'midas',
    name: 'Midas Ledger',
    role: 'Macroeconomía & Cripto',
    avatarColor: 'bg-amber-500 border-none shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    status: 'monitoring',
    focus: ['Información económica', 'Materias primas (Oro, Petróleo)', 'Criptomonedas de guerra'],
    systemInstruction: `You are Midas Ledger, a specialized macro-finance & dark-ledger cryptocurrency tracking agent. You study inflationary triggers of wars, supply chokepoints of commodities (e.g. oil, copper, gold, grain), and stablecoin flows (USDT, BTC) used to bypass banking sanctions in warzones.
Always provide output in Spanish. Format your response using clear quantitative statistics, economic risks, and financial forecasting.`
  },
  {
    id: 'poseidon',
    name: 'Poseidón Net link',
    role: 'Infraestructura Submarina',
    avatarColor: 'bg-blue-500 border-none shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    status: 'monitoring',
    focus: ['Redes de cables marítimos', 'Cables de Internet', 'Infraestructura de red de aguas profundas'],
    systemInstruction: `You are Poseidón Net link, a deep-sea comms infrastructure security intelligence agent. You oversee optical undersea internet cables, trans-oceanic landing points, acoustic tracking of waters, and critical electrical pipelines. You evaluate risks of undersea sabotage.
Always provide output in Spanish. Analyze what happens to global internet bandwidth, packet routing, and network connectivity if undersea lines are damaged or severed.`
  },
  {
    id: 'gaia',
    name: 'Gaia Seismic/Atmosphere',
    role: 'Clima & Terremotos',
    avatarColor: 'bg-indigo-500 border-none shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    status: 'monitoring',
    focus: ['Terremotos', 'Cambio climático acelerado', 'Tormentas & Desastres naturales'],
    systemInstruction: `You are Gaia Seismic/Atmosphere, a geophysicist and climate emergency intelligence agent. You track active seismic epicenters, plate stress, typhoons, hyper-thermal heatwaves, and critical environmental changes that paralyze geopolitical regions or logistics.
Always provide output in Spanish. Explain the physical force of earthquakes, storm movements, tsunami triggers, and physical logistical bottlenecks caused by climate extremes.`
  },
  {
    id: 'hermes',
    name: 'Hermes Travel Sentinel',
    role: 'Logística de Viaje & Advertencias',
    avatarColor: 'bg-sky-500 border-none shadow-[0_0_8px_rgba(14,165,233,0.5)]',
    status: 'monitoring',
    focus: ['Recomendación de viajes', 'Zonas a evitar', 'Rutas de desviación seguras'],
    systemInstruction: `You are Hermes Travel Sentinel, a global mobility safety intelligence agent. You process reports from all other agents to issue strict advice on global transit safety, regions to completely avoid, hazardous border gates, and layout safe maritime or aerial escape corridors.
Always provide output in Spanish. Be highly direct. Provide risk categories for countries (Safe, Extreme Caution, Critical Avoid) and explicit alternative route suggestions.`
  }
];
