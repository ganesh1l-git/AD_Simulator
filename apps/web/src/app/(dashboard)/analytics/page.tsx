'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { Chart, registerables } from 'chart.js';
import { api } from '@/lib/api';

Chart.register(...registerables);

// ---- Tactical Color Scheme (BI Palette) ----
const BI_COLORS = {
  Russia: '#ef4444',       // Crimson/Red
  USA: '#3b82f6',          // Deep Blue
  India: '#f97316',        // Saffron/Orange
  Israel: '#06b6d4',       // Cyan/Teal
  Germany: '#eab308',      // Yellow
  UK: '#a855f7',           // Purple
  France: '#ec4899',       // Pink
  Japan: '#10b981',        // Emerald
  'South Korea': '#14b8a6', // Teal
  Other: '#64748b',        // Gray
};

const CHART_ACCENTS = {
  green: '#22c55e',
  greenDim: 'rgba(34, 197, 94, 0.1)',
  cyan: '#06b6d4',
  cyanDim: 'rgba(6, 182, 212, 0.1)',
  amber: '#eab308',
  amberDim: 'rgba(234, 179, 8, 0.1)',
  red: '#ef4444',
  redDim: 'rgba(239, 68, 68, 0.1)',
  purple: '#a855f7',
  indigo: '#6366f1',
  textSecondary: '#94a3b8',
  gridColor: 'rgba(148, 163, 184, 0.04)',
};

// ---- Stable Date Formatting Helpers (Avoid Hydration Mismatch) ----
function formatDateStable(dateString: string, includeTime = false): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = String(date.getDate()).padStart(2, '0');
  const monthStr = months[date.getMonth()];
  const year = date.getFullYear();
  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${dayStr} ${monthStr} ${year} ${hours}:${minutes}:${seconds}`;
  }
  return `${dayStr} ${monthStr} ${year}`;
}

function formatDateShortStable(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// ---- Descriptive Labels Mapping for Defense layers ----
const LAYER_DESCRIPTIONS = {
  LONG_RANGE: { label: 'Long Range Defense', desc: 'e.g. S-400, Patriot PAC-3 (120km+)' },
  MEDIUM_RANGE: { label: 'Medium Range Defense', desc: 'e.g. Akash, MRSAM / Barak-8 (50-120km)' },
  SHORT_RANGE: { label: 'Short Range Tactical', desc: 'e.g. Pantsir, SPYDER (20-50km)' },
  VERY_SHORT_RANGE: { label: 'VSHORAD / MANPADS', desc: 'e.g. Igla-S, Stinger (under 20km)' },
  ANTI_DRONE: { label: 'Anti-Drone / Directed Energy', desc: 'Laser systems, microwave weapons' },
  RADAR: { label: 'Active Tracking Radar', desc: 'Target acquisition & fire control' },
};

// ---- System Details Helper Mapping ----
function getCountryForSystem(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('patriot') || n.includes('pac-3') || n.includes('nasams') || n.includes('thaad')) return 'USA';
  if (n.includes('s-400') || n.includes('s-300') || n.includes('pechora') || n.includes('igla') || n.includes('pantsir') || n.includes('tor-m2') || n.includes('buk')) {
    if (n.includes('indian')) return 'India';
    return 'Russia';
  }
  if (n.includes('barak') || n.includes('mrsam') || n.includes('lrsam')) return 'India / Israel';
  if (n.includes('akash') || n.includes('qrsam') || n.includes('vshorad') || n.includes('anti-drone') || n.includes('drdo')) return 'India';
  if (n.includes('spyder') || n.includes('iron dome') || n.includes('arrow') || n.includes('david')) return 'Israel';
  if (n.includes('iris-t')) return 'Germany';
  if (n.includes('sky sabre') || n.includes('rapier')) return 'UK';
  if (n.includes('mica') || n.includes('samp/t') || n.includes('crotale')) return 'France';
  if (n.includes('chu-sam') || n.includes('type-03') || n.includes('tan-sam')) return 'Japan';
  if (n.includes('l-sam') || n.includes('cheongung')) return 'South Korea';
  return 'Other';
}

function getCategoryForSystem(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('s-400') || n.includes('patriot') || n.includes('arrow') || n.includes('thaad')) return 'LONG_RANGE';
  if (n.includes('barak-8') || n.includes('mrsam') || n.includes('akash') || n.includes('nasams') || n.includes('iris-t')) return 'MEDIUM_RANGE';
  if (n.includes('spyder') || n.includes('qrsam') || n.includes('pantsir') || n.includes('sky sabre') || n.includes('pechora')) return 'SHORT_RANGE';
  if (n.includes('vshorad') || n.includes('igla') || n.includes('stinger') || n.includes('starstreak')) return 'VERY_SHORT_RANGE';
  if (n.includes('anti-drone') || n.includes('laser') || n.includes('counter-drone')) return 'ANTI_DRONE';
  if (n.includes('radar')) return 'RADAR';
  return 'MEDIUM_RANGE'; // default
}

function getThreatTypeFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('ballistic')) return 'BALLISTIC_MISSILE';
  if (n.includes('cruise')) return 'CRUISE_MISSILE';
  if (n.includes('uav') || n.includes('drone') || n.includes('swarm')) return 'UAV';
  if (n.includes('fighter') || n.includes('aircraft') || n.includes('su-') || n.includes('f-') || n.includes('j-') || n.includes('rafale') || n.includes('typhoon')) return 'FIGHTER_AIRCRAFT';
  if (n.includes('arm') || n.includes('anti-radiation')) return 'ANTI_RADIATION_MISSILE';
  return 'CRUISE_MISSILE'; // default
}

// ---- Static Head-to-Head System Specifications ----
const COMPARE_SYSTEMS: Record<string, { country: string; range: string; alt: string; capacity: number; reload: string; cost: string; accuracy: string; speed: string; bestAgainst: string; color: string }> = {
  'S-400 Triumf': { country: 'Russia', range: '400km', alt: '30,000m', capacity: 80, reload: '15s', cost: '$1,090M', accuracy: '90%', speed: 'Mach 14', bestAgainst: 'Long-range bombers, cruise missiles, and high-altitude targets.', color: BI_COLORS.Russia },
  'Patriot PAC-3': { country: 'USA', range: '160km', alt: '24,200m', capacity: 16, reload: '8s', cost: '$800M', accuracy: '85%', speed: 'Mach 5', bestAgainst: 'Tactical ballistic missiles, cruise missiles, and high-performance fighters.', color: BI_COLORS.USA },
  'MRSAM / Barak-8': { country: 'India / Israel', range: '70km', alt: '16,000m', capacity: 24, reload: '8s', cost: '$500M', accuracy: '85%', speed: 'Mach 2', bestAgainst: 'Medium-range cruise missiles, UAV swarms, and helicopters.', color: BI_COLORS.Israel },
  'Akash-NG': { country: 'India', range: '80km', alt: '20,000m', capacity: 8, reload: '5s', cost: '$480M', accuracy: '85%', speed: 'Mach 3.5', bestAgainst: 'Fighter aircraft, stealth cruise missiles, and low-RCS drone swarms.', color: BI_COLORS.India },
  'SPYDER': { country: 'Israel', range: '50km', alt: '16,000m', capacity: 4, reload: '4s', cost: '$50M', accuracy: '84%', speed: 'Mach 4', bestAgainst: 'UAVs, precision guided munitions, and cruise missiles.', color: BI_COLORS.Israel },
  'Pechora-2M': { country: 'Russia', range: '35km', alt: '20,000m', capacity: 2, reload: '10s', cost: '$15M', accuracy: '70%', speed: 'Mach 3.5', bestAgainst: 'Low-to-medium altitude legacy threats, helicopters, and UAVs.', color: BI_COLORS.Russia },
};

// ---- Rich Mock Simulations (BI Foundation Dataset) ----
const MOCK_SIMULATIONS = [
  {
    id: 'mock-sim-1',
    name: 'Operation Shield Guard',
    createdAt: '2026-07-16T12:00:00.000Z',
    completedAt: '2026-07-16T12:03:00.000Z',
    duration: 180,
    scenarioName: 'Western Sector Saturation Assault',
    status: 'COMPLETED',
    weather: 'RAINY',
    ecmLevel: 2,
    totalThreats: 36,
    threatsDetected: 34,
    threatsIntercepted: 30,
    threatsImpacted: 6,
    interceptionRate: 30 / 36,
    detectionRate: 34 / 36,
    totalCost: 18.6,
    radarsDestroyed: 1,
    engagements: [
      ...Array.from({ length: 12 }).map((_, i) => ({
        id: `mock-1-eng-akash-${i}`,
        threatName: `Shahed-136 UAV [W${i % 3 + 1}]`,
        threatType: 'UAV',
        systemName: 'Akash',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India',
        success: true,
        probability: 0.78,
        cost: 0.35,
        interceptTime: 12,
      })),
      ...Array.from({ length: 8 }).map((_, i) => ({
        id: `mock-1-eng-qrsam-${i}`,
        threatName: `Lancet Drone [W${i % 2 + 1}]`,
        threatType: 'UAV',
        systemName: 'QRSAM',
        systemCategory: 'SHORT_RANGE',
        country: 'India',
        success: true,
        probability: 0.82,
        cost: 0.6,
        interceptTime: 8,
      })),
      ...Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-1-eng-barak-${i}`,
        threatName: `Kalibr Cruise Missile [W${i + 1}]`,
        threatType: 'CRUISE_MISSILE',
        systemName: 'MRSAM / Barak-8',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India / Israel',
        success: true,
        probability: 0.85,
        cost: 1.5,
        interceptTime: 22,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-1-eng-s400-${i}`,
        threatName: `Iskander-M Ballistic [W${i + 1}]`,
        threatType: 'BALLISTIC_MISSILE',
        systemName: 'S-400 (Indian Configuration)',
        systemCategory: 'LONG_RANGE',
        country: 'India',
        success: true,
        probability: 0.9,
        cost: 3.5,
        interceptTime: 35,
      })),
      ...Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-1-eng-fail-drone-${i}`,
        threatName: `Shahed-136 UAV [W${i + 4}]`,
        threatType: 'UAV',
        systemName: 'Akash',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India',
        success: false,
        probability: 0.78,
        cost: 0.35,
        interceptTime: 14,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-1-eng-fail-cruise-${i}`,
        threatName: `Kalibr Cruise Missile [W${i + 5}]`,
        threatType: 'CRUISE_MISSILE',
        systemName: 'MRSAM / Barak-8',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India / Israel',
        success: false,
        probability: 0.85,
        cost: 1.5,
        interceptTime: 25,
      })),
      {
        id: 'mock-1-eng-arm',
        threatName: 'Kh-31P ARM',
        threatType: 'ANTI_RADIATION_MISSILE',
        systemName: 'S-400 Radar',
        systemCategory: 'RADAR',
        country: 'Russia',
        success: false,
        probability: 0.15,
        cost: 0.0,
        interceptTime: 18,
      }
    ]
  },
  {
    id: 'mock-sim-2',
    name: 'Operation Desert Sentinel',
    createdAt: '2026-07-15T15:30:00.000Z',
    completedAt: '2026-07-15T15:34:00.000Z',
    duration: 240,
    scenarioName: 'Symmetric Air Assault',
    status: 'COMPLETED',
    weather: 'CLEAR',
    ecmLevel: 0,
    totalThreats: 20,
    threatsDetected: 20,
    threatsIntercepted: 18,
    threatsImpacted: 2,
    interceptionRate: 18 / 20,
    detectionRate: 20 / 20,
    totalCost: 84.2,
    radarsDestroyed: 0,
    engagements: [
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `mock-2-eng-s400-fighter-${i}`,
        threatName: `Su-35 Flanker [W1-${i + 1}]`,
        threatType: 'FIGHTER_AIRCRAFT',
        systemName: 'S-400 Triumf',
        systemCategory: 'LONG_RANGE',
        country: 'Russia',
        success: true,
        probability: 0.88,
        cost: 12.0,
        interceptTime: 42,
      })),
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `mock-2-eng-patriot-fighter-${i}`,
        threatName: `J-16 Fighter [W2-${i + 1}]`,
        threatType: 'FIGHTER_AIRCRAFT',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: true,
        probability: 0.85,
        cost: 8.5,
        interceptTime: 48,
      })),
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `mock-2-eng-patriot-cruise-${i}`,
        threatName: `Tomahawk Cruise [W1-${i + 1}]`,
        threatType: 'CRUISE_MISSILE',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: true,
        probability: 0.82,
        cost: 4.5,
        interceptTime: 28,
      })),
      ...Array.from({ length: 3 }).map((_, i) => ({
        id: `mock-2-eng-barak-cruise-${i}`,
        threatName: `Kh-101 Cruise [W2-${i + 1}]`,
        threatType: 'CRUISE_MISSILE',
        systemName: 'Barak 8 ER',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India / Israel',
        success: true,
        probability: 0.86,
        cost: 2.2,
        interceptTime: 24,
      })),
      ...Array.from({ length: 4 }).map((_, i) => ({
        id: `mock-2-eng-akash-drone-${i}`,
        threatName: `Recon UAV [W1-${i + 1}]`,
        threatType: 'UAV',
        systemName: 'Akash Prime',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India',
        success: true,
        probability: 0.8,
        cost: 0.35,
        interceptTime: 14,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-2-eng-spyder-drone-${i}`,
        threatName: `Harop Loitering [W2-${i + 1}]`,
        threatType: 'UAV',
        systemName: 'SPYDER',
        systemCategory: 'SHORT_RANGE',
        country: 'Israel',
        success: true,
        probability: 0.84,
        cost: 0.8,
        interceptTime: 10,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-2-eng-fail-fighter-${i}`,
        threatName: `Su-35 Flanker [W1-${i + 4}]`,
        threatType: 'FIGHTER_AIRCRAFT',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: false,
        probability: 0.8,
        cost: 8.5,
        interceptTime: 55,
      }))
    ]
  },
  {
    id: 'mock-sim-3',
    name: 'Operation Hypersonic Aegis',
    createdAt: '2026-07-14T08:45:00.000Z',
    completedAt: '2026-07-14T08:48:00.000Z',
    duration: 120,
    scenarioName: 'Hypersonic Saturation Threat',
    status: 'COMPLETED',
    weather: 'CLEAR',
    ecmLevel: 0,
    totalThreats: 14,
    threatsDetected: 12,
    threatsIntercepted: 6,
    threatsImpacted: 8,
    interceptionRate: 6 / 14,
    detectionRate: 12 / 14,
    totalCost: 52.0,
    radarsDestroyed: 2,
    engagements: [
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-3-eng-hypersonic-impact-${i}`,
        threatName: `Zircon Hypersonic [W1-${i + 1}]`,
        threatType: 'HYPERSONIC_MISSILE',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: false,
        probability: 0.25,
        cost: 8.5,
        interceptTime: 15,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-3-eng-hypersonic-impact-s400-${i}`,
        threatName: `Zircon Hypersonic [W1-${i + 3}]`,
        threatType: 'HYPERSONIC_MISSILE',
        systemName: 'S-400 Triumf',
        systemCategory: 'LONG_RANGE',
        country: 'Russia',
        success: false,
        probability: 0.3,
        cost: 10.0,
        interceptTime: 14,
      })),
      {
        id: 'mock-3-eng-hypersonic-success-patriot',
        threatName: 'Zircon Hypersonic [W1-5]',
        threatType: 'HYPERSONIC_MISSILE',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: true,
        probability: 0.25,
        cost: 8.5,
        interceptTime: 18,
      },
      {
        id: 'mock-3-eng-hypersonic-success-s400',
        threatName: 'Zircon Hypersonic [W1-6]',
        threatType: 'HYPERSONIC_MISSILE',
        systemName: 'S-400 (Indian Configuration)',
        systemCategory: 'LONG_RANGE',
        country: 'India',
        success: true,
        probability: 0.35,
        cost: 10.0,
        interceptTime: 17,
      },
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-3-eng-ballistic-success-${i}`,
        threatName: `DF-21D Ballistic [W2-${i + 1}]`,
        threatType: 'BALLISTIC_MISSILE',
        systemName: 'Patriot PAC-3',
        systemCategory: 'LONG_RANGE',
        country: 'USA',
        success: true,
        probability: 0.72,
        cost: 8.5,
        interceptTime: 32,
      })),
      ...Array.from({ length: 2 }).map((_, i) => ({
        id: `mock-3-eng-ballistic-fail-${i}`,
        threatName: `DF-21D Ballistic [W2-${i + 3}]`,
        threatType: 'BALLISTIC_MISSILE',
        systemName: 'S-400 Triumf',
        systemCategory: 'LONG_RANGE',
        country: 'Russia',
        success: false,
        probability: 0.75,
        cost: 10.0,
        interceptTime: 30,
      })),
      {
        id: 'mock-3-eng-arm-hit-s400',
        threatName: 'AGM-88 HARM',
        threatType: 'ANTI_RADIATION_MISSILE',
        systemName: 'S-400 Radar',
        systemCategory: 'RADAR',
        country: 'Russia',
        success: false,
        probability: 0.15,
        cost: 0.0,
        interceptTime: 12,
      },
      {
        id: 'mock-3-eng-arm-hit-patriot',
        threatName: 'Kh-31P ARM',
        threatType: 'ANTI_RADIATION_MISSILE',
        systemName: 'Patriot MPQ-65 Radar',
        systemCategory: 'RADAR',
        country: 'USA',
        success: false,
        probability: 0.2,
        cost: 0.0,
        interceptTime: 11,
      },
      {
        id: 'mock-3-eng-arm-intercept-1',
        threatName: 'AGM-88 HARM [Escort]',
        threatType: 'ANTI_RADIATION_MISSILE',
        systemName: 'Akash-NG',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India',
        success: true,
        probability: 0.7,
        cost: 0.45,
        interceptTime: 8,
      },
      {
        id: 'mock-3-eng-arm-intercept-2',
        threatName: 'Kh-31P ARM [Escort]',
        threatType: 'ANTI_RADIATION_MISSILE',
        systemName: 'Akash-NG',
        systemCategory: 'MEDIUM_RANGE',
        country: 'India',
        success: true,
        probability: 0.7,
        cost: 0.45,
        interceptTime: 9,
      }
    ]
  },
  ...Array.from({ length: 7 }).map((_, idx) => {
    const totalThreats = 10 + idx * 3;
    const intercepted = Math.round(totalThreats * (0.7 + Math.random() * 0.25));
    const cost = parseFloat((intercepted * (0.8 + Math.random() * 1.5)).toFixed(1));
    const day = 7 - idx;
    return {
      id: `mock-hist-${idx}`,
      name: `Historical Exercise ${idx + 1}`,
      createdAt: new Date(Date.now() - day * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - day * 24 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
      duration: 150 + idx * 10,
      scenarioName: 'Border Air Patrol',
      status: 'COMPLETED',
      weather: idx % 3 === 0 ? 'RAINY' : idx % 3 === 1 ? 'FOGGY' : 'CLEAR',
      ecmLevel: idx % 3,
      totalThreats,
      threatsDetected: totalThreats,
      threatsIntercepted: intercepted,
      threatsImpacted: totalThreats - intercepted,
      interceptionRate: intercepted / totalThreats,
      detectionRate: 1.0,
      totalCost: cost,
      radarsDestroyed: 0,
      engagements: Array.from({ length: intercepted }).map((_, engIdx) => {
        const systems = ['Akash', 'Patriot PAC-3', 'S-400 Triumf', 'MRSAM / Barak-8', 'SPYDER'];
        const sys = systems[engIdx % systems.length];
        return {
          id: `mock-hist-${idx}-eng-${engIdx}`,
          threatName: 'Cruise Missile',
          threatType: 'CRUISE_MISSILE',
          systemName: sys,
          systemCategory: getCategoryForSystem(sys),
          country: getCountryForSystem(sys),
          success: true,
          probability: 0.8,
          cost: cost / intercepted,
          interceptTime: 15,
        };
      })
    };
  })
];

