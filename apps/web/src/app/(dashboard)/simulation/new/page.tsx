'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { getMissileThreatMultiplier } from '@iades/shared';

// ---- Data Catalogs ----
interface WeaponItem {
  name: string;
  type: 'CRUISE' | 'GLIDE_BOMB' | 'ROCKET';
  speed: number; // Mach
  range: number; // km
  rcs: number; // m²
  altitude: number; // meters
  cost: number; // USD Millions
  maxQty: number;
  weightSlots: number;
  set?: 1 | 2;
}

interface ThreatItem {
  id: string;
  name: string;
  type: 'BALLISTIC' | 'CRUISE' | 'FIGHTER' | 'UAV' | 'SWARM' | 'HYPERSONIC' | 'GLIDE_BOMB' | 'ROCKET';
  speed: number; // Mach
  altitude: number; // meters
  rcs: number; // m²
  threatScore: number;
  cost: number; // in USD Millions (base price without weapons)
  color: string;
  maxSlots?: number;
  weaponsCatalog?: WeaponItem[];
}

const THREAT_CATALOG: ThreatItem[] = [
  { id: 't1', name: 'Shaheen-III MRBM', type: 'BALLISTIC', speed: 12.0, altitude: 80000, rcs: 1.0, threatScore: 95, cost: 10.0, color: '#ef4444' },
  { id: 't2', name: 'Babur-3 LACM', type: 'CRUISE', speed: 0.8, altitude: 50, rcs: 0.05, threatScore: 80, cost: 2.0, color: '#f97316' },
  {
    id: 't3',
    name: 'JF-17 Block III',
    type: 'FIGHTER',
    speed: 1.6,
    altitude: 12000,
    rcs: 3.0,
    threatScore: 65,
    cost: 25.0,
    color: '#22d3ee',
    maxSlots: 7,
    weaponsCatalog: [
      { name: "Ra'ad ALCM", type: 'CRUISE', speed: 0.8, range: 350, rcs: 0.08, altitude: 100, cost: 1.5, maxQty: 1, weightSlots: 3, set: 1 },
      { name: 'CM-400AKG Supersonic Missile', type: 'CRUISE', speed: 4.0, range: 240, rcs: 0.1, altitude: 150, cost: 2.0, maxQty: 2, weightSlots: 3, set: 1 },
      { name: 'PL-15E BVRAAM', type: 'CRUISE', speed: 4.0, range: 145, rcs: 0.05, altitude: 100, cost: 1.0, maxQty: 4, weightSlots: 1, set: 2 },
      { name: 'PL-12 BVRAAM', type: 'CRUISE', speed: 4.0, range: 100, rcs: 0.05, altitude: 100, cost: 0.6, maxQty: 4, weightSlots: 1, set: 2 },
      { name: 'PL-10E SRAAM', type: 'CRUISE', speed: 3.0, range: 20, rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 2, weightSlots: 1, set: 2 },
      { name: 'LS-6 Glide Bomb', type: 'GLIDE_BOMB', speed: 0.9, range: 60, rcs: 0.15, altitude: 200, cost: 0.3, maxQty: 4, weightSlots: 1, set: 1 }
    ]
  },
  {
    id: 't3b',
    name: 'J-10C Fighter',
    type: 'FIGHTER',
    speed: 2.0,
    altitude: 15000,
    rcs: 1.5,
    threatScore: 75,
    cost: 35.0,
    color: '#38bdf8',
    maxSlots: 11,
    weaponsCatalog: [
      { name: 'KD-88 ALCM', type: 'CRUISE', speed: 0.85, range: 200, rcs: 0.08, altitude: 100, cost: 1.5, maxQty: 2, weightSlots: 3, set: 1 },
      { name: 'YJ-91 Anti-Radiation Missile', type: 'CRUISE', speed: 3.0, range: 120, rcs: 0.1, altitude: 120, cost: 1.2, maxQty: 2, weightSlots: 2, set: 1 },
      { name: 'PL-15E BVRAAM', type: 'CRUISE', speed: 4.0, range: 145, rcs: 0.05, altitude: 100, cost: 1.0, maxQty: 4, weightSlots: 1, set: 2 },
      { name: 'PL-12 BVRAAM', type: 'CRUISE', speed: 4.0, range: 100, rcs: 0.05, altitude: 100, cost: 0.6, maxQty: 4, weightSlots: 1, set: 2 },
      { name: 'PL-10E SRAAM', type: 'CRUISE', speed: 3.0, range: 20, rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 4, weightSlots: 1, set: 2 },
      { name: 'LS-6 Glide Bomb', type: 'GLIDE_BOMB', speed: 0.9, range: 60, rcs: 0.15, altitude: 200, cost: 0.3, maxQty: 4, weightSlots: 1, set: 1 }
    ]
  },
  {
    id: 't4',
    name: 'Wing Loong II UAV',
    type: 'UAV',
    speed: 0.28,
    altitude: 8000,
    rcs: 0.8,
    threatScore: 50,
    cost: 3.0,
    color: '#eab308',
    maxSlots: 8,
    weaponsCatalog: [
      { name: 'AR-1 Laser Guided Missile', type: 'ROCKET', speed: 1.1, range: 8, rcs: 0.02, altitude: 80, cost: 0.15, maxQty: 8, weightSlots: 1, set: 2 },
      { name: 'AR-2 Light Guided Missile', type: 'ROCKET', speed: 1.0, range: 8, rcs: 0.01, altitude: 80, cost: 0.08, maxQty: 16, weightSlots: 0.5, set: 2 },
      { name: 'BA-7 Blue Arrow Missile', type: 'ROCKET', speed: 1.2, range: 7, rcs: 0.03, altitude: 80, cost: 0.2, maxQty: 6, weightSlots: 1, set: 1 },
      { name: 'FT-9 Glide Bomb', type: 'GLIDE_BOMB', speed: 0.8, range: 5, rcs: 0.08, altitude: 100, cost: 0.1, maxQty: 6, weightSlots: 1, set: 1 }
    ]
  },
  { id: 't5', name: 'Coordinated Drone Swarm', type: 'SWARM', speed: 0.15, altitude: 200, rcs: 0.01, threatScore: 70, cost: 1.0, color: '#a3e635' },
  { id: 't6', name: 'Hypersonic Glide Vehicle', type: 'HYPERSONIC', speed: 8.0, altitude: 35000, rcs: 0.1, threatScore: 98, cost: 15.0, color: '#ff0055' },
];

interface MissileOption {
  name: string;
  range: number; // km
  speed: number; // Mach
  cost: number; // USD Millions
  accuracy: number; // 0-1
  minAlt: number; // meters
  maxAlt: number; // meters
  description: string;
}

interface DefenceItem {
  id: string;
  name: string;
  category: 'LONG_RANGE' | 'MEDIUM_RANGE' | 'SHORT_RANGE' | 'VERY_SHORT_RANGE' | 'RADAR';
  batteryCost: number; // USD Millions
  missileCost: number; // USD Millions per interceptor
  missileName: string;
  range: number; // km
  radarRange?: number; // km (max radar detection range)
  defaultAmmo?: number; // default missiles loaded on deployment
  minAlt: number; // meters
  maxAlt: number; // meters
  accuracy: number; // base 0-1
  color: string;
  speed: number; // Mach speed
  missileOptions?: MissileOption[];
  composition?: { name: string; type: string; qty: number }[];
}

const LOCAL_SYSTEM_THREAT_MULTIPLIERS: Record<string, Record<string, number>> = {
  'S-400': { BALLISTIC: 0.90, CRUISE: 0.95, UAV: 0.95, SWARM: 0.70, FIGHTER: 0.98, BOMBER: 0.98, ATTACK_HELICOPTER: 0.95, LOITERING_MUNITION: 0.90, TACTICAL_MISSILE: 0.95, HYPERSONIC: 0.35, GLIDE_BOMB: 0.80, ROCKET: 0.80 },
  'Barak 8 ER': { BALLISTIC: 0.65, CRUISE: 0.90, UAV: 0.92, SWARM: 0.65, FIGHTER: 0.95, BOMBER: 0.95, ATTACK_HELICOPTER: 0.92, LOITERING_MUNITION: 0.90, TACTICAL_MISSILE: 0.85, HYPERSONIC: 0.15, GLIDE_BOMB: 0.85, ROCKET: 0.85 },
  'Barak 8': { BALLISTIC: 0.40, CRUISE: 0.85, UAV: 0.90, SWARM: 0.60, FIGHTER: 0.92, BOMBER: 0.92, ATTACK_HELICOPTER: 0.90, LOITERING_MUNITION: 0.85, TACTICAL_MISSILE: 0.75, HYPERSONIC: 0.05, GLIDE_BOMB: 0.80, ROCKET: 0.80 },
  'SPYDER': { BALLISTIC: 0.00, CRUISE: 0.85, UAV: 0.95, SWARM: 0.75, FIGHTER: 0.90, BOMBER: 0.90, ATTACK_HELICOPTER: 0.95, LOITERING_MUNITION: 0.90, TACTICAL_MISSILE: 0.40, HYPERSONIC: 0.00, GLIDE_BOMB: 0.85, ROCKET: 0.85 },
  'Pechora': { BALLISTIC: 0.00, CRUISE: 0.55, UAV: 0.65, SWARM: 0.30, FIGHTER: 0.75, BOMBER: 0.80, ATTACK_HELICOPTER: 0.75, LOITERING_MUNITION: 0.40, TACTICAL_MISSILE: 0.20, HYPERSONIC: 0.00, GLIDE_BOMB: 0.40, ROCKET: 0.40 },
  'Akash-NG': { BALLISTIC: 0.50, CRUISE: 0.85, UAV: 0.90, SWARM: 0.60, FIGHTER: 0.92, BOMBER: 0.92, ATTACK_HELICOPTER: 0.90, LOITERING_MUNITION: 0.85, TACTICAL_MISSILE: 0.70, HYPERSONIC: 0.05, GLIDE_BOMB: 0.85, ROCKET: 0.85 },
  'Akash': { BALLISTIC: 0.00, CRUISE: 0.70, UAV: 0.80, SWARM: 0.40, FIGHTER: 0.85, BOMBER: 0.85, ATTACK_HELICOPTER: 0.80, LOITERING_MUNITION: 0.70, TACTICAL_MISSILE: 0.30, HYPERSONIC: 0.00, GLIDE_BOMB: 0.70, ROCKET: 0.70 },
  'QRSAM': { BALLISTIC: 0.00, CRUISE: 0.80, UAV: 0.90, SWARM: 0.70, FIGHTER: 0.88, BOMBER: 0.80, ATTACK_HELICOPTER: 0.90, LOITERING_MUNITION: 0.85, TACTICAL_MISSILE: 0.40, HYPERSONIC: 0.00, GLIDE_BOMB: 0.85, ROCKET: 0.85 },
  'VSHORAD': { BALLISTIC: 0.00, CRUISE: 0.78, UAV: 0.94, SWARM: 0.78, FIGHTER: 0.88, BOMBER: 0.88, ATTACK_HELICOPTER: 0.90, LOITERING_MUNITION: 0.85, TACTICAL_MISSILE: 0.30, HYPERSONIC: 0.00, GLIDE_BOMB: 0.82, ROCKET: 0.82 },
  'Igla-S': { BALLISTIC: 0.00, CRUISE: 0.72, UAV: 0.88, SWARM: 0.72, FIGHTER: 0.82, BOMBER: 0.82, ATTACK_HELICOPTER: 0.85, LOITERING_MUNITION: 0.80, TACTICAL_MISSILE: 0.20, HYPERSONIC: 0.00, GLIDE_BOMB: 0.78, ROCKET: 0.78 },
  'Anti-Drone': { BALLISTIC: 0.00, CRUISE: 0.00, UAV: 0.90, SWARM: 0.85, FIGHTER: 0.00, BOMBER: 0.00, ATTACK_HELICOPTER: 0.10, LOITERING_MUNITION: 0.90, TACTICAL_MISSILE: 0.00, HYPERSONIC: 0.00, GLIDE_BOMB: 0.90, ROCKET: 0.00 }
};

