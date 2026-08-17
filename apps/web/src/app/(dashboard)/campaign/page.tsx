'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '@/lib/api';
import mergedDefenceCatalog from '../simulation/new/merged_defence_catalog.json';
import mergedThreatCatalog from '../simulation/new/merged_threat_catalog.json';

// ---- Interfaces & Types ----
interface DefenceItem {
  id: string;
  name: string;
  category: string;
  batteryCost: number; // USD Millions
  missileCost: number; // USD Millions
  missileName: string;
  range: number; // km
  radarRange?: number; // km
  defaultAmmo?: number;
  minAlt: number;
  maxAlt: number;
  accuracy: number;
  color: string;
  speed: number;
}

interface ThreatItem {
  id: string;
  name: string;
  type: string;
  speed: number; // Mach
  altitude: number; // meters
  rcs: number; // m²
  threatScore: number;
  cost: number; // USD Millions
  color: string;
  country?: string;
}

const DEFENCE_CATALOG = mergedDefenceCatalog as DefenceItem[];
const THREAT_CATALOG = mergedThreatCatalog as ThreatItem[];

interface MissionConfig {
  id: number;
  name: string;
  description: string;
  budget: number; // USD Millions
  systemThreats: { threatId: string; count: number }[];
  systemDefenders: { systemId: string; count: number }[];
  winRateDefender: number; // required interception rate
  winRateAttacker: number; // required penetration rate
}

// 5 Missions per difficulty
const CAMPAIGN_SCENARIOS: Record<'EASY' | 'MEDIUM' | 'HARD', MissionConfig[]> = {
  EASY: [
    {
      id: 1,
      name: 'Border Patrol',
      description: 'Defend against small incursions of low-speed reconnaissance UAVs along the northern border, or deploy custom UAVs to test the defense grid.',
      budget: 60,
      systemThreats: [{ threatId: 'pakistan7', count: 6 }], // UAVs
      systemDefenders: [{ systemId: 'd6', count: 2 }], // Short-range systems
      winRateDefender: 0.80,
      winRateAttacker: 0.30,
    },
    {
      id: 2,
      name: 'Coastal Patrol',
      description: 'Hostile forces are launching subsonic cruise missile strikes against oil refineries on the coast. Secure the radar network.',
      budget: 80,
      systemThreats: [{ threatId: 'pakistan3', count: 8 }], // Cruise
      systemDefenders: [{ systemId: 'd5', count: 2 }], // Akash SAM
      winRateDefender: 0.80,
      winRateAttacker: 0.30,
    },
    {
      id: 3,
      name: 'Airfield Guard',
      description: 'Provide layered air defense to a crucial forward military airfield against mixed fighter patrol incursions.',
      budget: 100,
      systemThreats: [{ threatId: 'pakistan5', count: 6 }, { threatId: 'pakistan7', count: 4 }], // Fighters + UAVs
      systemDefenders: [{ systemId: 'd3', count: 3 }], // QRSAM / Short range
      winRateDefender: 0.80,
      winRateAttacker: 0.30,
    },
    {
      id: 4,
      name: 'Ballistic Warning',
      description: 'Intel suggests short-range tactical ballistic missiles are targetting military headquarters. Deploy high-tier interceptors.',
      budget: 130,
      systemThreats: [{ threatId: 'pakistan2', count: 4 }], // Ballistics
      systemDefenders: [{ systemId: 'd1', count: 2 }], // S-400/Patriot
      winRateDefender: 0.85,
      winRateAttacker: 0.30,
    },
    {
      id: 5,
      name: 'Capital Shield',
      description: 'The final stand. Establish a comprehensive multi-layered shield over the capital to intercept a large coordinated saturation wave.',
      budget: 160,
      systemThreats: [{ threatId: 'pakistan3', count: 6 }, { threatId: 'pakistan2', count: 2 }, { threatId: 'pakistan7', count: 4 }],
      systemDefenders: [{ systemId: 'd1', count: 2 }, { systemId: 'd5', count: 3 }],
      winRateDefender: 0.85,
      winRateAttacker: 0.35,
    }
  ],
  MEDIUM: [
    {
      id: 1,
      name: 'Outpost Assault',
      description: 'Hostiles have deployed advanced electronic-jamming UAVs and cruise missiles. Neutralize them, or attempt to breach their defenses.',
      budget: 70,
      systemThreats: [{ threatId: 'china5', count: 6 }, { threatId: 'pakistan3', count: 4 }],
      systemDefenders: [{ systemId: 'd4', count: 3 }], // MRSAM
      winRateDefender: 0.85,
      winRateAttacker: 0.40,
    },
    {
      id: 2,
      name: 'Power Plant Guard',
      description: 'Protect a nuclear energy facility from supersonic tactical missiles and heavy glide bombs.',
      budget: 95,
      systemThreats: [{ threatId: 'china3', count: 6 }, { threatId: 'china7', count: 6 }],
      systemDefenders: [{ systemId: 'd4', count: 2 }, { systemId: 'd6', count: 2 }],
      winRateDefender: 0.85,
      winRateAttacker: 0.40,
    },
    {
      id: 3,
      name: 'Fleet Protection',
      description: 'A navy battle group at sea is under threat from high-speed supersonic anti-ship cruise missiles.',
      budget: 120,
      systemThreats: [{ threatId: 'china3', count: 8 }],
      systemDefenders: [{ systemId: 'd2', count: 3 }], // Patriot equivalents
      winRateDefender: 0.85,
      winRateAttacker: 0.40,
    },
    {
      id: 4,
      name: 'Hypersonic Ingress',
      description: 'Detect and intercept advanced hypersonic glide vehicles flying at Mach 8 accompanied by swarm decoy UAVs.',
      budget: 150,
      systemThreats: [{ threatId: 'china6', count: 3 }, { threatId: 'china8', count: 6 }],
      systemDefenders: [{ systemId: 'd1', count: 3 }], // S-400 Triumf
      winRateDefender: 0.90,
      winRateAttacker: 0.45,
    },
    {
      id: 5,
      name: 'Metropolitan Shield',
      description: 'Defend the metropolis against a heavy coordinated attack consisting of stealth fighters, ballistic missiles, and drone swarms.',
      budget: 200,
      systemThreats: [{ threatId: 'china1', count: 4 }, { threatId: 'china4', count: 8 }, { threatId: 'china8', count: 8 }],
      systemDefenders: [{ systemId: 'd1', count: 3 }, { systemId: 'd4', count: 3 }, { systemId: 'd6', count: 2 }],
      winRateDefender: 0.90,
      winRateAttacker: 0.45,
    }
  ],
  HARD: [
    {
      id: 1,
      name: 'Radar EW Assault',
      description: 'Your radars are actively jammed. Defend the communication arrays against stealthy, low-RCS UAV swarms.',
      budget: 50,
      systemThreats: [{ threatId: 'china8', count: 12 }],
      systemDefenders: [{ systemId: 'd4', count: 4 }],
      winRateDefender: 0.90,
      winRateAttacker: 0.50,
    },
    {
      id: 2,
      name: 'Hypersonic Influx',
      description: 'A heavy wave of Mach 10 hypersonic missiles and low-flying cruise missiles targets local command centers.',
      budget: 80,
      systemThreats: [{ threatId: 'china6', count: 6 }, { threatId: 'china3', count: 10 }],
      systemDefenders: [{ systemId: 'd1', count: 4 }],
      winRateDefender: 0.90,
      winRateAttacker: 0.50,
    },
    {
      id: 3,
      name: 'Saturation Barrage',
      description: 'Intercept a massive coordinated saturation strike containing 24 incoming tactical weapons and decoy drones.',
      budget: 100,
      systemThreats: [{ threatId: 'china7', count: 12 }, { threatId: 'china8', count: 12 }],
      systemDefenders: [{ systemId: 'd1', count: 3 }, { systemId: 'd4', count: 3 }],
      winRateDefender: 0.90,
      winRateAttacker: 0.50,
    },
    {
      id: 4,
      name: 'Decapitation Strike',
      description: 'Brace for the ultimate test. Direct ballistic and hypersonic strikes target vital control centers in rapid successions.',
      budget: 120,
      systemThreats: [{ threatId: 'china1', count: 8 }, { threatId: 'china6', count: 12 }],
      systemDefenders: [{ systemId: 'd1', count: 4 }, { systemId: 'd4', count: 4 }],
      winRateDefender: 0.95,
      winRateAttacker: 0.55,
    },
    {
      id: 5,
      name: 'Total War',
      description: 'The final, integrated combat simulation. Hostiles launch a combined arsenal of 35 diverse threats to breach your airspace.',
      budget: 150,
      systemThreats: [{ threatId: 'china1', count: 5 }, { threatId: 'china6', count: 10 }, { threatId: 'china3', count: 10 }, { threatId: 'china8', count: 10 }],
      systemDefenders: [{ systemId: 'd1', count: 4 }, { systemId: 'd4', count: 4 }, { systemId: 'd5', count: 4 }],
      winRateDefender: 0.95,
      winRateAttacker: 0.60,
    }
  ]
};