// ---- Chart Card Sub-Component ----
function ChartCard({ title, children, subtitle }: { title: string; children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="card p-4 flex flex-col justify-between h-[320px] bg-[#131a2b]">
      <div>
        <h3 className="text-[11px] font-bold text-[#cbd5e1] tracking-wider uppercase font-mono">{title}</h3>
        {subtitle && <p className="text-[10px] text-[#64748b] font-mono mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 flex items-center justify-center min-h-0 mt-4 relative">
        {children}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'systems' | 'battles' | 'threats' | 'records'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Dynamic DB Data
  const [dbSimulations, setDbSimulations] = useState<any[]>([]);
  const [dbSystems, setDbSystems] = useState<any[]>([]);
  
  // Collapsible Filters Panel State
  const [isFilterPaneOpen, setIsFilterPaneOpen] = useState<boolean>(false);

  // Filter States
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [simulationScope, setSimulationScope] = useState<'last3' | 'all' | 'custom'>('last3');
  const [customSelectedSimIds, setCustomSelectedSimIds] = useState<string[]>([]);

  // Refined filter pane search and accordion states
  const [filterSearchCountry, setFilterSearchCountry] = useState<string>('');
  const [filterSearchWargame, setFilterSearchWargame] = useState<string>('');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    scope: true,
    countries: true,
    layers: true,
    battles: false,
  });

  // BI Interactive Cross-Highlighting State (Filter by clicking on charts)
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null);
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string | null>(null);
  
  // Selected Battle detail in tab
  const [selectedBattleId, setSelectedBattleId] = useState<string>('mock-sim-1');
  const [battleSearchQuery, setBattleSearchQuery] = useState<string>('');

  // What-If Analysis State
  const [whatIfThreatVol, setWhatIfThreatVol] = useState<number>(30);
  const [whatIfHypersonicPct, setWhatIfHypersonicPct] = useState<number>(10);
  const [whatIfEcm, setWhatIfEcm] = useState<number>(1);

  // Head-to-Head Compare State
  const [compareSystemA, setCompareSystemA] = useState<string>('S-400 Triumf');
  const [compareSystemB, setCompareSystemB] = useState<string>('Patriot PAC-3');

  // Drill-Down Expanded Rows Catalog
  const [expandedSimIds, setExpandedSimIds] = useState<string[]>([]);

  // Accordion toggle helper
  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Quick action selectors
  const selectAllCountries = () => setSelectedCountries(availableCountries);
  const clearAllCountries = () => setSelectedCountries([]);
  const selectAllLayers = () => setSelectedCategories(availableCategories);
  const clearAllLayers = () => setSelectedCategories([]);

  // Load live data from the server
  useEffect(() => {
    async function loadData() {
      try {
        const simRes = await api.simulations.list();
        const loadedSims = (simRes as any)?.data || simRes || [];
        if (Array.isArray(loadedSims)) {
          setDbSimulations(loadedSims);
        }

        const sysRes = await api.systems.list();
        const loadedSystems = (sysRes as any)?.data || sysRes || [];
        if (Array.isArray(loadedSystems)) {
          setDbSystems(loadedSystems);
        }
      } catch (err) {
        console.warn('Failed to load server data for analytics, using seeded fallbacks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Merge DB simulations into the standard format
  const allSimulations = useMemo(() => {
    const formattedDbSims = dbSimulations.map((sim: any) => {
      const results = sim.results || {};
      const engagements = (results.engagements || []).map((eng: any, idx: number) => {
        const sysName = eng.systemName || 'Defense Battery';
        return {
          id: eng.id || `${sim.id}-eng-${idx}`,
          threatName: eng.threatName || 'Intruder',
          threatType: eng.threatType || getThreatTypeFromName(eng.threatName || ''),
          systemName: sysName,
          systemCategory: getCategoryForSystem(sysName),
          country: getCountryForSystem(sysName),
          success: eng.success ?? true,
          probability: eng.probability || 0.8,
          cost: eng.cost || 1.5,
          interceptTime: eng.interceptTime || 12,
        };
      });

      return {
        id: sim.id,
        name: sim.name || `Simulation ${sim.id.substring(0, 6)}`,
        createdAt: sim.createdAt,
        completedAt: sim.completedAt || sim.createdAt,
        duration: sim.duration || 120,
        scenarioName: sim.scenario?.name || 'Tactical Sandbox',
        status: sim.status,
        weather: sim.config?.weatherCondition || 'CLEAR',
        ecmLevel: sim.config?.ecmLevel || 0,
        totalThreats: results.totalThreats || engagements.length || 5,
        threatsDetected: results.threatsDetected || engagements.length || 5,
        threatsIntercepted: results.threatsIntercepted || engagements.filter((e: any) => e.success).length || 4,
        threatsImpacted: results.threatsImpacted || engagements.filter((e: any) => !e.success).length || 1,
        interceptionRate: results.interceptionRate ?? 0.8,
        detectionRate: results.detectionRate ?? 0.9,
        totalCost: results.totalCost || engagements.reduce((sum: number, e: any) => sum + e.cost, 0) || 5.0,
        radarsDestroyed: results.radarsDestroyed || 0,
        engagements,
      };
    });

    const all = [...formattedDbSims, ...MOCK_SIMULATIONS];
    const seen = new Set();
    return all.filter(sim => {
      const duplicate = seen.has(sim.name);
      seen.add(sim.name);
      return !duplicate;
    });
  }, [dbSimulations]);

  // Unique lists
  const availableCountries = useMemo(() => {
    const list = new Set<string>();
    allSimulations.forEach((sim: any) => {
      sim.engagements.forEach((eng: any) => {
        if (eng.country) list.add(eng.country);
      });
    });
    return Array.from(list).sort();
  }, [allSimulations]);

  const availableCategories = ['LONG_RANGE', 'MEDIUM_RANGE', 'SHORT_RANGE', 'VERY_SHORT_RANGE', 'ANTI_DRONE', 'RADAR'];

  // Apply scope simulation filtering first
  const scopeSimulations = useMemo(() => {
    let sims = [...allSimulations].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (simulationScope === 'last3') {
      return sims.slice(0, 3);
    } else if (simulationScope === 'custom') {
      if (customSelectedSimIds.length > 0) {
        return sims.filter((s: any) => customSelectedSimIds.includes(s.id));
      }
      return sims.slice(0, 3);
    }
    return sims;
  }, [allSimulations, simulationScope, customSelectedSimIds]);

  // Apply country, category AND dynamic chart-clicks cross-highlighting filters
  const filteredData = useMemo(() => {
    let activeEngagements = scopeSimulations.flatMap((s: any) => s.engagements);

    // 1. Sidebar filters
    if (selectedCountries.length > 0) {
      activeEngagements = activeEngagements.filter((e: any) => selectedCountries.includes(e.country));
    }
    if (selectedCategories.length > 0) {
      activeEngagements = activeEngagements.filter((e: any) => selectedCategories.includes(e.systemCategory));
    }

    // 2. BI In-Report Cross-Highlighting (clicked chart country filter)
    if (selectedCountryFilter) {
      activeEngagements = activeEngagements.filter((e: any) => e.country === selectedCountryFilter);
    }

    // 3. BI In-Report Cross-Highlighting (clicked chart system filter)
    if (selectedSystemFilter) {
      activeEngagements = activeEngagements.filter((e: any) => e.systemName === selectedSystemFilter);
    }

    // Calculate metrics
    const totalEngaged = activeEngagements.length;
    const successfulIntercepts = activeEngagements.filter((e: any) => e.success).length;
    const failedIntercepts = totalEngaged - successfulIntercepts;
    const interceptionRate = totalEngaged > 0 ? successfulIntercepts / totalEngaged : 0;
    const totalEngagementCost = activeEngagements.reduce((sum: number, e: any) => sum + e.cost, 0);
    const avgResponseTime = totalEngaged > 0 ? activeEngagements.reduce((sum: number, e: any) => sum + e.interceptTime, 0) / totalEngaged : 0;
    const avgProbability = totalEngaged > 0 ? activeEngagements.reduce((sum: number, e: any) => sum + e.probability, 0) / totalEngaged : 0;

    const totalRadars = scopeSimulations.reduce((sum: number, s: any) => sum + (s.totalThreats > 15 ? 3 : 2), 0);
    const radarsDestroyed = scopeSimulations.reduce((sum: number, s: any) => sum + s.radarsDestroyed, 0);
    const radarSurvivalRate = totalRadars > 0 ? Math.max(0, (totalRadars - radarsDestroyed) / totalRadars) : 1;

    return {
      engagements: activeEngagements,
      simulations: scopeSimulations,
      kpis: {
        totalEngaged,
        successfulIntercepts,
        failedIntercepts,
        interceptionRate,
        totalCost: totalEngagementCost,
        avgResponseTime,
        avgProbability,
        radarSurvivalRate,
        detectionRate: scopeSimulations.length > 0 
          ? scopeSimulations.reduce((sum: number, s: any) => sum + s.detectionRate, 0) / scopeSimulations.length 
          : 0.95,
      }
    };
  }, [scopeSimulations, selectedCountries, selectedCategories, selectedCountryFilter, selectedSystemFilter]);

  // What-If Interception Predictor Formula
  const whatIfPrediction = useMemo(() => {
    let rate = 0.88; // baseline
    rate -= whatIfEcm * 0.12; // Jamming penalty
    rate -= (whatIfHypersonicPct / 100) * 0.48; // Speed penalty
    rate -= (whatIfThreatVol / 100) * 0.10; // Saturation penalty

    // Incorporate positive active filter modifiers
    if (selectedCountries.includes('USA') || selectedCountries.includes('Russia')) rate += 0.04;
    if (selectedCategories.includes('LONG_RANGE')) rate += 0.03;

    const predictedRate = Math.max(0.05, Math.min(0.99, rate));
    
    // Average launcher unit cost $1.8M
    const predictedCost = whatIfThreatVol * predictedRate * 1.8; 

    return {
      rate: predictedRate,
      cost: predictedCost
    };
  }, [whatIfThreatVol, whatIfHypersonicPct, whatIfEcm, selectedCountries, selectedCategories]);

  // Sidebar Toggles
  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter((c: string) => c !== country) : [...prev, country]
    );
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter((c: string) => c !== cat) : [...prev, cat]
    );
  };

  const handleSimToggle = (id: string) => {
    setSimulationScope('custom');
    setCustomSelectedSimIds(prev => 
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  // BI Dynamic clicks handler
  const handleChartCountryClick = (country: string) => {
    setSelectedCountryFilter(prev => prev === country ? null : country);
  };

  const handleChartSystemClick = (system: string) => {
    setSelectedSystemFilter(prev => prev === system ? null : system);
  };

  const handleChartTrendClick = (battleId: string) => {
    setSelectedBattleId(battleId);
    setActiveTab('battles');
  };

  const resetFilters = () => {
    setSelectedCountries([]);
    setSelectedCategories([]);
    setSimulationScope('last3');
    setCustomSelectedSimIds([]);
    setSelectedCountryFilter(null);
    setSelectedSystemFilter(null);
  };

  // Expand row drill-down toggle
  const toggleRowExpansion = (simId: string) => {
    setExpandedSimIds(prev => 
      prev.includes(simId) ? prev.filter(id => id !== simId) : [...prev, simId]
    );
  };

  // Export report
  const exportCSV = () => {
    const dataToExport = filteredData.engagements.map((e: any) => ({
      EngagementID: e.id,
      DefenseSystem: e.systemName,
      Category: e.systemCategory,
      OriginCountry: e.country,
      ThreatName: e.threatName,
      ThreatClass: e.threatType,
      Outcome: e.success ? 'INTERCEPTED' : 'BREACHED',
      HitChancePercent: (e.probability * 100).toFixed(0),
      InterceptTimeSeconds: e.interceptTime,
      OperatingCostMillions: e.cost.toFixed(2),
    }));

    if (dataToExport.length === 0) return alert('No engagement data in selected scope.');

    const headers = Object.keys(dataToExport[0]) as (keyof typeof dataToExport[0])[];
    const csvRows = [
      headers.join(','),
      ...dataToExport.map((row: any) => 
        headers.map((header: any) => {
          const val = row[header];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
      )
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IADES_Analytics_Report_${simulationScope}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Detail battle selection sync
  useEffect(() => {
    if (filteredData.simulations.length > 0) {
      const activeIds = filteredData.simulations.map(s => s.id);
      if (!activeIds.includes(selectedBattleId)) {
        setSelectedBattleId(filteredData.simulations[0].id);
      }
    }
  }, [filteredData.simulations, selectedBattleId]);

  const activeBattleDetail = useMemo(() => {
    return filteredData.simulations.find((s: any) => s.id === selectedBattleId) || filteredData.simulations[0];
  }, [filteredData.simulations, selectedBattleId]);

  return (
    <div className="flex flex-col space-y-6 min-h-screen pb-16">
      
      {/* ============================================
          TOP STATUS PANEL (Airspace summary ribbon)
          ============================================ */}
      <div className="card p-3 bg-[#0d1220] border-[rgba(56,189,248,0.2)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
          <span className="font-mono text-[10px] text-[#cbd5e1] tracking-wider uppercase font-bold">
            Airspace Shield Status: Active // Radar Coverage Stable
          </span>
        </div>
        
        {/* active cross filters badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {simulationScope !== 'last3' && (
            <span className="badge badge-cyan text-[8px]">Scope: All Battles</span>
          )}
          {selectedCountries.map(c => (
            <span key={c} onClick={() => handleCountryToggle(c)} className="badge badge-amber text-[8px] cursor-pointer hover:bg-opacity-20 hover:line-through transition-all">Country: {c}</span>
          ))}
          {selectedCategories.map(cat => (
            <span key={cat} onClick={() => handleCategoryToggle(cat)} className="badge badge-green text-[8px] cursor-pointer hover:bg-opacity-20 hover:line-through transition-all">Layer: {cat.replace('_',' ')}</span>
          ))}
          {selectedCountryFilter && (
            <span key={selectedCountryFilter} onClick={() => setSelectedCountryFilter(null)} className="badge badge-red text-[8px] cursor-pointer hover:bg-opacity-20 hover:line-through transition-all">Highlight Country: {selectedCountryFilter}</span>
          )}
          {selectedSystemFilter && (
            <span key={selectedSystemFilter} onClick={() => setSelectedSystemFilter(null)} className="badge badge-red text-[8px] cursor-pointer hover:bg-opacity-20 hover:line-through transition-all">Highlight System: {selectedSystemFilter}</span>
          )}
          {(selectedCountries.length > 0 || selectedCategories.length > 0 || selectedCountryFilter || selectedSystemFilter || simulationScope !== 'last3') && (
            <button 
              onClick={resetFilters} 
              className="text-[9px] font-mono text-[#cbd5e1] hover:text-[#ef4444] font-bold border border-[#ef4444] px-1.5 py-0.25 bg-[#ef4444] bg-opacity-10 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT COLUMN: Collapsible filters panel and Compare panel */}
        <div className="w-full lg:w-[260px] flex-shrink-0 space-y-4">
          
          {/* Main Filters Widget */}
          <div className="card p-4 bg-[#131a2b] space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.08)] pb-2.5">
              <span className="font-mono text-[11px] font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                BI REPORT FILTERS
              </span>
              <button 
                onClick={() => setIsFilterPaneOpen(!isFilterPaneOpen)} 
                className="lg:hidden text-[10px] font-mono text-[#cbd5e1] border border-[rgba(148,163,184,0.15)] px-2 py-0.5 animate-pulse"
              >
                {isFilterPaneOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className={`${isFilterPaneOpen ? 'block' : 'hidden lg:block'} space-y-3`}>
              
              {/* ACCORDION 1: CHRONOLOGICAL SCOPE */}
              <div className="border border-[rgba(148,163,184,0.08)] bg-[#0b0f19] overflow-hidden">
                <button
                  onClick={() => toggleAccordion('scope')}
                  className="w-full flex items-center justify-between p-2.5 font-mono text-[10px] font-bold text-[#cbd5e1] hover:bg-[#131a2b] transition-colors"
                >
                  <span className="flex items-center gap-1.5">📅 Scope & Chronology</span>
                  <span className="text-[#64748b] text-[8px]">{openAccordions.scope ? '▼' : '▶'}</span>
                </button>
                {openAccordions.scope && (
                  <div className="p-2.5 border-t border-[rgba(148,163,184,0.08)] bg-[#131a2b] space-y-2">
                    <label className="text-[8.5px] font-mono text-[#64748b] uppercase">Scope Presets</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setSimulationScope('last3')}
                        className={`px-2 py-1 text-[9px] font-mono border text-center transition-all duration-150 cursor-pointer
                          ${simulationScope === 'last3' 
                            ? 'bg-[rgba(56,189,248,0.06)] border-[#38bdf8] text-[#38bdf8]' 
                            : 'border-[rgba(148,163,184,0.08)] text-[#64748b] hover:text-[#cbd5e1] hover:border-[rgba(148,163,184,0.15)]'
                          }`}
                      >
                        Last 3 Battles
                      </button>
                      <button
                        onClick={() => setSimulationScope('all')}
                        className={`px-2 py-1 text-[9px] font-mono border text-center transition-all duration-150 cursor-pointer
                          ${simulationScope === 'all' 
                            ? 'bg-[rgba(56,189,248,0.06)] border-[#38bdf8] text-[#38bdf8]' 
                            : 'border-[rgba(148,163,184,0.08)] text-[#64748b] hover:text-[#cbd5e1] hover:border-[rgba(148,163,184,0.15)]'
                          }`}
                      >
                        All Battles
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 2: GEOPOLITICAL ORIGIN */}
              <div className="border border-[rgba(148,163,184,0.08)] bg-[#0b0f19] overflow-hidden">
                <button
                  onClick={() => toggleAccordion('countries')}
                  className="w-full flex items-center justify-between p-2.5 font-mono text-[10px] font-bold text-[#cbd5e1] hover:bg-[#131a2b] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    🗺️ Geopolitical Origin 
                    {selectedCountries.length > 0 && (
                      <span className="ml-1 text-[8.5px] px-1 bg-[#38bdf8] bg-opacity-20 text-[#38bdf8]">
                        {selectedCountries.length}
                      </span>
                    )}
                  </span>
                  <span className="text-[#64748b] text-[8px]">{openAccordions.countries ? '▼' : '▶'}</span>
                </button>
                {openAccordions.countries && (
                  <div className="p-2.5 border-t border-[rgba(148,163,184,0.08)] bg-[#131a2b] space-y-2">
                    
                    {/* Search box */}
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={filterSearchCountry}
                      onChange={(e) => setFilterSearchCountry(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-[rgba(148,163,184,0.12)] px-2 py-1 text-[9px] font-mono text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8]"
                    />

                    {/* Quick controls */}
                    <div className="flex justify-between text-[8px] font-mono text-[#38bdf8] border-b border-[rgba(148,163,184,0.04)] pb-1.5">
                      <button onClick={selectAllCountries} className="hover:underline cursor-pointer">SELECT ALL</button>
                      <button onClick={clearAllCountries} className="hover:underline cursor-pointer">CLEAR ALL</button>
                    </div>

                    <div className="space-y-1 max-h-[130px] overflow-y-auto pr-1">
                      {availableCountries
                        .filter(c => c.toLowerCase().includes(filterSearchCountry.toLowerCase()))
                        .map(country => {
                          const isChecked = selectedCountries.includes(country);
                          const color = BI_COLORS[country as keyof typeof BI_COLORS] || '#cbd5e1';
                          return (
                            <button
                              key={country}
                              onClick={() => handleCountryToggle(country)}
                              className={`w-full flex items-center justify-between px-2 py-1 text-[9.5px] font-mono border rounded-none transition-all duration-150 cursor-pointer
                                ${isChecked 
                                  ? 'bg-[rgba(56,189,248,0.04)] border-[#38bdf8] border-opacity-70' 
                                  : 'border-[rgba(148,163,184,0.04)] hover:bg-[rgba(148,163,184,0.02)]'
                                }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: color }} />
                                <span className={isChecked ? 'text-[#38bdf8] font-bold' : 'text-[#cbd5e1]'}>{country}</span>
                              </div>
                              {isChecked && <span className="text-[#38bdf8] text-[8px]">✓</span>}
                            </button>
                          );
                        })}
                      {availableCountries.filter(c => c.toLowerCase().includes(filterSearchCountry.toLowerCase())).length === 0 && (
                        <div className="text-[8px] text-[#64748b] text-center font-mono py-2">No matches found.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 3: DEFENSE LAYER TIER */}
              <div className="border border-[rgba(148,163,184,0.08)] bg-[#0b0f19] overflow-hidden">
                <button
                  onClick={() => toggleAccordion('layers')}
                  className="w-full flex items-center justify-between p-2.5 font-mono text-[10px] font-bold text-[#cbd5e1] hover:bg-[#131a2b] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    🛡️ Defense Layer Tier
                    {selectedCategories.length > 0 && (
                      <span className="ml-1 text-[8.5px] px-1 bg-[#38bdf8] bg-opacity-20 text-[#38bdf8]">
                        {selectedCategories.length}
                      </span>
                    )}
                  </span>
                  <span className="text-[#64748b] text-[8px]">{openAccordions.layers ? '▼' : '▶'}</span>
                </button>
                {openAccordions.layers && (
                  <div className="p-2.5 border-t border-[rgba(148,163,184,0.08)] bg-[#131a2b] space-y-2">
                    
                    {/* Quick controls */}
                    <div className="flex justify-between text-[8px] font-mono text-[#38bdf8] border-b border-[rgba(148,163,184,0.04)] pb-1.5">
                      <button onClick={selectAllLayers} className="hover:underline cursor-pointer">SELECT ALL</button>
                      <button onClick={clearAllLayers} className="hover:underline cursor-pointer">CLEAR ALL</button>
                    </div>

                    <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                      {availableCategories.map(cat => {
                        const isChecked = selectedCategories.includes(cat);
                        const detail = LAYER_DESCRIPTIONS[cat as keyof typeof LAYER_DESCRIPTIONS] || { label: cat, desc: '' };
                        return (
                          <button
                            key={cat}
                            onClick={() => handleCategoryToggle(cat)}
                            className={`w-full flex flex-col items-start px-2 py-1.5 text-[9.5px] font-mono border rounded-none transition-all duration-150 cursor-pointer text-left
                              ${isChecked 
                                ? 'bg-[rgba(56,189,248,0.04)] border-[#38bdf8] border-opacity-70' 
                                : 'border-[rgba(148,163,184,0.04)] hover:bg-[rgba(148,163,184,0.02)]'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 w-full justify-between">
                              <span className={isChecked ? 'text-[#38bdf8] font-bold' : 'text-[#cbd5e1]'}>{detail.label}</span>
                              {isChecked && <span className="text-[#38bdf8] text-[8px]">✓</span>}
                            </div>
                            {detail.desc && <span className="text-[7.5px] text-[#64748b] mt-0.5 font-normal tracking-wide">{detail.desc}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 4: TACTICAL BATTLES CATALOG */}
              <div className="border border-[rgba(148,163,184,0.08)] bg-[#0b0f19] overflow-hidden">
                <button
                  onClick={() => toggleAccordion('battles')}
                  className="w-full flex items-center justify-between p-2.5 font-mono text-[10px] font-bold text-[#cbd5e1] hover:bg-[#131a2b] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    ⚔️ Battles Catalog
                    {simulationScope === 'custom' && customSelectedSimIds.length > 0 && (
                      <span className="ml-1 text-[8.5px] px-1 bg-[#38bdf8] bg-opacity-20 text-[#38bdf8]">
                        {customSelectedSimIds.length}
                      </span>
                    )}
                  </span>
                  <span className="text-[#64748b] text-[8px]">{openAccordions.battles ? '▼' : '▶'}</span>
                </button>
                {openAccordions.battles && (
                  <div className="p-2.5 border-t border-[rgba(148,163,184,0.08)] bg-[#131a2b] space-y-2">
                    
                    {/* Search box */}
                    <input
                      type="text"
                      placeholder="Search battles..."
                      value={filterSearchWargame}
                      onChange={(e) => setFilterSearchWargame(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-[rgba(148,163,184,0.12)] px-2 py-1 text-[9px] font-mono text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8]"
                    />

                    <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                      {allSimulations
                        .filter(s => s.name.toLowerCase().includes(filterSearchWargame.toLowerCase()))
                        .map(sim => {
                          const isSelected = simulationScope === 'all' || (simulationScope === 'last3' && scopeSimulations.some(s => s.id === sim.id)) || customSelectedSimIds.includes(sim.id);
                          return (
                            <button
                              key={sim.id}
                              onClick={() => handleSimToggle(sim.id)}
                              className={`w-full text-left px-2 py-1 text-[9px] font-mono border rounded-none block transition-all duration-150 cursor-pointer
                                ${isSelected 
                                  ? 'bg-[rgba(56,189,248,0.04)] border-[#38bdf8] border-opacity-70' 
                                  : 'border-[rgba(148,163,184,0.02)] opacity-50 hover:opacity-100 hover:bg-[rgba(148,163,184,0.02)]'
                                }`}
                            >
                              <div className="truncate text-[#cbd5e1] font-semibold">{sim.name}</div>
                              <div className="flex justify-between items-center text-[7px] text-[#64748b] mt-0.5">
                                <span>{formatDateShortStable(sim.createdAt)}</span>
                                <span className={sim.interceptionRate >= 0.8 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                                  {(sim.interceptionRate*100).toFixed(0)}% accuracy
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      {allSimulations.filter(s => s.name.toLowerCase().includes(filterSearchWargame.toLowerCase())).length === 0 && (
                        <div className="text-[8px] text-[#64748b] text-center font-mono py-2">No wargames found.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={exportCSV} 
                className="w-full py-2 bg-[#1b2340] border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#0b0f19] font-mono text-[9.5px] font-bold tracking-wider transition-all duration-150 cursor-pointer"
              >
                📥 DOWNLOAD DATABASE (CSV)
              </button>

            </div>
          </div>

          {/* Context Card */}
          <div className="card p-3 bg-[#131a2b] font-mono text-[9px] text-[#64748b] space-y-1">
            <div className="font-bold uppercase text-[#94a3b8] mb-1">Scope Info</div>
            <div className="flex justify-between">
              <span>Wargames:</span>
              <span className="text-[#38bdf8]">{filteredData.simulations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Engagements:</span>
              <span className="text-[#38bdf8]">{filteredData.kpis.totalEngaged}</span>
            </div>
            {selectedCountryFilter && (
              <div className="flex justify-between font-bold text-[#ef4444]">
                <span>Filter (Country):</span>
                <span>{selectedCountryFilter}</span>
              </div>
            )}
            {selectedSystemFilter && (
              <div className="flex justify-between font-bold text-[#ef4444]">
                <span>Filter (System):</span>
                <span>{selectedSystemFilter}</span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Tab Panel and Analytics Visuals */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Header & Tabs */}
          <div className="card p-4 bg-[#131a2b] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Tactical Intelligence Analytical Platform
              </h2>
              <p className="text-[10px] text-[#64748b] font-mono mt-0.5">
                Indian Air Defence Command // Power BI Report Module v2.1
              </p>
            </div>

            <div className="flex flex-wrap gap-1 bg-[#0b0f19] p-1 border border-[rgba(148,163,184,0.06)]">
              {[
                { id: 'overview', label: '📊 Overview Trend' },
                { id: 'systems', label: '🛡️ Capability Matrix' },
                { id: 'battles', label: '⚔️ Last 3 Battles' },
                { id: 'threats', label: '🎯 What-If Predictor' },
                { id: 'records', label: '📁 Records Catalog' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer
                    ${activeTab === tab.id 
                      ? 'bg-[#1b2340] text-[#38bdf8] border border-[rgba(56,189,248,0.2)]' 
                      : 'text-[#64748b] hover:text-[#94a3b8]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: 'Interception rate',
                value: `${(filteredData.kpis.interceptionRate * 100).toFixed(1)}%`,
                color: filteredData.kpis.interceptionRate >= 0.8 ? CHART_ACCENTS.green : CHART_ACCENTS.red,
                desc: `Target: 85% // ${filteredData.kpis.successfulIntercepts} hits`
              },
              {
                label: 'Radar detection',
                value: `${(filteredData.kpis.detectionRate * 100).toFixed(1)}%`,
                color: CHART_ACCENTS.cyan,
                desc: 'Radar track locks established'
              },
              {
                label: 'Mitigation Cost',
                value: `$${filteredData.kpis.totalCost.toFixed(1)}M`,
                color: CHART_ACCENTS.amber,
                desc: `Avg $${(filteredData.kpis.totalCost / Math.max(1, filteredData.kpis.successfulIntercepts)).toFixed(1)}M per hit`
              },
              {
                label: 'Radar Survivability',
                value: `${(filteredData.kpis.radarSurvivalRate * 100).toFixed(0)}%`,
                color: filteredData.kpis.radarSurvivalRate >= 0.8 ? CHART_ACCENTS.green : CHART_ACCENTS.red,
                desc: 'Percentage of radars intact'
              },
              {
                label: 'Response Velocity',
                value: `${filteredData.kpis.avgResponseTime.toFixed(1)}s`,
                color: CHART_ACCENTS.purple,
                desc: 'Average detection-to-neutralize'
              }
            ].map(k => (
              <div key={k.label} className="card p-3 bg-[#131a2b]">
                <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-wider">{k.label}</div>
                <div className="text-xl font-bold font-mono mt-1" style={{ color: k.color }}>{k.value}</div>
                <div className="text-[8px] font-mono text-[#475569] mt-1 truncate">{k.desc}</div>
              </div>
            ))}
          </div>

          {/* ============================================
              TAB VIEW RENDERS
              ============================================ */}

          {/* TAB 1: OVERVIEW TREND */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <ChartCard title="Interception & Detection Success Rate Trend" subtitle="Click a data point to drill down into that battle's details">
                  <TrendChart simulations={filteredData.simulations} onSelect={handleChartTrendClick} />
                </ChartCard>

                <ChartCard title="Cost Footprint per Simulation" subtitle="Total missile launching costs in Millions USD">
                  <CostAnalysisChart simulations={filteredData.simulations} />
                </ChartCard>

                <ChartCard title="Launcher Utilization Distribution" subtitle="Click a segment slice to filter report by that system model">
                  <UtilizationChart engagements={filteredData.engagements} onSelect={handleChartSystemClick} selectedSystem={selectedSystemFilter} />
                </ChartCard>

                <ChartCard title="Jamming (ECM) & Weather Impact Matrix" subtitle="Average performance under different environments">
                  <EnvironmentalChart simulations={filteredData.simulations} />
                </ChartCard>

              </div>
            </div>
          )}

          {/* TAB 2: CAPABILITY MATRIX (Systems compare) */}
          {activeTab === 'systems' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <ChartCard title="System Performance accuracy by Country" subtitle="Click a bar segment to filter dashboard metrics by country">
                  <CountryAccuracyChart engagements={filteredData.engagements} onSelect={handleChartCountryClick} selectedCountry={selectedCountryFilter} />
                </ChartCard>

                <ChartCard title="Tactical Parameter Radar Footprint" subtitle="Multi-parameter capabilities compared by origin">
                  <RadarCapabilitiesChart />
                </ChartCard>

              </div>

              {/* Head-to-Head Compare Feature */}
              <div className="card p-4 bg-[#131a2b] space-y-4">
                <div className="border-b border-[rgba(148,163,184,0.06)] pb-2">
                  <h3 className="text-[11px] font-bold text-[#cbd5e1] tracking-wider uppercase font-mono">Head-to-Head Tactical Comparator</h3>
                  <p className="text-[10px] text-[#64748b] font-mono">Select any two air defense systems to compare performance metrics and parameters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Select System A */}
                  <div className="card p-3 bg-[#0d1220] border-[rgba(148,163,184,0.06)]">
                    <label className="text-[9px] font-mono text-[#64748b] uppercase">System Battery A</label>
                    <select
                      value={compareSystemA}
                      onChange={(e) => setCompareSystemA(e.target.value)}
                      className="w-full bg-[#131a2b] border border-[rgba(148,163,184,0.15)] text-[#cbd5e1] px-2 py-1.5 mt-1 font-mono text-[11px] focus:outline-none"
                    >
                      {Object.keys(COMPARE_SYSTEMS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>

                    <div className="mt-4 space-y-2 font-mono text-[10px]">
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Origin:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemA].country}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Maximum Range:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemA].range}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Maximum Altitude:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemA].alt}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Accuracy Rating:</span>
                        <span className="font-bold text-[#22c55e]">{COMPARE_SYSTEMS[compareSystemA].accuracy}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Regiment Cost:</span>
                        <span className="font-bold text-[#eab308]">{COMPARE_SYSTEMS[compareSystemA].cost}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Fired Interceptor Speed:</span>
                        <span className="font-bold text-[#38bdf8]">{COMPARE_SYSTEMS[compareSystemA].speed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Select System B */}
                  <div className="card p-3 bg-[#0d1220] border-[rgba(148,163,184,0.06)]">
                    <label className="text-[9px] font-mono text-[#64748b] uppercase">System Battery B</label>
                    <select
                      value={compareSystemB}
                      onChange={(e) => setCompareSystemB(e.target.value)}
                      className="w-full bg-[#131a2b] border border-[rgba(148,163,184,0.15)] text-[#cbd5e1] px-2 py-1.5 mt-1 font-mono text-[11px] focus:outline-none"
                    >
                      {Object.keys(COMPARE_SYSTEMS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>

                    <div className="mt-4 space-y-2 font-mono text-[10px]">
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Origin:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemB].country}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Maximum Range:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemB].range}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Maximum Altitude:</span>
                        <span className="font-bold text-[#cbd5e1]">{COMPARE_SYSTEMS[compareSystemB].alt}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Accuracy Rating:</span>
                        <span className="font-bold text-[#22c55e]">{COMPARE_SYSTEMS[compareSystemB].accuracy}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Regiment Cost:</span>
                        <span className="font-bold text-[#eab308]">{COMPARE_SYSTEMS[compareSystemB].cost}</span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(148,163,184,0.02)] pb-1">
                        <span className="text-[#64748b]">Fired Interceptor Speed:</span>
                        <span className="font-bold text-[#38bdf8]">{COMPARE_SYSTEMS[compareSystemB].speed}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Compare deltas */}
                <div className="card p-3 bg-[#0b0f19] border-[#38bdf8] border-opacity-20 font-mono text-[10px] space-y-2">
                  <div className="font-bold text-[#38bdf8] uppercase">Comparator Intelligence Output</div>
                  <div className="text-[#cbd5e1] leading-relaxed">
                    Comparing <span className="text-white font-bold">{compareSystemA}</span> (Origin: {COMPARE_SYSTEMS[compareSystemA].country}) vs <span className="text-white font-bold">{compareSystemB}</span> (Origin: {COMPARE_SYSTEMS[compareSystemB].country}):
                    <br />
                    • <span className="text-[#38bdf8] font-bold">{compareSystemA}</span> deployment range is <span className="text-white font-bold">{COMPARE_SYSTEMS[compareSystemA].range}</span>, while <span className="text-[#38bdf8] font-bold">{compareSystemB}</span> covers <span className="text-white font-bold">{COMPARE_SYSTEMS[compareSystemB].range}</span>.
                    <br />
                    • <span className="text-[#38bdf8] font-bold">{compareSystemA}</span> has a stated accuracy rating of <span className="text-white font-bold">{COMPARE_SYSTEMS[compareSystemA].accuracy}</span>; <span className="text-[#38bdf8] font-bold">{compareSystemB}</span> accuracy rating is <span className="text-white font-bold">{COMPARE_SYSTEMS[compareSystemB].accuracy}</span>.
                    <br />
                    • <span className="text-[#38bdf8] font-bold">Tactical Guidance</span>: {COMPARE_SYSTEMS[compareSystemA].bestAgainst}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: LAST 3 BATTLES */}
          {activeTab === 'battles' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredData.simulations.slice(0, 3).map((sim, i) => {
                  const isActive = activeBattleDetail?.id === sim.id;
                  return (
                    <div
                      key={sim.id}
                      onClick={() => setSelectedBattleId(sim.id)}
                      className={`card p-4 cursor-pointer transition-all duration-200 border-l-[3px] 
                        ${isActive 
                          ? 'bg-[#1b2340] border-l-[#38bdf8] border-opacity-100 shadow-lg scale-[1.01]' 
                          : 'bg-[#131a2b] border-l-transparent hover:border-l-[rgba(148,163,184,0.3)]'
                        }`}
                    >
                      <div className="text-[8px] font-mono text-[#64748b] tracking-wider uppercase mb-1">
                        Wargame #{i + 1} // {formatDateShortStable(sim.createdAt)}
                      </div>
                      <div className="font-bold text-sm text-[#cbd5e1] truncate">{sim.name}</div>
                      <div className="text-[10px] text-[#475569] font-mono truncate mt-0.5">Scenario: {sim.scenarioName}</div>
                      
                      <div className="flex items-center justify-between mt-3 text-[10px] font-mono">
                        <div>
                          <span className="text-[#64748b]">Accuracy:</span>{' '}
                          <span className={sim.interceptionRate >= 0.8 ? 'text-[#22c55e] font-bold' : sim.interceptionRate >= 0.5 ? 'text-[#eab308]' : 'text-[#ef4444]'}>
                            {(sim.interceptionRate * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[#64748b]">Spend:</span>{' '}
                          <span className="text-[#38bdf8] font-bold">${sim.totalCost.toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeBattleDetail ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Info Column */}
                  <div className="card p-4 bg-[#131a2b] space-y-4 lg:col-span-1">
                    <div>
                      <h4 className="text-[10px] font-mono font-semibold tracking-wider text-[#475569] uppercase">Selected Battle Card</h4>
                      <h2 className="text-base font-bold text-white mt-1">{activeBattleDetail.name}</h2>
                      <p className="text-[10px] text-[#94a3b8] font-mono mt-1">Logged: {formatDateStable(activeBattleDetail.createdAt, true)}</p>
                    </div>

                    <div className="space-y-2.5 font-mono text-[10px] border-t border-[rgba(148,163,184,0.06)] pt-3 text-[#cbd5e1]">
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Intrusion Wave Status:</span>
                        <span className="text-white font-bold">{activeBattleDetail.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Engagements Run:</span>
                        <span className="text-[#38bdf8]">{activeBattleDetail.engagements.length} intercepts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Weather System:</span>
                        <span className="text-white font-bold">{activeBattleDetail.weather}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">Jamming ECM:</span>
                        <span className="text-[#ef4444] font-bold">Level {activeBattleDetail.ecmLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#64748b]">System Outages:</span>
                        <span className="text-[#ef4444] font-bold">{activeBattleDetail.radarsDestroyed} Radar Destroyed</span>
                      </div>
                    </div>

                    {/* Placements */}
                    <div className="border-t border-[rgba(148,163,184,0.06)] pt-3">
                      <h4 className="text-[9px] font-mono font-semibold tracking-wider text-[#475569] uppercase mb-2">Deployed Assets</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set(activeBattleDetail.engagements.map((e: any) => e.systemName))).map((sys: any) => {
                          const country = getCountryForSystem(sys);
                          const color = BI_COLORS[country as keyof typeof BI_COLORS] || '#64748b';
                          return (
                            <span 
                              key={sys} 
                              className="text-[9px] font-mono px-2 py-0.5 bg-[#0b0f19] border border-[rgba(148,163,184,0.06)] text-[#cbd5e1] flex items-center gap-1.5"
                            >
                              <div className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
                              {sys}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-[rgba(148,163,184,0.06)] pt-3">
                      <div className="flex justify-between items-center text-sm font-mono font-bold">
                        <span className="text-[#64748b] text-[10px]">Wargame Expenditure:</span>
                        <span className="text-[#eab308]">${activeBattleDetail.totalCost.toFixed(2)}M</span>
                      </div>
                    </div>
                  </div>

                  {/* Battle Detailed Visuals */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ChartCard title="Threat Wave Mitigations" subtitle="Neutralizations vs total launched in wargame">
                        <ThreatSuccessChart engagements={activeBattleDetail.engagements} />
                      </ChartCard>

                      <ChartCard title="Interception Timeline Chart" subtitle="Success rate progress throughout simulation">
                        <TimelineChart engagements={activeBattleDetail.engagements} />
                      </ChartCard>
                    </div>

                    {/* Step by step logs */}
                    <div className="card p-4 bg-[#131a2b]">
                      <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.06)] pb-2 mb-3">
                        <h4 className="text-[11px] font-mono font-bold text-[#cbd5e1] uppercase">Step-by-step Engagement Feed</h4>
                        <input
                          type="text"
                          placeholder="Search threat/system..."
                          value={battleSearchQuery}
                          onChange={(e) => setBattleSearchQuery(e.target.value)}
                          className="bg-[#0b0f19] border border-[rgba(148,163,184,0.12)] px-2 py-1 text-[9px] font-mono text-white placeholder-[#475569] focus:outline-none focus:border-[#38bdf8] w-48"
                        />
                      </div>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {activeBattleDetail.engagements
                          .filter((e: any) => {
                            const query = battleSearchQuery.toLowerCase();
                            return e.threatName.toLowerCase().includes(query) || e.systemName.toLowerCase().includes(query);
                          })
                          .map((eng: any, idx: number) => {
                            const statusColor = eng.success ? 'text-[#22c55e]' : 'text-[#ef4444]';
                            return (
                              <div 
                                key={eng.id} 
                                className="flex items-center justify-between py-1.5 px-2 bg-[#0b0f19] border border-[rgba(148,163,184,0.02)] text-[10px] font-mono text-[#cbd5e1]"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-[#64748b] text-[9px]">[{eng.interceptTime}s]</span>
                                  <span className="font-semibold text-white">{eng.systemName}</span>
                                  <span className="text-[#64748b]">launched at</span>
                                  <span className="text-[#cbd5e1]">{eng.threatName}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-[#64748b]">P(hit): {(eng.probability * 100).toFixed(0)}%</span>
                                  <span className="text-[#eab308]">${eng.cost.toFixed(1)}M</span>
                                  <span className={`font-bold ${statusColor}`}>{eng.success ? 'INTERCEPTED' : 'BREACH'}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="card p-8 text-center text-[#64748b] font-mono">Select a battle above to view reports.</div>
              )}

            </div>
          )}

          {/* TAB 4: WHAT-IF PREDICTOR SIMULATOR */}
          {activeTab === 'threats' && (
            <div className="space-y-6">
              
              {/* Simulator Slider Panel */}
              <div className="card p-4 bg-[#131a2b] space-y-6">
                <div className="border-b border-[rgba(148,163,184,0.06)] pb-2.5">
                  <h3 className="text-[11px] font-bold text-[#cbd5e1] tracking-wider uppercase font-mono">Tactical What-If Scenario Simulator</h3>
                  <p className="text-[10px] text-[#64748b] font-mono">Simulate airspace intrusion waves and calculate predicted interception statistics instantly</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Slider 1: Wave Volume */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#94a3b8] uppercase font-bold">Threat Wave Size</span>
                      <span className="text-[#38bdf8] font-bold">{whatIfThreatVol} Projectiles</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={whatIfThreatVol}
                      onChange={(e) => setWhatIfThreatVol(parseInt(e.target.value))}
                      className="w-full accent-[#38bdf8] bg-[#0b0f19] h-1"
                    />
                    <div className="flex justify-between text-[8px] text-[#475569] font-mono">
                      <span>5 (Isolated)</span>
                      <span>100 (Saturation)</span>
                    </div>
                  </div>

                  {/* Slider 2: Hypersonic Proportion */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#94a3b8] uppercase font-bold">Hypersonic Share</span>
                      <span className="text-[#ef4444] font-bold">{whatIfHypersonicPct}% of Wave</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={whatIfHypersonicPct}
                      onChange={(e) => setWhatIfHypersonicPct(parseInt(e.target.value))}
                      className="w-full accent-[#ef4444] bg-[#0b0f19] h-1"
                    />
                    <div className="flex justify-between text-[8px] text-[#475569] font-mono">
                      <span>0% (Subsonic)</span>
                      <span>100% (High-speed)</span>
                    </div>
                  </div>

                  {/* Slider 3: Jamming Level */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#94a3b8] uppercase font-bold">Electronic Jamming (ECM)</span>
                      <span className="text-[#eab308] font-bold">Level {whatIfEcm}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={whatIfEcm}
                      onChange={(e) => setWhatIfEcm(parseInt(e.target.value))}
                      className="w-full accent-[#eab308] bg-[#0b0f19] h-1"
                    />
                    <div className="flex justify-between text-[8px] text-[#475569] font-mono">
                      <span>Level 0 (None)</span>
                      <span>Level 3 (Severe)</span>
                    </div>
                  </div>

                </div>

                {/* Simulation Output Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[rgba(148,163,184,0.06)]">
                  
                  <div className="card p-3 bg-[#0d1220] border-[rgba(148,163,184,0.08)]">
                    <div className="text-[8px] font-mono text-[#64748b] uppercase">Predicted Accuracy</div>
                    <div className="text-2xl font-bold font-mono text-[#38bdf8] mt-1">
                      {(whatIfPrediction.rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-[8px] text-[#475569] font-mono mt-1">Expected Interception success rate</div>
                  </div>

                  <div className="card p-3 bg-[#0d1220] border-[rgba(148,163,184,0.08)]">
                    <div className="text-[8px] font-mono text-[#64748b] uppercase">Predicted Spending</div>
                    <div className="text-2xl font-bold font-mono text-[#eab308] mt-1">
                      ${whatIfPrediction.cost.toFixed(1)}M
                    </div>
                    <div className="text-[8px] text-[#475569] font-mono mt-1">Estimated missile inventory outlay</div>
                  </div>

                  <div className="card p-3 bg-[#0d1220] border-[rgba(148,163,184,0.08)]">
                    <div className="text-[8px] font-mono text-[#64748b] uppercase">Historical Baseline</div>
                    <div className="text-2xl font-bold font-mono text-[#22c55e] mt-1">
                      {(filteredData.kpis.interceptionRate * 100).toFixed(1)}%
                    </div>
                    <div className="text-[8px] text-[#475569] font-mono mt-1">Factual average of selected battles</div>
                  </div>

                </div>

                {/* Simulation Output Delta Comparison Alert */}
                <div className="card p-3 bg-[#0b0f19] border-[#eab308] border-opacity-20 flex gap-4 items-start font-mono text-[9px] text-[#cbd5e1] leading-relaxed">
                  <span className="text-lg">📈</span>
                  <div>
                    <span className="text-[#eab308] font-bold">PREDICTOR SUMMARY REPORT: </span>
                    With a threat wave size of <span className="text-white font-bold">{whatIfThreatVol}</span> containing <span className="text-white font-bold">{whatIfHypersonicPct}%</span> hypersonic units under ECM Level <span className="text-white font-bold">{whatIfEcm}</span> jamming, 
                    the air defense shield is predicted to intercept <span className="text-white font-bold">{(whatIfThreatVol * whatIfPrediction.rate).toFixed(0)}</span> threats and sustain <span className="text-[#ef4444] font-bold">{(whatIfThreatVol * (1 - whatIfPrediction.rate)).toFixed(0)} target impacts (breaches)</span>. 
                    Adding high-altitude Long Range layers (such as S-400 or Patriot PAC-3) will dynamically boost resistance parameters.
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: DRILL DOWN CATALOG RECORDS */}
          {activeTab === 'records' && (
            <div className="card p-4 bg-[#131a2b] space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.08)] pb-3">
                <div>
                  <h3 className="text-[11px] font-bold text-[#cbd5e1] tracking-wider uppercase font-mono">Simulation catalog wargame records</h3>
                  <p className="text-[10px] text-[#64748b] font-mono mt-0.5">Click any row below to expand and view detailed wargame parameters and timelines</p>
                </div>
                <button
                  onClick={exportCSV}
                  className="px-2.5 py-1.5 bg-[#1b2340] border border-[rgba(56,189,248,0.2)] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#0b0f19] font-mono text-[9px] transition-all duration-150 uppercase font-bold cursor-pointer"
                >
                  Download CSV Dataset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(148,163,184,0.08)] text-[#64748b]">
                      <th className="py-2.5 px-3"></th>
                      <th className="py-2.5">Wargame Name</th>
                      <th className="py-2.5">Scenario Class</th>
                      <th className="py-2.5">Total Threats</th>
                      <th className="py-2.5">Neutralized</th>
                      <th className="py-2.5">Accuracy</th>
                      <th className="py-2.5">Spend</th>
                      <th className="py-2.5">Environment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.simulations.map(sim => {
                      const isExpanded = expandedSimIds.includes(sim.id);
                      return (
                        <Fragment key={sim.id}>
                          {/* Main Row */}
                          <tr 
                            onClick={() => toggleRowExpansion(sim.id)}
                            className="border-b border-[rgba(148,163,184,0.04)] hover:bg-[rgba(148,163,184,0.02)] text-[#cbd5e1] cursor-pointer"
                          >
                            <td className="py-3 px-3 text-[#38bdf8] font-bold text-center w-8">
                              {isExpanded ? '▼' : '▶'}
                            </td>
                            <td className="py-3 font-bold text-white">{sim.name}</td>
                            <td className="py-3 text-[#94a3b8]">{sim.scenarioName}</td>
                            <td className="py-3">{sim.totalThreats} Items</td>
                            <td className="py-3">{sim.threatsIntercepted} Hits</td>
                            <td className="py-3 font-bold">
                              <span className={`px-1.5 py-0.5 text-[9px] ${
                                sim.interceptionRate >= 0.8 
                                  ? 'text-[#22c55e] bg-rgba(34,197,94,0.06)' 
                                  : 'text-[#ef4444] bg-rgba(239,68,68,0.06)'
                              }`}>
                                {(sim.interceptionRate * 100).toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-3 text-[#eab308] font-bold">${sim.totalCost.toFixed(1)}M</td>
                            <td className="py-3 text-[#38bdf8]">{sim.weather} (ECM {sim.ecmLevel})</td>
                          </tr>
                          
                          {/* Expanded Drill-Down Row */}
                          {isExpanded && (
                            <tr className="bg-[#0b0f19] border-b border-[rgba(148,163,184,0.08)]">
                              <td colSpan={8} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px]">
                                  
                                  {/* Placements */}
                                  <div>
                                    <div className="text-[8px] font-bold text-[#64748b] uppercase mb-2">Battery Grid Setup</div>
                                    <div className="space-y-1.5">
                                      {Array.from(new Set(sim.engagements.map((e: any) => e.systemName))).map((sys: any) => {
                                        const country = getCountryForSystem(sys);
                                        const color = BI_COLORS[country as keyof typeof BI_COLORS] || '#64748b';
                                        return (
                                          <div key={sys} className="flex items-center gap-2 text-white">
                                            <div className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
                                            <span>{sys} ({country})</span>
                                          </div>
                                        );
                                      })}
                                      {sim.engagements.length === 0 && <span className="text-[#475569]">No systems engaged.</span>}
                                    </div>
                                  </div>

                                  {/* Battle stats */}
                                  <div className="space-y-1 text-[#cbd5e1]">
                                    <div className="text-[8px] font-bold text-[#64748b] uppercase mb-2">Metrics Summary</div>
                                    <div>Duration: <span className="text-white">{sim.duration} seconds</span></div>
                                    <div>Radars Intact: <span className="text-white">{sim.radarsDestroyed === 0 ? 'Yes' : 'Outage Damage'}</span></div>
                                    <div>Jamming Severity: <span className="text-[#ef4444]">Level {sim.ecmLevel}</span></div>
                                    <div>Weather System: <span className="text-white">{sim.weather}</span></div>
                                  </div>

                                  {/* Quick Event timeline */}
                                  <div>
                                    <div className="text-[8px] font-bold text-[#64748b] uppercase mb-2">Neutralization timeline</div>
                                    <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                                      {sim.engagements.slice(0, 5).map((eng: any) => (
                                        <div key={eng.id} className="flex justify-between items-center text-[9px] border-b border-[rgba(255,255,255,0.02)] pb-0.5">
                                          <span className="text-[#64748b] font-normal">[{eng.interceptTime}s]</span>
                                          <span className="text-white truncate max-w-[80px]">{eng.systemName}</span>
                                          <span className={eng.success ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                                            {eng.success ? 'HIT' : 'BREACH'}
                                          </span>
                                        </div>
                                      ))}
                                      {sim.engagements.length > 5 && (
                                        <div className="text-center text-[8px] text-[#475569] pt-1">...and {sim.engagements.length - 5} more events</div>
                                      )}
                                    </div>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// ============================================
// CHART IMPLEMENTATION DETAILS (Chart.js refs)
// ============================================

// Chart 1: Historical trend
function TrendChart({ simulations, onSelect }: { simulations: any[]; onSelect: (battleId: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const sortedData = useMemo(() => {
    return [...simulations].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [simulations]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = sortedData.map((s: any) => s.name);
    const interceptRates = sortedData.map((s: any) => s.interceptionRate * 100);
    const detectionRates = sortedData.map((s: any) => s.detectionRate * 100);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Interception Accuracy (%)',
            data: interceptRates,
            borderColor: CHART_ACCENTS.green,
            backgroundColor: CHART_ACCENTS.greenDim,
            fill: true,
            tension: 0.25,
            borderWidth: 2,
            pointBackgroundColor: CHART_ACCENTS.green,
            pointRadius: 4,
          },
          {
            label: 'Detection Coverage (%)',
            data: detectionRates,
            borderColor: CHART_ACCENTS.cyan,
            backgroundColor: CHART_ACCENTS.cyanDim,
            fill: false,
            tension: 0.25,
            borderWidth: 1.5,
            pointBackgroundColor: CHART_ACCENTS.cyan,
            pointRadius: 3.5,
            borderDash: [5, 5],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0 && chartInstanceRef.current) {
            const index = elements[0].index;
            const simId = sortedData[index].id;
            onSelect(simId);
          }
        },
        plugins: {
          legend: { position: 'top', labels: { color: CHART_ACCENTS.textSecondary, font: { size: 10, family: 'JetBrains Mono' } } },
        },
        scales: {
          x: { ticks: { color: '#4b5563', font: { size: 8, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } },
          y: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor }, min: 0, max: 100 }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [sortedData, onSelect]);

  return <canvas ref={canvasRef} />;
}

// Chart 2: Cost Analysis Bar Chart
function CostAnalysisChart({ simulations }: { simulations: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const sortedData = useMemo(() => {
    return [...simulations].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [simulations]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = sortedData.map((s: any) => s.name);
    const costs = sortedData.map((s: any) => s.totalCost);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cost allocation ($M)',
            data: costs,
            backgroundColor: 'rgba(234, 179, 8, 0.45)',
            borderColor: CHART_ACCENTS.amber,
            borderWidth: 1.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: CHART_ACCENTS.textSecondary, font: { size: 10, family: 'JetBrains Mono' } } }
        },
        scales: {
          x: { ticks: { color: '#4b5563', font: { size: 8, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } },
          y: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [sortedData]);

  return <canvas ref={canvasRef} />;
}

// Chart 3: System Utilization (Doughnut)
function UtilizationChart({ engagements, onSelect, selectedSystem }: { engagements: any[]; onSelect: (sys: string) => void; selectedSystem: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const utilizationData = useMemo(() => {
    const counts: Record<string, number> = {};
    engagements.forEach((e: any) => {
      counts[e.systemName] = (counts[e.systemName] || 0) + 1;
    });
    
    const sorted = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
    const labels = sorted.map((item: any) => item[0]);
    const data = sorted.map((item: any) => item[1]);
    return { labels, data };
  }, [engagements]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (utilizationData.labels.length === 0) return;

    // Highlighting colors configuration
    const defaultColors = [
      '#dc2626', '#3b82f6', '#f97316', '#06b6d4', 
      '#a855f7', '#eab308', '#10b981', '#64748b'
    ];
    const borderColors = utilizationData.labels.map(l => l === selectedSystem ? '#38bdf8' : '#131a2b');
    const borderThickness = utilizationData.labels.map(l => l === selectedSystem ? 3 : 1.5);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: utilizationData.labels,
        datasets: [
          {
            data: utilizationData.data,
            backgroundColor: defaultColors.slice(0, utilizationData.labels.length),
            borderWidth: borderThickness,
            borderColor: borderColors,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0 && chartInstanceRef.current) {
            const index = elements[0].index;
            const systemName = chartInstanceRef.current.data.labels?.[index];
            if (systemName && typeof systemName === 'string') {
              onSelect(systemName);
            }
          }
        },
        plugins: {
          legend: { position: 'right', labels: { color: CHART_ACCENTS.textSecondary, font: { size: 9, family: 'JetBrains Mono' } } }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [utilizationData, onSelect, selectedSystem]);

  return engagements.length > 0 ? (
    <canvas ref={canvasRef} />
  ) : (
    <div className="text-center font-mono text-[10px] text-[#64748b]">No deployment engagements active in filtered scope.</div>
  );
}

// Chart 4: Environmental effectiveness (ECM vs Weather)
function EnvironmentalChart({ simulations }: { simulations: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const envStats = useMemo(() => {
    const weathers = ['CLEAR', 'RAINY', 'FOGGY'];
    const weatherRates = weathers.map(w => {
      const match = simulations.filter((s: any) => s.weather === w);
      if (match.length === 0) return 0;
      return (match.reduce((sum: number, s: any) => sum + s.interceptionRate, 0) / match.length) * 100;
    });

    const ecms = [0, 1, 2];
    const ecmRates = ecms.map(e => {
      const match = simulations.filter((s: any) => s.ecmLevel === e);
      if (match.length === 0) return 0;
      return (match.reduce((sum: number, s: any) => sum + s.interceptionRate, 0) / match.length) * 100;
    });

    return { weatherRates, ecmRates };
  }, [simulations]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Clear', 'Rainy', 'Foggy', 'Jamming 0', 'Jamming 1', 'Jamming 2'],
        datasets: [
          {
            label: 'Accuracy Success (%)',
            data: [...envStats.weatherRates, ...envStats.ecmRates],
            backgroundColor: [
              'rgba(6, 182, 212, 0.45)', 'rgba(6, 182, 212, 0.45)', 'rgba(6, 182, 212, 0.45)',
              'rgba(168, 85, 247, 0.45)', 'rgba(168, 85, 247, 0.45)', 'rgba(168, 85, 247, 0.45)'
            ],
            borderColor: [
              '#06b6d4', '#06b6d4', '#06b6d4',
              '#a855f7', '#a855f7', '#a855f7'
            ],
            borderWidth: 1.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } },
          y: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor }, min: 0, max: 100 }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [envStats]);

  return <canvas ref={canvasRef} />;
}

// Chart 5: Horizontal Country Accuracy Chart
function CountryAccuracyChart({ engagements, onSelect, selectedCountry }: { engagements: any[]; onSelect: (country: string) => void; selectedCountry: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const countryStats = useMemo(() => {
    const totals: Record<string, number> = {};
    const success: Record<string, number> = {};
    
    engagements.forEach((e: any) => {
      if (e.country) {
        totals[e.country] = (totals[e.country] || 0) + 1;
        if (e.success) {
          success[e.country] = (success[e.country] || 0) + 1;
        }
      }
    });

    const labels = Object.keys(totals);
    const rates = labels.map((c: string) => (success[c] / totals[c]) * 100);

    return { labels, rates };
  }, [engagements]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (countryStats.labels.length === 0) return;

    // border highlighting based on selected country
    const borderColors = countryStats.labels.map(c => c === selectedCountry ? '#38bdf8' : 'transparent');
    const borderThickness = countryStats.labels.map(c => c === selectedCountry ? 2 : 0);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: countryStats.labels,
        datasets: [
          {
            label: 'Neutralization accuracy (%)',
            data: countryStats.rates,
            backgroundColor: countryStats.labels.map((c: string) => BI_COLORS[c as keyof typeof BI_COLORS] + '70' || 'rgba(148, 163, 184, 0.4)'),
            borderColor: borderColors,
            borderWidth: borderThickness,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0 && chartInstanceRef.current) {
            const index = elements[0].index;
            const countryLabel = chartInstanceRef.current.data.labels?.[index];
            if (countryLabel && typeof countryLabel === 'string') {
              onSelect(countryLabel);
            }
          }
        },
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor }, min: 0, max: 100 },
          y: { ticks: { color: '#cbd5e1', font: { size: 9, family: 'JetBrains Mono' } }, grid: { display: false } }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [countryStats, onSelect, selectedCountry]);

  return engagements.length > 0 ? (
    <canvas ref={canvasRef} />
  ) : (
    <div className="text-center font-mono text-[10px] text-[#64748b]">Filter by a different scope to display country metrics.</div>
  );
}

// Chart 6: Radar Capabilities Chart (Static Capabilities comparison)
function RadarCapabilitiesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Coverage Range (km)', 'Max Target Volume', 'Kill Speed (Mach)', 'Hit Probability', 'Cost Efficiency', 'Reload Speed (s)'],
        datasets: [
          {
            label: 'Russia (e.g. S-400)',
            data: [95, 80, 90, 88, 65, 55],
            borderColor: BI_COLORS.Russia,
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderWidth: 2,
          },
          {
            label: 'USA (e.g. Patriot)',
            data: [75, 65, 80, 85, 55, 65],
            borderColor: BI_COLORS.USA,
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 2,
          },
          {
            label: 'Israel (e.g. Iron Dome)',
            data: [60, 95, 70, 92, 85, 75],
            borderColor: BI_COLORS.Israel,
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 2,
          },
          {
            label: 'India (e.g. Akash-NG)',
            data: [70, 75, 75, 84, 90, 80],
            borderColor: BI_COLORS.India,
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: CHART_ACCENTS.textSecondary, font: { size: 9, family: 'JetBrains Mono' } } }
        },
        scales: {
          r: {
            angleLines: { color: CHART_ACCENTS.gridColor },
            grid: { color: CHART_ACCENTS.gridColor },
            pointLabels: { color: CHART_ACCENTS.textSecondary, font: { size: 8, family: 'JetBrains Mono' } },
            ticks: { display: false }
          }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

// Chart 7: Selected battle timeline
function TimelineChart({ engagements }: { engagements: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const timelineData = useMemo(() => {
    const sorted = [...engagements].sort((a: any, b: any) => a.interceptTime - b.interceptTime);
    let cumulativeInterceptions = 0;
    const points = sorted.map((e: any, idx: number) => {
      if (e.success) cumulativeInterceptions++;
      const currentRate = (cumulativeInterceptions / (idx + 1)) * 100;
      return { x: e.interceptTime, y: currentRate };
    });
    return points;
  }, [engagements]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (timelineData.length === 0) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Cumulative Neutralization (%)',
            data: timelineData as any,
            borderColor: CHART_ACCENTS.green,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBackgroundColor: CHART_ACCENTS.green,
            pointRadius: 3,
            showLine: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { 
            type: 'linear', 
            position: 'bottom', 
            title: { display: true, text: 'Simulation Ticks (seconds)', color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } },
            ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, 
            grid: { color: CHART_ACCENTS.gridColor } 
          },
          y: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor }, min: 0, max: 100 }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [timelineData]);

  return engagements.length > 0 ? (
    <canvas ref={canvasRef} />
  ) : (
    <div className="text-center font-mono text-[10px] text-[#64748b]">No timeline points recorded in wargame logs.</div>
  );
}

// Chart 8: Selected battle Threat Success Rate Breakdown
function ThreatSuccessChart({ engagements }: { engagements: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const threatStats = useMemo(() => {
    const totals: Record<string, number> = {};
    const success: Record<string, number> = {};

    engagements.forEach((e: any) => {
      totals[e.threatType] = (totals[e.threatType] || 0) + 1;
      if (e.success) {
        success[e.threatType] = (success[e.threatType] || 0) + 1;
      }
    });

    const labels = Object.keys(totals);
    const dataFired = labels.map((t: string) => totals[t]);
    const dataIntercepted = labels.map((t: string) => success[t] || 0);

    return { labels, dataFired, dataIntercepted };
  }, [engagements]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (threatStats.labels.length === 0) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: threatStats.labels.map(l => l.replace('_MISSILE', '').replace('_AIRCRAFT', '')),
        datasets: [
          {
            label: 'Total Launched',
            data: threatStats.dataFired,
            backgroundColor: 'rgba(148, 163, 184, 0.2)',
            borderColor: '#64748b',
            borderWidth: 1,
          },
          {
            label: 'Intercepted',
            data: threatStats.dataIntercepted,
            backgroundColor: CHART_ACCENTS.cyan + '80',
            borderColor: CHART_ACCENTS.cyan,
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: CHART_ACCENTS.textSecondary, font: { size: 9, family: 'JetBrains Mono' } } }
        },
        scales: {
          x: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } },
          y: { ticks: { color: '#4b5563', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: CHART_ACCENTS.gridColor } }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [threatStats]);

  return engagements.length > 0 ? (
    <canvas ref={canvasRef} />
  ) : (
    <div className="text-center font-mono text-[10px] text-[#64748b]">No threat events matching filter configuration.</div>
  );
}