const localFindSystemKey = (systemName: string): string | undefined => {
  const name = systemName.toLowerCase();
  if (name.includes('s-400') || name.includes('s400')) return 'S-400';
  if (name.includes('barak 8 er') || name.includes('barak-8 er')) return 'Barak 8 ER';
  if (name.includes('barak-8') || name.includes('barak 8') || name.includes('mrsam')) return 'Barak 8';
  if (name.includes('spyder') || name.includes('syder')) return 'SPYDER';
  if (name.includes('pechora')) return 'Pechora';
  if (name.includes('akash-ng')) return 'Akash-NG';
  if (name.includes('akash')) return 'Akash';
  if (name.includes('qrsam')) return 'QRSAM';
  if (name.includes('vshorad manpad') || name.includes('vshorad (mistral)')) return 'VSHORAD';
  if (name.includes('vshorad') || name.includes('mistral')) return 'VSHORAD';
  if (name.includes('igla')) return 'Igla-S';
  if (name.includes('anti-drone') || name.includes('smash')) return 'Anti-Drone';
  return undefined;
};

const DEFENCE_CATALOG: DefenceItem[] = [
  {
    id: 'd1',
    name: 'S-400 Triumf Regiment',
    category: 'LONG_RANGE',
    batteryCost: 1000.0,
    missileCost: 2.5,
    missileName: '48N6DM',
    range: 400,
    radarRange: 600,
    defaultAmmo: 32,
    minAlt: 10,
    maxAlt: 30000,
    accuracy: 0.92,
    color: '#ef4444',
    speed: 6.0,
    missileOptions: [
      { name: '40N6E Ultra Long-Range', range: 400, speed: 12.0, cost: 2.5, accuracy: 0.92, minAlt: 10, maxAlt: 30000, description: 'Interceptions up to 400km.' },
      { name: '48N6DM Long-Range', range: 250, speed: 6.0, cost: 1.5, accuracy: 0.88, minAlt: 10, maxAlt: 25000, description: 'Standard high-altitude target missile.' },
      { name: '9M96E2 Medium-Range', range: 120, speed: 4.5, cost: 0.8, accuracy: 0.85, minAlt: 10, maxAlt: 20000, description: 'Agile hit-to-kill weapon.' }
    ],
    composition: [
      { name: '55K6E Combat Management Post', type: 'C2 Vehicle', qty: 1 },
      { name: '91N6E Acquisition Radar (S-band)', type: 'Surveillance Radar', qty: 1 },
      { name: '92N6E Grave Stone Radar (X-band)', type: 'Fire Control Radar', qty: 2 },
      { name: '5P85TE2 Self-Propelled Launcher', type: 'TEL Launcher (4 canisters)', qty: 8 }
    ]
  },
  {
    id: 'd2b',
    name: 'Barak 8 ER SAM Battery',
    category: 'MEDIUM_RANGE',
    batteryCost: 180.0,
    missileCost: 1.2,
    missileName: 'Barak-8 ER',
    range: 150,
    radarRange: 200,
    defaultAmmo: 24,
    minAlt: 15,
    maxAlt: 30000,
    accuracy: 0.88,
    color: '#f59e0b',
    speed: 3.0,
    composition: [
      { name: 'Mobile Command & Control (MCP)', type: 'C2 Station', qty: 1 },
      { name: 'MF-STAR AESA Radar', type: 'Active AESA Radar', qty: 1 },
      { name: 'Vertical Launcher Unit (VLU)', type: 'Launcher Truck (8 cells)', qty: 3 }
    ]
  },
  {
    id: 'd2',
    name: 'MRSAM / Barak-8 Battery',
    category: 'MEDIUM_RANGE',
    batteryCost: 150.0,
    missileCost: 1.2,
    missileName: 'Barak-8',
    range: 70,
    radarRange: 120,
    defaultAmmo: 24,
    minAlt: 15,
    maxAlt: 16000,
    accuracy: 0.85,
    color: '#f59e0b',
    speed: 4.0,
    missileOptions: [
      { name: 'Barak-8 Standard', range: 70, speed: 2.0, cost: 1.0, accuracy: 0.85, minAlt: 15, maxAlt: 12000, description: 'Local tactical area protection.' }
    ],
    composition: [
      { name: 'Mobile Command & Control (MCP)', type: 'C2 Station', qty: 1 },
      { name: 'MF-STAR Multi-Function Radar', type: 'Active AESA Radar', qty: 1 },
      { name: 'Vertical Launcher Unit (VLU)', type: 'Launcher Truck (8 cells)', qty: 3 }
    ]
  },
  {
    id: 'd3',
    name: 'Akash-NG Battery',
    category: 'MEDIUM_RANGE',
    batteryCost: 50.0,
    missileCost: 0.3,
    missileName: 'Akash-NG',
    range: 80,
    radarRange: 120,
    defaultAmmo: 12,
    minAlt: 30,
    maxAlt: 20000,
    accuracy: 0.85,
    color: '#eab308',
    speed: 3.0,
    missileOptions: [
      { name: 'Akash-NG Active Seeker', range: 80, speed: 3.5, cost: 0.3, accuracy: 0.85, minAlt: 30, maxAlt: 20000, description: 'Active RF terminal seeker.' },
      { name: 'Akash Standard Command', range: 30, speed: 2.5, cost: 0.2, accuracy: 0.75, minAlt: 30, maxAlt: 15000, description: 'PESA command guided legacy variant.' }
    ],
    composition: [
      { name: 'Battery Command Post (BCP)', type: 'Tactical BCP', qty: 1 },
      { name: '3D Active Electronically Scanned Radar', type: 'PESA/AESA Radar', qty: 1 },
      { name: 'Mobile Launcher Unit (ML)', type: 'TEL Trailer (3 cells)', qty: 4 }
    ]
  },
  {
    id: 'd3b',
    name: 'Pechora-2M SAM Battery',
    category: 'MEDIUM_RANGE',
    batteryCost: 15.0,
    missileCost: 0.1,
    missileName: '5V27DE',
    range: 35,
    radarRange: 50,
    defaultAmmo: 8,
    minAlt: 20,
    maxAlt: 20000,
    accuracy: 0.72,
    color: '#f59e0b',
    speed: 3.5,
    composition: [
      { name: 'UNV-2M Command Cabin', type: 'Guidance Cabin', qty: 1 },
      { name: 'Pechora-2M 5P73 TEL Launcher', type: 'TEL Launcher (2 rails)', qty: 4 }
    ]
  },
  {
    id: 'd4b',
    name: 'SPYDER SAM Battery',
    category: 'SHORT_RANGE',
    batteryCost: 80.0,
    missileCost: 0.5,
    missileName: 'Derby',
    range: 50,
    radarRange: 80,
    defaultAmmo: 16,
    minAlt: 20,
    maxAlt: 16000,
    accuracy: 0.82,
    color: '#00ff88',
    speed: 4.0,
    missileOptions: [
      { name: 'Derby Interceptor', range: 50, speed: 4.0, cost: 0.5, accuracy: 0.82, minAlt: 20, maxAlt: 16000, description: 'Active radar-homing interception.' },
      { name: 'Python-5 Interceptor', range: 20, speed: 4.0, cost: 0.3, accuracy: 0.82, minAlt: 20, maxAlt: 9000, description: 'Dual-band infrared point defence.' }
    ],
    composition: [
      { name: 'Mobile Command Post (MCP)', type: 'Tactical C2', qty: 1 },
      { name: 'EL/M-2106 ATAR 3D Radar', type: 'Surveillance Radar', qty: 1 },
      { name: 'SPYDER Mobile Launcher', type: 'TEL Launcher (4 rails)', qty: 4 }
    ]
  },
  {
    id: 'd4',
    name: 'QRSAM Battery',
    category: 'SHORT_RANGE',
    batteryCost: 20.0,
    missileCost: 0.15,
    missileName: 'QRSAM',
    range: 30,
    radarRange: 50,
    defaultAmmo: 18,
    minAlt: 30,
    maxAlt: 6000,
    accuracy: 0.82,
    color: '#00ff88',
    speed: 3.0,
    composition: [
      { name: 'Battery Surveillance Radar (BSR)', type: '3D AESA Radar', qty: 1 },
      { name: 'Battery Multifunction Radar (BMR)', type: 'Fire Control Radar', qty: 1 },
      { name: 'Quick Reaction Launcher (QRL)', type: 'TEL Launcher (6 cells)', qty: 3 }
    ]
  },
  {
    id: 'd5b',
    name: 'VSHORAD MANPADS Team',
    category: 'VERY_SHORT_RANGE',
    batteryCost: 0.15,
    missileCost: 0.08,
    missileName: 'DRDO VSHORAD',
    range: 6.5,
    radarRange: 10,
    defaultAmmo: 4,
    minAlt: 5,
    maxAlt: 15000,
    accuracy: 0.85,
    color: '#00b4d8',
    speed: 2.5,
    composition: [
      { name: 'DRDO VSHORAD Launcher', type: 'MANPADS Tube', qty: 4 },
      { name: 'Optical Target Sight', type: 'Thermal Visual sight', qty: 4 }
    ]
  },
  {
    id: 'd5',
    name: 'Igla-S MANPADS Team',
    category: 'VERY_SHORT_RANGE',
    batteryCost: 1.0,
    missileCost: 0.05,
    missileName: 'Igla-S',
    range: 6,
    radarRange: 10,
    defaultAmmo: 4,
    minAlt: 10,
    maxAlt: 15000,
    accuracy: 0.80,
    color: '#00b4d8',
    speed: 1.5,
    composition: [
      { name: 'Igla-S Launch Grip-stock', type: 'MANPADS Tube', qty: 4 },
      { name: 'Optical Target Pointer', type: 'Thermal Visual sight', qty: 4 }
    ]
  },
  {
    id: 'd6',
    name: 'Arudhra AESA Radar Station',
    category: 'RADAR',
    batteryCost: 100.0,
    missileCost: 0,
    missileName: 'None',
    range: 500,
    radarRange: 500,
    defaultAmmo: 0,
    minAlt: 0,
    maxAlt: 30000,
    accuracy: 0,
    color: '#6366f1',
    speed: 0,
    composition: [
      { name: 'Rotating AESA Antenna Unit', type: 'Radar Array', qty: 1 },
      { name: 'Signal Processing Container', type: 'Tactical Shelter', qty: 1 }
    ]
  },
];

type SimPhase = 'config' | 'procure_attacker' | 'procure_defender' | 'simulate' | 'report';

interface SelectedThreat {
  id: string;
  threat: ThreatItem;
  count: number;
  loadout: { [weaponName: string]: number };
}

interface SelectedDefence {
  id: string; // unique instance id
  system: DefenceItem;
  selectedMissile: MissileOption;
  missilesPurchased: number;
  x: number; // location coordinates 0-100 on map
  y: number;
  isDestroyed?: boolean;
  initialMissilesPurchased?: number;
  ballisticFiredCount?: number;
}

const getBatteryDefaultMissile = (system: DefenceItem): MissileOption => {
  if (system.missileOptions && system.missileOptions.length > 0) {
    return system.missileOptions[0];
  }
  return {
    name: system.missileName,
    range: system.range,
    speed: system.speed,
    cost: system.missileCost,
    accuracy: system.accuracy,
    minAlt: system.minAlt,
    maxAlt: system.maxAlt,
    description: `Standard interceptor for ${system.name}`
  };
};

// Visual engine interfaces
interface VisualThreat {
  id: string;
  threat: ThreatItem;
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  targetBatteryId?: string;
  initialDistance?: number;
  progress: number; // 0 to 1
  isDead: boolean;
  isLeaked: boolean;
  detected: boolean;
  isReturning?: boolean;
  retreated?: boolean;
  loadoutStatus?: {
    [wName: string]: {
      fired: number;
      total: number;
      weapon: WeaponItem;
    }
  };
  distanceToTarget?: number; // km
}

interface VisualInterceptor {
  id: string;
  batteryId?: string;
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetId: string;
  progress: number;
  accuracy: number;
  isDead: boolean;
  color: string;
  speed: number;
}

interface VisualLog {
  time: number;
  message: string;
  type: 'LAUNCH' | 'DETECTION' | 'INTERCEPT_SUCCESS' | 'INTERCEPT_FAIL' | 'BREACH' | 'INFO';
}