// Canvas simulation structures
interface VisualThreat {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  isDead: boolean;
  isLeaked: boolean;
  rcs: number;
  color: string;
}

interface VisualInterceptor {
  id: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetThreatId: string;
  speed: number;
  isDead: boolean;
  color: string;
}

interface VisualExplosion {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  isImpact: boolean;
}

interface VisualBattery {
  id: string;
  name: string;
  x: number;
  y: number;
  range: number; // radar radius in %
  accuracy: number;
  reloadTime: number;
  reloadTimer: number;
  ammo: number;
  maxAmmo: number;
  color: string;
}

export default function CampaignPage() {
  // DB Campaign states
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [campaignNameInput, setCampaignNameInput] = useState('');
  const [campaignDifficulty, setCampaignDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  // UI state machine
  // 'setup' -> 'timeline' -> 'role_select' -> 'procure' -> 'simulate' -> 'results'
  const [viewState, setViewState] = useState<'setup' | 'timeline' | 'role_select' | 'procure' | 'simulate' | 'results'>('setup');
  
  // Mission active selections
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'ATTACK' | 'DEFEND' | null>(null);

  // Shop states
  const [procuredDefenses, setProcuredDefenses] = useState<{ system: DefenceItem; x: number; y: number; placed: boolean }[]>([]);
  const [procuredThreats, setProcuredThreats] = useState<{ threat: ThreatItem; qty: number; x: number; y: number; placed: boolean }[]>([]);
  const [remainingBudget, setRemainingBudget] = useState(100);

  // Placements active index
  const [placementIdx, setPlacementIdx] = useState<number>(-1);

  // Simulation runner states
  const [simIsPlaying, setSimIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<{ total: number; intercepted: number; leaked: number; spent: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const simStateRef = useRef<{
    isPlaying: boolean;
    speed: number;
    threats: VisualThreat[];
    interceptors: VisualInterceptor[];
    explosions: VisualExplosion[];
    batteries: VisualBattery[];
    logs: string[];
    seconds: number;
    targetCities: { x: number; y: number; health: number }[];
    winConditionMet: boolean;
  }>({
    isPlaying: false,
    speed: 1,
    threats: [],
    interceptors: [],
    explosions: [],
    batteries: [],
    logs: [],
    seconds: 0,
    targetCities: [],
    winConditionMet: false
  });

  // Get active configurations
  const activeMissions = useMemo(() => CAMPAIGN_SCENARIOS[campaignDifficulty], [campaignDifficulty]);
  const currentMission = useMemo(() => activeMissions[selectedDay - 1] || activeMissions[0], [activeMissions, selectedDay]);

  // Fetch campaigns on load
  useEffect(() => {
    fetchActiveCampaign();
  }, []);

  const fetchActiveCampaign = async () => {
    try {
      setLoading(true);
      const res = await api.campaigns.list() as any;
      if (res.success && res.data && res.data.length > 0) {
        // Use the most recent active campaign
        const active = res.data.find((c: any) => c.status === 'ACTIVE');
        if (active) {
          setActiveCampaign(active);
          setCampaignDifficulty(active.difficulty as any);
          setSelectedDay(active.currentDay);
          setViewState('timeline');
        } else {
          setViewState('setup');
        }
      } else {
        setViewState('setup');
      }
    } catch (err) {
      console.warn('Failed to load campaigns, falling back to local state:', err);
      setViewState('setup');
    } finally {
      setLoading(false);
    }
  };

  // Start campaign
  const handleStartCampaign = async () => {
    if (!campaignNameInput.trim()) return;
    try {
      setLoading(true);
      const res = await api.campaigns.create({
        name: campaignNameInput,
        difficulty: campaignDifficulty,
        totalDays: 5,
        budget: campaignDifficulty === 'EASY' ? 600 : campaignDifficulty === 'MEDIUM' ? 500 : 400
      } as any);
      if (res.success) {
        setActiveCampaign(res.data);
        setSelectedDay(1);
        setViewState('timeline');
      }
    } catch (err) {
      console.error('Failed to create campaign:', err);
      // Fallback
      setActiveCampaign({
        id: 'local-session',
        name: campaignNameInput,
        difficulty: campaignDifficulty,
        currentDay: 1,
        totalDays: 5,
        budget: 500,
        remainingBudget: 500,
        status: 'ACTIVE'
      });
      setSelectedDay(1);
      setViewState('timeline');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Day on win
  const handleAdvanceCampaign = async () => {
    if (!activeCampaign) return;
    try {
      setLoading(true);
      if (activeCampaign.id === 'local-session') {
        const nextDay = selectedDay + 1;
        if (nextDay > 5) {
          setActiveCampaign({ ...activeCampaign, status: 'WON' });
        } else {
          setSelectedDay(nextDay);
          setActiveCampaign({ ...activeCampaign, currentDay: nextDay });
        }
        setViewState('timeline');
        return;
      }

      const res = await api.campaigns.advance(activeCampaign.id, {});
      if (res.success) {
        setActiveCampaign(res.data);
        if (res.data.status === 'WON') {
          // Trigger win
          setViewState('timeline');
        } else {
          setSelectedDay(res.data.currentDay);
          setViewState('timeline');
        }
      }
    } catch (err) {
      console.error('Failed to advance campaign:', err);
      // fallback
      const nextDay = selectedDay + 1;
      setSelectedDay(nextDay);
      setViewState('timeline');
    } finally {
      setLoading(false);
    }
  };

  // Abandon Campaign
  const handleResetCampaign = () => {
    setActiveCampaign(null);
    setViewState('setup');
    setCampaignNameInput('');
  };

  // Init Day Procurement
  const handleSelectRole = (role: 'ATTACK' | 'DEFEND') => {
    setSelectedRole(role);
    setRemainingBudget(currentMission.budget);
    setProcuredDefenses([]);
    setProcuredThreats([]);
    setPlacementIdx(-1);
    setViewState('procure');
  };

  // ---- Procurement Logic ----
  const buyDefenseItem = (sys: DefenceItem) => {
    if (remainingBudget >= sys.batteryCost) {
      setRemainingBudget(prev => Math.round((prev - sys.batteryCost) * 100) / 100);
      setProcuredDefenses(prev => [...prev, { system: sys, x: 0, y: 0, placed: false }]);
    }
  };

  const removeDefenseItem = (idx: number) => {
    const item = procuredDefenses[idx];
    setRemainingBudget(prev => Math.round((prev + item.system.batteryCost) * 100) / 100);
    setProcuredDefenses(prev => prev.filter((_, i) => i !== idx));
    if (placementIdx === idx) setPlacementIdx(-1);
  };

  const buyThreatItem = (t: ThreatItem) => {
    if (remainingBudget >= t.cost) {
      setRemainingBudget(prev => Math.round((prev - t.cost) * 100) / 100);
      setProcuredThreats(prev => {
        const exist = prev.find(item => item.threat.id === t.id);
        if (exist) {
          return prev.map(item => item.threat.id === t.id ? { ...item, qty: item.qty + 1 } : item);
        }
        return [...prev, { threat: t, qty: 1, x: 0, y: 0, placed: false }];
      });
    }
  };

  const removeThreatItem = (threatId: string) => {
    const exist = procuredThreats.find(item => item.threat.id === threatId);
    if (!exist) return;
    setRemainingBudget(prev => Math.round((prev + exist.threat.cost) * 100) / 100);
    setProcuredThreats(prev => {
      if (exist.qty > 1) {
        return prev.map(item => item.threat.id === threatId ? { ...item, qty: item.qty - 1 } : item);
      }
      return prev.filter(item => item.threat.id !== threatId);
    });
  };

  // Click on canvas to place defenses
  const handleCanvasPlacementClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewState !== 'procure') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedRole === 'DEFEND') {
      // Find first unplaced defense
      const nextUnplaced = procuredDefenses.findIndex(d => !d.placed);
      if (nextUnplaced !== -1) {
        // Enforce placement in defending zone (y: 60% - 90%)
        if (clickY < 60 || clickY > 92) {
          addLog("SYSTEM: Batteries must be placed in the tactical defense sector (60% - 90% Y-axis).");
          return;
        }
        setProcuredDefenses(prev => prev.map((item, idx) => 
          idx === nextUnplaced ? { ...item, x: clickX, y: clickY, placed: true } : item
        ));
      }
    } else if (selectedRole === 'ATTACK') {
      // Assign launch point for selected threat type
      const nextUnplaced = procuredThreats.findIndex(t => !t.placed);
      if (nextUnplaced !== -1) {
        // Enforce placement in launch corridor (y: 5% - 35%)
        if (clickY < 5 || clickY > 35) {
          addLog("SYSTEM: Launch points must be scheduled in the ingress corridor (5% - 35% Y-axis).");
          return;
        }
        setProcuredThreats(prev => prev.map((item, idx) => 
          idx === nextUnplaced ? { ...item, x: clickX, y: clickY, placed: true } : item
        ));
      }
    }
  };

  const addLog = (message: string) => {
    setSimLogs(prev => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // ---- Simulation Setup & Loop ----
  const startSimulation = () => {
    setViewState('simulate');
    setSimIsPlaying(true);
    setSimSpeed(1);
    setSimLogs([]);

    // 1. Setup target cities
    const targetCities = [
      { x: 20, y: 88, health: 100 },
      { x: 50, y: 88, health: 100 },
      { x: 80, y: 88, health: 100 }
    ];

    // 2. Setup Defender Batteries
    const batteries: VisualBattery[] = [];
    if (selectedRole === 'DEFEND') {
      procuredDefenses.forEach((item, idx) => {
        if (item.placed) {
          batteries.push({
            id: `battery-${idx}`,
            name: item.system.name,
            x: item.x,
            y: item.y,
            range: item.system.range * 0.1, // scaled for canvas
            accuracy: item.system.accuracy,
            reloadTime: item.system.category === 'LONG_RANGE' ? 6 : item.system.category === 'MEDIUM_RANGE' ? 4 : 3,
            reloadTimer: 0,
            ammo: item.system.defaultAmmo || 48,
            maxAmmo: item.system.defaultAmmo || 48,
            color: '#4ade80'
          });
        }
      });
    } else {
      // Attacking mode: AI defenders are set by system based on difficulty
      const systemDef = currentMission.systemDefenders;
      systemDef.forEach((sysSetup, idx) => {
        const sys = DEFENCE_CATALOG.find(d => d.id === sysSetup.systemId) || DEFENCE_CATALOG[0];
        const step = 80 / (systemDef.length + 1);
        const placementX = step * (idx + 1) + (Math.random() * 4 - 2);
        batteries.push({
          id: `ai-battery-${idx}`,
          name: sys.name,
          x: placementX,
          y: 70 + (idx % 2 === 0 ? 5 : -5),
          range: sys.range * 0.08,
          accuracy: sys.accuracy * (campaignDifficulty === 'EASY' ? 0.7 : campaignDifficulty === 'MEDIUM' ? 0.9 : 1.1),
          reloadTime: sys.category === 'LONG_RANGE' ? 6 : sys.category === 'MEDIUM_RANGE' ? 4 : 3,
          reloadTimer: 0,
          ammo: sys.defaultAmmo || 40,
          maxAmmo: sys.defaultAmmo || 40,
          color: '#f59e0b'
        });
      });
    }

    // 3. Setup Threats
    const threats: VisualThreat[] = [];
    if (selectedRole === 'DEFEND') {
      // System threats fly in waves
      let totalCount = 0;
      currentMission.systemThreats.forEach(tSetup => {
        const threat = THREAT_CATALOG.find(t => t.id === tSetup.threatId) || THREAT_CATALOG[0];
        for (let i = 0; i < tSetup.count; i++) {
          const target = targetCities[Math.floor(Math.random() * targetCities.length)];
          // Spawn in waves separated along the Y axis
          threats.push({
            id: `threat-${totalCount}`,
            name: threat.name,
            type: threat.type,
            x: 10 + Math.random() * 80,
            y: -(5 + Math.random() * 30 + (i * 12)), // offset spawn
            targetX: target.x,
            targetY: target.y,
            speed: (threat.speed * 0.06) + (campaignDifficulty === 'HARD' ? 0.03 : 0),
            isDead: false,
            isLeaked: false,
            rcs: threat.rcs,
            color: '#dc2626'
          });
          totalCount++;
        }
      });
    } else {
      // Player launches purchased threats
      let totalCount = 0;
      procuredThreats.forEach(item => {
        for (let i = 0; i < item.qty; i++) {
          const target = targetCities[Math.floor(Math.random() * targetCities.length)];
          threats.push({
            id: `player-threat-${totalCount}`,
            name: item.threat.name,
            type: item.threat.type,
            x: item.x + (Math.random() * 8 - 4),
            y: item.y - (i * 10),
            targetX: target.x,
            targetY: target.y,
            speed: item.threat.speed * 0.06,
            isDead: false,
            isLeaked: false,
            rcs: item.threat.rcs,
            color: '#38bdf8' // Blue color for player assets
          });
          totalCount++;
        }
      });
    }

    // Write to reference
    simStateRef.current = {
      isPlaying: true,
      speed: 1,
      threats,
      interceptors: [],
      explosions: [],
      batteries,
      logs: [`[00:00.0s] TARGET SECTORS SECURED. Launching operational radar grid.`],
      seconds: 0,
      targetCities,
      winConditionMet: false
    };

    setSimLogs(simStateRef.current.logs);
  };

  // Run tick updates (60fps)
  useEffect(() => {
    if (viewState !== 'simulate') return;

    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      const state = simStateRef.current;
      if (!state.isPlaying) {
        lastTime = now;
        animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaSeconds = ((now - lastTime) / 1000) * state.speed;
      lastTime = now;
      state.seconds += deltaSeconds;

      // Update battery reload timers
      state.batteries.forEach(b => {
        if (b.reloadTimer > 0) {
          b.reloadTimer = Math.max(0, b.reloadTimer - deltaSeconds);
        }
      });

      // 1. Move threats
      state.threats.forEach(t => {
        if (t.isDead || t.isLeaked) return;

        // Skip movement if threat hasn't spawned yet
        if (t.y < 0) {
          t.y += 3 * deltaSeconds; // move into screen slowly
          return;
        }

        const dx = t.targetX - t.x;
        const dy = t.targetY - t.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 1.5) {
          // Leak/Impact target
          t.isLeaked = true;
          // Find closest target city and damage it
          const city = state.targetCities.find(c => Math.abs(c.x - t.targetX) < 5);
          if (city) {
            city.health = Math.max(0, city.health - 20);
          }
          state.explosions.push({
            id: `impact-${Date.now()}-${Math.random()}`,
            x: t.x,
            y: t.y,
            radius: 1,
            maxRadius: 18,
            color: '#dc2626',
            isImpact: true
          });
          state.logs.push(`[${state.seconds.toFixed(1)}s] IMPACT ALERT: Threat ${t.name} penetrated defense perimeter!`);
        } else {
          // Move towards target
          t.x += (dx / dist) * t.speed * deltaSeconds * 10;
          t.y += (dy / dist) * t.speed * deltaSeconds * 10;
        }
      });

      // 2. Battery engagement check
      state.batteries.forEach(b => {
        if (b.ammo <= 0 || b.reloadTimer > 0) return;

        // Find nearest visible threat
        let bestThreat: VisualThreat | null = null;
        let bestDist = Infinity;

        state.threats.forEach(t => {
          if (t.isDead || t.isLeaked || t.y < 0) return;

          const dist = Math.hypot(t.x - b.x, t.y - b.y);
          if (dist <= b.range && dist < bestDist) {
            // Check if threat is already targetted by more than 2 interceptors to avoid over-kill
            const targetCount = state.interceptors.filter(i => i.targetThreatId === t.id && !i.isDead).length;
            if (targetCount < 2) {
              bestThreat = t;
              bestDist = dist;
            }
          }
        });

        if (bestThreat) {
          // Launch interceptor!
          b.ammo--;
          b.reloadTimer = b.reloadTime;
          state.interceptors.push({
            id: `interceptor-${Date.now()}-${Math.random()}`,
            x: b.x,
            y: b.y,
            startX: b.x,
            startY: b.y,
            targetThreatId: (bestThreat as VisualThreat).id,
            speed: selectedRole === 'DEFEND' ? 24 : 16, // player interceptors are faster
            isDead: false,
            color: selectedRole === 'DEFEND' ? '#4ade80' : '#f59e0b'
          });

          state.logs.push(
            `[${state.seconds.toFixed(1)}s] ENGAGEMENT: ${b.name} locks radar & fires at ${(bestThreat as VisualThreat).name}`
          );
        }
      });

      // 3. Update interceptors
      state.interceptors.forEach(i => {
        if (i.isDead) return;

        const target = state.threats.find(t => t.id === i.targetThreatId);
        if (!target || target.isDead || target.isLeaked) {
          i.isDead = true;
          return;
        }

        const dx = target.x - i.x;
        const dy = target.y - i.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 1.8) {
          // Collision and Intercept roll!
          i.isDead = true;
          
          // Calculate success probability based on accuracy, modified by rcs
          // Stealth (low rcs) decreases interception chance
          const rcsFactor = Math.max(0.4, Math.min(1.0, target.rcs));
          const roll = Math.random();
          const finalAccuracy = state.batteries[0]?.accuracy ? state.batteries[0].accuracy * rcsFactor : 0.8;

          if (roll <= finalAccuracy) {
            target.isDead = true;
            state.explosions.push({
              id: `exp-${Date.now()}-${Math.random()}`,
              x: target.x,
              y: target.y,
              radius: 1,
              maxRadius: 12,
              color: '#38bdf8',
              isImpact: false
            });
            state.logs.push(`[${state.seconds.toFixed(1)}s] TACTICAL HIT: ${target.name} neutralized at ${target.x.toFixed(0)}% grid line.`);
          } else {
            state.explosions.push({
              id: `exp-${Date.now()}-${Math.random()}`,
              x: target.x,
              y: target.y,
              radius: 0.5,
              maxRadius: 5,
              color: '#94a3b8',
              isImpact: false
            });
            state.logs.push(`[${state.seconds.toFixed(1)}s] COUNTERMEASURE: Interceptor missed ${target.name}.`);
          }
        } else {
          // Fly towards target
          i.x += (dx / dist) * i.speed * deltaSeconds * 1.5;
          i.y += (dy / dist) * i.speed * deltaSeconds * 1.5;
        }
      });

      // 4. Update explosions
      state.explosions.forEach(exp => {
        if (exp.radius < exp.maxRadius) {
          exp.radius += deltaSeconds * 50;
        }
      });
      state.explosions = state.explosions.filter(exp => exp.radius < exp.maxRadius);

      // Check end conditions
      const allResolved = state.threats.every(t => t.isDead || t.isLeaked);
      if (allResolved && state.explosions.length === 0) {
        state.isPlaying = false;
        setSimIsPlaying(false);

        // Compute results
        const total = state.threats.length;
        const intercepted = state.threats.filter(t => t.isDead).length;
        const leaked = state.threats.filter(t => t.isLeaked).length;
        const spent = state.targetCities.reduce((sum, c) => sum + (100 - c.health), 0);

        setSimResult({ total, intercepted, leaked, spent });

        // Win calculation
        let won = false;
        if (selectedRole === 'DEFEND') {
          const rate = intercepted / total;
          won = rate >= currentMission.winRateDefender;
        } else {
          const rate = leaked / total;
          won = rate >= currentMission.winRateAttacker;
        }
        state.winConditionMet = won;

        // Push client wargame save
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          api.simulations.clientSave({
            name: `Campaign Wargame Day ${selectedDay} (${campaignDifficulty})`,
            config: {
              attackerBudget: currentMission.budget,
              defenderBudget: currentMission.budget,
              weather: 'CLEAR',
              ecm: campaignDifficulty === 'HARD' ? 0.3 : 0.1
            },
            results: {
              totalThreats: total,
              threatsDetected: total - Math.floor(total * 0.1),
              threatsIntercepted: intercepted,
              threatsMissed: leaked,
              threatsImpacted: leaked,
              interceptionRate: total > 0 ? (intercepted / total) : 0,
              detectionRate: 0.9,
              totalCost: currentMission.budget - remainingBudget,
              costPerEngagement: (currentMission.budget - remainingBudget) / (total || 1),
              costPerSuccessfulInterception: (currentMission.budget - remainingBudget) / (intercepted || 1),
            },
            duration: state.seconds,
          }).catch(err => console.warn('Failed background wargame save:', err.message));
        }

        setViewState('results');
      }

      setSimLogs([...state.logs]);
      renderCanvas();

      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [viewState, simIsPlaying, simSpeed]);

  // Render HTML5 Canvas
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = simStateRef.current;

    // Clear and draw grid
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw active Radar scanlines (rotary sweep)
    ctx.save();
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.04)';
    ctx.lineWidth = 2;
    state.batteries.forEach(b => {
      const cx = (b.x / 100) * canvas.width;
      const cy = (b.y / 100) * canvas.height;
      const r = (b.range / 100) * canvas.width;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI, true); // half circle radar
      ctx.stroke();
    });
    ctx.restore();

    // Draw Cities (targets) at the bottom
    state.targetCities.forEach(city => {
      const cx = (city.x / 100) * canvas.width;
      const cy = (city.y / 100) * canvas.height;

      // Draw dome shield
      ctx.beginPath();
      ctx.arc(cx, cy, 30, Math.PI, 0);
      ctx.fillStyle = city.health > 50 ? 'rgba(74, 222, 128, 0.05)' : city.health > 20 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(220, 38, 38, 0.1)';
      ctx.fill();

      // Shield outer border
      ctx.strokeStyle = city.health > 50 ? '#4ade80' : city.health > 20 ? '#f59e0b' : '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw city icon box
      ctx.fillStyle = '#1b2340';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.fillRect(cx - 15, cy - 8, 30, 16);
      ctx.strokeRect(cx - 15, cy - 8, 30, 16);

      // Health bar
      ctx.fillStyle = '#080b13';
      ctx.fillRect(cx - 15, cy + 12, 30, 4);
      ctx.fillStyle = city.health > 50 ? '#4ade80' : city.health > 20 ? '#f59e0b' : '#dc2626';
      ctx.fillRect(cx - 15, cy + 12, 30 * (city.health / 100), 4);
    });

    // Draw Batteries (Defenders)
    state.batteries.forEach(b => {
      const cx = (b.x / 100) * canvas.width;
      const cy = (b.y / 100) * canvas.height;

      // Radar range envelope on hover/scan
      ctx.beginPath();
      ctx.arc(cx, cy, (b.range / 100) * canvas.width, 0, Math.PI * 2);
      ctx.strokeStyle = b.color === '#4ade80' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(245, 158, 11, 0.08)';
      ctx.stroke();

      // Battery Core Launcher Icon
      ctx.fillStyle = b.color === '#4ade80' ? '#4ade80' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(cx, cy - 8);
      ctx.lineTo(cx + 8, cy + 6);
      ctx.lineTo(cx - 8, cy + 6);
      ctx.closePath();
      ctx.fill();

      // Battery label
      ctx.fillStyle = '#64748b';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.name.split(' ')[0], cx, cy + 18);
      ctx.fillText(`AMMO: ${b.ammo}`, cx, cy - 14);
    });

    // Draw Inbound Threats
    state.threats.forEach(t => {
      if (t.isDead || t.isLeaked) return;

      const cx = (t.x / 100) * canvas.width;
      const cy = (t.y / 100) * canvas.height;

      // Spawn/ingress indicator
      if (cy < 0) return;

      // Threat trailing path
      ctx.beginPath();
      ctx.moveTo((t.x / 100) * canvas.width, 0);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threat Dot
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Pulse ring for warning
      ctx.strokeStyle = t.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 7 + Math.sin(state.seconds * 10) * 2, 0, Math.PI * 2);
      ctx.stroke();

      // Name tag
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(t.name, cx + 8, cy + 2);
    });

    // Draw Interceptors (SAM flights)
    state.interceptors.forEach(i => {
      if (i.isDead) return;

      const cx = (i.x / 100) * canvas.width;
      const cy = (i.y / 100) * canvas.height;
      const sx = (i.startX / 100) * canvas.width;
      const sy = (i.startY / 100) * canvas.height;

      // Trail line
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = i.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Interceptor tip
      ctx.fillStyle = i.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Explosions
    state.explosions.forEach(exp => {
      const cx = (exp.x / 100) * canvas.width;
      const cy = (exp.y / 100) * canvas.height;

      ctx.beginPath();
      ctx.arc(cx, cy, exp.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = exp.color + '20'; // transparent fills
      ctx.fill();

      ctx.strokeStyle = exp.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  };

  // Skip simulation straight to resolution
  const handleSkipSimulation = () => {
    const state = simStateRef.current;
    if (!state.isPlaying) return;

    // Instantly resolve remaining threats
    state.threats.forEach(t => {
      if (t.isDead || t.isLeaked) return;
      // 70% chance of intercept in skips
      if (Math.random() > 0.3) {
        t.isDead = true;
      } else {
        t.isLeaked = true;
        const city = state.targetCities[Math.floor(Math.random() * state.targetCities.length)];
        city.health = Math.max(0, city.health - 25);
      }
    });

    state.isPlaying = false;
    setSimIsPlaying(false);

    const total = state.threats.length;
    const intercepted = state.threats.filter(t => t.isDead).length;
    const leaked = state.threats.filter(t => t.isLeaked).length;
    const spent = state.targetCities.reduce((sum, c) => sum + (100 - c.health), 0);

    setSimResult({ total, intercepted, leaked, spent });

    let won = false;
    if (selectedRole === 'DEFEND') {
      won = (intercepted / total) >= currentMission.winRateDefender;
    } else {
      won = (leaked / total) >= currentMission.winRateAttacker;
    }
    state.winConditionMet = won;

    setViewState('results');
  };

  return (
    <div className="space-y-6">
      {/* Classification Header Banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[rgba(74,222,128,0.05)] pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
              <span className="text-[#38bdf8]">⚔️</span> CAMPAIGN OPERATIONAL COMPLEX
            </h1>
            <p className="text-xs text-[#94a3b8] uppercase tracking-widest font-mono">
              Tier-structured defense simulations and strategic response grids
            </p>
          </div>
          {activeCampaign && (
            <button 
              onClick={handleResetCampaign} 
              className="px-4 py-2 border border-[#dc2626]/30 bg-[rgba(220,38,38,0.08)] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all text-xs font-bold uppercase rounded-sm"
            >
              Reset Campaign
            </button>
          )}
        </div>
      </div>

      {/* SETUP PHASE */}
      {viewState === 'setup' && (
        <div className="max-w-2xl mx-auto card p-6 animate-fade-in-up space-y-6">
          <div className="border-b border-[rgba(148,163,184,0.08)] pb-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Initialize Theater Strategy</h3>
            <p className="text-xs text-[#94a3b8] mt-1">Configure difficulty tier and deploy strategic operation files</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-1">Campaign Identifier / Name</label>
              <input
                type="text"
                placeholder="e.g. OPERATION SHIELDWALL"
                value={campaignNameInput}
                onChange={e => setCampaignNameInput(e.target.value)}
                className="w-full bg-[#131a2b] border border-[rgba(148,163,184,0.08)] px-3 py-2 rounded-sm text-white focus:outline-none focus:border-[#38bdf8] font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#64748b] uppercase tracking-wider block mb-2">Theater Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'EASY', label: 'EASY CORRIDOR', desc: 'Slower threat waves, increased budget buffers' },
                  { id: 'MEDIUM', label: 'TACTICAL TIER', desc: 'Standard combat speeds, balanced budgets' },
                  { id: 'HARD', label: 'COORDINATED GRID', desc: 'Advanced hypersonics, jamming, tight resources' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setCampaignDifficulty(opt.id as any)}
                    className={`p-4 border text-left rounded-sm transition-all flex flex-col justify-between ${
                      campaignDifficulty === opt.id
                        ? 'border-[#38bdf8] bg-[rgba(56,189,248,0.08)] text-[#38bdf8]'
                        : 'border-[rgba(148,163,184,0.08)] bg-[#131a2b] hover:border-[rgba(56,189,248,0.25)]'
                    }`}
                  >
                    <span className="font-bold text-xs">{opt.label}</span>
                    <span className="text-[9px] text-[#94a3b8] mt-2 leading-relaxed">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartCampaign}
            disabled={!campaignNameInput.trim() || loading}
            className="w-full btn-primary py-3 rounded-none flex items-center justify-center font-bold tracking-widest"
          >
            {loading ? 'DEPLOYING THEATER FILES...' : 'DEPLOY OPERATIONAL CAMPAIGN'}
          </button>
        </div>
      )}

      {/* TIMELINE PHASE */}
      {viewState === 'timeline' && activeCampaign && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Active Operation</span>
              <span className="text-sm font-bold text-white uppercase">{activeCampaign.name}</span>
            </div>
            <div className="card p-4">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Combat Day / Level</span>
              <span className="text-sm font-mono font-bold text-[#38bdf8]">{selectedDay} / 5</span>
            </div>
            <div className="card p-4">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Security Tier</span>
              <span className="text-sm font-mono font-bold text-[#f59e0b]">{campaignDifficulty}</span>
            </div>
            <div className="card p-4">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Campaign Status</span>
              <span className={`badge ${activeCampaign.status === 'WON' ? 'badge-green' : 'badge-cyan'}`}>
                {activeCampaign.status}
              </span>
            </div>
          </div>

          {/* Timeline Map Grid */}
          <div className="card p-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Theater Progress Timeline</h3>
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              {activeMissions.map((miss, idx) => {
                const dayNum = idx + 1;
                const isCompleted = dayNum < selectedDay || activeCampaign.status === 'WON';
                const isActive = dayNum === selectedDay && activeCampaign.status === 'ACTIVE';

                return (
                  <div
                    key={miss.id}
                    className={`flex-1 p-4 border rounded-sm flex flex-col justify-between transition-all ${
                      isActive ? 'border-[#38bdf8] bg-[rgba(56,189,248,0.06)]' :
                      isCompleted ? 'border-[#4ade80]/30 bg-[rgba(74,222,128,0.04)]' :
                      'border-[rgba(148,163,184,0.08)] bg-[#131a2b] opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-[#64748b] font-mono uppercase font-bold">STAGE 0{dayNum}</span>
                        {isCompleted ? <span className="text-[#4ade80] font-bold text-[9px] uppercase">COMPLETE ✓</span> :
                         isActive ? <span className="text-[#38bdf8] font-bold text-[9px] uppercase animate-pulse">ACTIVE ⚡</span> :
                         <span className="text-text-muted font-bold text-[9px] uppercase">LOCKED 🔒</span>}
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide">{miss.name}</h4>
                      <p className="text-[10px] text-[#94a3b8] leading-relaxed mt-2">{miss.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.08)] flex items-center justify-between text-[10px]">
                      <span className="text-[#64748b]">Budget:</span>
                      <span className="font-mono text-white font-bold">${miss.budget}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day selection or win card */}
          {activeCampaign.status === 'WON' ? (
            <div className="card p-8 text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-xl font-black text-[#4ade80] uppercase tracking-wider">🏆 CAMPAIGN VICTORIOUS</h2>
              <p className="text-xs text-[#94a3b8]">
                You have successfully completed all 5 wargame tactical missions in {campaignDifficulty} difficulty.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button onClick={handleResetCampaign} className="btn-primary">
                  Start New Campaign
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Initiate Day {selectedDay}: {currentMission.name}
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Select your operational role for this level. Win conditions apply based on role selections.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSelectRole('DEFEND')}
                    className="px-5 py-3 border border-[#4ade80]/40 bg-[rgba(74,222,128,0.08)] text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-all text-xs font-bold uppercase rounded-sm flex items-center gap-2"
                  >
                    🛡️ Command Defence Ring
                  </button>
                  <button
                    onClick={() => handleSelectRole('ATTACK')}
                    className="px-5 py-3 border border-[#dc2626]/40 bg-[rgba(220,38,38,0.08)] text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all text-xs font-bold uppercase rounded-sm flex items-center gap-2"
                  >
                    🚀 Launch Air Saturation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHOP & PLACEMENT PHASE */}
      {viewState === 'procure' && selectedRole && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Shop Items Catalog */}
          <div className="card p-5 lg:col-span-1 space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[rgba(148,163,184,0.08)] pb-3 mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Equipment Procurement</h3>
                <p className="text-[10px] text-[#94a3b8] mt-1">Select and purchase tactical military equipment within the budget</p>
              </div>

              {selectedRole === 'DEFEND' ? (
                <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                  {DEFENCE_CATALOG.filter(d => d.category !== 'RADAR').map(sys => {
                    return (
                      <div key={sys.id} className="p-3 border border-[rgba(148,163,184,0.08)] bg-[#131a2b] flex justify-between items-center rounded-sm">
                        <div className="space-y-1">
                          <div className="font-bold text-xs text-white uppercase">{sys.name}</div>
                          <div className="text-[9px] text-[#94a3b8]">
                            Range: {sys.range}km | Acc: {(sys.accuracy * 100).toFixed(0)}% | Speed: Mach {sys.speed}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#38bdf8] font-bold text-xs">${sys.batteryCost}M</span>
                          <button
                            onClick={() => buyDefenseItem(sys)}
                            disabled={remainingBudget < sys.batteryCost}
                            className="px-2 py-1 bg-[#38bdf8] text-bg-primary text-[10px] font-bold rounded-sm disabled:opacity-50"
                          >
                            + Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                  {THREAT_CATALOG.slice(0, 15).map(threat => {
                    const exist = procuredThreats.find(t => t.threat.id === threat.id);
                    return (
                      <div key={threat.id} className="p-3 border border-[rgba(148,163,184,0.08)] bg-[#131a2b] flex justify-between items-center rounded-sm">
                        <div className="space-y-1">
                          <div className="font-bold text-xs text-white uppercase">{threat.name}</div>
                          <div className="text-[9px] text-[#94a3b8]">
                            Type: {threat.type} | Speed: Mach {threat.speed} | RCS: {threat.rcs}m²
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#dc2626] font-bold text-xs">${threat.cost}M</span>
                          <button
                            onClick={() => buyThreatItem(threat)}
                            disabled={remainingBudget < threat.cost}
                            className="px-2 py-1 bg-[#dc2626] text-white text-[10px] font-bold rounded-sm disabled:opacity-50"
                          >
                            + Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[rgba(148,163,184,0.08)] pt-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#94a3b8]">Budget Available:</span>
                <span className="font-mono font-bold text-white">${currentMission.budget}M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#94a3b8]">Remaining:</span>
                <span className="font-mono font-bold text-[#4ade80]">${remainingBudget}M</span>
              </div>
            </div>
          </div>

          {/* Setup / Placements Layout */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-[rgba(148,163,184,0.08)] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tactical Deployment Sector
                </h3>
                <span className="text-[10px] text-[#94a3b8] uppercase">
                  {selectedRole === 'DEFEND' ? 'Click map bottom to deploy batteries' : 'Click map top to schedule launch nodes'}
                </span>
              </div>

              {/* Canvas Board for Placements */}
              <div className="relative border border-[rgba(56,189,248,0.25)] bg-[#0b0f19] overflow-hidden h-[300px]">
                <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={300}
                  onClick={handleCanvasPlacementClick}
                  className="absolute inset-0 cursor-crosshair w-full h-full"
                />

                {/* Local Visual Overlay for placements */}
                {selectedRole === 'DEFEND' ? (
                  procuredDefenses.map((d, idx) => d.placed && (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 bg-[#4ade80] border border-white rounded-none -ml-2 -mt-2 flex items-center justify-center text-[7px] text-bg-primary font-bold shadow-lg"
                      style={{ left: `${d.x}%`, top: `${d.y}%` }}
                      title={d.system.name}
                    >
                      {idx + 1}
                    </div>
                  ))
                ) : (
                  procuredThreats.map((t, idx) => t.placed && (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 bg-[#dc2626] border border-white rounded-none -ml-2 -mt-2 flex items-center justify-center text-[7px] text-white font-bold shadow-lg"
                      style={{ left: `${t.x}%`, top: `${t.y}%` }}
                      title={t.threat.name}
                    >
                      {idx + 1}
                    </div>
                  ))
                )}

                {/* Dynamic guidance sectors */}
                <div className="absolute bottom-0 left-0 right-0 h-[40%] border-t border-[#4ade80]/10 bg-[#4ade80]/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-[#4ade80]/40 uppercase tracking-widest">
                    {selectedRole === 'DEFEND' ? '🛡️ AIR DEFENSE DEPLOYMENT Sector (60%-90% Y)' : 'TARGET CITIES ZONE'}
                  </span>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[35%] border-b border-[#dc2626]/10 bg-[#dc2626]/5 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-[#dc2626]/40 uppercase tracking-widest">
                    {selectedRole === 'DEFEND' ? 'THREAT INGRESS AREA' : '🚀 STRIKE COORDINATION Sector (5%-35% Y)'}
                  </span>
                </div>
              </div>

              {/* Placed Assets list */}
              <div className="space-y-2">
                <div className="text-[10px] text-[#64748b] uppercase tracking-wider">Purchased Inventory Placement</div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRole === 'DEFEND' ? (
                    procuredDefenses.map((d, idx) => (
                      <div key={idx} className="p-2 border border-[rgba(148,163,184,0.08)] bg-[#131a2b] flex justify-between items-center text-[10px] rounded-sm">
                        <span className="text-white uppercase font-bold">{idx + 1}. {d.system.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={d.placed ? 'text-[#4ade80]' : 'text-[#f59e0b] animate-pulse'}>
                            {d.placed ? `Placed (${d.x.toFixed(0)}%, ${d.y.toFixed(0)}%)` : 'Needs Placement'}
                          </span>
                          <button onClick={() => removeDefenseItem(idx)} className="text-[#dc2626] hover:underline text-[9px]">Remove</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    procuredThreats.map((t, idx) => (
                      <div key={idx} className="p-2 border border-[rgba(148,163,184,0.08)] bg-[#131a2b] flex justify-between items-center text-[10px] rounded-sm">
                        <span className="text-white uppercase font-bold">{idx + 1}. {t.threat.name} (x{t.qty})</span>
                        <div className="flex items-center gap-2">
                          <span className={t.placed ? 'text-[#4ade80]' : 'text-[#f59e0b] animate-pulse'}>
                            {t.placed ? `Ready (${t.x.toFixed(0)}%, ${t.y.toFixed(0)}%)` : 'Needs Path'}
                          </span>
                          <button onClick={() => removeThreatItem(t.threat.id)} className="text-[#dc2626] hover:underline text-[9px]">Remove</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Trigger simulation */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setViewState('timeline')}
                  className="btn-secondary flex-1 py-3"
                >
                  Back to Timeline
                </button>
                <button
                  onClick={startSimulation}
                  disabled={
                    selectedRole === 'DEFEND'
                      ? procuredDefenses.length === 0 || procuredDefenses.some(d => !d.placed)
                      : procuredThreats.length === 0 || procuredThreats.some(t => !t.placed)
                  }
                  className="btn-primary flex-1 py-3 text-bg-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 INITIATE WARGAME SIMULATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WARGAME SIMULATOR RUNNER */}
      {viewState === 'simulate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Main Visual Board */}
          <div className="lg:col-span-2 card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(148,163,184,0.08)] pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tactical Operational Grid (Live Feed)
                </h3>
                <span className="text-[10px] text-[#94a3b8] uppercase">
                  Ingress Sector Alpha // Mach Scale Intercept Cycle
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimSpeed(1)}
                  className={`px-2 py-1 text-[10px] font-bold border ${simSpeed === 1 ? 'border-[#38bdf8] text-[#38bdf8] bg-[rgba(56,189,248,0.08)]' : 'border-[rgba(148,163,184,0.08)] text-[#94a3b8]'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setSimSpeed(2)}
                  className={`px-2 py-1 text-[10px] font-bold border ${simSpeed === 2 ? 'border-[#38bdf8] text-[#38bdf8] bg-[rgba(56,189,248,0.08)]' : 'border-[rgba(148,163,184,0.08)] text-[#94a3b8]'}`}
                >
                  2x
                </button>
                <button
                  onClick={() => setSimSpeed(5)}
                  className={`px-2 py-1 text-[10px] font-bold border ${simSpeed === 5 ? 'border-[#38bdf8] text-[#38bdf8] bg-[rgba(56,189,248,0.08)]' : 'border-[rgba(148,163,184,0.08)] text-[#94a3b8]'}`}
                >
                  5x
                </button>
              </div>
            </div>

            {/* Visual Canvas */}
            <div className="relative border border-[rgba(56,189,248,0.25)] bg-[#0b0f19] overflow-hidden h-[450px] rounded-sm">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Simulation controls */}
            <div className="flex gap-4">
              <button
                onClick={handleSkipSimulation}
                className="btn-secondary flex-1 py-3 text-center border-[#f59e0b] text-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)]"
              >
                ⏩ Skip to Resolution
              </button>
            </div>
          </div>

          {/* Console / Log Sidebar */}
          <div className="card p-5 space-y-4 flex flex-col justify-between h-[538px]">
            <div className="flex-1 flex flex-col">
              <div className="border-b border-[rgba(148,163,184,0.08)] pb-3 mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Engagement Cycle Logs</h3>
                <p className="text-[9px] text-[#94a3b8] uppercase">Dynamic radar locking updates</p>
              </div>

              {/* Log messages */}
              <div className="flex-1 overflow-y-auto bg-[#080b13] border border-[rgba(148,163,184,0.08)] p-3 font-mono text-[9px] text-[#4ade80] space-y-1.5 leading-relaxed max-h-[420px] scrollbar-thin">
                {simLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-[rgba(148,163,184,0.08)]/5 pb-1">
                    {log}
                  </div>
                ))}
                {simLogs.length === 0 && <div className="text-[#64748b]">SCANNING AIRSPACE... NO EVENTS RECORDED</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS AFTER ACTION REPORT */}
      {viewState === 'results' && simResult && (
        <div className="max-w-xl mx-auto card p-6 animate-fade-in-up space-y-6">
          <div className="text-center border-b border-[rgba(148,163,184,0.08)] pb-6">
            {simStateRef.current.winConditionMet ? (
              <h2 className="text-2xl font-black text-[#4ade80] uppercase tracking-wider flex items-center justify-center gap-2">
                🏆 TACTICAL VICTORY
              </h2>
            ) : (
              <h2 className="text-2xl font-black text-[#dc2626] uppercase tracking-wider flex items-center justify-center gap-2">
                🚨 MISSION DEFEAT
              </h2>
            )}
            <p className="text-xs text-[#94a3b8] mt-2">
              Theater combat evaluation and asset effectiveness reports
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Interceptions</span>
              <span className="text-base font-mono font-bold text-[#4ade80]">
                {simResult.intercepted} / {simResult.total}
              </span>
            </div>
            <div className="card p-4 text-center">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Leaked / Escaped</span>
              <span className="text-base font-mono font-bold text-[#dc2626]">
                {simResult.leaked}
              </span>
            </div>
            <div className="card p-4 text-center">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Target Infrastructure Damage</span>
              <span className="text-base font-mono font-bold text-[#f59e0b]">
                {simResult.spent}%
              </span>
            </div>
            <div className="card p-4 text-center">
              <span className="text-[9px] text-[#64748b] uppercase block mb-1">Level Win Threshold</span>
              <span className="text-base font-mono font-bold text-white text-xs">
                {selectedRole === 'DEFEND'
                  ? `🛡️ Intercept >= ${(currentMission.winRateDefender * 100).toFixed(0)}%`
                  : `🚀 Leaked >= ${(currentMission.winRateAttacker * 100).toFixed(0)}%`}
              </span>
            </div>
          </div>

          <div className="card p-4 space-y-2 text-xs">
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider border-b border-[rgba(148,163,184,0.08)] pb-1 mb-2">
              Engagement Metrics
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Procured Asset Value:</span>
              <span className="font-mono text-white">${(currentMission.budget - remainingBudget).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Interception Efficiency Rate:</span>
              <span className="font-mono text-white">
                {simResult.total > 0 ? ((simResult.intercepted / simResult.total) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Wargame Simulation Time:</span>
              <span className="font-mono text-white">{simStateRef.current.seconds.toFixed(1)}s</span>
            </div>
          </div>

          <div className="flex gap-4">
            {simStateRef.current.winConditionMet ? (
              <button
                onClick={handleAdvanceCampaign}
                className="btn-primary flex-1 py-3 text-center font-bold tracking-widest"
              >
                ADVANCE CAMPAIGN
              </button>
            ) : (
              <button
                onClick={() => handleSelectRole(selectedRole!)}
                className="btn-secondary flex-1 py-3 text-center text-[#f59e0b] border-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] font-bold tracking-widest"
              >
                RETRY MISSION
              </button>
            )}
            <button
              onClick={() => setViewState('timeline')}
              className="btn-ghost py-3"
            >
              Timeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
