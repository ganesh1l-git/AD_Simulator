'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { getMissileThreatMultiplier, SYSTEM_THREAT_MULTIPLIERS, findSystemKey } from '@iades/shared';
import mergedDefenceCatalog from './merged_defence_catalog.json';
import mergedThreatCatalog from './merged_threat_catalog.json';

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
  accuracy?: number;
}

interface ThreatItem {
  id: string;
  name: string;
  type: 'BALLISTIC' | 'CRUISE' | 'FIGHTER' | 'UAV' | 'SWARM' | 'HYPERSONIC' | 'GLIDE_BOMB' | 'ROCKET' | 'LOITERING_MUNITION' | 'TACTICAL_MISSILE';
  speed: number; // Mach
  altitude: number; // meters
  rcs: number; // m²
  threatScore: number;
  cost: number; // in USD Millions (base price without weapons)
  color: string;
  maxSlots?: number;
  weaponsCatalog?: WeaponItem[];
  country?: string;
}

const THREAT_CATALOG: ThreatItem[] = mergedThreatCatalog as ThreatItem[];

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
  country?: string;
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

const mapLocalThreatToShared = (type: string): string => {
  switch (type) {
    case 'BALLISTIC': return 'BALLISTIC_MISSILE';
    case 'CRUISE': return 'CRUISE_MISSILE';
    case 'FIGHTER': return 'FIGHTER_AIRCRAFT';
    case 'SWARM': return 'DRONE_SWARM';
    case 'UAV': return 'UAV';
    case 'HYPERSONIC': return 'HYPERSONIC';
    case 'LOITERING_MUNITION': return 'LOITERING_MUNITION';
    case 'TACTICAL_MISSILE': return 'TACTICAL_MISSILE';
    default: return type;
  }
};


const isAirSuperiorityJet = (name: string): boolean => {
  const n = name.toLowerCase();
  return (
    n.includes('f-22') ||
    n.includes('f-15ex') ||
    n.includes('j-20') ||
    n.includes('su-35') ||
    n.includes('su-57') ||
    n.includes('j-16') ||
    n.includes('typhoon') ||
    n.includes('rafale') ||
    n.includes('kf-21') ||
    n.includes('su-30') ||
    n.includes('mig-31') ||
    n.includes('f-15c') ||
    n.includes('f-15k') ||
    n.includes('j-10') ||
    n.includes('f-16')
  );
};


const getA2AMissile = (loadoutStatus: any, type: 'BVR' | 'SR') => {
  if (!loadoutStatus) return null;
  for (const [wName, status] of Object.entries(loadoutStatus) as any) {
    if (status.fired < status.total) {
      const isA2A = status.weapon.set === 2;
      if (!isA2A) continue; // Skip non-A2A weapons

      const isBVR = status.weapon.range > 30;
      const isSR = status.weapon.range <= 30;

      if (type === 'BVR' && isBVR) {
        return { name: wName, status };
      }
      if (type === 'SR' && isSR) {
        return { name: wName, status };
      }
    }
  }
  return null;
};


const DEFENCE_CATALOG: DefenceItem[] = mergedDefenceCatalog as DefenceItem[];

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
  isPatrolling?: boolean;
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
  isA2A?: boolean;
}

interface VisualLog {
  time: number;
  message: string;
  type: 'LAUNCH' | 'DETECTION' | 'INTERCEPT_SUCCESS' | 'INTERCEPT_FAIL' | 'BREACH' | 'INFO';
}