export default function SimulationPage() {
  const [phase, setPhase] = useState<SimPhase>('config');
  const [attackerBudget, setAttackerBudget] = useState(500); // USD Millions
  const defenderBudget = attackerBudget * 4; // Auto-scaling 4x

  // Weather/ECMs
  const [weather, setWeather] = useState<'CLEAR' | 'CLOUDY' | 'STORMY'>('CLEAR');
  const [ecm, setEcm] = useState<'NONE' | 'LOW' | 'HIGH'>('NONE');

  // Attacker list of selected weapons
  const [attackerProcured, setAttackerProcured] = useState<SelectedThreat[]>([]);
  // Defender list of placed defense batteries
  const [defenderProcured, setDefenderProcured] = useState<SelectedDefence[]>([]);

  // Validation warning state
  const [warning, setWarning] = useState<string | null>(null);
  
  // Track group battery counts as editable values (including empty string/0 during typing)
  const [groupQuantities, setGroupQuantities] = useState<Record<string, number | string>>({});

  // Interception engagements details for post-action report
  interface EngagementRecord {
    systemId: string;
    systemName: string;
    threatType: string;
    success: boolean;
  }
  const [engagements, setEngagements] = useState<EngagementRecord[]>([]);

  // Simulation controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 3 | 5 | 10>(1);
  const [simLogs, setSimLogs] = useState<VisualLog[]>([]);
  const [leakerCount, setLeakerCount] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [threatCountTotal, setThreatCountTotal] = useState(0);
  const [spentDefenderMissilesCost, setSpentDefenderMissilesCost] = useState(0);

  // Attacker Procurement Cost Calculation (Base + Loadout)
  const attackerTotalSpent = attackerProcured.reduce((sum, item) => {
    const countVal = Number(item.count) || 0;
    const loadoutCost = Object.entries(item.loadout).reduce((lSum, [wName, qty]) => {
      const weapon = item.threat.weaponsCatalog?.find(w => w.name === wName);
      return lSum + (weapon ? weapon.cost * (Number(qty) || 0) : 0);
    }, 0);
    return sum + (item.threat.cost + loadoutCost) * countVal;
  }, 0);

  // Defender Procurement Cost Calculation (Battery costs + Initial ammo purchases based on selected missile type)
  const defenderTotalSpent = defenderProcured.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * (Number(item.missilesPurchased) || 0)), 0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualThreatsRef = useRef<VisualThreat[]>([]);
  const visualInterceptorsRef = useRef<VisualInterceptor[]>([]);
  const simTimeRef = useRef(0);
  const defenderProcuredRef = useRef<SelectedDefence[]>([]);
  
  // Audio context placeholders for kinetic sound cues
  useEffect(() => {
    defenderProcuredRef.current = defenderProcured;
  }, [defenderProcured]);

  const addThreatToCart = (threat: ThreatItem) => {
    const itemCost = threat.cost;
    if (attackerTotalSpent + itemCost > attackerBudget) return;
    setAttackerProcured(prev => [
      ...prev,
      {
        id: `threat-instance-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        threat,
        count: 1,
        loadout: {}
      }
    ]);
  };

  const removeThreatFromCart = (instanceId: string) => {
    setAttackerProcured(prev => prev.filter(item => item.id !== instanceId));
  };

  const increaseThreatQuantity = (instanceId: string) => {
    setAttackerProcured(prev => {
      const target = prev.find(item => item.id === instanceId);
      if (!target) return prev;
      const loadoutCost = Object.entries(target.loadout).reduce((lSum, [wName, qty]) => {
        const weapon = target.threat.weaponsCatalog?.find(w => w.name === wName);
        return lSum + (weapon ? weapon.cost * (Number(qty) || 0) : 0);
      }, 0);
      const unitCost = target.threat.cost + loadoutCost;
      if (attackerTotalSpent + unitCost > attackerBudget) return prev;
      const currentVal = Number(target.count) || 0;
      return prev.map(item => item.id === instanceId ? { ...item, count: currentVal + 1 } : item);
    });
  };

  const decreaseThreatQuantity = (instanceId: string) => {
    setAttackerProcured(prev => {
      const existing = prev.find(item => item.id === instanceId);
      const currentVal = Number(existing?.count) || 0;
      if (existing && currentVal > 1) {
        return prev.map(item => item.id === instanceId ? { ...item, count: currentVal - 1 } : item);
      }
      return prev.filter(item => item.id !== instanceId);
    });
  };

  const setThreatWeaponQty = (instanceId: string, weaponName: string, val: number | string) => {
    setAttackerProcured(prev => {
      const target = prev.find(item => item.id === instanceId);
      if (!target || !target.threat.weaponsCatalog) return prev;

      const weapon = target.threat.weaponsCatalog.find(w => w.name === weaponName);
      if (!weapon) return prev;

      const numericVal = val === '' ? 0 : Number(val);
      if (numericVal < 0 || numericVal > weapon.maxQty) return prev;

      // Validate loadout constraints:
      // Ra'ad and CM-400AKG are mutually exclusive on JF-17 Block III (t3)
      if (target.threat.id === 't3' && numericVal > 0) {
        if (weaponName === "Ra'ad ALCM" && (Number(target.loadout['CM-400AKG Supersonic Missile']) || 0) > 0) {
          return prev;
        }
        if (weaponName === 'CM-400AKG Supersonic Missile' && (Number(target.loadout["Ra'ad ALCM"]) || 0) > 0) {
          return prev;
        }
      }

      // Check slot limits
      const nextLoadout = { ...target.loadout, [weaponName]: val as any };
      const totalSlots = Object.entries(nextLoadout).reduce((sum, [wName, qty]) => {
        const w = target.threat.weaponsCatalog?.find(item => item.name === wName);
        return sum + (w ? w.weightSlots * (Number(qty) || 0) : 0);
      }, 0);

      if (target.threat.maxSlots && totalSlots > target.threat.maxSlots) {
        return prev;
      }

      // Check budget limit
      const otherSpent = prev.reduce((sum, x) => {
        if (x.id === instanceId) return sum;
        const loadoutCost = Object.entries(x.loadout).reduce((lSum, [wName, q]) => {
          const w = x.threat.weaponsCatalog?.find(item => item.name === wName);
          return lSum + (w ? w.cost * (Number(q) || 0) : 0);
        }, 0);
        return sum + (x.threat.cost + loadoutCost) * (Number(x.count) || 0);
      }, 0);

      const thisLoadoutCost = Object.entries(nextLoadout).reduce((lSum, [wName, q]) => {
        const w = target.threat.weaponsCatalog?.find(item => item.name === wName);
        return lSum + (w ? w.cost * (Number(q) || 0) : 0);
      }, 0);

      const prospectiveTotal = otherSpent + (target.threat.cost + thisLoadoutCost) * (Number(target.count) || 0);
      if (prospectiveTotal > attackerBudget) return prev;

      return prev.map(item => item.id === instanceId ? { ...item, loadout: nextLoadout } : item);
    });
  };

  const adjustThreatWeapon = (instanceId: string, weaponName: string, delta: number) => {
    setAttackerProcured(prev => {
      const target = prev.find(item => item.id === instanceId);
      if (!target || !target.threat.weaponsCatalog) return prev;

      const weapon = target.threat.weaponsCatalog.find(w => w.name === weaponName);
      if (!weapon) return prev;

      const currentQty = Number(target.loadout[weaponName]) || 0;
      const newQty = Math.max(0, Math.min(weapon.maxQty, currentQty + delta));
      if (currentQty === newQty) return prev;

      // Validate loadout constraints:
      // Ra'ad and CM-400AKG are mutually exclusive on JF-17 Block III (t3)
      if (target.threat.id === 't3') {
        if (weaponName === "Ra'ad ALCM" && newQty > 0 && (Number(target.loadout['CM-400AKG Supersonic Missile']) || 0) > 0) {
          return prev;
        }
        if (weaponName === 'CM-400AKG Supersonic Missile' && newQty > 0 && (Number(target.loadout["Ra'ad ALCM"]) || 0) > 0) {
          return prev;
        }
      }

      // Check slot limits
      const nextLoadout = { ...target.loadout, [weaponName]: newQty };
      const totalSlots = Object.entries(nextLoadout).reduce((sum, [wName, qty]) => {
        const w = target.threat.weaponsCatalog?.find(item => item.name === wName);
        return sum + (w ? w.weightSlots * (Number(qty) || 0) : 0);
      }, 0);

      if (target.threat.maxSlots && totalSlots > target.threat.maxSlots) {
        return prev;
      }

      // Check budget limit
      const weaponCostDiff = weapon.cost * delta * (Number(target.count) || 0);
      if (attackerTotalSpent + weaponCostDiff > attackerBudget) return prev;

      return prev.map(item => item.id === instanceId ? { ...item, loadout: nextLoadout } : item);
    });
  };

  const adjustGroupQuantity = (systemId: string, targetQty: number, syncMap = true) => {
    const system = DEFENCE_CATALOG.find(s => s.id === systemId);
    if (!system) return;

    setDefenderProcured(prev => {
      const currentItems = prev.filter(x => x.system.id === systemId);
      const currentQty = currentItems.length;
      const otherItems = prev.filter(x => x.system.id !== systemId);

      if (targetQty === currentQty) {
        if (syncMap) setGroupQuantities(g => ({ ...g, [systemId]: targetQty }));
        return prev;
      }

      if (targetQty > currentQty) {
        const newItems = [...prev];
        let tempSpent = prev.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * (Number(item.missilesPurchased) || 0)), 0);
        const selectedMissile = currentItems[0]?.selectedMissile || getBatteryDefaultMissile(system);
        const initialAmmo = system.category === 'RADAR' ? 0 : (system.defaultAmmo ?? 8);

        for (let i = currentQty; i < targetQty; i++) {
          const unitCost = system.batteryCost + (system.category === 'RADAR' ? 0 : initialAmmo * selectedMissile.cost);
          if (tempSpent + unitCost > defenderBudget) break;

          tempSpent += unitCost;
          newItems.push({
            id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            system,
            selectedMissile,
            missilesPurchased: initialAmmo,
            x: 30 + Math.random() * 40,
            y: 40 + Math.random() * 30
          });
        }
        
        if (syncMap) {
          const finalCount = newItems.filter(x => x.system.id === systemId).length;
          setGroupQuantities(g => ({ ...g, [systemId]: finalCount }));
        }
        
        return newItems;
      } else {
        const keepCount = Math.max(0, targetQty);
        const thisSystemKept = currentItems.slice(0, keepCount);
        
        if (syncMap) {
          setGroupQuantities(g => ({ ...g, [systemId]: keepCount }));
        }
        
        return [...otherItems, ...thisSystemKept];
      }
    });
  };

  const addDefenceBattery = (system: DefenceItem) => {
    const existingGroup = defenderProcured.filter(item => item.system.id === system.id);
    if (existingGroup.length > 0) {
      adjustGroupQuantity(system.id, existingGroup.length + 1);
      return;
    }

    const selectedMissile = getBatteryDefaultMissile(system);
    const initialAmmo = system.category === 'RADAR' ? 0 : (system.defaultAmmo ?? 8);
    const unitCost = system.batteryCost + (system.category === 'RADAR' ? 0 : initialAmmo * selectedMissile.cost);
    if (defenderTotalSpent + unitCost > defenderBudget) return;

    const newBattery: SelectedDefence = {
      id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      system,
      selectedMissile,
      missilesPurchased: initialAmmo,
      x: 30 + Math.random() * 40,
      y: 40 + Math.random() * 30
    };
    setDefenderProcured(prev => [...prev, newBattery]);
    setGroupQuantities(g => ({ ...g, [system.id]: 1 }));
  };

  const setBatteryAmmo = (id: string, val: number | string) => {
    setDefenderProcured(prev => prev.map(battery => {
      if (battery.id !== id) return battery;
      const numericVal = val === '' ? 0 : Number(val);
      const costDiff = (numericVal - (Number(battery.missilesPurchased) || 0)) * battery.selectedMissile.cost;
      if (defenderTotalSpent + costDiff > defenderBudget) return battery;
      return { ...battery, missilesPurchased: val as any };
    }));
  };

  const adjustBatteryAmmo = (id: string, delta: number) => {
    setDefenderProcured(prev => prev.map(battery => {
      if (battery.id !== id) return battery;
      const currentAmmo = Number(battery.missilesPurchased) || 0;
      const nextAmmo = Math.max(0, currentAmmo + delta);
      const costDiff = (nextAmmo - currentAmmo) * battery.selectedMissile.cost;
      if (defenderTotalSpent + costDiff > defenderBudget) return battery;
      return { ...battery, missilesPurchased: nextAmmo };
    }));
  };

  const changeGroupMissileType = (systemId: string, missileName: string) => {
    setDefenderProcured(prev => {
      const system = DEFENCE_CATALOG.find(s => s.id === systemId);
      if (!system) return prev;
      const opt = system.missileOptions?.find(o => o.name === missileName);
      if (!opt) return prev;

      const nextProcured = prev.map(item => {
        if (item.system.id !== systemId) return item;
        return { ...item, selectedMissile: opt };
      });

      const nextTotalSpent = nextProcured.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * (Number(item.missilesPurchased) || 0)), 0);
      if (nextTotalSpent > defenderBudget) return prev;
      return nextProcured;
    });
  };

  const removeDefenceBattery = (id: string) => {
    setDefenderProcured(prev => prev.filter(b => b.id !== id));
  };

  const updateBatteryPosition = (id: string, x: number, y: number) => {
    setDefenderProcured(prev => prev.map(b => b.id === id ? { ...b, x, y } : b));
  };

  const handleConfirmAttacker = () => {
    const hasInvalid = attackerProcured.some(item => {
      const count = Number(item.count);
      return isNaN(count) || count <= 0;
    });

    if (hasInvalid) {
      setWarning('Wrong entry of equipment detected! Removing zero/empty items from list...');
      
      const validList = attackerProcured.filter(item => {
        const count = Number(item.count);
        return !isNaN(count) && count > 0;
      });

      const cleanedList = validList.map(item => {
        const nextLoadout = { ...item.loadout };
        Object.keys(nextLoadout).forEach(wName => {
          const qty = Number(nextLoadout[wName]);
          if (isNaN(qty) || qty <= 0) {
            delete nextLoadout[wName];
          }
        });
        return { ...item, loadout: nextLoadout };
      });

      setAttackerProcured(cleanedList);

      setTimeout(() => {
        setWarning(null);
        if (cleanedList.length > 0) {
          setPhase('procure_defender');
        }
      }, 3000);
    } else {
      const cleanedList = attackerProcured.map(item => {
        const nextLoadout = { ...item.loadout };
        Object.keys(nextLoadout).forEach(wName => {
          const qty = Number(nextLoadout[wName]);
          if (isNaN(qty) || qty <= 0) {
            delete nextLoadout[wName];
          }
        });
        return { ...item, loadout: nextLoadout };
      });
      setAttackerProcured(cleanedList);
      setPhase('procure_defender');
    }
  };

  const handleConfirmDefender = () => {
    const invalidGroupIds = Object.keys(groupQuantities).filter(systemId => {
      const qty = groupQuantities[systemId];
      return qty === '' || Number(qty) <= 0;
    });

    const hasInvalidAmmo = defenderProcured.some(battery => {
      if (battery.system.category === 'RADAR') return false;
      const ammo = Number(battery.missilesPurchased);
      return isNaN(ammo) || ammo <= 0;
    });

    const hasInvalidGroup = invalidGroupIds.length > 0;

    if (hasInvalidGroup || hasInvalidAmmo) {
      setWarning('Wrong entry of equipment detected! Removing zero/empty items from list...');

      const nextGroupQuantities = { ...groupQuantities };
      invalidGroupIds.forEach(id => {
        delete nextGroupQuantities[id];
      });
      setGroupQuantities(nextGroupQuantities);

      const validDefender = defenderProcured.filter(battery => {
        const isGroupInvalid = invalidGroupIds.includes(battery.system.id);
        if (isGroupInvalid) return false;

        if (battery.system.category === 'RADAR') return true;
        const ammo = Number(battery.missilesPurchased);
        return !isNaN(ammo) && ammo > 0;
      });

      const cleanedDefender = validDefender.map(battery => ({
        ...battery,
        missilesPurchased: Number(battery.missilesPurchased) || 0
      }));

      setDefenderProcured(cleanedDefender);

      setTimeout(() => {
        setWarning(null);
        if (cleanedDefender.length > 0) {
          initSimulationState(cleanedDefender);
        }
      }, 3000);
    } else {
      const cleanedDefender = defenderProcured.map(battery => ({
        ...battery,
        missilesPurchased: Number(battery.missilesPurchased) || 0
      }));
      setDefenderProcured(cleanedDefender);
      initSimulationState(cleanedDefender);
    }
  };

  const initSimulationState = (overrideDefenderList?: SelectedDefence[]) => {
    setSimTime(0);
    simTimeRef.current = 0;
    setSimLogs([
      { time: 0, message: '🛡️ Simulation initialized. Defense coordinates mapped.', type: 'INFO' },
      { time: 0, message: '📡 Active AESA Radars operating. Coverage cones active.', type: 'INFO' }
    ]);
    setLeakerCount(0);
    setHitCount(0);
    setSpentDefenderMissilesCost(0);
    setEngagements([]);

    const defenderListToUse = (overrideDefenderList || defenderProcured).map(battery => ({
      ...battery,
      initialMissilesPurchased: Number(battery.missilesPurchased) || 0,
      ballisticFiredCount: 0
    }));
    defenderProcuredRef.current = defenderListToUse;

    // Populate visual threats from the attacker setup
    const threatList: VisualThreat[] = [];
    let tIndex = 0;
    attackerProcured.forEach(item => {
      const itemCount = Number(item.count) || 0;
      for (let i = 0; i < itemCount; i++) {
        // Attackers originate from border edges (Top: 0, Right: 100, Left: 0) and fly towards HQ center (50, 80)
        const angle = Math.random() * Math.PI; // Top hemisphere arc
        const startX = 50 + Math.cos(angle) * 44;
        const startY = 80 - Math.sin(angle) * 72;

        // Build loadoutStatus status tracking
        const loadoutStatus: { [wName: string]: { fired: number, total: number, weapon: WeaponItem } } = {};
        if (item.threat.weaponsCatalog) {
          item.threat.weaponsCatalog.forEach(w => {
            const qty = Number(item.loadout[w.name]) || 0;
            if (qty > 0) {
              loadoutStatus[w.name] = {
                fired: 0,
                total: qty,
                weapon: w
              };
            }
          });
        }

        threatList.push({
          id: `t-${item.threat.id}-${tIndex++}`,
          threat: item.threat,
          startX,
          startY,
          x: startX,
          y: startY,
          progress: 0,
          isDead: false,
          isLeaked: false,
          detected: false,
          isReturning: false,
          retreated: false,
          loadoutStatus,
          distanceToTarget: 200.0,
        });
      }
    });

    setThreatCountTotal(threatList.length);
    visualThreatsRef.current = threatList;
    visualInterceptorsRef.current = [];
    setPhase('simulate');
    setIsPlaying(true);
  };

  // Main simulation tick loop
  useEffect(() => {
    if (!isPlaying || phase !== 'simulate') return;

    const interval = setInterval(() => {
      simTimeRef.current += simSpeed;
      setSimTime(simTimeRef.current);

      const activeThreats = visualThreatsRef.current;
      const activeInterceptors = visualInterceptorsRef.current;
      const currentPlacements = defenderProcuredRef.current;

      // Attacker speed multipliers
      let speedModifier = 1.0;
      if (weather === 'CLOUDY') speedModifier = 0.9;
      if (weather === 'STORMY') speedModifier = 0.75;

      // 1. Move threats
      activeThreats.forEach(t => {
        if (t.isDead || t.isLeaked) return;

        // Speed in km/s: Mach * 0.34
        const speedInKmS = t.threat.speed * 0.34 * speedModifier;
        const distStep = speedInKmS * simSpeed; // since 1 tick = 1s * simSpeed

        if (t.isReturning) {
          // Returning to base: distance to target increases
          const currentDistance = t.distanceToTarget ?? 200.0;
          const nextDistance = Math.min(200.0, currentDistance + distStep);
          t.distanceToTarget = nextDistance;
          t.progress = (200.0 - nextDistance) / 200.0;

          t.x = t.startX + (50 - t.startX) * t.progress;
          t.y = t.startY + (80 - t.startY) * t.progress;

          if (nextDistance >= 200.0) {
            t.retreated = true;
            t.isDead = true;
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `✈️ RTB: Attacker ${t.threat.name} successfully returned to base and exited airspace.`,
              type: 'INFO'
            }]);
          }
          return;
        }

        // Flight towards target: distance to target decreases
        const currentDistance = t.distanceToTarget ?? 200.0;
        const nextDistance = Math.max(0.0, currentDistance - distStep);
        t.distanceToTarget = nextDistance;
        const initDist = t.initialDistance ?? 200.0;
        t.progress = initDist > 0 ? (initDist - nextDistance) / initDist : 1.0;

        t.x = t.startX + ((t.targetX ?? 50) - t.startX) * t.progress;
        t.y = t.startY + ((t.targetY ?? 80) - t.startY) * t.progress;

        // Check standoff launch condition for jets/UAVs
        if (t.loadoutStatus) {
          let hasUnfired = false;
          Object.entries(t.loadoutStatus).forEach(([wName, wStatus]) => {
            if (wStatus.fired < wStatus.total) {
              if (nextDistance <= wStatus.weapon.range) {
                // Spawn the fired payloads as individual entities starting at current jet position
                wStatus.fired = wStatus.total;
                for (let i = 0; i < wStatus.total; i++) {
                  const isAntiRad = wStatus.weapon.name.toLowerCase().includes('anti-radiation') || wStatus.weapon.name.includes('YJ-91');
                  let targetBatteryId: string | undefined = undefined;
                  let targetX = 50;
                  let targetY = 80;
                  let payloadDistance = nextDistance;

                  if (isAntiRad) {
                    const activeBatteries = currentPlacements.filter(b => !b.isDestroyed);
                    if (activeBatteries.length > 0) {
                      const targetBattery = activeBatteries[Math.floor(Math.random() * activeBatteries.length)];
                      targetBatteryId = targetBattery.id;
                      targetX = targetBattery.x;
                      targetY = targetBattery.y;
                      const distPct = Math.sqrt(Math.pow(targetBattery.x - t.x, 2) + Math.pow(targetBattery.y - t.y, 2));
                      payloadDistance = distPct * 2.5;
                    }
                  }

                  activeThreats.push({
                    id: `t-pay-${t.id}-${wName}-${i}-${Date.now()}-${Math.random()}`,
                    threat: {
                      id: `payload-${t.threat.id}-${wName}-${i}-${Date.now()}`,
                      name: wStatus.weapon.name,
                      type: wStatus.weapon.type,
                      speed: wStatus.weapon.speed,
                      altitude: wStatus.weapon.altitude,
                      rcs: wStatus.weapon.rcs,
                      threatScore: t.threat.threatScore + 5,
                      cost: wStatus.weapon.cost,
                      color: '#f97316',
                    },
                    startX: t.x,
                    startY: t.y,
                    x: t.x,
                    y: t.y,
                    targetX,
                    targetY,
                    targetBatteryId,
                    initialDistance: payloadDistance,
                    progress: 0,
                    isDead: false,
                    isLeaked: false,
                    detected: t.detected,
                    distanceToTarget: payloadDistance,
                  });
                }

                setSimLogs(prev => [...prev, {
                  time: simTimeRef.current,
                  message: `🚀 STANDOFF LAUNCH: ${t.threat.name} released ${wStatus.total}x ${wName} payload at range ${nextDistance.toFixed(0)}km!`,
                  type: 'LAUNCH'
                }]);
              } else {
                hasUnfired = true;
              }
            }
          });

          // If all configured weapons are fired, the aircraft RTBs immediately
          if (!hasUnfired && Object.keys(t.loadoutStatus).length > 0) {
            t.isReturning = true;
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `✈️ RTB: ${t.threat.name} expended all payloads. Turning back to base.`,
              type: 'INFO'
            }]);
          }
        }

        // Check if threat has reached HQ target or battery target
        if (!t.isReturning && nextDistance <= 0.01) {
          t.isLeaked = true;
          if (t.targetBatteryId) {
            const hitBattery = currentPlacements.find(b => b.id === t.targetBatteryId);
            if (hitBattery) {
              hitBattery.isDestroyed = true;
            }
            const batteryName = hitBattery ? hitBattery.system.name : 'Defender Battery';
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `💥 DIRECT HIT: Anti-radiation missile destroyed ${batteryName}!`,
              type: 'BREACH'
            }]);
          } else {
            setLeakerCount(prev => prev + 1);
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `💥 BREACH: Attacker ${t.threat.name} impacted Command HQ!`,
              type: 'BREACH'
            }]);
          }
        }
      });

      // 2. Detection & Locking checks
      activeThreats.forEach(t => {
        if (!t.isDead && !t.isLeaked && !t.detected) {
          const detected = currentPlacements.some(placed => {
            if (placed.isDestroyed) return false;
            const jammingFactor = ecm === 'HIGH' ? 0.5 : ecm === 'LOW' ? 0.8 : 1.0;
            const rcsFactor = Math.pow(t.threat.rcs, 0.25);
            const radarRange = placed.system.radarRange || placed.system.range;
            const radarRangePct = (radarRange / 2.5) * jammingFactor * rcsFactor;
            const distance = Math.sqrt(Math.pow(placed.x - t.x, 2) + Math.pow(placed.y - t.y, 2));
            return distance <= radarRangePct;
          });

          if (detected) {
            t.detected = true;
            const currentDistance = t.distanceToTarget ?? 200.0;
            const currentAlt = Math.round(t.threat.altitude * (currentDistance / 200.0));
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `📡 DETECTION: ${t.threat.name} locked on radar coordinates at range ${currentDistance.toFixed(0)}km. Alt: ${currentAlt}m, Speed: Mach ${t.threat.speed}`,
              type: 'DETECTION'
            }]);
          }
        }
      });

      // 3. Defender firing logical tick
      currentPlacements.forEach(placed => {
        if (placed.system.category === 'RADAR' || placed.missilesPurchased <= 0 || placed.isDestroyed) return;

        let targetThreat: VisualThreat | null = null;
        let minDistancePct = placed.selectedMissile.range / 2.5;

        for (const t of activeThreats) {
          if (!t.detected || t.isDead || t.isLeaked) continue;

          // Check if system/missile is capable of targeting this threat type
          let capability = getMissileThreatMultiplier(placed.selectedMissile.name, t.threat.type);
          if (capability === undefined) {
            const sysKey = localFindSystemKey(placed.system.name);
            if (sysKey && LOCAL_SYSTEM_THREAT_MULTIPLIERS[sysKey]) {
              capability = LOCAL_SYSTEM_THREAT_MULTIPLIERS[sysKey][t.threat.type];
            }
          }
          if (capability === 0.0) continue; // Not capable against this threat type

          // Special layered defense logic: S-400 and Barak 8 ER should avoid firing at drone swarms (SWARM)
          // if other active complementary SAMs are present, unless in the final stage and not targeted by anyone else.
          const isS400OrBarak8ER = placed.system.name.includes('S-400') || placed.system.name.includes('Barak 8 ER') || placed.system.name.includes('Barak-8 ER');
          const isDroneSwarm = t.threat.type === 'SWARM';
          if (isS400OrBarak8ER && isDroneSwarm) {
            const otherSAMsActive = currentPlacements.some(p => {
              if (p.id === placed.id) return false;
              const name = p.system.name;
              const isOtherS400OrBarak8ER = name.includes('S-400') || name.includes('Barak 8 ER') || name.includes('Barak-8 ER');
              return !isOtherS400OrBarak8ER && p.system.category !== 'RADAR' && !p.isDestroyed && p.missilesPurchased > 0;
            });
            if (otherSAMsActive) {
              const isFinalStage = t.distanceToTarget !== undefined && t.distanceToTarget <= 45;
              const noOneFiring = !activeInterceptors.some(i => !i.isDead && i.targetId === t.id);
              if (!(isFinalStage && noOneFiring)) {
                continue;
              }
            }
          }

          // Special layered ballistic defense logic: Akash and Pechora should limit engagements against ballistic threats
          // to at most 10% of their initial inventory when teamed with S-400, Barak-8 ER, or Barak-8.
          if (t.threat.type === 'BALLISTIC') {
            const isAkashOrPechora = placed.system.name.includes('Akash') || placed.system.name.includes('Pechora');
            if (isAkashOrPechora) {
              const teamedWithABM = currentPlacements.some(p => {
                if (p.id === placed.id) return false;
                const name = p.system.name;
                const isABMSystem = name.includes('S-400') || name.includes('Barak 8') || name.includes('Barak-8');
                return isABMSystem && !p.isDestroyed && p.missilesPurchased > 0;
              });
              if (teamedWithABM) {
                const limit = Math.ceil((placed.initialMissilesPurchased ?? 0) * 0.1);
                if ((placed.ballisticFiredCount ?? 0) >= limit) {
                  continue; // Exceeded 10% limit for ballistic missiles, reserve the rest for other threats
                }
              }
            }
          }

          const currentDistance = t.distanceToTarget ?? 200.0;
          let currentAlt = t.threat.type === 'BALLISTIC' || t.threat.type === 'HYPERSONIC' 
            ? t.threat.altitude * Math.max((currentDistance / 200.0), 0.05)
            : t.threat.altitude;
          
          // Check if system or missile is ABM-capable to adjust apogee altitude checks
          const isABM = placed.system.name.includes('S-400') ||
                        placed.system.name.includes('Barak-8') ||
                        placed.system.name.includes('Barak 8') ||
                        placed.system.name.includes('Akash-NG') ||
                        placed.selectedMissile.name.includes('40N6') ||
                        placed.selectedMissile.name.includes('48N6') ||
                        placed.selectedMissile.name.includes('Barak-8') ||
                        placed.selectedMissile.name.includes('Barak 8') ||
                        placed.selectedMissile.name.includes('Akash-NG');
                        
          if (t.threat.type === 'BALLISTIC' && currentAlt > placed.selectedMissile.maxAlt && isABM) {
            // Scale adjusted altitude to mid-envelope so it is not penalized for its mid-course apogee
            currentAlt = (placed.selectedMissile.minAlt + placed.selectedMissile.maxAlt) / 2;
          }
          
          if (currentAlt < placed.selectedMissile.minAlt || currentAlt > placed.selectedMissile.maxAlt) continue;
          
          const alreadyEngagedByThisBattery = activeInterceptors.some(i => !i.isDead && i.targetId === t.id && i.batteryId === placed.id);
          if (alreadyEngagedByThisBattery) continue;

          const distance = Math.sqrt(Math.pow(placed.x - t.x, 2) + Math.pow(placed.y - t.y, 2));
          if (distance <= minDistancePct) {
            minDistancePct = distance;
            targetThreat = t;
          }
        }

        if (targetThreat) {
          placed.missilesPurchased--;
          setSpentDefenderMissilesCost(prev => prev + placed.selectedMissile.cost);
          
          if (targetThreat.threat.type === 'BALLISTIC') {
            if (placed.ballisticFiredCount !== undefined) {
              placed.ballisticFiredCount++;
            }
          }
          
          let interceptAccuracy = placed.selectedMissile.accuracy;
          
          // Apply system/missile threat capability coefficient to match real-world success rates
          let coefficient = getMissileThreatMultiplier(placed.selectedMissile.name, targetThreat.threat.type);
          if (coefficient === undefined) {
            const sysKey = localFindSystemKey(placed.system.name);
            if (sysKey && LOCAL_SYSTEM_THREAT_MULTIPLIERS[sysKey]) {
              coefficient = LOCAL_SYSTEM_THREAT_MULTIPLIERS[sysKey][targetThreat.threat.type];
            }
          }
          if (coefficient !== undefined) {
            interceptAccuracy = placed.selectedMissile.accuracy * coefficient;
          }

          if (ecm === 'LOW') interceptAccuracy -= 0.08;
          if (ecm === 'HIGH') interceptAccuracy -= 0.18;

          activeInterceptors.push({
            id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            batteryId: placed.id,
            startX: placed.x,
            startY: placed.y,
            x: placed.x,
            y: placed.y,
            targetId: targetThreat.id,
            progress: 0,
            accuracy: interceptAccuracy,
            isDead: false,
            color: placed.system.color,
            speed: placed.selectedMissile.speed,
          });

          const currentDistance = targetThreat.distanceToTarget ?? 200.0;
          const currentAlt = Math.round(targetThreat.threat.type === 'BALLISTIC' || targetThreat.threat.type === 'HYPERSONIC' 
            ? targetThreat.threat.altitude * Math.max((currentDistance / 200.0), 0.05)
            : targetThreat.threat.altitude);
          setSimLogs(prev => [...prev, {
            time: simTimeRef.current,
            message: `🚀 LAUNCH: ${placed.system.name} launched ${placed.selectedMissile.name} interceptor. Target Alt: ${currentAlt}m, Range: ${currentDistance.toFixed(0)}km`,
            type: 'LAUNCH'
          }]);
        }
      });

      // 4. Update interceptors
      activeInterceptors.forEach(interceptor => {
        if (interceptor.isDead) return;

        const target = activeThreats.find(t => t.id === interceptor.targetId);
        if (!target || target.isDead || target.isLeaked) {
          interceptor.isDead = true;
          const battery = currentPlacements.find(b => b.id === interceptor.batteryId);
          if (battery) {
            setEngagements(prev => [
              ...prev,
              {
                systemId: battery.system.id,
                systemName: battery.system.name,
                threatType: target ? target.threat.type : 'UAV',
                success: false
              }
            ]);
          }
          return;
        }

        const dx = target.x - interceptor.x;
        const dy = target.y - interceptor.y;
        const distPct = Math.sqrt(dx * dx + dy * dy);
        
        // Speed step in canvas coordinates per simulation second
        const stepPct = ((interceptor.speed * 0.34) / 2.5) * simSpeed;

        if (stepPct >= distPct) {
          interceptor.x = target.x;
          interceptor.y = target.y;
          interceptor.isDead = true;
          
          const hits = Math.random() < interceptor.accuracy;
          
          const battery = currentPlacements.find(b => b.id === interceptor.batteryId);
          if (battery) {
            setEngagements(prev => [
              ...prev,
              {
                systemId: battery.system.id,
                systemName: battery.system.name,
                threatType: target.threat.type,
                success: hits
              }
            ]);
          }

          if (hits) {
            target.isDead = true;
            setHitCount(prev => prev + 1);
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `⚡ INTERCEPT SUCCESS: Target ${target.threat.name} neutralized!`,
              type: 'INTERCEPT_SUCCESS'
            }]);
          } else {
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `💨 INTERCEPT FAIL: Interceptor missed ${target.threat.name}!`,
              type: 'INTERCEPT_FAIL'
            }]);
          }
        } else {
          interceptor.x += (dx / distPct) * stepPct;
          interceptor.y += (dy / distPct) * stepPct;
        }
      });

      // Check for simulation end condition
      const allResolved = activeThreats.every(t => t.isDead || t.isLeaked);
      const noInterceptors = activeInterceptors.every(i => i.isDead);
      
      if (allResolved && noInterceptors) {
        setIsPlaying(false);
        clearInterval(interval);

        const finalHitCount = activeThreats.filter(t => t.isDead && !t.retreated).length;
        const finalLeakerCount = activeThreats.filter(t => t.isLeaked).length;
        const finalThreatCountTotal = activeThreats.length;
        const finalDetectedCount = activeThreats.filter(t => t.detected).length;

        setHitCount(finalHitCount);
        setLeakerCount(finalLeakerCount);
        setThreatCountTotal(finalThreatCountTotal);

        const destroyedBatteriesCost = currentPlacements.reduce((sum, item) => sum + (item.isDestroyed ? item.system.batteryCost : 0), 0);
        const finalDefenderOutlay = spentDefenderMissilesCost + destroyedBatteriesCost;

        api.simulations.clientSave({
          name: `Sandbox Wargame: ${finalHitCount} Neutralized / ${finalThreatCountTotal} Threats`,
          config: {
            attackerBudget,
            defenderBudget,
            weather,
            ecm,
          },
          results: {
            totalThreats: finalThreatCountTotal,
            threatsDetected: finalDetectedCount,
            threatsIntercepted: finalHitCount,
            threatsMissed: finalLeakerCount,
            threatsImpacted: finalLeakerCount,
            interceptionRate: finalThreatCountTotal > 0 ? (finalHitCount / finalThreatCountTotal) : 0,
            detectionRate: finalThreatCountTotal > 0 ? (finalDetectedCount / finalThreatCountTotal) : 0,
            totalCost: finalDefenderOutlay,
            costPerEngagement: finalDefenderOutlay / (finalThreatCountTotal || 1),
            costPerSuccessfulInterception: finalDefenderOutlay / (finalHitCount || 1),
          },
          duration: simTimeRef.current,
        }).catch(err => console.error('Failed to save simulation to database:', err));

        setPhase('report');
      }

    }, 200); // Fast operational ticks

    return () => clearInterval(interval);
  }, [isPlaying, phase, weather, ecm, simSpeed]);

  // Render Canvas
  useEffect(() => {
    if (phase !== 'simulate') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Tactical Radar Grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 50; r < canvas.width; r += 70) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height * 0.8, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw sweep lines
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height * 0.8);
      ctx.lineTo(canvas.width, canvas.height * 0.8);
      ctx.stroke();

      // Radar Sweep Effect
      const angle = (Date.now() / 800) % (Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.015)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height * 0.8);
      ctx.arc(canvas.width / 2, canvas.height * 0.8, canvas.width * 0.5, angle, angle + 0.3);
      ctx.closePath();
      ctx.fill();

      // Draw Command HQ Center
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * 0.8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0a0e17';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw placed defender batteries & range coverage
      const activePlacements = (phase === 'simulate' || phase === 'report') ? defenderProcuredRef.current : defenderProcured;
      activePlacements.forEach(sys => {
        const sysX = (sys.x / 100) * canvas.width;
        const sysY = (sys.y / 100) * canvas.height;
        const rangeRadius = sys.system.range * 0.1 * (canvas.width / 100);

        // System range circles
        if (!sys.isDestroyed) {
          ctx.strokeStyle = `${sys.system.color}20`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(sysX, sysY, rangeRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Battery Marker
        if (sys.isDestroyed) {
          ctx.fillStyle = '#4b5563'; // gray out
          ctx.beginPath();
          ctx.arc(sysX, sysY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Draw red X
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sysX - 5, sysY - 5);
          ctx.lineTo(sysX + 5, sysY + 5);
          ctx.moveTo(sysX + 5, sysY - 5);
          ctx.lineTo(sysX - 5, sysY + 5);
          ctx.stroke();
        } else {
          ctx.fillStyle = sys.system.color;
          ctx.beginPath();
          ctx.arc(sysX, sysY, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Label
        ctx.fillStyle = sys.isDestroyed ? '#ef4444' : '#9ca3af';
        ctx.font = '8px monospace';
        const labelText = sys.system.name.split(' ')[0] + (sys.isDestroyed ? ' [KIA]' : '');
        ctx.fillText(labelText, sysX - 15, sysY - 10);
      });

      // Draw active threats
      visualThreatsRef.current.forEach(t => {
        if (t.isDead || t.isLeaked) return;

        const threatX = (t.x / 100) * canvas.width;
        const threatY = (t.y / 100) * canvas.height;

        // Visual distinction for returning planes
        ctx.fillStyle = t.isReturning ? 'rgba(156, 163, 175, 0.6)' : t.threat.color;
        ctx.beginPath();
        ctx.arc(threatX, threatY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Ring glow
        ctx.strokeStyle = t.isReturning ? 'rgba(156, 163, 175, 0.3)' : `${t.threat.color}66`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(threatX, threatY, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = t.isReturning ? '#9ca3af' : '#ef4444';
        ctx.font = '7px monospace';
        const label = t.isReturning ? `${t.threat.name} (RTB)` : `${t.threat.name} (M${t.threat.speed})`;
        ctx.fillText(label, threatX + 8, threatY + 3);
      });

      // Draw interceptors in flight
      visualInterceptorsRef.current.forEach(i => {
        if (i.isDead) return;

        const intX = (i.x / 100) * canvas.width;
        const intY = (i.y / 100) * canvas.height;

        ctx.strokeStyle = i.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(intX, intY, 3, 0, Math.PI * 2);
        ctx.stroke();

        // Flame trailing line
        const startX = (i.startX / 100) * canvas.width;
        const startY = (i.startY / 100) * canvas.height;
        ctx.strokeStyle = `${i.color}40`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(intX, intY);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, defenderProcured]);

  // Cost calculations based on final outcomes (safe RTBs, anti-radiation hits, and salvos)
  const firedWeaponsCost = visualThreatsRef.current.reduce((sum, t) => {
    const isReturningType = t.threat.type === 'FIGHTER' || t.threat.type === 'UAV';
    if (t.id.includes('t-pay-') || !isReturningType) {
      return sum + t.threat.cost;
    }
    return sum;
  }, 0);

  const lostAircraftCost = visualThreatsRef.current.reduce((sum, t) => {
    if (t.id.includes('t-pay-')) return sum;
    const isReturningType = t.threat.type === 'FIGHTER' || t.threat.type === 'UAV';
    if (isReturningType && t.isDead && !t.retreated) {
      return sum + t.threat.cost;
    }
    return sum;
  }, 0);

  const finalAttackerCostCalculated = firedWeaponsCost + lostAircraftCost;

  const activePlacementsForCost = (phase === 'simulate' || phase === 'report') ? defenderProcuredRef.current : defenderProcured;
  const destroyedBatteriesCostCalculated = activePlacementsForCost.reduce((sum, item) => {
    return sum + (item.isDestroyed ? item.system.batteryCost : 0);
  }, 0);

  const finalDefenderCostCalculated = spentDefenderMissilesCost + destroyedBatteriesCostCalculated;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#ef4444]/5" />
        <div className="relative flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Layered Simulation Sandbox</h1>
            <p className="text-sm text-[#6b7280]">
              Engage in two-player budget procurement exercises: Attacker vs Defender
            </p>
          </div>
          <div className="flex gap-2">
            <div className="badge badge-green text-[10px]">OPERATIONAL RATIOS: 4:1 BUDGET</div>
          </div>
        </div>
      </div>

      {/* Progress Phases */}
      <div className="card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { id: 'config', label: '1. Rules & Setup' },
            { id: 'procure_attacker', label: '2. Attacker Procurement' },
            { id: 'procure_defender', label: '3. Defender Layering' },
            { id: 'simulate', label: '4. Simulation' },
            { id: 'report', label: '5. Post-Action Report' }
          ].map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                phase === p.id ? 'bg-[#00ff88] text-[#0a0e17]' : 'bg-[#1f2937] text-[#4b5563]'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs ${phase === p.id ? 'text-[#00ff88] font-medium' : 'text-[#4b5563]'}`}>
                {p.label}
              </span>
              {i < 4 && <div className="w-4 h-px bg-[#1f2937]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Warning Banner */}
      {warning && (
        <div className="card p-4 border-[#ef4444]/30 bg-[#ef4444]/5 text-[#ef4444] text-sm font-mono flex items-center gap-3 animate-pulse">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold text-[#ef4444]">Wrong entry of equipment</p>
            <p className="text-xs text-[#9ca3af]">{warning}</p>
          </div>
        </div>
      )}

      {/* CONFIGURATION PHASE */}
      {phase === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider">War Game Budgets</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6b7280] mb-2 block">
                  Attacker Procurement Limit: <strong>${attackerBudget} Million</strong>
                </label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={attackerBudget}
                  onChange={e => setAttackerBudget(parseInt(e.target.value))}
                  className="w-full accent-[#ef4444]"
                />
              </div>

              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Defender Air Defence Budget (4x Attacker)</label>
                <div className="text-xl font-mono font-black text-[#00ff88] bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                  ${defenderBudget} Million ($2.0 Billion equivalents)
                </div>
                <p className="text-[10px] text-[#4b5563] mt-1.5 leading-relaxed">
                  Defending assets (like S-400 battalions, active AESA radar rigs, and high-performance medium-range interceptors) require significant capital.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider">Environmental & ECM Modifier</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Weather Condition</label>
                <select
                  value={weather}
                  onChange={e => setWeather(e.target.value as any)}
                  className="input-field"
                >
                  <option value="CLEAR">☀️ CLEAR (Full range visibility)</option>
                  <option value="CLOUDY">⛅ CLOUDY (-10% launch velocity)</option>
                  <option value="STORMY">⛈️ STORMY (-25% velocity)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Electronic Jamming (ECM)</label>
                <select
                  value={ecm}
                  onChange={e => setEcm(e.target.value as any)}
                  className="input-field"
                >
                  <option value="NONE">🟢 NONE (Standard lock success)</option>
                  <option value="LOW">🟡 LOW (-8% accuracy success)</option>
                  <option value="HIGH">🔴 HIGH (-18% accuracy success)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <button onClick={() => setPhase('procure_attacker')} className="btn-primary">
              Continue to Attacker Procurement →
            </button>
          </div>
        </div>
      )}

      {/* ATTACKER PROCUREMENT PHASE */}
      {phase === 'procure_attacker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Cart & Budget (Left) */}
          <div className="card p-5 space-y-4 h-fit">
            <h3 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider">Attacker Wave Cart</h3>
            
            <div className="bg-black/40 p-4 rounded border border-white/[0.05]">
              <div className="text-xs text-[#6b7280] mb-1">Procured Wave Cost:</div>
              <div className={`text-2xl font-mono font-bold ${attackerTotalSpent > attackerBudget ? 'text-[#ef4444]' : 'text-white'}`}>
                ${attackerTotalSpent.toFixed(1)}M / ${attackerBudget}M
              </div>
              <div className="progress-bar mt-2 h-1.5">
                <div
                  className="progress-fill bg-[#ef4444]"
                  style={{ width: `${Math.min(100, (attackerTotalSpent / attackerBudget) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {attackerProcured.length === 0 ? (
                <div className="text-xs text-[#4b5563] text-center py-6 font-mono">No weapons procured yet. Select from catalogue.</div>
              ) : (
                attackerProcured.map(item => {
                  const loadoutCost = Object.entries(item.loadout).reduce((lSum, [wName, qty]) => {
                    const weapon = item.threat.weaponsCatalog?.find(w => w.name === wName);
                    return lSum + (weapon ? weapon.cost * qty : 0);
                  }, 0);
                  const totalUnitCost = item.threat.cost + loadoutCost;

                  const sameTypeItems = attackerProcured.filter(x => x.threat.id === item.threat.id);
                  const typeIndex = sameTypeItems.findIndex(x => x.id === item.id);
                  const displayName = sameTypeItems.length > 1
                    ? `${item.threat.name} (Set ${typeIndex + 1})`
                    : item.threat.name;

                  return (
                    <div key={item.id} className="p-3 rounded bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">{displayName}</div>
                          <div className="text-[10px] text-[#6b7280]">
                            Unit Cost: ${totalUnitCost.toFixed(2)}M
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => decreaseThreatQuantity(item.id)} className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">-</button>
                          <input
                            type="number"
                            min="0"
                            value={item.count}
                            onChange={e => {
                              const raw = e.target.value;
                              if (raw === '') {
                                setAttackerProcured(prev => prev.map(x => x.id === item.id ? { ...x, count: '' as any } : x));
                                return;
                              }
                              const val = parseInt(raw);
                              if (!isNaN(val)) {
                                if (val < 0) return;
                                setAttackerProcured(prev => {
                                  const otherSpent = prev.reduce((sum, x) => {
                                    if (x.id === item.id) return sum;
                                    const loadoutCost = Object.entries(x.loadout).reduce((lSum, [wName, q]) => {
                                      const weapon = x.threat.weaponsCatalog?.find(w => w.name === wName);
                                      return lSum + (weapon ? weapon.cost * (Number(q) || 0) : 0);
                                    }, 0);
                                    return sum + (x.threat.cost + loadoutCost) * (Number(x.count) || 0);
                                  }, 0);
                                  
                                  const thisLoadoutCost = Object.entries(item.loadout).reduce((lSum, [wName, q]) => {
                                    const weapon = item.threat.weaponsCatalog?.find(w => w.name === wName);
                                    return lSum + (weapon ? weapon.cost * (Number(q) || 0) : 0);
                                  }, 0);
                                  const thisUnitCost = item.threat.cost + thisLoadoutCost;
                                  const prospectiveTotal = otherSpent + thisUnitCost * val;
                                  if (prospectiveTotal > attackerBudget) return prev;
                                  return prev.map(x => x.id === item.id ? { ...x, count: val } : x);
                                });
                              }
                            }}
                            className="w-10 text-center bg-transparent text-white text-xs font-mono font-bold outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button onClick={() => increaseThreatQuantity(item.id)} className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">+</button>
                        </div>
                      </div>

                      {item.threat.weaponsCatalog && item.threat.weaponsCatalog.length > 0 && (
                        <div className="bg-black/20 p-2.5 rounded space-y-2 border border-white/5">
                          <div className="flex justify-between items-center text-[10px] text-[#6b7280] font-mono border-b border-white/5 pb-1">
                            <span>WEAPON LOADOUT:</span>
                            <span>
                              Slots: {
                                Object.entries(item.loadout).reduce((sum, [wName, qty]) => {
                                  const w = item.threat.weaponsCatalog?.find(x => x.name === wName);
                                  return sum + (w ? w.weightSlots * qty : 0);
                                }, 0)
                              }/{item.threat.maxSlots}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Set 1: Heavy Strike Loadout */}
                            {item.threat.weaponsCatalog.some(w => w.set === 1) && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] text-[#ef4444] font-semibold tracking-wide uppercase border-b border-white/5 pb-0.5 mb-1">Set 1: Heavy Strike Loadout</div>
                                {item.threat.weaponsCatalog.filter(w => w.set === 1).map(w => {
                                  const qty = item.loadout[w.name] || 0;
                                  const isRaadCM400Conflict = item.threat.id === 't3' && (
                                    (w.name === "Ra'ad ALCM" && (item.loadout['CM-400AKG Supersonic Missile'] || 0) > 0) ||
                                    (w.name === "CM-400AKG Supersonic Missile" && (item.loadout["Ra'ad ALCM"] || 0) > 0)
                                  );

                                  return (
                                    <div key={w.name} className="flex justify-between items-center text-[10px] gap-1.5">
                                      <div className="flex-1">
                                        <div className="text-[#9ca3af] font-medium leading-tight">{w.name}</div>
                                        <div className="text-[9px] text-[#4b5563] font-mono">
                                          Rng: {w.range}km • M{w.speed} • {w.weightSlots} Slot{w.weightSlots !== 1 && 's'}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[#00ff88] font-mono font-bold mr-1.5">${w.cost}M</span>
                                        <button
                                          type="button"
                                          disabled={qty === 0}
                                          onClick={() => adjustThreatWeapon(item.id, w.name, -1)}
                                          className="w-4 h-4 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 flex items-center justify-center font-bold"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          max={w.maxQty}
                                          value={qty}
                                          onChange={e => {
                                            const raw = e.target.value;
                                            if (raw === '') {
                                              setThreatWeaponQty(item.id, w.name, '');
                                            } else {
                                              const val = parseInt(raw);
                                              if (!isNaN(val)) {
                                                setThreatWeaponQty(item.id, w.name, val);
                                              }
                                            }
                                          }}
                                          className="w-8 text-center bg-transparent text-white text-xs font-mono font-bold outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                          type="button"
                                          disabled={qty >= w.maxQty || isRaadCM400Conflict}
                                          onClick={() => adjustThreatWeapon(item.id, w.name, 1)}
                                          className="w-4 h-4 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 flex items-center justify-center font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Set 2: Tactical Self-Defence */}
                            {item.threat.weaponsCatalog.some(w => w.set === 2) && (
                              <div className="space-y-1.5">
                                <div className="text-[9px] text-[#22d3ee] font-semibold tracking-wide uppercase border-b border-white/5 pb-0.5 mb-1">Set 2: Tactical Self-Defence</div>
                                {item.threat.weaponsCatalog.filter(w => w.set === 2).map(w => {
                                  const qty = item.loadout[w.name] || 0;
                                  const isRaadCM400Conflict = item.threat.id === 't3' && (
                                    (w.name === "Ra'ad ALCM" && (item.loadout['CM-400AKG Supersonic Missile'] || 0) > 0) ||
                                    (w.name === "CM-400AKG Supersonic Missile" && (item.loadout["Ra'ad ALCM"] || 0) > 0)
                                  );

                                  return (
                                    <div key={w.name} className="flex justify-between items-center text-[10px] gap-1.5">
                                      <div className="flex-1">
                                        <div className="text-[#9ca3af] font-medium leading-tight">{w.name}</div>
                                        <div className="text-[9px] text-[#4b5563] font-mono">
                                          Rng: {w.range}km • M{w.speed} • {w.weightSlots} Slot{w.weightSlots !== 1 && 's'}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-[#00ff88] font-mono font-bold mr-1.5">${w.cost}M</span>
                                        <button
                                          type="button"
                                          disabled={qty === 0}
                                          onClick={() => adjustThreatWeapon(item.id, w.name, -1)}
                                          className="w-4 h-4 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 flex items-center justify-center font-bold"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          max={w.maxQty}
                                          value={qty}
                                          onChange={e => {
                                            const raw = e.target.value;
                                            if (raw === '') {
                                              setThreatWeaponQty(item.id, w.name, '');
                                            } else {
                                              const val = parseInt(raw);
                                              if (!isNaN(val)) {
                                                setThreatWeaponQty(item.id, w.name, val);
                                              }
                                            }
                                          }}
                                          className="w-8 text-center bg-transparent text-white text-xs font-mono font-bold outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                          type="button"
                                          disabled={qty >= w.maxQty || isRaadCM400Conflict}
                                          onClick={() => adjustThreatWeapon(item.id, w.name, 1)}
                                          className="w-4 h-4 rounded bg-white/5 disabled:opacity-30 hover:bg-white/10 flex items-center justify-center font-bold"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={handleConfirmAttacker}
              disabled={attackerProcured.length === 0 || warning !== null}
              className="w-full btn-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              Confirm Attacker Setup →
            </button>
          </div>

          {/* Catalog (Right) */}
          <div className="lg:col-span-2 card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider">Attacker Arsenal Catalogue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THREAT_CATALOG.map(threat => (
                <div
                  key={threat.id}
                  onClick={() => addThreatToCart(threat)}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between cursor-pointer hover:bg-white/[0.05] hover:border-[#ef4444]/30 hover:shadow-lg transition-all"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-white">{threat.name}</h4>
                      <span className="badge badge-red text-[9px] uppercase font-mono">{threat.type}</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed mb-2">
                      Speed: <strong>Mach {threat.speed}</strong> • Altitude: <strong>{threat.altitude}m</strong> • RCS: <strong>{threat.rcs}m²</strong>
                    </p>
                    <div className="text-xs text-[#ef4444] font-mono font-bold">${threat.cost}M</div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addThreatToCart(threat);
                    }}
                    className="w-full py-1.5 rounded bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 border border-[#ef4444]/20 text-xs font-bold transition-all"
                  >
                    Add to Attacker Wave
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEFENDER PROCUREMENT & PLACEMENT PHASE */}
      {phase === 'procure_defender' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Cart & Placed Batteries (Left) */}
          <div className="card p-5 space-y-4 h-fit">
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Battery Inventory</h3>
            
            <div className="bg-black/40 p-4 rounded border border-white/[0.05]">
              <div className="text-xs text-[#6b7280] mb-1">Procured Battery Cost:</div>
              <div className={`text-2xl font-mono font-bold ${defenderTotalSpent > defenderBudget ? 'text-[#ef4444]' : 'text-white'}`}>
                ${defenderTotalSpent.toFixed(1)}M / ${defenderBudget}M
              </div>
              <div className="progress-bar mt-2 h-1.5">
                <div
                  className="progress-fill bg-[#00ff88]"
                  style={{ width: `${Math.min(100, (defenderTotalSpent / defenderBudget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Configured placements */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {(() => {
                const groupedDefender: { [systemId: string]: SelectedDefence[] } = {};
                defenderProcured.forEach(item => {
                  if (!groupedDefender[item.system.id]) {
                    groupedDefender[item.system.id] = [];
                  }
                  groupedDefender[item.system.id].push(item);
                });

                if (Object.keys(groupedDefender).length === 0) {
                  return <div className="text-xs text-[#4b5563] text-center py-6 font-mono">No batteries purchased. Select from catalog.</div>;
                }

                return Object.entries(groupedDefender).map(([systemId, batteries]) => {
                  const firstBattery = batteries[0];
                  const system = firstBattery.system;
                  const currentQty = batteries.length;
                  const selectedMissile = firstBattery.selectedMissile;

                  return (
                    <div key={systemId} className="p-3 rounded bg-white/[0.02] border border-[#00ff88]/20 space-y-3 text-xs">
                      {/* Group Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: system.color }} />
                            {system.name}
                          </div>
                          <div className="text-[10px] text-[#6b7280]">
                            Base: ${system.batteryCost}M each
                          </div>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded border border-white/5">
                          <button
                            type="button"
                            onClick={() => adjustGroupQuantity(systemId, currentQty - 1)}
                            className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={groupQuantities[systemId] !== undefined ? groupQuantities[systemId] : currentQty}
                            onChange={e => {
                              const raw = e.target.value;
                              if (raw === '') {
                                setGroupQuantities(g => ({ ...g, [systemId]: '' }));
                                adjustGroupQuantity(systemId, 0, false);
                              } else {
                                const val = parseInt(raw);
                                if (!isNaN(val) && val >= 0) {
                                  setGroupQuantities(g => ({ ...g, [systemId]: val }));
                                  adjustGroupQuantity(systemId, val, false);
                                }
                              }
                            }}
                            className="w-10 text-center bg-transparent text-white text-xs font-mono font-bold outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => adjustGroupQuantity(systemId, currentQty + 1)}
                            className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Composition (Amount of Equipment) */}
                      {system.composition && (
                        <div className="bg-black/15 p-2 rounded border border-white/[0.03] space-y-1.5">
                          <div className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Regiment Composition:</div>
                          <div className="grid grid-cols-1 gap-1 text-[10px] text-[#9ca3af]">
                            {system.composition.map((comp, idx) => (
                              <div key={idx} className="flex justify-between font-mono">
                                <span>{comp.name}:</span>
                                <span className="text-white font-bold">{comp.qty * currentQty}x</span>
                              </div>
                            ))}
                            {system.category !== 'RADAR' && (
                              <div className="flex justify-between font-mono text-[#00ff88] pt-1 border-t border-white/[0.04]">
                                <span>Total Launch Ready:</span>
                                <span className="font-bold">{batteries.reduce((sum, b) => sum + (Number(b.missilesPurchased) || 0), 0)} missiles</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Missile Selection */}
                      {system.missileOptions && system.missileOptions.length > 0 && (
                        <div className="bg-black/25 p-2 rounded border border-white/[0.03] space-y-1">
                          <div className="flex justify-between text-[9px] text-[#6b7280]">
                            <span>Armed Missile Variant:</span>
                            <span className="text-[#00ff88] font-mono">${selectedMissile.cost}M ea</span>
                          </div>
                          <select
                            value={selectedMissile.name}
                            onChange={e => changeGroupMissileType(systemId, e.target.value)}
                            className="w-full bg-black/40 text-white border border-white/10 rounded px-1 py-0.5 text-[10px] outline-none"
                          >
                            {system.missileOptions.map(opt => (
                              <option key={opt.name} value={opt.name}>
                                {opt.name} (Range: {opt.range}km, Speed: M{opt.speed}, Acc: {(opt.accuracy*100).toFixed(0)}%)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Nested Compact Coordinate / Position Sliders */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pl-1 pr-1 border-t border-white/[0.05] pt-2">
                        <div className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Unit Coordinates & Ammo:</div>
                        {batteries.map((battery, idx) => (
                          <div key={battery.id} className="p-2 rounded bg-black/20 text-[10px] space-y-1">
                            <div className="flex justify-between items-center text-[#9ca3af] font-semibold">
                              <span>Unit #{idx + 1}</span>
                              {system.category !== 'RADAR' && (
                                <div className="flex items-center gap-1.5">
                                  <span>Ammo:</span>
                                  <button
                                    type="button"
                                    onClick={() => adjustBatteryAmmo(battery.id, -2)}
                                    className="w-4 h-4 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[9px] font-bold"
                                  >
                                    -2
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={battery.missilesPurchased}
                                    onChange={e => {
                                      const raw = e.target.value;
                                      if (raw === '') {
                                        setBatteryAmmo(battery.id, '');
                                      } else {
                                        const val = parseInt(raw);
                                        if (!isNaN(val) && val >= 0) {
                                          setBatteryAmmo(battery.id, val);
                                        }
                                      }
                                    }}
                                    className="w-8 text-center bg-transparent text-white text-xs font-mono font-bold outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => adjustBatteryAmmo(battery.id, 2)}
                                    className="w-4 h-4 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[9px] font-bold"
                                  >
                                    +2
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[9px] text-[#6b7280]">
                              <div className="space-y-0.5">
                                <div className="flex justify-between">
                                  <span>Sector X:</span>
                                  <span className="text-white font-mono">{battery.x}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="90"
                                  value={battery.x}
                                  onChange={e => updateBatteryPosition(battery.id, parseInt(e.target.value), battery.y)}
                                  className="w-full h-1 accent-[#00ff88]"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex justify-between">
                                  <span>Sector Y:</span>
                                  <span className="text-white font-mono">{battery.y}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="30"
                                  max="90"
                                  value={battery.y}
                                  onChange={e => updateBatteryPosition(battery.id, battery.x, parseInt(e.target.value))}
                                  className="w-full h-1 accent-[#00ff88]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setPhase('procure_attacker')} className="btn-secondary w-1/3">← Back</button>
              <button
                onClick={handleConfirmDefender}
                disabled={defenderProcured.length === 0 || warning !== null}
                className="btn-primary w-2/3 disabled:opacity-40"
              >
                🚀 Run Simulation
              </button>
            </div>
          </div>

          {/* Catalog (Right) */}
          <div className="lg:col-span-2 card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFENCE_CATALOG.map(sys => (
                <div
                  key={sys.id}
                  onClick={() => addDefenceBattery(sys)}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] flex flex-col justify-between cursor-pointer hover:bg-white/[0.05] hover:border-[#00ff88]/30 hover:shadow-lg transition-all"
                >
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-white">{sys.name}</h4>
                      <span className="badge badge-green text-[9px] uppercase font-mono">{sys.category}</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed mb-2">
                      Max Range: <strong>{sys.range}km</strong> • Envelope: <strong>{sys.minAlt}m-{sys.maxAlt}m</strong> • Accuracy: <strong>{(sys.accuracy*100).toFixed(0)}%</strong>
                    </p>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#00ff88]">Battery: ${sys.batteryCost}M</span>
                      {sys.missileCost > 0 && <span className="text-[#00b4d8]">Missile: ${sys.missileCost}M</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addDefenceBattery(sys);
                    }}
                    className="w-full py-1.5 rounded bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 border border-[#00ff88]/20 text-xs font-bold transition-all"
                  >
                    Deploy Battery
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE ENGAGEMENT PHASE */}
      {phase === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Canvas visual radar map */}
          <div className="lg:col-span-2 card p-5 space-y-4 flex flex-col items-center">
            <div className="w-full flex justify-between items-center border-b border-white/[0.05] pb-2 gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#6b7280]">TACTICAL RADAR SCROLL SCAN</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] uppercase font-mono text-[#6b7280] mr-1">Speed:</span>
                {([1, 2, 3, 5, 10] as const).map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setSimSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                      simSpeed === speed ? 'bg-[#00ff88] text-[#0a0e17]' : 'bg-white/5 text-[#9ca3af] hover:bg-white/10'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-[#00ff88]">SIM TIME: {simTime}s</span>
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="bg-[#070b12] border border-[#00ff88]/30 rounded-lg w-full max-w-[800px] aspect-[8/5]"
            />

            <div className="flex gap-4 w-full justify-center text-xs font-mono text-[#6b7280]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#00ff88]" /> Defender
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#ef4444]" /> Attacker Threat
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-[#00b4d8] border border-[#00b4d8]" /> Interceptor Vector
              </div>
            </div>
          </div>

          {/* Event Logs & Current Stats (Right) */}
          <div className="card p-5 flex flex-col justify-between h-[480px]">
            <div>
              <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider mb-3">Live Interceptions</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4 text-center font-mono">
                <div className="bg-white/[0.02] p-2 rounded border border-white/[0.05]">
                  <div className="text-[10px] text-[#6b7280]">NEUTRALIZED</div>
                  <div className="text-xl font-bold text-[#00ff88]">{hitCount}</div>
                </div>
                <div className="bg-white/[0.02] p-2 rounded border border-white/[0.05]">
                  <div className="text-[10px] text-[#6b7280]">HQ LEAKED</div>
                  <div className="text-xl font-bold text-[#ef4444]">{leakerCount}</div>
                </div>
              </div>

              <h4 className="text-xs text-[#9ca3af] uppercase tracking-wider mb-2 font-bold mt-3">System Ammo Status</h4>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto p-2 bg-black/30 rounded border border-white/[0.05] text-[10px] font-mono mb-3">
                {defenderProcuredRef.current.filter(b => b.system.category !== 'RADAR').length === 0 ? (
                  <div className="text-[#6b7280] text-center">No missile systems active.</div>
                ) : (
                  defenderProcuredRef.current.filter(b => b.system.category !== 'RADAR').map((battery, idx) => (
                    <div key={battery.id} className="flex justify-between items-center">
                      <span className="text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: battery.system.color }} />
                        {battery.system.name.split(' ')[0]} #{idx + 1}
                      </span>
                      <span className={battery.isDestroyed ? 'text-[#ef4444] font-bold' : battery.missilesPurchased === 0 ? 'text-[#f97316] font-bold' : 'text-[#00ff88]'}>
                        {battery.isDestroyed ? 'KIA' : `${battery.missilesPurchased} left`}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <h4 className="text-xs text-[#9ca3af] uppercase tracking-wider mb-2 font-bold">HQ Signal Log</h4>
              <div className="space-y-2 h-[140px] overflow-y-auto p-2 bg-black/30 rounded border border-white/[0.05] text-[11px] font-mono">
                {simLogs.map((log, index) => {
                  let colorClass = 'text-[#9ca3af]';
                  if (log.type === 'LAUNCH') colorClass = 'text-[#a855f7]';
                  if (log.type === 'DETECTION') colorClass = 'text-[#eab308]';
                  if (log.type === 'INTERCEPT_SUCCESS') colorClass = 'text-[#00ff88]';
                  if (log.type === 'INTERCEPT_FAIL') colorClass = 'text-[#f97316]';
                  if (log.type === 'BREACH') colorClass = 'text-[#ef4444]';

                  return (
                    <div key={index} className="flex gap-2">
                      <span className="text-[#4b5563]">{log.time}s</span>
                      <span className={colorClass}>{log.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.05]">
              <div className="text-[10px] text-[#6b7280] font-mono text-center">
                AUTOMATIC RESOLVING ENGAGEMENTS...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AFTER-ACTION REPORT PHASE */}
      {phase === 'report' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Main Stats Summary */}
          <div className="card p-6 border-[#00ff88]/20 space-y-6">
            <h2 className="text-lg font-bold text-[#00ff88]">📊 Engagement After-Action Report</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280] uppercase">Interception Success</div>
                <div className="text-2xl font-black text-[#00ff88] mt-1">
                  {((hitCount / threatCountTotal) * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-[#4b5563] mt-1">{hitCount} / {threatCountTotal} Threats</div>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280] uppercase">HQ Leaks (Fails)</div>
                <div className="text-2xl font-black text-[#ef4444] mt-1">
                  {leakerCount}
                </div>
                <div className="text-[10px] text-[#4b5563] mt-1">Penetrated command limits</div>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280] uppercase">Defensive Cost Outlay</div>
                <div className="text-2xl font-black text-white mt-1">
                  ${finalDefenderCostCalculated.toFixed(1)}M
                </div>
                <div className="text-[10px] text-[#4b5563] mt-1">Hardware loss & ammo cost</div>
              </div>

              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="text-[10px] text-[#6b7280] uppercase">Defensive Efficiency</div>
                <div className={`text-2xl font-black mt-1 ${hitCount >= threatCountTotal * 0.8 ? 'text-[#00ff88]' : 'text-[#f59e0b]'}`}>
                  {hitCount >= threatCountTotal * 0.8 ? 'OPTIMAL' : 'COMPROMISED'}
                </div>
                <div className="text-[10px] text-[#4b5563] mt-1">Layer evaluation rank</div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider">Procurement Cost Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#ef4444]/5 p-4 rounded border border-[#ef4444]/10">
                <h4 className="text-xs text-[#ef4444] uppercase tracking-wider font-bold mb-2">Attacker Expenses</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Missiles & Munitions Used:</span>
                    <span className="text-white">${firedWeaponsCost.toFixed(1)}M</span>
                  </div>
                  {lostAircraftCost > 0 && (
                    <div className="flex justify-between">
                      <span>Lost Jets & UAVs:</span>
                      <span className="text-white">${lostAircraftCost.toFixed(1)}M</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#ef4444]/15 pt-2 text-sm font-bold">
                    <span>Final Attacker Outlay:</span>
                    <span className="text-[#ef4444]">${finalAttackerCostCalculated.toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#00ff88]/5 p-4 rounded border border-[#00ff88]/10">
                <h4 className="text-xs text-[#00ff88] uppercase tracking-wider font-bold mb-2">Defender Expenses</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span>Fired Missile Salvos:</span>
                    <span className="text-white">${spentDefenderMissilesCost.toFixed(1)}M</span>
                  </div>
                  {destroyedBatteriesCostCalculated > 0 && (
                    <div className="flex justify-between">
                      <span>Destroyed SAM Batteries:</span>
                      <span className="text-white">${destroyedBatteriesCostCalculated.toFixed(1)}M</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#00ff88]/15 pt-2 text-sm font-bold">
                    <span>Final Defender Outlay:</span>
                    <span className="text-[#00ff88]">${finalDefenderCostCalculated.toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAM System Performance Breakdown */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">SAM System Performance Breakdown</h3>
            
            <div className="space-y-6">
              {(() => {
                // Find all systems that were deployed
                const deployedSystems = Array.from(new Set(defenderProcuredRef.current.map(b => b.system.id))).map(id => {
                  return defenderProcuredRef.current.find(b => b.system.id === id)!.system;
                });

                if (deployedSystems.length === 0) {
                  return <div className="text-xs text-[#6b7280] font-mono">No defensive systems deployed.</div>;
                }

                return deployedSystems.map(system => {
                  const systemEngagements = engagements.filter(e => e.systemId === system.id);
                  const overallTotal = systemEngagements.length;
                  const overallSuccess = systemEngagements.filter(e => e.success).length;
                  const overallRate = overallTotal > 0 ? (overallSuccess / overallTotal) * 100 : 0;
                  const overallLeft = defenderProcuredRef.current.filter(b => b.system.id === system.id).reduce((sum, b) => sum + b.missilesPurchased, 0);
                  const overallMissed = overallTotal - overallSuccess;

                  const threatTypes = ['BALLISTIC', 'CRUISE', 'FIGHTER', 'UAV', 'SWARM', 'HYPERSONIC', 'GLIDE_BOMB', 'ROCKET'];
                  
                  return (
                    <div key={system.id} className="p-4 rounded bg-white/[0.02] border border-white/[0.05] space-y-3">
                      <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: system.color }} />
                          <h4 className="text-sm font-bold text-white">{system.name}</h4>
                        </div>
                        <div className="text-xs font-mono">
                          Overall Interception Rate: <span className="font-bold text-[#00ff88]">{overallRate.toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs border-b border-white/[0.05] pb-3 mb-2">
                        <div className="p-2 rounded bg-white/[0.02] border border-white/[0.03]">
                          <div className="text-[10px] text-[#6b7280] uppercase">Missiles Fired</div>
                          <div className="text-sm font-bold text-white mt-0.5">{overallTotal}</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.02] border border-white/[0.03]">
                          <div className="text-[10px] text-[#6b7280] uppercase">Missiles Left</div>
                          <div className="text-sm font-bold text-[#00ff88] mt-0.5">{overallLeft}</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.02] border border-white/[0.03]">
                          <div className="text-[10px] text-[#6b7280] uppercase">Intercepted</div>
                          <div className="text-sm font-bold text-[#00ff88] mt-0.5">{overallSuccess}</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.02] border border-white/[0.03]">
                          <div className="text-[10px] text-[#6b7280] uppercase">Missed</div>
                          <div className="text-sm font-bold text-[#ef4444] mt-0.5">{overallMissed}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {threatTypes.map(type => {
                          const typeEngagements = systemEngagements.filter(e => e.threatType === type);
                          const total = typeEngagements.length;
                          const success = typeEngagements.filter(e => e.success).length;
                          const rate = total > 0 ? (success / total) * 100 : 0;

                          const labelMap: Record<string, string> = {
                            BALLISTIC: 'Ballistic',
                            CRUISE: 'Cruise',
                            FIGHTER: 'Fighter Jets',
                            UAV: 'UAVs',
                            SWARM: 'Drone Swarms',
                            HYPERSONIC: 'Hypersonic',
                            GLIDE_BOMB: 'Glide Bombs',
                            ROCKET: 'Rockets'
                          };

                          if (total === 0) return null;

                          return (
                            <div key={type} className="p-2 rounded bg-black/30 border border-white/[0.03] text-center font-mono text-[11px]">
                              <div className="text-[#9ca3af] mb-1">{labelMap[type] || type}</div>
                              <div className="text-xs font-bold text-[#00ff88]">{rate.toFixed(0)}%</div>
                              <div className="text-[9px] text-[#4b5563]">{success}/{total} hits</div>
                            </div>
                          );
                        })}
                        {overallTotal === 0 && (
                          <div className="col-span-full text-center py-2 text-xs text-[#4b5563] font-mono">
                            No active kinetic engagements registered for this system.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPhase('config');
                setAttackerProcured([]);
                setDefenderProcured([]);
                setSimLogs([]);
                setLeakerCount(0);
                setHitCount(0);
              }}
              className="btn-primary"
            >
              🔄 Launch New War Game Exercise
            </button>
            
            <button
              onClick={() => {
                setPhase('procure_defender');
                setSimLogs([]);
                setLeakerCount(0);
                setHitCount(0);
              }}
              className="btn-secondary"
            >
              🛠️ Re-layer Defense Positionings
            </button>
          </div>
        </div>
      )}

      {/* Educational Disclaimer */}
      <div className="card p-4 border-[#f59e0b]/20">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="text-xs text-[#f59e0b] font-medium mb-1">Educational Platform Disclaimer</p>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              This simulator highlights the asymmetric cost structures between threat delivery vehicles (like tactical glide units) and defensive platforms (like S-400 battalions). Missile costs represent approximated declassified figures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