const COUNTRY_META = {
  "india": {
    "label": "India",
    "flag": "🇮🇳",
    "color": "#00b4d8",
    "defColor": "#00b4d8"
  },
  "pakistan": {
    "label": "Pakistan",
    "flag": "🇵🇰",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "usa": {
    "label": "USA",
    "flag": "🇺🇸",
    "color": "#3b82f6",
    "defColor": "#3b82f6"
  },
  "china": {
    "label": "China",
    "flag": "🇨🇳",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "russia": {
    "label": "Russia",
    "flag": "🇷🇺",
    "color": "#dc2626",
    "defColor": "#dc2626"
  },
  "japan": {
    "label": "Japan",
    "flag": "🇯🇵",
    "color": "#f97316",
    "defColor": "#f97316"
  },
  "south_korea": {
    "label": "South Korea",
    "flag": "🇰🇷",
    "color": "#22d3ee",
    "defColor": "#22d3ee"
  },
  "uk": {
    "label": "UK",
    "flag": "🇬🇧",
    "color": "#6366f1",
    "defColor": "#6366f1"
  },
  "france": {
    "label": "France",
    "flag": "🇫🇷",
    "color": "#a78bfa",
    "defColor": "#a78bfa"
  },
  "germany": {
    "label": "Germany",
    "flag": "🇩🇪",
    "color": "#facc15",
    "defColor": "#facc15"
  },
  "generic": {
    "label": "Generic",
    "flag": "🌐",
    "color": "#10b981",
    "defColor": "#10b981"
  }
};

export default function SimulationPage() {
  const [phase, setPhase] = useState<SimPhase>('config');
  const [defCountryTab, setDefCountryTab] = useState<string>('india');
  const [attCountryTab, setAttCountryTab] = useState<string>('pakistan');
  const [collapsedThreats, setCollapsedThreats] = useState<Record<string, boolean>>({});
  const [collapsedDefenders, setCollapsedDefenders] = useState<Record<string, boolean>>({});

  const toggleThreatCollapse = (id: string) => {
    setCollapsedThreats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDefenderCollapse = (id: string) => {
    setCollapsedDefenders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [attackerBudget, setAttackerBudget] = useState(500); // USD Millions
  const defenderBudget = attackerBudget * 4; // Auto-scaling 4x

  // Weather/ECMs
  const [weather, setWeather] = useState<'CLEAR' | 'CLOUDY' | 'STORMY'>('CLEAR');
  const [ecm, setEcm] = useState<'NONE' | 'LOW' | 'HIGH'>('NONE');

  // Attacker list of selected weapons
  const [attackerProcured, setAttackerProcured] = useState<SelectedThreat[]>([]);
  // Defender list of placed defense units
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

  // Defender Procurement Cost Calculation (unit costs + initial ammo purchases based on selected missile type)
  const defenderTotalSpent = defenderProcured.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * Math.max(0, (Number(item.missilesPurchased) || 0) - (item.system.defaultAmmo || 0))), 0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualThreatsRef = useRef<VisualThreat[]>([]);
  const visualInterceptorsRef = useRef<VisualInterceptor[]>([]);
  const simTimeRef = useRef(0);
  const defenderProcuredRef = useRef<SelectedDefence[]>([]);
  // Radar sweep tracking: radarId -> current sweep angle (radians)
  const radarSweepAnglesRef = useRef<Record<string, number>>({});
  // Radar cueing bonus active: radarId -> threatId -> sim-time when bonus expires
  const radarBonusActiveRef = useRef<Record<string, Record<string, number>>>({});
  // Radar cued kills tracking: radarId -> { radarName, assistedSAMs: Set<string>, cuedKills, cueEvents }
  const radarCuedKillsRef = useRef<Record<string, { radarName: string; assistedSAMs: Set<string>; cuedKills: number; cueEvents: number }>>({});
  // Per interceptor: was it launched under active radar cue? interceptorId -> radarId
  const interceptorRadarCueRef = useRef<Record<string, string>>({});
  
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

      // Ra'ad and CM-400AKG are mutually exclusive on JF-17 Block III
      const isJF17 = target.threat.name.toLowerCase().includes('jf-17');
      if (isJF17 && numericVal > 0) {
        if (weaponName === "Ra'ad ALCM" && (Number(target.loadout['CM-400AKG Supersonic']) || 0) > 0) {
          return prev;
        }
        if (weaponName === 'CM-400AKG Supersonic' && (Number(target.loadout["Ra'ad ALCM"]) || 0) > 0) {
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

      // Ra'ad and CM-400AKG are mutually exclusive on JF-17 Block III
      const isJF17 = target.threat.name.toLowerCase().includes('jf-17');
      if (isJF17) {
        if (weaponName === "Ra'ad ALCM" && newQty > 0 && (Number(target.loadout['CM-400AKG Supersonic']) || 0) > 0) {
          return prev;
        }
        if (weaponName === 'CM-400AKG Supersonic' && newQty > 0 && (Number(target.loadout["Ra'ad ALCM"]) || 0) > 0) {
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
        let tempSpent = prev.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * Math.max(0, (Number(item.missilesPurchased) || 0) - (item.system.defaultAmmo || 0))), 0);
        const selectedMissile = currentItems[0]?.selectedMissile || getBatteryDefaultMissile(system);
        const initialAmmo = system.category === 'RADAR' ? 0 : (system.defaultAmmo ?? 8);

        for (let i = currentQty; i < targetQty; i++) {
          const unitCost = system.batteryCost + (system.category === 'RADAR' ? 0 : Math.max(0, initialAmmo - (system.defaultAmmo ?? 8)) * selectedMissile.cost);
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
    const unitCost = system.batteryCost + (system.category === 'RADAR' ? 0 : Math.max(0, initialAmmo - (system.defaultAmmo ?? 8)) * selectedMissile.cost);
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
      const currentAmmo = Number(battery.missilesPurchased) || 0;
      const costDiff = (Math.max(0, numericVal - (battery.system.defaultAmmo || 0)) - Math.max(0, currentAmmo - (battery.system.defaultAmmo || 0))) * battery.selectedMissile.cost;
      if (defenderTotalSpent + costDiff > defenderBudget) return battery;
      return { ...battery, missilesPurchased: val as any };
    }));
  };

  const adjustBatteryAmmo = (id: string, delta: number) => {
    setDefenderProcured(prev => prev.map(battery => {
      if (battery.id !== id) return battery;
      const currentAmmo = Number(battery.missilesPurchased) || 0;
      const nextAmmo = Math.max(0, currentAmmo + delta);
      const costDiff = (Math.max(0, nextAmmo - (battery.system.defaultAmmo || 0)) - Math.max(0, currentAmmo - (battery.system.defaultAmmo || 0))) * battery.selectedMissile.cost;
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

      const nextTotalSpent = nextProcured.reduce((sum, item) => sum + item.system.batteryCost + (item.selectedMissile.cost * Math.max(0, (Number(item.missilesPurchased) || 0) - (item.system.defaultAmmo || 0))), 0);
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
      { time: 0, message: '[SYS] Simulation initialized. Defense coordinates mapped.', type: 'INFO' },
      { time: 0, message: '[RADAR] Active AESA Radars operating. Coverage cones active.', type: 'INFO' }
    ]);
    setLeakerCount(0);
    setHitCount(0);
    setSpentDefenderMissilesCost(0);
    setEngagements([]);
    radarSweepAnglesRef.current = {};
    radarBonusActiveRef.current = {};
    radarCuedKillsRef.current = {};
    interceptorRadarCueRef.current = {};

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

      // Advance radar sweep angles each tick (6 RPM = full rotation every 10 sim-seconds)
      const rotPeriodSec = 10;
      currentPlacements.forEach(p => {
        if (p.system.category === 'RADAR' && !p.isDestroyed) {
          const prev = radarSweepAnglesRef.current[p.id] ?? 0;
          radarSweepAnglesRef.current[p.id] = (prev + (2 * Math.PI / rotPeriodSec) * simSpeed) % (2 * Math.PI);
        }
      });

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
              message: `[RTB] Attacker ${t.threat.name} successfully returned to base and exited airspace.`,
              type: 'INFO'
            }]);
          }
          return;
        }

        // Flight towards target: distance to target decreases
        const currentDistance = t.distanceToTarget ?? 200.0;
        let nextDistance = Math.max(0.0, currentDistance - distStep);

        // Check if pure escort/air superiority fighter should establish CAP line at 100km
        const patrolRange = 100.0;
        let isPureEscort = false;
        if (t.loadoutStatus) {
          const hasUnfiredGroundStrike = Object.values(t.loadoutStatus).some((wStatus: any) => {
            return wStatus.weapon.set !== 2 && wStatus.fired < wStatus.total;
          });
          const isAirSuperiority = isAirSuperiorityJet(t.threat.name);
          const hasGroundStrikeAtAll = Object.values(t.loadoutStatus).some((wStatus: any) => {
            return wStatus.weapon.set !== 2;
          });
          if ((isAirSuperiority && !hasUnfiredGroundStrike) || !hasGroundStrikeAtAll) {
            isPureEscort = true;
          }
        }

        if (isPureEscort && nextDistance <= patrolRange && !t.isReturning) {
          if (!t.isPatrolling) {
            t.isPatrolling = true;
            (t as any).patrolDistance = nextDistance;
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[PATROL] Escort fighter ${t.threat.name} established Combat Air Patrol (CAP) line at ${nextDistance.toFixed(0)}km. Defending wingmen.`,
              type: 'INFO'
            }]);
          }
          nextDistance = (t as any).patrolDistance ?? nextDistance;
        }

        t.distanceToTarget = nextDistance;
        const initDist = t.initialDistance ?? 200.0;
        t.progress = initDist > 0 ? (initDist - nextDistance) / initDist : 1.0;

        const baseX = t.startX + ((t.targetX ?? 50) - t.startX) * t.progress;
        const baseY = t.startY + ((t.targetY ?? 80) - t.startY) * t.progress;

        if (t.isPatrolling) {
          const angle = (simTimeRef.current * 0.1) % (2 * Math.PI);
          t.x = baseX + Math.cos(angle) * 2.0;
          t.y = baseY + Math.sin(angle) * 2.0;

          // Check if it should return to base because all strike packages have finished/dead/returning
          const activeStrikeThreats = activeThreats.some(other => {
            if (other.id === t.id || other.isDead || other.isLeaked || other.isReturning) return false;
            let otherIsEscort = false;
            if (other.loadoutStatus) {
              const hasGround = Object.values(other.loadoutStatus).some((w: any) => {
                return w.weapon.set !== 2;
              });
              const isAirSup = isAirSuperiorityJet(other.threat.name);
              otherIsEscort = isAirSup || !hasGround;
            }
            return !otherIsEscort;
          });

          if (!activeStrikeThreats) {
            t.isPatrolling = false;
            t.isReturning = true;
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[RTB] Escort fighter ${t.threat.name} returning to base (all strike wingmen resolved).`,
              type: 'INFO'
            }]);
          }
        } else {
          t.x = baseX;
          t.y = baseY;
        }

        // Check standoff launch condition for jets/UAVs
        if (t.loadoutStatus) {
          let hasGroundStrikePayloads = false;
          let hasUnfiredGroundStrikePayloads = false;

          Object.entries(t.loadoutStatus).forEach(([wName, wStatus]) => {
            const isA2A = wStatus.weapon.set === 2;

            if (isA2A) {
              // A2A missiles are reserved for defense/escort protection, never launched at the ground city target
              return;
            }

            hasGroundStrikePayloads = true;

            if (wStatus.fired < wStatus.total) {
              if (nextDistance <= wStatus.weapon.range) {
                // Spawn the fired payloads as individual entities starting at current jet position
                wStatus.fired = wStatus.total;
                for (let i = 0; i < wStatus.total; i++) {
                  const isAntiRad = wStatus.weapon.name.toLowerCase().includes('anti-radiation') || wStatus.weapon.name.toLowerCase().includes('harm') || wStatus.weapon.name.toLowerCase().includes('arm') || wStatus.weapon.name.includes('YJ-91');
                  let targetBatteryId: string | undefined = undefined;
                  let targetX = 50;
                  let targetY = 80;
                  let payloadDistance = nextDistance;

                  if (isAntiRad) {
                    const activeRadars = currentPlacements.filter(b => b.system.category === 'RADAR' && !b.isDestroyed);
                    const activeOthers = currentPlacements.filter(b => b.system.category !== 'RADAR' && !b.isDestroyed);
                    const targetPool = activeRadars.length > 0 ? activeRadars : activeOthers;

                    if (targetPool.length > 0) {
                      const targetBattery = targetPool[Math.floor(Math.random() * targetPool.length)];
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
                  message: `[LAUNCH] STANDOFF: ${t.threat.name} released ${wStatus.total}x ${wName} payload at range ${nextDistance.toFixed(0)}km`,
                  type: 'LAUNCH'
                }]);
              } else {
                hasUnfiredGroundStrikePayloads = true;
              }
            }
          });

          // If all configured ground-strike weapons are fired, the aircraft RTBs immediately (unless it's an air superiority fighter)
          if (hasGroundStrikePayloads && !hasUnfiredGroundStrikePayloads) {
            const isAirSuperiority = isAirSuperiorityJet(t.threat.name);
            if (isAirSuperiority) {
              if (!t.isPatrolling) {
                t.isPatrolling = true;
                (t as any).patrolDistance = nextDistance;
                setSimLogs(prev => [...prev, {
                  time: simTimeRef.current,
                  message: `[PATROL] Air superiority fighter ${t.threat.name} expended ground strike payloads. Transitioning to Combat Air Patrol at ${nextDistance.toFixed(0)}km to defend wingmen.`,
                  type: 'INFO'
                }]);
              }
            } else {
              t.isReturning = true;
              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `[RTB] ${t.threat.name} expended all ground strike payloads. Turning back to base.`,
                type: 'INFO'
              }]);
            }
          }
        }

        // If a jet has launched all of its missiles of all categories, it leaves (RTB).
        const hasAnyLoadout = t.loadoutStatus && Object.keys(t.loadoutStatus).length > 0;
        const allMissilesFired = hasAnyLoadout && Object.values(t.loadoutStatus || {}).every((wStatus: any) => wStatus.fired >= wStatus.total);
        if (allMissilesFired && !t.isReturning) {
          t.isReturning = true;
          t.isPatrolling = false;
          setSimLogs(prev => [...prev, {
            time: simTimeRef.current,
            message: `[RTB] ${t.threat.name} has expended all weapons across all categories. Returning to base.`,
            type: 'INFO'
          }]);
        }



        // Check if threat has reached HQ target or battery target
        if (!t.isReturning && nextDistance <= 0.01) {
          t.isLeaked = true;
          if (t.targetBatteryId) {
            const hitBattery = currentPlacements.find(b => b.id === t.targetBatteryId);
            if (hitBattery) {
              hitBattery.isDestroyed = true;
            }
            const batteryName = hitBattery ? hitBattery.system.name : 'Defender Unit';
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[IMPACT] SEAD HIT: Anti-radiation missile destroyed ${batteryName}`,
              type: 'BREACH'
            }]);
          } else {
            if (isPureEscort) {
              t.isReturning = true;
              t.distanceToTarget = 0.01;
              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `[RTB] Escort fighter ${t.threat.name} completed escort/defense patrol. Returning to base.`,
                type: 'INFO'
              }]);
            } else {
              setLeakerCount(prev => prev + 1);
              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `[BREACH] Attacker ${t.threat.name} impacted Command HQ`,
                type: 'BREACH'
              }]);
            }
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
              message: `[DETECT] ${t.threat.name} locked — range ${currentDistance.toFixed(0)}km, Alt: ${currentAlt}m, Mach ${t.threat.speed}`,
              type: 'DETECTION'
            }]);
          }
        }
      });

      // 3. Defender firing logical tick
      currentPlacements.forEach(placed => {
        if (placed.system.category === 'RADAR' || placed.missilesPurchased <= 0 || placed.isDestroyed) return;

        const isModern = placed.system.name.includes('S-400') ||
                         placed.system.name.includes('Barak') ||
                         placed.system.name.includes('Akash-NG') ||
                         placed.system.name.includes('SPYDER') ||
                         placed.system.name.includes('QRSAM') ||
                         placed.system.name.includes('Patriot') ||
                         placed.system.name.includes('NASAMS') ||
                         placed.system.name.includes('IRIS-T') ||
                         placed.system.name.includes('Sky Sabre');
        
        const hasStandAloneRadarsInScenario = currentPlacements.some(p => p.system.category === 'RADAR');
        const activeExternalRadars = currentPlacements.filter(p => p.system.category === 'RADAR' && !p.isDestroyed).length;
        const activeModernADSystems = currentPlacements.filter(p => p.id !== placed.id && !p.isDestroyed && p.system.category !== 'RADAR' && (
          p.system.name.includes('S-400') || p.system.name.includes('Barak') || p.system.name.includes('Akash-NG') || p.system.name.includes('SPYDER') || p.system.name.includes('QRSAM') || p.system.name.includes('Patriot') || p.system.name.includes('NASAMS') || p.system.name.includes('IRIS-T') || p.system.name.includes('Sky Sabre')
        )).length;

        // If radar systems got attacked (destroyed), the air defence systems should not work if they are alone
        if (hasStandAloneRadarsInScenario && activeExternalRadars === 0) {
          if (!isModern || activeModernADSystems === 0) {
            return; // Doesn't work!
          }
        }

        let targetThreat: VisualThreat | null = null;
        let minDistancePct = placed.selectedMissile.range / 2.5;

          // ── Shared engagement rule: doctrine salvo + maxSAMs by threat class ────────
          const isModernSAM = placed.system.name.includes('S-400') ||
                              placed.system.name.includes('Barak 8 ER') ||
                              placed.system.name.includes('Barak 8') ||
                              placed.system.name.includes('Barak-8') ||
                              placed.system.name.includes('Akash-NG') ||
                              placed.system.name.includes('QRSAM') ||
                              placed.system.name.includes('SPYDER');

          const getDoctrineSalvo = (threatType: string, threatSpeed: number): { salvoPerSAM: number; maxSAMs: number } => {
            if (!isModernSAM) return { salvoPerSAM: 1, maxSAMs: 2 };
            switch (threatType) {
              case 'UAV': case 'SWARM': case 'ROCKET':
              case 'LOITERING_MUNITION': case 'GLIDE_BOMB':
                return { salvoPerSAM: 1, maxSAMs: 2 };
              case 'FIGHTER': case 'BOMBER': case 'ATTACK_HELICOPTER':
                return { salvoPerSAM: 2, maxSAMs: 2 };
              case 'CRUISE': case 'TACTICAL':
                return threatSpeed >= 3.0
                  ? { salvoPerSAM: 2, maxSAMs: 3 }  // supersonic
                  : { salvoPerSAM: 2, maxSAMs: 2 };  // subsonic
              case 'BALLISTIC':
                // User cap: max 2 per SAM. Large MRBMs still get 2 but from 3 SAMs.
                return threatSpeed >= 7.0
                  ? { salvoPerSAM: 2, maxSAMs: 3 }
                  : { salvoPerSAM: 2, maxSAMs: 2 };
              case 'HYPERSONIC':
                return { salvoPerSAM: threatSpeed >= 12 ? 4 : 3, maxSAMs: 3 };
              default:
                return { salvoPerSAM: 1, maxSAMs: 2 };
            }
          };

          // ── Ammo Conservation (computed once per battery, before the target loop) ───
          // Same metrics used in both gate-check and fire-block so they always agree.
          const _activeSAMCount = currentPlacements.filter(p =>
            !p.isDestroyed && p.missilesPurchased > 0 && p.system.category !== 'RADAR'
          ).length;
          const _totalMissiles = currentPlacements
            .filter(p => !p.isDestroyed && p.system.category !== 'RADAR')
            .reduce((sum, p) => sum + (Number(p.missilesPurchased) || 0), 0);
          const _activeThreats = activeThreats.filter(t =>
            !t.isDead && !t.isLeaked && t.detected
          ).length;
          const _ammoRatio = _activeThreats > 0 ? _totalMissiles / _activeThreats : 99;

          // 0=Normal, 1=Cautious (≤3 SAMs or ratio≤3), 2=Critical (ratio≤1.5)
          const _consLevel = _ammoRatio <= 1.5 ? 2 : (_activeSAMCount <= 3 || _ammoRatio <= 3.0 ? 1 : 0);

          const getEffectiveSalvo = (threatType: string, threatSpeed: number): number => {
            const { salvoPerSAM } = getDoctrineSalvo(threatType, threatSpeed);
            if (_consLevel === 2) {
              // Critical: 1 for easy, 2 max for high-priority
              const hiPri = threatType === 'BALLISTIC' || threatType === 'HYPERSONIC' ||
                            (threatType === 'CRUISE' && threatSpeed >= 3.0);
              return hiPri ? Math.min(2, salvoPerSAM) : 1;
            }
            if (_consLevel === 1) return Math.max(1, salvoPerSAM - 1); // trim by 1
            return salvoPerSAM; // normal
          };

          for (const t of activeThreats) {
            if (!t.detected || t.isDead || t.isLeaked) continue;

            let capability = getMissileThreatMultiplier(placed.selectedMissile.name, t.threat.type);
            if (capability === undefined) {
              const sysKey = findSystemKey(placed.system.name);
              if (sysKey && SYSTEM_THREAT_MULTIPLIERS[sysKey]) {
                const sharedThreatType = mapLocalThreatToShared(t.threat.type);
                capability = SYSTEM_THREAT_MULTIPLIERS[sysKey][sharedThreatType];
              }
            }
            if (capability === 0.0) continue;

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
                if (!(isFinalStage && noOneFiring)) continue;
              }
            }

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
                  if ((placed.ballisticFiredCount ?? 0) >= limit) continue;
                }
              }
            }

            const currentDistance = t.distanceToTarget ?? 200.0;
            let currentAlt = t.threat.type === 'BALLISTIC' || t.threat.type === 'HYPERSONIC'
              ? t.threat.altitude * Math.max((currentDistance / 200.0), 0.05)
              : t.threat.altitude;

            const isABM = placed.system.name.includes('S-400') ||
                          placed.system.name.includes('Barak-8') ||
                          placed.system.name.includes('Barak 8 ER') ||
                          placed.system.name.includes('Barak 8') ||
                          placed.system.name.includes('Akash-NG') ||
                          placed.selectedMissile.name.includes('40N6') ||
                          placed.selectedMissile.name.includes('48N6') ||
                          placed.selectedMissile.name.includes('Barak-8') ||
                          placed.selectedMissile.name.includes('Barak 8 ER') ||
                          placed.selectedMissile.name.includes('Barak 8') ||
                          placed.selectedMissile.name.includes('Akash-NG');

            if (t.threat.type === 'BALLISTIC' && currentAlt > placed.selectedMissile.maxAlt && isABM) {
              currentAlt = (placed.selectedMissile.minAlt + placed.selectedMissile.maxAlt) / 2;
            }
            if (currentAlt < placed.selectedMissile.minAlt || currentAlt > placed.selectedMissile.maxAlt) continue;

            // Gate: use conserved salvo size so gate and fire block always agree
            const effectiveSalvoForGate = getEffectiveSalvo(t.threat.type, t.threat.speed);
            const activeSalvoCount = activeInterceptors.filter(i => !i.isDead && i.targetId === t.id && i.batteryId === placed.id).length;
            if (activeSalvoCount >= effectiveSalvoForGate) continue;

            const { maxSAMs } = getDoctrineSalvo(t.threat.type, t.threat.speed);
            const activeBatteryEngagements = new Set(
              activeInterceptors.filter(i => !i.isDead && i.targetId === t.id).map(i => i.batteryId)
            ).size;
            if (activeBatteryEngagements >= maxSAMs) continue;

            const distance = Math.sqrt(Math.pow(placed.x - t.x, 2) + Math.pow(placed.y - t.y, 2));
            if (distance <= minDistancePct) {
              minDistancePct = distance;
              targetThreat = t;
            }
          }

        if (targetThreat) {
          // Use the SAME getEffectiveSalvo helper (already computed above) for consistency
          const salvoCount = getEffectiveSalvo(targetThreat.threat.type, targetThreat.threat.speed);
          const missilesToFire = Math.min(salvoCount, placed.missilesPurchased);
          if (missilesToFire <= 0) return;

          const isAdvanced = placed.system.name.includes('S-400') ||
                             placed.system.name.includes('Barak') ||
                             placed.system.name.includes('Akash-NG') ||
                             placed.system.name.includes('SPYDER') ||
                             placed.system.name.includes('QRSAM') ||
                             placed.selectedMissile.name.includes('40N6') ||
                             placed.selectedMissile.name.includes('48N6') ||
                             placed.selectedMissile.name.includes('9M96') ||
                             placed.selectedMissile.name.includes('Barak') ||
                             placed.selectedMissile.name.includes('Akash-NG') ||
                             placed.selectedMissile.name.includes('Derby') ||
                             placed.selectedMissile.name.includes('Python') ||
                             placed.selectedMissile.name.includes('QRSAM');

          // --- Radar Cueing Bonus ---
          let radarBonus = 0;
          if (isAdvanced) {
            const activeRadars = currentPlacements.filter(p => p.system.category === 'RADAR' && !p.isDestroyed).length;
            if (activeRadars >= 1) {
              // 8% for first radar, 3% for each additional
              radarBonus = 0.08 + (activeRadars - 1) * 0.03;
              if (simTimeRef.current % 10 === 0) {
                setSimLogs(prev => [...prev, {
                  time: simTimeRef.current,
                  message: `📡 RADAR CONNECTIVITY: ${activeRadars}x external radars boosting modern AD network by +${(radarBonus * 100).toFixed(0)}%!`,
                  type: 'DETECTION'
                }]);
              }
            }
          }

          // Launch salvo
          placed.missilesPurchased -= missilesToFire;
          setSpentDefenderMissilesCost(prev => prev + placed.selectedMissile.cost * missilesToFire);

          if (targetThreat.threat.type === 'BALLISTIC' && placed.ballisticFiredCount !== undefined) {
            placed.ballisticFiredCount += missilesToFire;
          }

          const currentDistance = targetThreat.distanceToTarget ?? 200.0;
          const currentAlt = Math.round(targetThreat.threat.type === 'BALLISTIC' || targetThreat.threat.type === 'HYPERSONIC'
            ? targetThreat.threat.altitude * Math.max((currentDistance / 200.0), 0.05)
            : targetThreat.threat.altitude);

          // Record which SAM systems this radar is assisting
          if (radarBonus > 0) {
            currentPlacements.forEach(radarPlaced => {
              if (radarPlaced.system.category !== 'RADAR' || radarPlaced.isDestroyed) return;
              if (radarCuedKillsRef.current[radarPlaced.id]) {
                radarCuedKillsRef.current[radarPlaced.id].assistedSAMs.add(placed.system.name);
              }
            });
          }

          for (let s = 0; s < missilesToFire; s++) {
            let interceptAccuracy = placed.selectedMissile.accuracy;

            // Apply system/missile threat capability coefficient
            let coefficient = getMissileThreatMultiplier(placed.selectedMissile.name, targetThreat.threat.type);
            if (coefficient === undefined) {
              const sysKey = findSystemKey(placed.system.name);
              if (sysKey && SYSTEM_THREAT_MULTIPLIERS[sysKey]) {
                const sharedThreatType = mapLocalThreatToShared(targetThreat.threat.type);
                coefficient = SYSTEM_THREAT_MULTIPLIERS[sysKey][sharedThreatType];
              }
            }
            if (coefficient !== undefined) {
              interceptAccuracy = placed.selectedMissile.accuracy * coefficient;
            }

            // Apply ECM degradation
            if (ecm === 'LOW') interceptAccuracy -= isAdvanced ? 0.03 : 0.10;
            if (ecm === 'HIGH') interceptAccuracy -= isAdvanced ? 0.08 : 0.22;

            // Apply ARM radar attacked penalty
            if (hasStandAloneRadarsInScenario && currentPlacements.some(p => p.system.category === 'RADAR' && p.isDestroyed)) {
              if (activeExternalRadars > 0) {
                // uses that external radar, but hit rate drops by 30%
                interceptAccuracy = interceptAccuracy * 0.70;
              } else if (activeModernADSystems > 0) {
                // uses peer modern AD system radar, but hit rate drops by 60%
                interceptAccuracy = interceptAccuracy * 0.40;
              }
            }

            // Small per-missile variance for realism (±2%)
            interceptAccuracy = Math.min(0.99, Math.max(0, interceptAccuracy + (Math.random() - 0.5) * 0.04));

            const intId = `int-${Date.now()}-${s}-${Math.random().toString(36).substr(2, 4)}`;
            // Tag interceptor with active radar cue if bonus > 0
            if (radarBonus > 0) {
              const cuingRadarId = Object.keys(radarCuedKillsRef.current)[0];
              if (cuingRadarId) interceptorRadarCueRef.current[intId] = cuingRadarId;
            }
            activeInterceptors.push({
              id: intId,
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
          }

          if (missilesToFire > 1) {
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[SALVO] ${placed.system.name} fired ${missilesToFire}x ${placed.selectedMissile.name} — Alt: ${currentAlt}m, Range: ${currentDistance.toFixed(0)}km${radarBonus > 0 ? ` [Radar +${(radarBonus * 100).toFixed(0)}%]` : ''}`,
              type: 'LAUNCH'
            }]);
          } else {
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[LAUNCH] ${placed.system.name} fired ${placed.selectedMissile.name} — Alt: ${currentAlt}m, Range: ${currentDistance.toFixed(0)}km${radarBonus > 0 ? ` [Radar +${(radarBonus * 100).toFixed(0)}%]` : ''}`,
              type: 'LAUNCH'
            }]);
          }
        }
      });

      // 4. Update interceptors
      activeInterceptors.forEach(interceptor => {
        if (interceptor.isDead) return;

        if (interceptor.isA2A) {
          // A2A Interceptor update: target is a SAM interceptor
          const targetSAM = activeInterceptors.find(sam => sam.id === interceptor.targetId && !sam.isDead && !sam.isA2A);
          if (!targetSAM) {
            interceptor.isDead = true;
            return;
          }

          const dx = targetSAM.x - interceptor.x;
          const dy = targetSAM.y - interceptor.y;
          const distPct = Math.sqrt(dx * dx + dy * dy);
          const stepPct = ((interceptor.speed * 0.34) / 2.5) * simSpeed;

          if (stepPct >= distPct) {
            interceptor.x = targetSAM.x;
            interceptor.y = targetSAM.y;
            interceptor.isDead = true;

            const hit = Math.random() < interceptor.accuracy;
            if (hit) {
              targetSAM.isDead = true;
              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `💥 A2A INTERCEPT: SAM interceptor destroyed in flight!`,
                type: 'INTERCEPT_SUCCESS'
              }]);
            } else {
              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `💨 A2A MISS: A2A missile missed the incoming SAM.`,
                type: 'INTERCEPT_FAIL'
              }]);
            }
          } else {
            interceptor.x += (dx / distPct) * stepPct;
            interceptor.y += (dy / distPct) * stepPct;
          }
          return;
        }

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

        // --- A2A Self-defense logic ---
        const hasA2ASelfDefense = target.loadoutStatus && Object.values(target.loadoutStatus).some((wStatus: any) => wStatus.weapon.set === 2 && wStatus.fired < wStatus.total);
        if (hasA2ASelfDefense) {
          if (!(interceptor as any).a2aChecked) {
            (interceptor as any).a2aChecked = { bvr: false, sr: false };
          }

          const dx = target.x - interceptor.x;
          const dy = target.y - interceptor.y;
          const distanceInKm = Math.sqrt(dx * dx + dy * dy) * 2.5;

          // BVR range: 30km to 100km
          if (distanceInKm > 30 && distanceInKm <= 100 && !(interceptor as any).a2aChecked.bvr) {
            const a2a = getA2AMissile(target.loadoutStatus, 'BVR');
            if (a2a) {
              (interceptor as any).a2aChecked.bvr = true;
              a2a.status.fired++;
              const isModern = isAirSuperiorityJet(target.threat.name) || target.threat.name.includes('Block III') || target.threat.name.includes('Block 52+') || target.threat.name.includes('Rafale') || target.threat.name.includes('Su-30') || target.threat.name.includes('JF-17');
              const detectProb = isModern ? 0.85 : 0.60;

              // Spawn A2A interceptor targeting this SAM
              const a2aIntId = `a2a-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
              activeInterceptors.push({
                id: a2aIntId,
                startX: target.x,
                startY: target.y,
                x: target.x,
                y: target.y,
                targetId: interceptor.id,
                progress: 0,
                accuracy: 0.60,
                isDead: false,
                color: '#38bdf8', // Cyan for A2A
                speed: a2a.status.weapon.speed,
                isA2A: true,
              });

              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `✈️ A2A DEFENSE: ${target.threat.name} RWR locked SAM. Launched ${a2a.name} (BVR AAM) in self-defense!`,
                type: 'LAUNCH'
              }]);
            }
          }

          // SR range: <= 30km
          if (distanceInKm <= 30 && !(interceptor as any).a2aChecked.sr) {
            const a2a = getA2AMissile(target.loadoutStatus, 'SR');
            if (a2a) {
              (interceptor as any).a2aChecked.sr = true;
              a2a.status.fired++;

              // Spawn A2A interceptor targeting this SAM
              const a2aIntId = `a2a-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
              activeInterceptors.push({
                id: a2aIntId,
                startX: target.x,
                startY: target.y,
                x: target.x,
                y: target.y,
                targetId: interceptor.id,
                progress: 0,
                accuracy: 0.60,
                isDead: false,
                color: '#60a5fa', // Blue for SR A2A
                speed: a2a.status.weapon.speed,
                isA2A: true,
              });

              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `✈️ A2A DEFENSE: ${target.threat.name} visual contact on SAM. Launched ${a2a.name} (SR AAM) in self-defense!`,
                type: 'LAUNCH'
              }]);
            }
          }
        }

        // --- Escort Cover Intercept Logic ---
        if (!(interceptor as any).escortInterceptionChecked) {
          const escort = activeThreats.find(escortThreat => {
            if (escortThreat.isDead || escortThreat.isLeaked) return false;
            if (escortThreat.id === target.id) return false; // Self-defense logic already covers this target

            const escName = escortThreat.threat.name.toLowerCase();
            const isAirSuperiority = isAirSuperiorityJet(escName);
            if (!isAirSuperiority) return false;

            const a2a = getA2AMissile(escortThreat.loadoutStatus, 'BVR');
            if (!a2a) return false;

            // Distance from escort to SAM in Km
            const dx = escortThreat.x - interceptor.x;
            const dy = escortThreat.y - interceptor.y;
            const escortDist = Math.sqrt(dx * dx + dy * dy) * 2.5;

            // Escort is within BVR range to launch intercept
            return escortDist <= 100;
          });

          if (escort) {
            const a2a = getA2AMissile(escort.loadoutStatus, 'BVR');
            if (a2a) {
              (interceptor as any).escortInterceptionChecked = true;
              a2a.status.fired++;

              // Spawn A2A interceptor targeting this SAM
              const a2aIntId = `a2a-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
              activeInterceptors.push({
                id: a2aIntId,
                startX: escort.x,
                startY: escort.y,
                x: escort.x,
                y: escort.y,
                targetId: interceptor.id,
                progress: 0,
                accuracy: 0.60,
                isDead: false,
                color: '#38bdf8', // Cyan for BVR A2A
                speed: a2a.status.weapon.speed,
                isA2A: true,
              });

              setSimLogs(prev => [...prev, {
                time: simTimeRef.current,
                message: `🛡️ ESCORT COVER: Escort fighter ${escort.threat.name} locked SAM targeting wingman ${target.threat.name}. Launched ${a2a.name} (BVR AAM) to defend wingman!`,
                type: 'LAUNCH'
              }]);
            }
          }
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
            // Credit cued kill to the radar that assisted this interceptor
            const cuingRadarId = interceptorRadarCueRef.current[interceptor.id];
            if (cuingRadarId && radarCuedKillsRef.current[cuingRadarId]) {
              radarCuedKillsRef.current[cuingRadarId].cuedKills++;
            }
            delete interceptorRadarCueRef.current[interceptor.id];
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[KILL] Target ${target.threat.name} neutralized`,
              type: 'INTERCEPT_SUCCESS'
            }]);
          } else {
            setSimLogs(prev => [...prev, {
              time: simTimeRef.current,
              message: `[MISS] Interceptor missed ${target.threat.name}`,
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

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
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
          }).catch(err => console.warn('Failed background wargame save:', err.message));
        } else {
          console.log('Skipping background wargame save (no active auth session).');
        }

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
        ctx.lineWidth = i.isA2A ? 1.5 : 2.5;
        ctx.beginPath();
        ctx.arc(intX, intY, i.isA2A ? 2 : 3, 0, Math.PI * 2);
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
    <div className="space-y-4">
      {/* Banner */}
      <div className="card p-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">Layered Simulation Sandbox</h1>
            <p className="text-[11px] text-[#475569] font-mono mt-0.5">
              Two-player budget procurement exercise — Attacker vs Defender
            </p>
          </div>
          <div className="flex gap-2">
            <div className="badge badge-cyan text-[9px]">OPERATIONAL RATIO: 4:1 BUDGET</div>
          </div>
        </div>
      </div>

      {/* Progress Phases */}
      <div className="card p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { id: 'config', label: 'SETUP' },
            { id: 'procure_attacker', label: 'ATTACKER PROC.' },
            { id: 'procure_defender', label: 'DEFENDER LAYER' },
            { id: 'simulate', label: 'SIMULATION' },
            { id: 'report', label: 'AAR' }
          ].map((p, i) => (
            <div key={p.id} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono font-bold ${
                phase === p.id ? 'bg-[#38bdf8] text-[#0b0f19]' : 'bg-[#1b2340] text-[#475569]'
              }`}>
                {i + 1}
              </div>
              <span className={`text-[10px] font-mono ${phase === p.id ? 'text-[#38bdf8] font-semibold' : 'text-[#475569]'}`}>
                {p.label}
              </span>
              {i < 4 && <div className="w-3 h-px bg-[#1b2340]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Warning Banner */}
      {warning && (
        <div className="card p-3 border-[#dc2626]/30 bg-[#dc2626]/5 text-[#dc2626] text-[11px] font-mono flex items-center gap-2">
          <span className="text-[11px] font-bold">[WARN]</span>
          <div>
            <p className="font-bold text-[#dc2626]">INVALID EQUIPMENT ENTRY</p>
            <p className="text-[10px] text-[#94a3b8]">{warning}</p>
          </div>
        </div>
      )}

      {/* CONFIGURATION PHASE */}
      {phase === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="card p-5 space-y-4">
            <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">War Game Budgets</h3>
            
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
                <div className="text-lg font-mono font-bold text-[#4ade80] bg-[#0b0f19] border border-[rgba(148,163,184,0.08)] p-3">
                  ${defenderBudget} Million ($2.0 Billion equivalents)
                </div>
                <p className="text-[10px] text-[#4b5563] mt-1.5 leading-relaxed">
                  Defending assets (like S-400 regiments, active AESA radar rigs, and high-performance medium-range interceptors) require significant capital.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">Environmental & ECM Modifier</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Weather Condition</label>
                <select
                  value={weather}
                  onChange={e => setWeather(e.target.value as any)}
                  className="input-field"
                >
                  <option value="CLEAR">CLEAR — Full range visibility</option>
                  <option value="CLOUDY">CLOUDY — -10% launch velocity</option>
                  <option value="STORMY">STORMY — -25% velocity</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Electronic Jamming (ECM)</label>
                <select
                  value={ecm}
                  onChange={e => setEcm(e.target.value as any)}
                  className="input-field"
                >
                  <option value="NONE">NONE — Standard lock success</option>
                  <option value="LOW">LOW — -8% accuracy</option>
                  <option value="HIGH">HIGH — -18% accuracy</option>
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
                  const isCollapsed = collapsedThreats[item.id] || false;

                  return (
                    <div key={item.id} className="p-3 rounded bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => toggleThreatCollapse(item.id)}>
                          <span className="text-[#6b7280] hover:text-white transition-all text-[9px] w-3 text-center">
                            {isCollapsed ? '▼' : '▲'}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{displayName}</div>
                            <div className="text-[10px] text-[#6b7280]">
                              Unit Cost: ${totalUnitCost.toFixed(2)}M
                            </div>
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

                      {!isCollapsed && item.threat.weaponsCatalog && item.threat.weaponsCatalog.length > 0 && (
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
                                  const isRaadCM400Conflict = item.threat.name.toLowerCase().includes('jf-17') && (
                                    (w.name === "Ra'ad ALCM" && (item.loadout['CM-400AKG Supersonic'] || 0) > 0) ||
                                    (w.name === "CM-400AKG Supersonic" && (item.loadout["Ra'ad ALCM"] || 0) > 0)
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
                                  const isRaadCM400Conflict = item.threat.name.toLowerCase().includes('jf-17') && (
                                    (w.name === "Ra'ad ALCM" && (item.loadout['CM-400AKG Supersonic'] || 0) > 0) ||
                                    (w.name === "CM-400AKG Supersonic" && (item.loadout["Ra'ad ALCM"] || 0) > 0)
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
            <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/[0.05] pb-3">
              <h3 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider">Attacker Arsenal Catalogue</h3>
              
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-1 bg-white/[0.02] border border-white/5 p-0.5 rounded-lg">
                {Object.keys(COUNTRY_META).map(cid => {
                  const meta = COUNTRY_META[cid as keyof typeof COUNTRY_META];
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setAttCountryTab(cid)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        attCountryTab === cid
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-[#6b7280] hover:text-white'
                      }`}
                    >
                      {meta.flag} {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THREAT_CATALOG.filter(threat => (threat.country || 'generic') === attCountryTab).map(threat => (
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
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Unit Inventory</h3>
            
            <div className="bg-black/40 p-4 rounded border border-white/[0.05]">
              <div className="text-xs text-[#6b7280] mb-1">Procured Unit Cost:</div>
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
                  return <div className="text-xs text-[#4b5563] text-center py-6 font-mono">No units purchased. Select from catalog.</div>;
                }

                return Object.entries(groupedDefender).map(([systemId, batteries]) => {
                  const firstBattery = batteries[0];
                  const system = firstBattery.system;
                  const currentQty = batteries.length;
                  const selectedMissile = firstBattery.selectedMissile;
                  const isCollapsed = collapsedDefenders[systemId] || false;

                  return (
                    <div key={systemId} className="p-3 rounded bg-white/[0.02] border border-[#00ff88]/20 space-y-3 text-xs">
                      {/* Group Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-white/[0.05]">
                        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => toggleDefenderCollapse(systemId)}>
                          <span className="text-[#6b7280] hover:text-white transition-all text-[9px] w-3 text-center">
                            {isCollapsed ? '▼' : '▲'}
                          </span>
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: system.color }} />
                              {system.name}
                            </div>
                            <div className="text-[10px] text-[#6b7280]">
                              Base: ${system.batteryCost}M each
                            </div>
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

                      {!isCollapsed && (
                        <>

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
                        </>
                      )}
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
            <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/[0.05] pb-3">
              <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>
              
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-1 bg-white/[0.02] border border-white/5 p-0.5 rounded-lg">
                {Object.keys(COUNTRY_META).filter(cid => cid !== 'generic').map(cid => {
                  const meta = COUNTRY_META[cid as keyof typeof COUNTRY_META];
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setDefCountryTab(cid)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        defCountryTab === cid
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-[#6b7280] hover:text-white'
                      }`}
                    >
                      {meta.flag} {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFENCE_CATALOG.filter(sys => (sys.country || 'india') === defCountryTab).map(sys => (
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
                      <span className="text-[#00ff88]">Unit: ${sys.batteryCost}M</span>
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
                    Deploy Unit
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
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold transition-all ${
                      simSpeed === speed ? 'bg-[#38bdf8] text-[#0b0f19]' : 'bg-[#1b2340] text-[#64748b] hover:bg-[#232d4a]'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-[#38bdf8]">T+{simTime}s</span>
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="bg-[#070b12] border border-[rgba(56,189,248,0.15)] w-full max-w-[800px] aspect-[8/5]"
            />

            <div className="flex gap-4 w-full justify-center text-xs font-mono text-[#6b7280]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#4ade80]" /> Defender
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
          <div className="card p-4 border-[rgba(56,189,248,0.15)] space-y-4">
            <h2 className="text-sm font-mono font-bold text-[#38bdf8] uppercase tracking-[0.1em]">Engagement After-Action Report</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-3 bg-[#0b0f19] border border-[rgba(148,163,184,0.08)]">
                <div className="text-[10px] text-[#6b7280] uppercase">Interception Success</div>
                <div className="text-xl font-bold font-mono text-[#4ade80] mt-1">
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
                <div className={`text-xl font-bold font-mono mt-1 ${hitCount >= threatCountTotal * 0.8 ? 'text-[#4ade80]' : 'text-[#f59e0b]'}`}>
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
                      <span>Destroyed SAM Units:</span>
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
                // Find all NON-RADAR systems that were deployed
                const deployedSystems = Array.from(new Set(defenderProcuredRef.current.map(b => b.system.id))).map(id => {
                  return defenderProcuredRef.current.find(b => b.system.id === id)!.system;
                }).filter(system => system.category !== 'RADAR');

                if (deployedSystems.length === 0) {
                  return <div className="text-xs text-[#6b7280] font-mono">No SAM systems deployed.</div>;
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

          {/* Radar Intelligence Support Breakdown — only shown if RADAR systems were deployed */}
          {defenderProcuredRef.current.some(b => b.system.category === 'RADAR') && (
            <div className="card p-5 space-y-4 border-[#6366f1]/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">📡</span>
                <h3 className="text-sm font-semibold text-[#6366f1] uppercase tracking-wider">Radar Intelligence Support Report</h3>
              </div>
              <p className="text-[11px] text-[#6b7280] leading-relaxed">
                Radar stations provide rotating AESA sweep cueing — when the beam illuminates a target, linked modern SAM systems receive a real-time accuracy boost for 1.5 seconds per sweep pass.
              </p>

              <div className="space-y-4">
                {(() => {
                  const radarBatteries = defenderProcuredRef.current.filter(b => b.system.category === 'RADAR');
                  const radarGroups: Record<string, { system: typeof radarBatteries[0]['system']; count: number }> = {};
                  radarBatteries.forEach(b => {
                    if (!radarGroups[b.system.id]) radarGroups[b.system.id] = { system: b.system, count: 0 };
                    radarGroups[b.system.id].count++;
                  });

                  // Aggregate cueing stats across all radar instances
                  const totalCueEvents = Object.values(radarCuedKillsRef.current).reduce((s, r) => s + r.cueEvents, 0);
                  const totalCuedKills = Object.values(radarCuedKillsRef.current).reduce((s, r) => s + r.cuedKills, 0);
                  const allAssistedSAMs = new Set<string>();
                  Object.values(radarCuedKillsRef.current).forEach(r => r.assistedSAMs.forEach(n => allAssistedSAMs.add(n)));

                  // Overall summary stats
                  const totalSAMs = defenderProcuredRef.current.filter(b => b.system.category !== 'RADAR').length;
                  const radarCount = radarBatteries.length;

                  return (
                    <>
                      {/* Summary stats row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                        <div className="p-3 rounded bg-[#6366f1]/10 border border-[#6366f1]/20">
                          <div className="text-[10px] text-[#6366f1] uppercase">Radar Units Active</div>
                          <div className="text-lg font-black text-white mt-1">{radarCount}</div>
                          <div className="text-[9px] text-[#4b5563]">deployed stations</div>
                        </div>
                        <div className="p-3 rounded bg-[#6366f1]/10 border border-[#6366f1]/20">
                          <div className="text-[10px] text-[#6366f1] uppercase">SAMs Assisted</div>
                          <div className="text-lg font-black text-[#00ff88] mt-1">{allAssistedSAMs.size} / {totalSAMs}</div>
                          <div className="text-[9px] text-[#4b5563]">unique units cued</div>
                        </div>
                        <div className="p-3 rounded bg-[#6366f1]/10 border border-[#6366f1]/20">
                          <div className="text-[10px] text-[#6366f1] uppercase">Kills Under Cue</div>
                          <div className="text-lg font-black text-[#00ff88] mt-1">{totalCuedKills}</div>
                          <div className="text-[9px] text-[#4b5563]">radar-assisted neutralizations</div>
                        </div>
                        <div className="p-3 rounded bg-[#6366f1]/10 border border-[#6366f1]/20">
                          <div className="text-[10px] text-[#6366f1] uppercase">Sweep Cue Events</div>
                          <div className="text-lg font-black text-white mt-1">{totalCueEvents}</div>
                          <div className="text-[9px] text-[#4b5563]">beam illuminations fired</div>
                        </div>
                      </div>

                      {/* Per-radar breakdown */}
                      {Object.entries(radarGroups).map(([sysId, { system, count }]) => {
                        const instanceIds = radarBatteries.filter(b => b.system.id === sysId).map(b => b.id);
                        const instanceCueData = Object.entries(radarCuedKillsRef.current)
                          .filter(([, v]) => v.radarName === system.name);
                        const instanceCueEvents = instanceCueData.reduce((s, [, v]) => s + v.cueEvents, 0);
                        const instanceCuedKills = instanceCueData.reduce((s, [, v]) => s + v.cuedKills, 0);
                        const instanceAssistedSAMs = new Set<string>();
                        instanceCueData.forEach(([, v]) => v.assistedSAMs.forEach(n => instanceAssistedSAMs.add(n)));

                        return (
                          <div key={sysId} className="p-3 rounded bg-white/[0.02] border border-[#6366f1]/15 space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                                <div>
                                  <div className="text-sm font-bold text-white">{system.name}</div>
                                  <div className="text-[10px] text-[#6b7280]">{count} unit{count > 1 ? 's' : ''} deployed • Detection range: {system.range}km • Rotation: 6 RPM</div>
                                </div>
                              </div>
                              <span className="badge text-[9px] font-mono" style={{ backgroundColor: '#6366f120', color: '#6366f1', border: '1px solid #6366f144' }}>AESA RADAR</span>
                            </div>

                            {instanceCueEvents > 0 ? (
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                                  <div className="p-2 rounded bg-black/30">
                                    <div className="text-[#6b7280] uppercase mb-0.5">Cue Events</div>
                                    <div className="font-bold text-[#6366f1]">{instanceCueEvents}</div>
                                  </div>
                                  <div className="p-2 rounded bg-black/30">
                                    <div className="text-[#6b7280] uppercase mb-0.5">Cued Kills</div>
                                    <div className="font-bold text-[#00ff88]">{instanceCuedKills}</div>
                                  </div>
                                  <div className="p-2 rounded bg-black/30">
                                    <div className="text-[#6b7280] uppercase mb-0.5">Cue Kill Rate</div>
                                    <div className="font-bold text-[#00ff88]">{instanceCueEvents > 0 ? ((instanceCuedKills / instanceCueEvents) * 100).toFixed(0) : 0}%</div>
                                  </div>
                                </div>
                                {instanceAssistedSAMs.size > 0 && (
                                  <div className="text-[10px] font-mono">
                                    <span className="text-[#6b7280]">Assisted SAM Units: </span>
                                    <span className="text-[#00b4d8]">{Array.from(instanceAssistedSAMs).join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-[10px] text-[#4b5563] font-mono bg-black/20 rounded p-2">
                                ⚠️ No sweep cue events triggered during this engagement. Radar was rotating but beam did not align with active threat vectors during SAM launch windows. Consider repositioning closer to threat axis.
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Assisted SAM names summary */}
                      {allAssistedSAMs.size > 0 && (
                        <div className="p-3 rounded bg-[#00ff88]/5 border border-[#00ff88]/15 text-[11px] font-mono">
                          <div className="text-[#00ff88] font-semibold mb-1">📊 Radar-Assisted Kill Summary</div>
                          <div className="text-[#9ca3af]">
                            <span className="text-white font-bold">{totalCuedKills}</span> out of <span className="text-white font-bold">{hitCount}</span> total kills were achieved under active radar sweep illumination ({hitCount > 0 ? ((totalCuedKills / hitCount) * 100).toFixed(0) : 0}% of all neutralizations were radar-cued).
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                const resetDefender = defenderProcured.map(battery => ({
                  ...battery,
                  isDestroyed: false,
                }));
                setDefenderProcured(resetDefender);
                setPhase('procure_attacker');
                setSimLogs([]);
                setLeakerCount(0);
                setHitCount(0);
              }}
              className="px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all bg-[#00ff88] hover:bg-[#00dd77] text-black border-none cursor-pointer flex items-center gap-1.5"
            >
              <span>🔄</span> Retry with Exact Loadout
            </button>

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
              LAUNCH NEW EXERCISE
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
              RE-LAYER DEFENSE
            </button>
          </div>
        </div>
      )}

      {/* Educational Disclaimer */}
      <div className="card p-3 border-[rgba(120,101,13,0.25)]">
        <div className="flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-[#d97706] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[10px] text-[#d97706] font-mono font-semibold tracking-[0.05em] mb-0.5">EDUCATIONAL DISCLAIMER</p>
            <p className="text-[10px] text-[#475569] leading-relaxed font-mono">
              This simulator highlights asymmetric cost structures between threat delivery vehicles and defensive platforms. Missile costs represent approximated declassified figures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
