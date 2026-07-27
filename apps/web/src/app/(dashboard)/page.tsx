'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { useUIStore } from '@/stores/uiStore';
import {
  calculateInterceptionProbability,
  calculateDetectionProbability,
  findSystemKey
} from '@iades/shared';

// ---- Stat Card Component ----
interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  abbr: string;
  color: string;
  delay: number;
  onClick?: () => void;
}

function StatCard({ 
  label, value, suffix, abbr, color, delay, onClick 
}: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`stat-card card p-3 animate-fade-in-up ${onClick ? 'cursor-pointer hover:border-[rgba(56,189,248,0.25)] hover:shadow-[0_0_10px_rgba(56,189,248,0.06)]' : ''}`}
      style={{ '--accent-color': color, animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-[#64748b] uppercase tracking-[0.08em] font-mono mb-1.5">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono" style={{ color }}>{value}</span>
            {suffix && <span className="text-[11px] text-[#475569] font-mono">{suffix}</span>}
          </div>
        </div>
        <div className="text-[10px] font-mono font-semibold text-[#475569] bg-[#1b2340] px-1.5 py-0.5 border border-[rgba(148,163,184,0.06)]">{abbr}</div>
      </div>
      {onClick && (
        <div className="absolute bottom-1 right-1.5 text-[8px] text-[#475569] font-mono tracking-wider opacity-0 hover:opacity-100 transition-opacity">
          CLICK TO INSPECT
        </div>
      )}
    </div>
  );
}

// ---- Threat Definition ----
interface ThreatInstance {
  id: string;
  label: string;
  type: string;
  speed: number; // Mach
  rcs: number; // m²
  altitude: number; // meters
  heading: number; // degrees
  distance: number; // km
  x: number; // 0 - 100 on radar grid
  y: number; // 0 - 100 on radar grid
  angle: number; // radians
  status: 'DETECTED' | 'ENGAGED' | 'NEUTRALIZED' | 'IMPACTED';
  color: string;
  timeToImpact: number; // seconds
  trail?: Array<{ x: number; y: number }>;
}

// ---- Interceptor Definition ----
interface InterceptorInstance {
  id: string;
  threatId: string;
  x: number; // 0 - 100
  y: number; // 0 - 100
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  systemName: string;
  probability: number;
}

// ---- Sector Definition ----
interface SectorInfo {
  name: string;
  coverage: number;
  deployedSystemId: string | null;
  status: 'OPTIMAL' | 'SECURED' | 'MODERATE' | 'VULNERABLE';
  description: string;
}

// ---- Log Event Definition ----
interface LogEvent {
  id: string;
  time: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  system?: string;
  threat?: string;
}

export default function DashboardPage() {
  // ---- Global Stores & Session ----
  const { addToast } = useUIStore();
  
  // ---- Core Stats & Data State ----
  const [stats, setStats] = useState<any>(null);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [procuredList, setProcuredList] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // ---- Budget & Spent state ----
  const [budget, setBudget] = useState(2500); // $M local fallback
  const [spent, setSpent] = useState(1340); // $M local fallback

  // ---- Interactive Simulation State ----
  const [threats, setThreats] = useState<ThreatInstance[]>([]);
  const [interceptors, setInterceptors] = useState<InterceptorInstance[]>([]);
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);
  const [selectedSystemId, setSelectedSystemId] = useState<string>('');
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const [defcon, setDefcon] = useState<'3' | '2' | '1'>('3');
  const [radarSweepActive, setRadarSweepActive] = useState(true);
  const [radarSweepSpeed, setRadarSweepSpeed] = useState<number>(3); // 1 = slow, 3 = normal, 5 = fast
  const [ecmJamming, setEcmJamming] = useState(false);
  const [threatFilter, setThreatFilter] = useState<'ALL' | 'BALLISTIC_MISSILE' | 'CRUISE_MISSILE' | 'UAV'>('ALL');
  const [patrolAngle, setPatrolAngle] = useState(0);
  const [weaponsState, setWeaponsState] = useState<'SAFE' | 'HOLD' | 'FREE'>('SAFE');
  const [hoverCoords, setHoverCoords] = useState<{ lat: string; lng: string; mgrs: string } | null>(null);

  const handleRadarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const dx = x - 50;
    const dy = y - 50;
    
    const baseLat = 28.6139;
    const baseLng = 77.2090;
    
    const latOffset = -(dy / 40) * (400 / 111);
    const lngOffset = (dx / 40) * (400 / 111);
    
    const lat = baseLat + latOffset;
    const lng = baseLng + lngOffset;
    
    const formatDMS = (val: number, isLat: boolean) => {
      const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
      const absVal = Math.abs(val);
      const d = Math.floor(absVal);
      const m = Math.floor((absVal - d) * 60);
      const s = Math.floor(((absVal - d) * 60 - m) * 60);
      return `${d}°${m}'${s}"${dir}`;
    };

    const zone = '43R';
    const gridSquare = 'DQ';
    const easting = Math.floor(Math.abs(dx * 1234)).toString().padStart(5, '0');
    const northing = Math.floor(Math.abs(dy * 5678)).toString().padStart(5, '0');

    setHoverCoords({
      lat: formatDMS(lat, true),
      lng: formatDMS(lng, false),
      mgrs: `${zone} ${gridSquare} ${easting} ${northing}`
    });
  };

  // ---- Sectors State ----
  const [selectedSector, setSelectedSector] = useState<string>('Northern Sector');
  const [sectors, setSectors] = useState<Record<string, SectorInfo>>({
    'Northern Sector': { name: 'NORTHERN FRONT [SEC-01/JK]', coverage: 87, deployedSystemId: 'd1', status: 'SECURED', description: 'Safeguarding Jammu & Kashmir and Ladakh borders. High mountain clutter.' },
    'Western Sector': { name: 'WESTERN PLAINS [SEC-02/PK]', coverage: 92, deployedSystemId: 'd3', status: 'OPTIMAL', description: 'Plains sector protecting Punjab and Rajasthan regions. High drone activity.' },
    'Eastern Sector': { name: 'EASTERN HILLS [SEC-03/LAC]', coverage: 78, deployedSystemId: 'd2', status: 'MODERATE', description: 'Hilly terrains of Northeast. High cloud cover weather impacts.' },
    'Southern Sector': { name: 'SOUTHERN COASTAL [SEC-04/IND]', coverage: 85, deployedSystemId: 'd4', status: 'SECURED', description: 'Coastal defense coverage monitoring maritime airspace.' },
    'Central Region': { name: 'CENTRAL NCR [SEC-05/NCR]', coverage: 95, deployedSystemId: 'd1', status: 'OPTIMAL', description: 'Heartland defense guarding critical capital command zones.' }
  });

  // ---- Overlay Modals State ----
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<any | null>(null);
  
  // Refs for radar loop
  const radarSweepAngleRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // ---- Local Fallbacks (If APIs are unavailable) ----
  const fallbackCatalog = [
    { id: 'd1', name: 'S-400 Triumf Regiment', category: 'LONG_RANGE', cost: 1090, maxRange: 400, accuracy: 0.92, operatingCostPerHour: 500, description: 'Preeminent long-range strategic surface-to-air missile system.' },
    { id: 'd2', name: 'Akash Battery', category: 'MEDIUM_RANGE', cost: 120, maxRange: 25, accuracy: 0.85, operatingCostPerHour: 80, description: 'Short/Medium range mobile air defense system with phased array radar.' },
    { id: 'd3', name: 'Barak 8 ER System', category: 'MEDIUM_RANGE', cost: 650, maxRange: 150, accuracy: 0.90, operatingCostPerHour: 320, description: 'Joint Indo-Israeli long-range active seeker counter-ballistic system.' },
    { id: 'd4', name: 'QRSAM Battery', category: 'SHORT_RANGE', cost: 180, maxRange: 30, accuracy: 0.85, operatingCostPerHour: 120, description: 'Quick Reaction Surface-to-Air Missile designed for truck-mobile escort.' },
    { id: 'd5', name: 'VSHORAD System', category: 'VERY_SHORT_RANGE', cost: 40, maxRange: 8, accuracy: 0.75, operatingCostPerHour: 30, description: 'Man-portable infrared homing short range defense.' },
    { id: 'd6', name: 'Anti-Drone Jammer', category: 'ANTI_DRONE', cost: 25, maxRange: 4, accuracy: 0.88, operatingCostPerHour: 15, description: 'Directed energy and RF disruption anti-UAV system.' },
    { id: 'd7', name: 'Arudhra 3D Radar', category: 'RADAR', cost: 95, maxRange: 400, accuracy: 1.0, operatingCostPerHour: 50, description: 'Indigenous medium power active aperture radar system.' }
  ];

  const fallbackOperators = [
    { id: 'u1', name: 'Cmdr. A. Sharma', role: 'ADMIN', createdAt: '2026-01-10T12:00:00Z', stats: { simulationsRun: 142 } },
    { id: 'u2', name: 'Lt. Col. R. Iyer', role: 'PLAYER', createdAt: '2026-02-15T09:30:00Z', stats: { simulationsRun: 89 } },
    { id: 'u3', name: 'Flt. Lt. S. Sen', role: 'PLAYER', createdAt: '2026-04-03T16:45:00Z', stats: { simulationsRun: 54 } },
    { id: 'u4', name: 'Sgt. M. Deshmukh', role: 'OBSERVER', createdAt: '2026-05-20T11:15:00Z', stats: { simulationsRun: 0 } }
  ];

  // ---- Fetch Initial Data ----
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Get Overview Stats
      const overviewRes = await api.analytics.overview() as any;
      if (overviewRes && overviewRes.success) {
        setStats(overviewRes.data);
      }

      // 2. Get Procurement Catalog
      const catalogRes = await api.procurement.catalog() as any;
      if (catalogRes && catalogRes.success && catalogRes.data && catalogRes.data.length > 0) {
        setCatalog(catalogRes.data);
      } else {
        setCatalog(fallbackCatalog);
      }

      // 3. Get Budget & Deployed Systems
      const budgetRes = await api.procurement.budget() as any;
      if (budgetRes && budgetRes.success && budgetRes.data) {
        const totalBudget = 5000; // $5B total budget
        const totalSpent = budgetRes.data.totalSpent || 1340;
        setBudget(totalBudget - totalSpent);
        setSpent(totalSpent);
        setProcuredList(budgetRes.data.procurements || []);
      } else {
        // Mock local list from fallbackCatalog
        const defaultProcured = [
          { id: 'p-1', systemId: 'd1', level: 1, purchaseCost: 1090, system: fallbackCatalog[0] },
          { id: 'p-2', systemId: 'd2', level: 1, purchaseCost: 120, system: fallbackCatalog[1] },
          { id: 'p-3', systemId: 'd4', level: 1, purchaseCost: 180, system: fallbackCatalog[3] }
        ];
        setProcuredList(defaultProcured);
      }

      // 4. Get User Accounts (Operators)
      const usersRes = await api.admin.users() as any;
      if (usersRes && usersRes.success && usersRes.data) {
        setOperators(usersRes.data);
      } else {
        setOperators(fallbackOperators);
      }

    } catch (err) {
      console.warn('Backend API unavailable. Booting with local storage/fallback simulator.');
      setCatalog(fallbackCatalog);
      setOperators(fallbackOperators);
      // Load from LocalStorage if exists
      const savedBudget = localStorage.getItem('iades_budget');
      const savedSpent = localStorage.getItem('iades_spent');
      const savedProcured = localStorage.getItem('iades_procured');
      if (savedBudget) setBudget(Number(savedBudget));
      if (savedSpent) setSpent(Number(savedSpent));
      if (savedProcured) {
        setProcuredList(JSON.parse(savedProcured));
      } else {
        const defaultProcured = [
          { id: 'p-1', systemId: 'd1', level: 1, purchaseCost: 1090, system: fallbackCatalog[0] },
          { id: 'p-2', systemId: 'd2', level: 1, purchaseCost: 120, system: fallbackCatalog[1] },
          { id: 'p-3', systemId: 'd4', level: 1, purchaseCost: 180, system: fallbackCatalog[3] }
        ];
        setProcuredList(defaultProcured);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentTime(new Date());
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Setup initial default events
    const initialEvents: LogEvent[] = [
      { id: 'e1', time: '17:01:12', message: 'C2 Command operations online. Radar sweep initialized.', severity: 'info' },
      { id: 'e2', time: '17:02:45', message: 'Communications link established with Western Sector.', severity: 'info' },
      { id: 'e3', time: '17:05:08', message: 'Akash Battery deployed on high-alert operational footing.', severity: 'info' }
    ];
    setLogEvents(initialEvents);

    return () => {
      clearInterval(clock);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Sync local budget saves
  useEffect(() => {
    if (procuredList.length > 0) {
      localStorage.setItem('iades_procured', JSON.stringify(procuredList));
      localStorage.setItem('iades_budget', String(budget));
      localStorage.setItem('iades_spent', String(spent));
    }
  }, [procuredList, budget, spent]);

  // Set default selected system when procured list or selected threat changes
  useEffect(() => {
    if (procuredList.length > 0) {
      setSelectedSystemId(procuredList[0].id);
    }
  }, [procuredList, selectedThreatId]);

  // ---- Helper: Add Log Event ----
  const addLog = (message: string, severity: LogEvent['severity'], system?: string, threat?: string) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    const newLog: LogEvent = {
      id: `log-${Date.now()}-${Math.random()}`,
      time: timeStr,
      message,
      severity,
      system,
      threat
    };
    setLogEvents(prev => [newLog, ...prev].slice(0, 50));
  };

  // ---- Sector Coverage Calculation ----
  const getSectorSystem = (sectorName: string) => {
    const sec = sectors[sectorName];
    if (!sec || !sec.deployedSystemId) return null;
    return procuredList.find(p => p.system.id === sec.deployedSystemId || p.systemId === sec.deployedSystemId);
  };

  const reevaluateSectorCoverage = (sectorName: string, systemId: string | null) => {
    if (!systemId) {
      setSectors(prev => ({
        ...prev,
        [sectorName]: { ...prev[sectorName], deployedSystemId: null, coverage: 15, status: 'VULNERABLE' }
      }));
      addLog(`Sector ${sectorName}: All active defense batteries dismounted. Coverage critically low.`, 'critical');
      return;
    }

    const match = procuredList.find(p => p.id === systemId || p.systemId === systemId);
    if (!match) return;

    const sys = match.system;
    let baseCoverage = 15; // base radar coverage
    if (sys.category === 'LONG_RANGE') baseCoverage = 92;
    else if (sys.category === 'MEDIUM_RANGE') baseCoverage = 80;
    else if (sys.category === 'SHORT_RANGE') baseCoverage = 65;
    else if (sys.category === 'VERY_SHORT_RANGE') baseCoverage = 40;
    else if (sys.category === 'ANTI_DRONE') baseCoverage = 30;
    else if (sys.category === 'RADAR') baseCoverage = 75;

    // Apply upgrade level boost
    const levelBonus = (match.level || 1) * 3 - 3;
    const finalCoverage = Math.min(99, baseCoverage + levelBonus);
    
    let status: SectorInfo['status'] = 'MODERATE';
    if (finalCoverage >= 90) status = 'OPTIMAL';
    else if (finalCoverage >= 75) status = 'SECURED';
    else if (finalCoverage >= 40) status = 'MODERATE';
    else status = 'VULNERABLE';

    setSectors(prev => ({
      ...prev,
      [sectorName]: { ...prev[sectorName], deployedSystemId: sys.id, coverage: finalCoverage, status }
    }));

    addLog(`Sector ${sectorName}: Mounted ${sys.name} (LVL ${match.level || 1}). Coverage established at ${finalCoverage}%.`, 'success');
  };

  // ---- Simulate / Spawn Threat ----
  const spawnThreat = (forceType?: string) => {
    const types = ['BALLISTIC_MISSILE', 'CRUISE_MISSILE', 'UAV', 'FIGHTER_AIRCRAFT', 'HYPERSONIC'];
    const selectedType = forceType || types[Math.floor(Math.random() * types.length)];
    
    const angle = Math.random() * Math.PI * 2; // Random entry angle
    const distance = 250 + Math.random() * 150; // Entry range between 250km and 400km
    
    // Convert to x, y relative to center (50, 50)
    // Radar radius corresponds to 400km
    const radiusRatio = distance / 400;
    const x = 50 + Math.cos(angle) * 40 * radiusRatio;
    const y = 50 + Math.sin(angle) * 40 * radiusRatio;

    let label = 'TGT-';
    let speed = 1.0; // Mach
    let rcs = 1.0; // m²
    let altitude = 5000; // meters
    let color = '#f59e0b'; // amber

    switch (selectedType) {
      case 'BALLISTIC_MISSILE':
        label = `BM-${Math.floor(100 + Math.random() * 900)}`;
        speed = 5.5 + Math.random() * 3;
        rcs = 0.5;
        altitude = 90000;
        color = '#dc2626'; // red
        break;
      case 'HYPERSONIC':
        label = `HGV-${Math.floor(100 + Math.random() * 900)}`;
        speed = 7.0 + Math.random() * 5;
        rcs = 0.15;
        altitude = 35000;
        color = '#be123c'; // dark red
        break;
      case 'CRUISE_MISSILE':
        label = `CM-${Math.floor(100 + Math.random() * 900)}`;
        speed = 0.8 + Math.random() * 0.4;
        rcs = 0.3;
        altitude = 150; // low sea-skimming/terrain hugger
        color = '#ea580c'; // orange
        break;
      case 'UAV':
        label = `UAV-${Math.floor(100 + Math.random() * 900)}`;
        speed = 0.15 + Math.random() * 0.1;
        rcs = 0.05;
        altitude = 1200;
        color = '#eab308'; // yellow
        break;
      case 'FIGHTER_AIRCRAFT':
        label = `FTR-${Math.floor(100 + Math.random() * 900)}`;
        speed = 1.2 + Math.random() * 1.0;
        rcs = 4.0;
        altitude = 12000;
        color = '#3b82f6'; // blue
        break;
    }

    // DEFCON multiplier adjustments
    if (defcon === '2') speed *= 1.2;
    else if (defcon === '1') speed *= 1.4;

    const newThreat: ThreatInstance = {
      id: `threat-${Date.now()}-${Math.random()}`,
      label,
      type: selectedType,
      speed,
      rcs,
      altitude,
      heading: (angle * 180 / Math.PI + 180) % 360,
      distance,
      x,
      y,
      angle,
      status: 'DETECTED',
      color,
      timeToImpact: Math.floor((distance / (speed * 1225)) * 3600) // speed * 1225 = km/h approximation
    };

    setThreats(prev => [...prev, newThreat]);
    addLog(`ALERT: New radar track ${label} (${selectedType}) locked at range ${distance.toFixed(0)}km. Speed: Mach ${speed.toFixed(1)}.`, 'critical', undefined, label);
    addToast(`THREAT INBOUND: ${label}`, 'WARNING');
  };

  // ---- Fire Interceptor Hook ----
  const triggerLaunch = (target: ThreatInstance, systemProc: any) => {
    if (target.status === 'NEUTRALIZED' || target.status === 'IMPACTED' || target.status === 'ENGAGED') {
      return;
    }

    const sys = systemProc.system;
    
    // Interception Range Check
    if (target.distance > sys.maxRange) {
      return;
    }

    // Mark threat as engaged
    setThreats(prev => prev.map(t => t.id === target.id ? { ...t, status: 'ENGAGED' } : t));

    // Calculate probability using shared formulas
    const systemKey = findSystemKey(sys.name) || 'S-400';
    const accuracy = sys.accuracy || 0.85;
    
    // Weather condition factor
    const weather = 'CLEAR';
    const ecmLevel = ecmJamming ? 0.6 : 0.1; // Higher ecmLevel degrades PK probability

    const prob = calculateInterceptionProbability({
      baseAccuracy: accuracy,
      targetSpeed: target.speed,
      interceptorSpeed: sys.category === 'LONG_RANGE' ? 6 : sys.category === 'MEDIUM_RANGE' ? 4 : 2,
      targetAltitude: target.altitude,
      systemMinAlt: sys.minAltitude || 10,
      systemMaxAlt: sys.maxAltitude || 25000,
      targetRCS: target.rcs,
      weather,
      ecmLevel,
      range: target.distance,
      systemMaxRange: sys.maxRange,
      targetType: target.type,
      systemName: systemKey
    });

    const newInterceptor: InterceptorInstance = {
      id: `int-${Date.now()}-${Math.random()}`,
      threatId: target.id,
      x: 50,
      y: 50,
      startX: 50,
      startY: 50,
      targetX: target.x,
      targetY: target.y,
      progress: 0,
      systemName: sys.name,
      probability: prob
    };

    setInterceptors(prev => [...prev, newInterceptor]);
    addLog(`Command Authorized Launch: Interceptor salvo launched from ${sys.name} against ${target.label}. PK probability: ${(prob * 100).toFixed(1)}%.`, 'info', sys.name, target.label);
  };

  const fireInterceptor = () => {
    if (weaponsState === 'SAFE') {
      addToast('WEAPONS SAFE: Override console status to HOLD/FREE to authorize salvo.', 'ERROR');
      addLog('Command Override Blocked: Salvo blocked due to Weapons SAFE status.', 'warning');
      return;
    }

    if (!selectedThreatId || !selectedSystemId) return;
    
    const target = threats.find(t => t.id === selectedThreatId);
    const systemProc = procuredList.find(p => p.id === selectedSystemId);
    
    if (!target || !systemProc) return;

    if (target.status === 'NEUTRALIZED' || target.status === 'IMPACTED') {
      addToast('Target already neutralized or impacted', 'INFO');
      return;
    }

    if (target.distance > systemProc.system.maxRange) {
      addToast(`Target out of intercept range (Max: ${systemProc.system.maxRange}km)`, 'ERROR');
      addLog(`C2 Blocked Launch: Target ${target.label} range (${target.distance.toFixed(0)}km) exceeds ${systemProc.system.name} envelope (${systemProc.system.maxRange}km).`, 'warning', systemProc.system.name, target.label);
      return;
    }

    triggerLaunch(target, systemProc);
  };

  // ---- Execute Simulation Loop ----
  useEffect(() => {
    const updateTick = () => {
      // 1. Move threats closer to center
      setThreats(prev => {
        return prev.map(t => {
          if (t.status === 'NEUTRALIZED' || t.status === 'IMPACTED') return t;

          // Target movement based on speed
          // Speed is Mach. Speed * 0.05 is distance step in %
          const speedStep = (t.speed * 0.015) / 10;
          const currentRadius = Math.sqrt(Math.pow(t.x - 50, 2) + Math.pow(t.y - 50, 2));
          
          if (currentRadius <= 1.0) {
            // Hit friendly base C2 Node
            addLog(`CRITICAL ENGAGEMENT: Threat ${t.label} breached final layer and impacted base!`, 'critical', undefined, t.label);
            addToast(`COLLISION ALERT: ${t.label} Impacted!`, 'ERROR');
            return { ...t, status: 'IMPACTED', x: 50, y: 50, distance: 0, timeToImpact: 0 };
          }

          const newRadius = Math.max(0, currentRadius - speedStep);
          const newX = 50 + Math.cos(t.angle) * newRadius;
          const newY = 50 + Math.sin(t.angle) * newRadius;
          const newDistance = (newRadius / 40) * 400; // Recalculate km range
          const currentTrail = t.trail || [];
          const newTrail = [...currentTrail, { x: t.x, y: t.y }].slice(-4);

          return {
            ...t,
            x: newX,
            y: newY,
            distance: newDistance,
            timeToImpact: Math.max(0, t.timeToImpact - 1),
            trail: newTrail
          };
        });
      });

      // 2. Move Interceptors towards targets
      setInterceptors(prev => {
        const active: InterceptorInstance[] = [];

        prev.forEach(int => {
          const target = threats.find(t => t.id === int.threatId);
          if (!target || target.status === 'NEUTRALIZED' || target.status === 'IMPACTED') {
            // Discard if target is gone
            return;
          }

          // Advance interceptor progress
          const newProgress = int.progress + 0.08; // speed of interceptor visual travel
          
          if (newProgress >= 1.0) {
            // Impact! Run neutralization roll
            const roll = Math.random();
            const success = roll <= int.probability;

            if (success) {
              setThreats(tPrev => tPrev.map(t => t.id === int.threatId ? { ...t, status: 'NEUTRALIZED' } : t));
              addLog(`TACTICAL SUCCESS: Threat ${target.label} successfully neutralized by ${int.systemName} interceptor salvo!`, 'success', int.systemName, target.label);
              addToast(`TARGET NEUTRALIZED: ${target.label}`, 'SUCCESS');
              
              // Increment engagements count locally
              setStats((sPrev: any) => sPrev ? {
                ...sPrev,
                totalSimulations: (sPrev.totalSimulations || 0) + 1,
                avgInterceptionRate: sPrev.avgInterceptionRate ? (sPrev.avgInterceptionRate * 9 + 1.0) / 10 : 1.0
              } : null);

            } else {
              setThreats(tPrev => tPrev.map(t => t.id === int.threatId ? { ...t, status: 'DETECTED' } : t));
              addLog(`TACTICAL BREAK: Interception failed! Salvo missed track ${target.label}. Assign secondary defense priority.`, 'warning', int.systemName, target.label);
              addToast(`INTERCEPT FAILED: ${target.label}`, 'ERROR');
              
              setStats((sPrev: any) => sPrev ? {
                ...sPrev,
                totalSimulations: (sPrev.totalSimulations || 0) + 1,
                avgInterceptionRate: sPrev.avgInterceptionRate ? (sPrev.avgInterceptionRate * 9 + 0.0) / 10 : 0.0
              } : null);
            }
          } else {
            // Interpolate position
            const newX = int.startX + (target.x - int.startX) * newProgress;
            const newY = int.startY + (target.y - int.startY) * newProgress;

            active.push({
              ...int,
              x: newX,
              y: newY,
              progress: newProgress
            });
          }
        });

        return active;
      });

      // 3. Increment radar sweep line
      if (radarSweepActive) {
        radarSweepAngleRef.current = (radarSweepAngleRef.current + radarSweepSpeed * 0.5) % 360;
      }

      // 4. Increment patrol aircraft angle
      setPatrolAngle(prev => (prev + 0.04) % (Math.PI * 2));

      // 5. Auto Engage Logic if WEAPONS FREE
      if (weaponsState === 'FREE') {
        threats.forEach(t => {
          if (t.status === 'DETECTED') {
            const systemProc = procuredList.find(p => t.distance <= p.system.maxRange);
            if (systemProc) {
              triggerLaunch(t, systemProc);
            }
          }
        });
      }
    };

    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, [threats, radarSweepActive, radarSweepSpeed, weaponsState, procuredList]);

  // Clean neutralized threats from screen after a delay
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setThreats(prev => prev.filter(t => t.status !== 'NEUTRALIZED' && t.status !== 'IMPACTED'));
      // Reset selected target if it was neutralized/impacted
      const activeTargets = threats.filter(t => t.status !== 'NEUTRALIZED' && t.status !== 'IMPACTED');
      if (selectedThreatId && !activeTargets.some(t => t.id === selectedThreatId)) {
        setSelectedThreatId(null);
      }
    }, 5000);

    return () => clearTimeout(cleanup);
  }, [threats, selectedThreatId]);

  // ---- Execute Live System Procurement ----
  const purchaseSystem = async (sys: any) => {
    if (budget < sys.cost) {
      addToast('INSUFFICIENT FUNDS: Project budget limit exceeded.', 'ERROR');
      return;
    }

    try {
      setLoading(true);
      const res = await api.procurement.purchase(sys.id) as any;
      if (res && res.success) {
        // Success backend purchase
        addToast(`PROCURING: ${sys.name}`, 'SUCCESS');
        addLog(`C2 procurement completed: Procured unit ${sys.name} for $${sys.cost}M.`, 'success');
        fetchData(); // reload stats and systems
      } else {
        throw new Error('Purchase failed');
      }
    } catch {
      // Fallback local procurement
      const updatedBudget = budget - sys.cost;
      const updatedSpent = spent + sys.cost;
      const newProcured = {
        id: `p-local-${Date.now()}`,
        systemId: sys.id,
        level: 1,
        purchaseCost: sys.cost,
        system: sys
      };

      setBudget(updatedBudget);
      setSpent(updatedSpent);
      setProcuredList(prev => [...prev, newProcured]);
      
      // Update local stats card count
      setStats((sPrev: any) => sPrev ? {
        ...sPrev,
        totalSystems: (sPrev.totalSystems || 0) + 1
      } : null);

      addToast(`PROCURING: ${sys.name} (Local)`, 'SUCCESS');
      addLog(`C2 Local Procurement: Purchased unit ${sys.name} for $${sys.cost}M.`, 'success');
    } finally {
      setLoading(false);
      setActiveModal(null);
      setSelectedCatalogItem(null);
    }
  };

  // ---- Execute System Upgrade ----
  const upgradeSystem = async (procId: string) => {
    const target = procuredList.find(p => p.id === procId);
    if (!target) return;

    const upgradeCost = Math.round(target.purchaseCost * 0.2 * target.level);
    if (budget < upgradeCost) {
      addToast('INSUFFICIENT FUNDS: Upgrade budget limit exceeded.', 'ERROR');
      return;
    }

    try {
      setLoading(true);
      const res = await api.procurement.upgrade(procId, 'accuracy') as any;
      if (res && res.success) {
        addToast(`UPGRADED: ${target.system.name}`, 'SUCCESS');
        addLog(`System refit completed: Upgraded ${target.system.name} to Level ${target.level + 1}.`, 'success');
        fetchData();
      } else {
        throw new Error('Upgrade failed');
      }
    } catch {
      // Local fallback upgrade
      const updatedBudget = budget - upgradeCost;
      const updatedSpent = spent + upgradeCost;

      setProcuredList(prev => prev.map(p => {
        if (p.id === procId) {
          return {
            ...p,
            level: p.level + 1,
            purchaseCost: p.purchaseCost + upgradeCost
          };
        }
        return p;
      }));

      setBudget(updatedBudget);
      setSpent(updatedSpent);

      addToast(`UPGRADED: ${target.system.name} (Local)`, 'SUCCESS');
      addLog(`System local refit completed: Upgraded ${target.system.name} to Level ${target.level + 1}. Cost: $${upgradeCost}M.`, 'success');
    } finally {
      setLoading(false);
    }
  };

  // Find system counts by range category
  const getCategoryCount = (category: string) => {
    return procuredList.filter(p => p.system.category === category).length;
  };

  return (
    <div className="space-y-4">
      {/* Header Panel */}
      <div className="card p-4 border-[rgba(56,189,248,0.15)] relative overflow-hidden">
        {/* Glow corner line */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="status-dot status-active animate-pulse" />
              <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">
                C2 Operations Center — COMMAND CONSOLE
              </h1>
            </div>
            <p className="text-[11px] text-[#475569] font-mono mt-0.5">
              IADES — Indian Air Defence Educational Simulator // DEFCON STATUS: {defcon} // LIVE TACTICAL DEPLOYMENT
            </p>
          </div>
          
          {/* Operations Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* DEFCON Selector */}
            <div className="flex items-center bg-[#0b0f19] border border-[rgba(148,163,184,0.08)] px-2 py-1 gap-1.5 rounded-sm">
              <span className="text-[9px] font-mono text-[#64748b] tracking-wider mr-1">DEFCON:</span>
              <button 
                onClick={() => { setDefcon('3'); addLog('DEFCON alert set to level 3 (Normal Operations).', 'info'); }}
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 transition-colors ${defcon === '3' ? 'bg-[#4ade80] text-[#0b0f19]' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                3
              </button>
              <button 
                onClick={() => { setDefcon('2'); addLog('DEFCON level 2 declared. Heightened scanning and missile speed limits updated.', 'warning'); }}
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 transition-colors ${defcon === '2' ? 'bg-[#f59e0b] text-[#0b0f19]' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                2
              </button>
              <button 
                onClick={() => { setDefcon('1'); addLog('DEFCON LEVEL 1 DECLARED. Maximum threat readiness active.', 'critical'); }}
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 transition-colors ${defcon === '1' ? 'bg-[#dc2626] text-[#cbd5e1]' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                1
              </button>
            </div>

            {/* Weapons Override State Selector */}
            <div className="flex items-center bg-[#0b0f19] border border-[rgba(148,163,184,0.08)] px-2 py-1 gap-1.5 rounded-sm">
              <span className="text-[9px] font-mono text-[#64748b] tracking-wider mr-1">WEAPONS:</span>
              <button 
                onClick={() => { setWeaponsState('SAFE'); addLog('Weapons System SAFE: Launch overrides locked.', 'warning'); }}
                className={`text-[9px] font-mono font-bold px-1 py-0.5 transition-colors ${weaponsState === 'SAFE' ? 'bg-[#eab308] text-[#0b0f19]' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                SAFE
              </button>
              <button 
                onClick={() => { setWeaponsState('HOLD'); addLog('Weapons System HOLD: Manual salvo authorization active.', 'info'); }}
                className={`text-[9px] font-mono font-bold px-1 py-0.5 transition-colors ${weaponsState === 'HOLD' ? 'bg-[#38bdf8] text-[#0b0f19]' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                HOLD
              </button>
              <button 
                onClick={() => { setWeaponsState('FREE'); addLog('WARNING: WEAPONS FREE DECLARED. AUTOMATIC SALVO LAUNCH ENABLED.', 'critical'); }}
                className={`text-[9px] font-mono font-bold px-1 py-0.5 transition-colors ${weaponsState === 'FREE' ? 'bg-[#dc2626] text-[#cbd5e1] animate-pulse' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
              >
                AUTO-FIRE
              </button>
            </div>

            {/* Spawn Trigger Buttons */}
            <button 
              onClick={() => spawnThreat()}
              className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1.5 rounded-sm font-mono border-[rgba(245,158,11,0.25)] text-[#f59e0b]"
            >
              <svg className="w-3 h-3 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              INJECT THREAT
            </button>
            <button 
              onClick={() => {
                spawnThreat('UAV');
                setTimeout(() => spawnThreat('UAV'), 400);
                setTimeout(() => spawnThreat('UAV'), 800);
              }}
              className="btn-secondary py-1 px-3 text-[10px] flex items-center gap-1.5 rounded-sm font-mono border-[rgba(220,38,38,0.25)] text-[#dc2626]"
            >
              UAV SWARM
            </button>
            <button 
              onClick={() => {
                setThreats([]);
                setInterceptors([]);
                setSelectedThreatId(null);
                addLog('Radar grid cleared. Target tracks reset.', 'info');
              }}
              className="btn-ghost py-1 px-2 text-[10px] font-mono rounded-sm text-[#64748b]"
            >
              CLEAR GRID
            </button>

            {/* Time / Date Clock */}
            <div className="text-right pl-3 border-l border-[rgba(148,163,184,0.1)] hide-mobile font-mono">
              <div className="text-xs font-semibold text-[#38bdf8] tracking-wider leading-none">
                {currentTime ? currentTime.toLocaleTimeString('en-IN', { hour12: false }) : '--:--:--'}
              </div>
              <div className="text-[9px] text-[#475569] mt-0.5 leading-none">
                {currentTime ? currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Active Simulations" value={stats?.activeSimulations ?? 3} abbr="SIM" color="#38bdf8" delay={0} />
        <StatCard label="Operators Online" value={operators.length} abbr="USR" color="#4ade80" delay={40} onClick={() => setActiveModal('operators')} />
        <StatCard label="Defence Systems" value={procuredList.length} abbr="DEF" color="#d97706" delay={80} onClick={() => setActiveModal('inventory')} />
        <StatCard label="Threat Profiles" value={stats?.totalThreats ?? 19} abbr="THR" color="#dc2626" delay={120} onClick={() => setActiveModal('threats')} />
        <StatCard label="Interception rate" value={stats?.avgInterceptionRate ? `${(stats.avgInterceptionRate * 100).toFixed(0)}%` : '82%'} abbr="PK" color="#7c3aed" delay={160} />
        <StatCard label="Available Budget" value={`$${budget}M`} abbr="USD" color="#4f46e5" delay={200} onClick={() => setActiveModal('catalog')} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Columns - Tactical Radar and Control */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Radar Screen Card */}
          <div className="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1 & 2: Radar Canvas Screen */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 border-b border-[rgba(148,163,184,0.06)] pb-1.5">
                <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                  Tactical Air Defense Radar Sweep
                </h3>
                
                {/* Radar controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-[#475569] uppercase">Sweep speed:</span>
                  <input 
                    type="range" min="1" max="5" value={radarSweepSpeed} 
                    onChange={(e) => setRadarSweepSpeed(Number(e.target.value))} 
                    className="w-16 h-1" 
                  />
                  <button 
                    onClick={() => setRadarSweepActive(!radarSweepActive)} 
                    className="text-[9px] font-mono font-semibold px-1.5 py-0.5 border border-[rgba(148,163,184,0.12)] text-[#cbd5e1] rounded-xs"
                  >
                    {radarSweepActive ? 'PAUSE' : 'SCAN'}
                  </button>
                </div>
              </div>

              {/* Radar Secondary Controls (Filters & Jamming) */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-[#0b0f19] p-2 border border-[rgba(148,163,184,0.04)] text-[9px] font-mono">
                {/* Threat Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#64748b]">FILTER:</span>
                  {(['ALL', 'BALLISTIC_MISSILE', 'CRUISE_MISSILE', 'UAV'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setThreatFilter(f)}
                      className={`px-1.5 py-0.5 border border-transparent transition-colors rounded-xs ${threatFilter === f ? 'bg-[#38bdf8] text-[#0b0f19] font-bold' : 'text-[#64748b] hover:text-[#cbd5e1]'}`}
                    >
                      {f === 'ALL' ? 'ALL' : f === 'BALLISTIC_MISSILE' ? 'BM' : f === 'CRUISE_MISSILE' ? 'CM' : 'UAV'}
                    </button>
                  ))}
                </div>

                {/* ECM Jamming Switch */}
                <button
                  onClick={() => {
                    const next = !ecmJamming;
                    setEcmJamming(next);
                    addLog(next ? 'WARNING: Hostile jamming/ECM active. Defense lock probabilities degraded.' : 'ECM Jamming cleared. Radar clarity restored.', next ? 'warning' : 'info');
                  }}
                  className={`px-2 py-0.5 border transition-all rounded-xs font-bold flex items-center gap-1
                    ${ecmJamming 
                      ? 'border-[#be123c] bg-[rgba(190,18,60,0.15)] text-[#ef4444] animate-pulse'
                      : 'border-[rgba(148,163,184,0.15)] text-[#64748b] hover:text-[#cbd5e1]'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ecmJamming ? 'bg-[#ef4444]' : 'bg-[#475569]'}`} />
                  ECM JAMMING
                </button>
              </div>

              {/* The radar sweep circle container */}
              <div 
                onMouseMove={handleRadarMouseMove}
                onMouseLeave={() => setHoverCoords(null)}
                className="relative w-full aspect-square max-w-[340px] mx-auto border border-[rgba(56,189,248,0.15)] rounded-full bg-[#070b13] p-0.5 overflow-hidden shadow-[inset_0_0_20px_rgba(56,189,248,0.05)]"
              >
                {/* Concentric rings */}
                {[10, 20, 30, 40].map(rad => (
                  <div
                    key={rad}
                    className="absolute rounded-full border border-[rgba(56,189,248,0.06)] flex items-center justify-center"
                    style={{
                      width: `${rad * 2.3}%`, height: `${rad * 2.3}%`,
                      top: `${50 - rad * 2.3 / 2}%`, left: `${50 - rad * 2.3 / 2}%`,
                    }}
                  >
                    {/* Ring distance labels */}
                    <span className="absolute top-0 text-[7px] text-[#475569] font-mono select-none">
                      {(rad * 10).toFixed(0)}km
                    </span>
                  </div>
                ))}

                {/* Visual Military Boundaries & ADIZ Zones */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
                  {/* Engagement Threshold Zone (150km range circle) */}
                  <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="0.25" strokeDasharray="1 1" />
                  <text x="50" y="34.2" fill="#ef4444" fontSize="1.3" fontFamily="monospace" textAnchor="middle" opacity="0.45" letterSpacing="0.05em"> engagement zone (150km) </text>
                  
                  {/* Airspace Identification boundary (300km range circle) */}
                  <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.25" strokeDasharray="1.5 1.5" />
                  <text x="50" y="19.2" fill="#f59e0b" fontSize="1.3" fontFamily="monospace" textAnchor="middle" opacity="0.4" letterSpacing="0.05em"> active adiz limit (300km) </text>

                  {/* Northwest High Threat Corridor slice */}
                  <path d="M50,50 L30,15 A43,43 0 0,1 70,15 Z" fill="rgba(239,68,68,0.015)" stroke="rgba(239,68,68,0.08)" strokeWidth="0.2" strokeDasharray="1 1" />
                  <text x="50" y="10" fill="#dc2626" fontSize="1.4" fontFamily="monospace" textAnchor="middle" opacity="0.4" letterSpacing="0.05em">HIGH-RISK INBOUND VENT</text>
                  
                  {/* Active threat vector lines to base */}
                  {selectedThreatId && (() => {
                    const target = threats.find(t => t.id === selectedThreatId);
                    if (!target || target.status === 'NEUTRALIZED' || target.status === 'IMPACTED') return null;
                    return (
                      <>
                        <line
                          x1={target.x}
                          y1={target.y}
                          x2={50}
                          y2={50}
                          stroke="#ef4444"
                          strokeWidth="0.3"
                          strokeDasharray="1 1"
                          opacity="0.75"
                        />
                        <circle cx={target.x + (50 - target.x) * 0.3} cy={target.y + (50 - target.y) * 0.3} r="0.7" fill="#ef4444" opacity="0.8" />
                        <text x={target.x + (50 - target.x) * 0.3 + 1.5} y={target.y + (50 - target.y) * 0.3 + 0.5} fill="#ef4444" fontSize="1.0" fontFamily="monospace" opacity="0.75">T+30s</text>
                      </>
                    );
                  })()}
                </svg>

                {/* HUD Floating Coordinate Readout */}
                {hoverCoords && (
                  <div className="absolute bottom-3 left-3 bg-[#070b13]/90 border border-[rgba(56,189,248,0.25)] p-1.5 font-mono text-[7px] text-[#38bdf8] space-y-0.5 pointer-events-none select-none z-30 leading-none rounded-xs">
                    <div>LAT: {hoverCoords.lat}</div>
                    <div>LNG: {hoverCoords.lng}</div>
                    <div>GRID: {hoverCoords.mgrs}</div>
                  </div>
                )}
                
                {/* Bearing cross-lines */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[rgba(56,189,248,0.06)]" />
                <div className="absolute left-0 right-0 top-1/2 h-px bg-[rgba(56,189,248,0.06)]" />
                
                {/* Friendly C2 Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-[#4ade80] flex items-center justify-center bg-[#0b0f19] z-10 rotate-45 select-none">
                  <div className="w-1.5 h-1.5 bg-[#4ade80]" />
                  <span className="absolute bottom-[10px] text-[7px] font-mono text-[#4ade80] bg-[#070b13] px-0.5 border border-[rgba(74,222,128,0.15)]">C2</span>
                </div>

                {/* Sweeper sweep line */}
                {radarSweepActive && (
                  <div 
                    className="absolute inset-0 origin-center transition-transform duration-100 ease-linear"
                    style={{ transform: `rotate(${radarSweepAngleRef.current}deg)` }}
                  >
                    <div
                      className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                      style={{
                        background: 'conic-gradient(from 270deg, rgba(56,189,248,0.12), transparent 45deg)',
                      }}
                    />
                    <div className="absolute top-0 bottom-1/2 left-1/2 w-px bg-gradient-to-t from-[rgba(56,189,248,0.4)] to-transparent" />
                  </div>
                )}

                {/* ECM Jamming Noise Overlay */}
                {ecmJamming && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(190,18,60,0.05)_100%)] pointer-events-none z-10">
                    {[1, 2, 3, 4, 5].map(i => {
                      const randX = Math.floor(Math.sin(i * 123 + Date.now()) * 30) + 50;
                      const randY = Math.floor(Math.cos(i * 456 + Date.now()) * 30) + 50;
                      return (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-red-500/25 rounded-full animate-ping"
                          style={{
                            left: `${randX}%`,
                            top: `${randY}%`,
                            animationDuration: `${1.0 + i * 0.2}s`
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Combat Air Patrol (CAP) Friendly Jet */}
                <div
                  className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 z-20 group pointer-events-none"
                  style={{ 
                    left: `${50 + Math.cos(patrolAngle) * 20}%`, 
                    top: `${50 + Math.sin(patrolAngle) * 20}%` 
                  }}
                >
                  <span className="absolute inset-0 rounded-full border border-[#38bdf8]/30 opacity-40 animate-ping" style={{ animationDuration: '2.5s' }} />
                  <div 
                    className="w-2 h-2 border-l border-t border-[#38bdf8] rotate-45"
                    style={{ transform: `rotate(${patrolAngle * 180 / Math.PI + 45}deg)` }}
                  />
                  <div className="absolute top-[8px] left-1/2 -translate-x-1/2 bg-[#070b13] border border-[rgba(56,189,248,0.15)] text-[#38bdf8] text-[5px] py-0.25 px-0.5 rounded-xs font-mono whitespace-nowrap select-none scale-75">
                    CAP: SU-30
                  </div>
                </div>

                {/* Render Threat Dots & Trails */}
                {threats
                  .filter(t => threatFilter === 'ALL' || t.type === threatFilter)
                  .map(t => {
                    const isSelected = selectedThreatId === t.id;
                    
                    return (
                      <div key={t.id}>
                        {/* Trail points */}
                        {t.trail && t.trail.map((pt, idx) => (
                          <div
                            key={idx}
                            className="absolute w-1 h-1 rounded-full pointer-events-none opacity-40"
                            style={{
                              left: `${pt.x}%`,
                              top: `${pt.y}%`,
                              backgroundColor: t.color,
                              transform: 'translate(-50%, -50%)',
                              width: `${(idx + 1) * 0.75}px`,
                              height: `${(idx + 1) * 0.75}px`
                            }}
                          />
                        ))}

                        <button
                          onClick={() => setSelectedThreatId(isSelected ? null : t.id)}
                          className={`absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-transform z-20 group`}
                          style={{ left: `${t.x}%`, top: `${t.y}%` }}
                        >
                          {/* Interactive ring overlay */}
                          <span 
                            className={`absolute inset-0 rounded-full border opacity-50 animate-ping`} 
                            style={{ borderColor: t.color, animationDuration: '1.5s' }}
                          />
                          
                          {/* Core target symbol */}
                          <div 
                            className={`w-2.5 h-2.5 flex items-center justify-center border font-mono font-bold text-[7px] relative`}
                            style={{ 
                              borderColor: t.color, 
                              backgroundColor: isSelected ? t.color : '#070b13',
                              color: isSelected ? '#0b0f19' : t.color,
                              boxShadow: `0 0 8px ${t.color}` 
                            }}
                          >
                            x
                            {/* Target label tooltip */}
                            <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#070b13] border border-[rgba(148,163,184,0.15)] text-[#cbd5e1] text-[8px] py-0.5 px-1 rounded-sm pointer-events-none select-none font-mono whitespace-nowrap z-50">
                              {t.label} ({t.type})
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}

                {/* Render Interceptor Missiles */}
                {interceptors.map(int => (
                  <div
                    key={int.id}
                    className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: `${int.x}%`, top: `${int.y}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Tactical Target Inspector Panel */}
            <div className="border-l border-[rgba(148,163,184,0.06)] pl-4 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.08em] mb-2 border-b border-[rgba(148,163,184,0.06)] pb-1">
                  Tactical Inspector
                </h4>
                
                {selectedThreatId ? (
                  (() => {
                    const target = threats.find(t => t.id === selectedThreatId);
                    if (!target) return <p className="text-[10px] text-[#475569] font-mono">No target locked.</p>;
                    
                    const systemProc = procuredList.find(p => p.id === selectedSystemId);
                    const selectedSystem = systemProc?.system;
                    
                    // Find probability dynamically if selector is active
                    let displayProbability = 0;
                    const ecmLevel = ecmJamming ? 0.6 : 0.1;
                    if (target.status === 'ENGAGED') {
                      const matchingInt = interceptors.find(i => i.threatId === target.id);
                      displayProbability = matchingInt ? matchingInt.probability : 0;
                    } else if (selectedSystem) {
                      const systemKey = findSystemKey(selectedSystem.name) || 'S-400';
                      const accuracy = selectedSystem.accuracy || 0.85;
                      
                      displayProbability = calculateInterceptionProbability({
                        baseAccuracy: accuracy,
                        targetSpeed: target.speed,
                        interceptorSpeed: selectedSystem.category === 'LONG_RANGE' ? 6 : selectedSystem.category === 'MEDIUM_RANGE' ? 4 : 2,
                        targetAltitude: target.altitude,
                        systemMinAlt: selectedSystem.minAltitude || 10,
                        systemMaxAlt: selectedSystem.maxAltitude || 25000,
                        targetRCS: target.rcs,
                        weather: 'CLEAR',
                        ecmLevel,
                        range: target.distance,
                        systemMaxRange: selectedSystem.maxRange,
                        targetType: target.type,
                        systemName: systemKey
                      });
                    }

                    return (
                      <div className="space-y-3 font-mono">
                        <div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#64748b]">TRACK ID:</span>
                            <span className="font-bold" style={{ color: target.color }}>{target.label}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-[#94a3b8] mt-1">
                            <span>TYPE:</span>
                            <span>{target.type.replace('_', ' ')}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-[9px] border-t border-b border-[rgba(148,163,184,0.06)] py-1.5 my-1 bg-[#0b0f19] p-1.5 rounded-xs">
                          <div className="flex justify-between text-[#64748b]">
                            <span>IFF IDENT:</span>
                            <span className="font-bold" style={{ color: target.type === 'FIGHTER_AIRCRAFT' ? '#38bdf8' : '#ef4444' }}>
                              {target.type === 'FIGHTER_AIRCRAFT' ? 'SQUAWK 3450 (MIL)' : 'NO RESPONSE (HOSTILE)'}
                            </span>
                          </div>
                          <div className="flex justify-between text-[#64748b]">
                            <span>POSITION:</span>
                            <span className="font-mono text-right text-[8px] text-[#cbd5e1]">
                              {(28.6139 - (target.y - 50) * 0.09).toFixed(4)}°N / {(77.2090 + (target.x - 50) * 0.09).toFixed(4)}°E
                            </span>
                          </div>
                          <div className="flex justify-between text-[#64748b]">
                            <span>HEADING:</span>
                            <span className="text-[#cbd5e1]">{target.heading.toFixed(0)}° (NORTH)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#0b0f19] p-1.5 border border-[rgba(148,163,184,0.04)]">
                          <div>
                            <span className="text-[#475569] block text-[8px] uppercase">Range</span>
                            <span className="font-semibold text-[#cbd5e1]">{target.distance.toFixed(0)} km</span>
                          </div>
                          <div>
                            <span className="text-[#475569] block text-[8px] uppercase">Speed</span>
                            <span className="font-semibold text-[#cbd5e1]">Mach {target.speed.toFixed(1)}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-[#475569] block text-[8px] uppercase">Altitude</span>
                            <span className="font-semibold text-[#cbd5e1]">{target.altitude >= 1000 ? `${(target.altitude/1000).toFixed(1)} km` : `${target.altitude} m`}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-[#475569] block text-[8px] uppercase">Radar RCS</span>
                            <span className="font-semibold text-[#cbd5e1]">{target.rcs.toFixed(2)} m²</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] text-[#64748b] uppercase mb-1">Select Countermeasure:</label>
                          <select 
                            value={selectedSystemId}
                            onChange={(e) => setSelectedSystemId(e.target.value)}
                            disabled={target.status === 'ENGAGED'}
                            className="input-field py-1 px-1.5 text-[10px] leading-tight select-custom font-mono"
                          >
                            {procuredList.length === 0 ? (
                              <option value="">No Active Systems</option>
                            ) : (
                              procuredList.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.system.name} (LVL {p.level})
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {selectedSystem && (
                          <div className="text-[10px] bg-[#1b2340] p-2 border border-[rgba(56,189,248,0.1)]">
                            <div className="flex justify-between text-[9px] text-[#64748b] mb-1">
                              <span>INTERCEPT ESTIMATE:</span>
                              <span className="font-semibold text-[#38bdf8]">{selectedSystem.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-[#cbd5e1]">Pk Probability:</span>
                              <span className="text-xs font-bold text-[#4ade80]">{(displayProbability * 100).toFixed(0)}%</span>
                            </div>
                            {ecmJamming && (
                              <div className="text-[8px] text-[#ef4444] font-mono mt-1 text-center animate-pulse">
                                ⚠ ECM JAMMING ACTIVE (-20% PK DEGRADATION)
                              </div>
                            )}
                            <div className="w-full bg-[#0b0f19] h-1 mt-1.5 overflow-hidden">
                              <div className="h-full bg-[#4ade80] transition-all duration-300" style={{ width: `${displayProbability * 100}%` }} />
                            </div>
                          </div>
                        )}

                        <button
                          onClick={fireInterceptor}
                          disabled={target.status === 'ENGAGED' || procuredList.length === 0}
                          className={`w-full py-1.5 text-[10px] font-bold text-[#0b0f19] uppercase tracking-wider rounded-sm font-mono flex items-center justify-center gap-1
                            ${target.status === 'ENGAGED' 
                              ? 'bg-[#475569] text-[#cbd5e1] cursor-not-allowed'
                              : procuredList.length === 0
                                ? 'bg-[#1b2340] text-[#475569] cursor-not-allowed'
                                : 'bg-[#38bdf8] hover:bg-[#0ea5e9]'}`}
                        >
                          {target.status === 'ENGAGED' ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-[#cbd5e1] animate-ping" />
                              SALVO ENGAGED
                            </>
                          ) : (
                            'FIRE INTERCEPTOR'
                          )}
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[rgba(148,163,184,0.08)] bg-[rgba(148,163,184,0.01)] text-center px-4">
                    <svg className="w-6 h-6 text-[#475569] mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3" />
                    </svg>
                    <p className="text-[10px] text-[#64748b] font-mono leading-relaxed">
                      Select an incoming threat dot on the radar sweep grid to assign intercept batteries and inspect telemetry.
                    </p>
                  </div>
                )}
              </div>

              {/* Radar Status Foot */}
              <div className="mt-4 pt-2 border-t border-[rgba(148,163,184,0.06)] text-[9px] font-mono text-[#475569] flex justify-between">
                <span>SYSTEM LOCKS: {threats.filter(t => t.status === 'ENGAGED').length}</span>
                <span>ACTIVE TRACKS: {threats.length}</span>
              </div>
            </div>
          </div>

          {/* Threat Assessment & PK Countermeasure Matrix */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">
                Threat Assessment & PK Matrix Calculator
              </h3>
              <span className="text-[8px] font-mono text-[#475569]">CLICK ROWS FOR INTELLIGENCE DETAILS</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="bg-[#1b2340] border-b border-[rgba(148,163,184,0.1)] text-[#64748b]">
                    <th className="p-2 uppercase tracking-wider font-semibold">Threat Class</th>
                    <th className="p-2 uppercase tracking-wider font-semibold text-center">Threat Level</th>
                    <th className="p-2 uppercase tracking-wider font-semibold text-center">Typical RCS</th>
                    <th className="p-2 uppercase tracking-wider font-semibold text-center">Ideal Countermeasure</th>
                    <th className="p-2 uppercase tracking-wider font-semibold text-right">Max Intercept Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(148,163,184,0.04)]">
                  {[
                    { name: 'BALLISTIC_MISSILE', label: 'Ballistic Missile', rcs: '0.8 m²', typicalSpeed: 'Mach 6.5', level: 'CRITICAL', color: '#dc2626', defaultBest: 'S-400 Triumf' },
                    { name: 'HYPERSONIC', label: 'Hypersonic Glider', rcs: '0.15 m²', typicalSpeed: 'Mach 8.0', level: 'CRITICAL', color: '#be123c', defaultBest: 'Barak 8 ER' },
                    { name: 'CRUISE_MISSILE', label: 'Cruise Missile', rcs: '0.3 m²', typicalSpeed: 'Mach 0.9', level: 'HIGH', color: '#ea580c', defaultBest: 'SPYDER / Barak 8' },
                    { name: 'UAV', label: 'UAV / Drone Swarm', rcs: '0.05 m²', typicalSpeed: 'Mach 0.15', level: 'MEDIUM', color: '#eab308', defaultBest: 'Anti-Drone System' },
                    { name: 'FIGHTER_AIRCRAFT', label: 'Fighter Aircraft', rcs: '4.0 m²', typicalSpeed: 'Mach 1.8', level: 'HIGH', color: '#3b82f6', defaultBest: 'Akash Battery' }
                  ].map(tm => {
                    // Look up dynamically in user inventory if we have a countermeasure
                    let bestSys = 'NO DEPLOYED ASSETS';
                    let bestPkVal = 0;

                    procuredList.forEach(p => {
                      const sys = p.system;
                      const sysKey = findSystemKey(sys.name);
                      if (sysKey) {
                        const baseAccuracy = sys.accuracy || 0.85;
                        const prob = calculateInterceptionProbability({
                          baseAccuracy,
                          targetSpeed: tm.name === 'BALLISTIC_MISSILE' ? 6 : tm.name === 'HYPERSONIC' ? 8 : 1,
                          interceptorSpeed: sys.category === 'LONG_RANGE' ? 6 : sys.category === 'MEDIUM_RANGE' ? 4 : 2,
                          targetAltitude: tm.name === 'CRUISE_MISSILE' ? 100 : 15000,
                          systemMinAlt: sys.minAltitude || 10,
                          systemMaxAlt: sys.maxAltitude || 25000,
                          targetRCS: tm.name === 'UAV' ? 0.05 : 1,
                          weather: 'CLEAR',
                          ecmLevel: ecmJamming ? 0.6 : 0.1,
                          range: sys.maxRange * 0.7,
                          systemMaxRange: sys.maxRange,
                          targetType: tm.name,
                          systemName: sysKey
                        });

                        if (prob > bestPkVal) {
                          bestPkVal = prob;
                          bestSys = sys.name;
                        }
                      }
                    });

                    if (procuredList.length === 0) {
                      bestSys = tm.defaultBest;
                      bestPkVal = tm.name === 'BALLISTIC_MISSILE' ? 0.90 : tm.name === 'HYPERSONIC' ? 0.40 : 0.85;
                    }

                    return (
                      <tr 
                        key={tm.name} 
                        onClick={() => {
                          setSelectedCatalogItem(tm);
                          setActiveModal('threat_intel');
                        }}
                        className="hover:bg-[rgba(56,189,248,0.02)] transition-colors cursor-pointer"
                      >
                        <td className="p-2 font-medium text-[#cbd5e1]">{tm.label}</td>
                        <td className="p-2 text-center">
                          <span className="badge" style={{ backgroundColor: `${tm.color}15`, color: tm.color, border: `1px solid ${tm.color}25` }}>
                            {tm.level}
                          </span>
                        </td>
                        <td className="p-2 text-[#94a3b8] text-center">{tm.rcs}</td>
                        <td className="p-2 text-[#38bdf8] text-center">{bestSys}</td>
                        <td className="p-2 text-right font-bold" style={{ color: bestPkVal > 0.8 ? '#4ade80' : bestPkVal > 0.5 ? '#f59e0b' : '#dc2626' }}>
                          {(bestPkVal * 100).toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column - Sector Maps and Procurement controls */}
        <div className="space-y-4">
          
          {/* Sector Coverage Map card */}
          <div className="card p-4">
            <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em] mb-3">
              Sector Coverage & Tactical Deployment
            </h3>

            {/* Interactive Sector Graphic Map (using flex grid representation) */}
            <div className="grid grid-cols-3 gap-2 bg-[#0b0f19] p-3 border border-[rgba(148,163,184,0.06)] rounded-sm mb-4 relative">
              {[
                { key: 'Northern Sector', label: 'NORTH', style: 'col-span-3 text-center py-2' },
                { key: 'Western Sector', label: 'WEST', style: 'py-3 text-left' },
                { key: 'Central Region', label: 'CENTRAL', style: 'py-3 text-center bg-[#1b2340]/40' },
                { key: 'Eastern Sector', label: 'EAST', style: 'py-3 text-right' },
                { key: 'Southern Sector', label: 'SOUTH', style: 'col-span-3 text-center py-2' }
              ].map(secItem => {
                const isSelected = selectedSector === secItem.key;
                const sec = sectors[secItem.key];
                const activeSys = getSectorSystem(secItem.key);
                
                return (
                  <button
                    key={secItem.key}
                    onClick={() => setSelectedSector(secItem.key)}
                    className={`font-mono transition-all text-xs rounded-xs border p-1.5 focus:outline-none flex flex-col items-center justify-center gap-1
                      ${secItem.style}
                      ${isSelected 
                        ? 'border-[#38bdf8] bg-[rgba(56,189,248,0.06)] shadow-[0_0_8px_rgba(56,189,248,0.1)] text-[#38bdf8]' 
                        : 'border-[rgba(148,163,184,0.08)] bg-[#131a2b] hover:border-[rgba(148,163,184,0.2)] text-[#64748b]'}`}
                  >
                    <span className="text-[9px] font-bold tracking-wider">{secItem.label}</span>
                    <span 
                      className="text-[10px] font-mono font-bold" 
                      style={{ color: sec.coverage >= 90 ? '#4ade80' : sec.coverage >= 75 ? '#f59e0b' : '#dc2626' }}
                    >
                      {sec.coverage}%
                    </span>
                    {activeSys && !isSelected && (
                      <span className="text-[7px] text-[#475569] uppercase font-mono truncate max-w-full leading-none">
                        {activeSys.system.name.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Sector Panel details */}
            {selectedSector && (
              (() => {
                const sec = sectors[selectedSector];
                const activeSys = getSectorSystem(selectedSector);
                return (
                  <div className="bg-[#1b2340]/40 p-3 border border-[rgba(148,163,184,0.06)] space-y-2.5 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-[rgba(148,163,184,0.06)] pb-1.5">
                      <span className="font-bold text-[#cbd5e1]">{sec.name}</span>
                      <span className="badge" style={{ 
                        color: sec.status === 'OPTIMAL' ? '#4ade80' : sec.status === 'SECURED' ? '#38bdf8' : sec.status === 'MODERATE' ? '#f59e0b' : '#dc2626',
                        backgroundColor: 'transparent'
                      }}>
                        {sec.status}
                      </span>
                    </div>
                    
                    <p className="text-[#64748b] text-[9px] leading-relaxed italic">{sec.description}</p>
                    
                    <div className="flex justify-between text-[11px] items-center">
                      <span className="text-[#94a3b8]">Airspace Coverage:</span>
                      <span className="font-bold text-sm" style={{ color: sec.coverage >= 90 ? '#4ade80' : sec.coverage >= 75 ? '#f59e0b' : '#dc2626' }}>
                        {sec.coverage}%
                      </span>
                    </div>

                    <div>
                      <label className="block text-[8px] text-[#64748b] uppercase mb-1">Station Battery:</label>
                      <select
                        value={activeSys ? activeSys.id : ''}
                        onChange={(e) => reevaluateSectorCoverage(selectedSector, e.target.value || null)}
                        className="input-field py-1 px-1.5 text-[9px] leading-tight select-custom font-mono"
                      >
                        <option value="">No Active Defense (Muted radar coverage)</option>
                        {procuredList.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.system.name} (LVL {p.level}) — Range: {p.system.maxRange}km
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Deployed Force Distribution & Procurement */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">
                Active Force Distribution
              </h3>
              <button 
                onClick={() => setActiveModal('catalog')}
                className="text-[9px] font-mono font-bold text-[#38bdf8] hover:underline"
              >
                + PROCURE ASSETS
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'LONG_RANGE', label: 'Strategic (LRAD)', color: '#dc2626', max: 5 },
                { key: 'MEDIUM_RANGE', label: 'Tactical (MRAD)', color: '#d97706', max: 8 },
                { key: 'SHORT_RANGE', label: 'Point Defense (SRAD)', color: '#16a34a', max: 8 },
                { key: 'VERY_SHORT_RANGE', label: 'VSHORAD Manpads', color: '#0284c7', max: 6 },
                { key: 'ANTI_DRONE', label: 'Anti-Drone Jammers', color: '#7c3aed', max: 6 },
                { key: 'RADAR', label: 'Search Radars', color: '#4f46e5', max: 4 }
              ].map(cat => {
                const count = getCategoryCount(cat.key);
                const pct = (count / cat.max) * 100;
                
                return (
                  <div key={cat.key} className="font-mono">
                    <div className="flex justify-between text-[9px] mb-1">
                      <span className="text-[#94a3b8]">{cat.label}</span>
                      <span className="font-bold" style={{ color: cat.color }}>
                        {count}/{cat.max} Units
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill transition-all duration-500" 
                        style={{ width: `${Math.min(100, pct)}%`, background: cat.color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Live Activity Logs (Dynamic Events log) */}
      <div className="card p-4">
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.06)] pb-2 mb-3">
          <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">
            C2 SECURE DATA LINK // ACTIVE TELEMETRY FEEDS
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const text = JSON.stringify(logEvents, null, 2);
                const blob = new Blob([text], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `c2-ops-log-${Date.now()}.json`;
                a.click();
              }}
              className="text-[9px] font-mono text-[#64748b] hover:text-[#cbd5e1] border border-[rgba(148,163,184,0.08)] px-1.5 py-0.5 rounded-sm"
            >
              EXPORT LOGS
            </button>
            <button 
              onClick={() => {
                setLogEvents([{ id: 'c', time: new Date().toLocaleTimeString('en-IN', { hour12: false }), message: 'C2 Command Log cleared by Operator.', severity: 'info' }]);
              }}
              className="text-[9px] font-mono text-[#dc2626] hover:text-red-400 border border-[rgba(220,38,38,0.12)] px-1.5 py-0.5 rounded-sm"
            >
              CLEAR
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-[180px] overflow-y-auto font-mono">
          {logEvents.length === 0 ? (
            <p className="text-[10px] text-[#475569] text-center py-4">No events logged.</p>
          ) : (
            logEvents.map(evt => {
              let textClass = 'text-[#cbd5e1]';
              let bgClass = 'bg-transparent';
              let prefix = '//';

              if (evt.severity === 'success') {
                textClass = 'text-[#4ade80]';
                prefix = '✔ [SUCCESS]';
              } else if (evt.severity === 'warning') {
                textClass = 'text-[#f59e0b]';
                prefix = '⚠ [WARNING]';
              } else if (evt.severity === 'critical') {
                textClass = 'text-[#dc2626]';
                bgClass = 'bg-[rgba(220,38,38,0.04)]';
                prefix = '✖ [CRITICAL]';
              }

              return (
                <div key={evt.id} className={`flex items-start gap-2.5 px-2 py-1 hover:bg-[rgba(148,163,184,0.02)] transition-colors border-b border-[rgba(148,163,184,0.03)] last:border-0 ${bgClass}`}>
                  <span className="text-[9px] text-[#475569] w-12 flex-shrink-0 pt-0.5">{evt.time}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] leading-relaxed break-words font-medium ${textClass}`}>
                      {prefix} {evt.message}
                    </span>
                    {(evt.system || evt.threat) && (
                      <span className="text-[8px] text-[#475569] ml-2 uppercase select-none">
                        [{evt.system ? `SYS: ${evt.system}` : ''}{evt.system && evt.threat ? ' | ' : ''}{evt.threat ? `TGT: ${evt.threat}` : ''}]
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Educational Platform Disclaimer */}
      <div className="card p-3 border-[rgba(120,101,13,0.25)]">
        <div className="flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-[#d97706] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[10px] text-[#d97706] font-mono font-semibold tracking-[0.05em] mb-0.5">EDUCATIONAL PLATFORM DISCLAIMER</p>
            <p className="text-[10px] text-[#475569] leading-relaxed font-mono">
              This platform is for educational and analytical purposes only. NOT a military planning tool.
              All calculations and formulas are simplified approximations sourced from publicly available educational documentation.
            </p>
          </div>
        </div>
      </div>

      {/* ---- OVERLAY MODALS ---- */}
      
      {/* 1. Operators Online Modal */}
      {activeModal === 'operators' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="card w-full max-w-md p-4 bg-[#0d1220] border-[rgba(56,189,248,0.2)]">
            <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold text-[#cbd5e1] uppercase tracking-wider">
                Online Operators Roster
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#64748b] hover:text-[#cbd5e1] font-bold">×</button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {operators.map(op => (
                <div key={op.id} className="flex justify-between items-center p-2 bg-[#131a2b] border border-[rgba(148,163,184,0.04)] font-mono text-[10px]">
                  <div>
                    <span className="font-semibold text-[#cbd5e1] block">{op.name}</span>
                    <span className="text-[8px] text-[#475569]">{op.id} // ACTIVE SESSION</span>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-green text-[8px] mb-0.5">{op.role}</span>
                    <span className="block text-[8px] text-[#64748b]">{op.stats?.simulationsRun || 0} SIMS RUN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Deployed Systems Inventory & Upgrade Refit Modal */}
      {activeModal === 'inventory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="card w-full max-w-lg p-4 bg-[#0d1220] border-[rgba(56,189,248,0.2)]">
            <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold text-[#cbd5e1] uppercase tracking-wider">
                Deployed Air Defense Inventory
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#64748b] hover:text-[#cbd5e1] font-bold">×</button>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {procuredList.length === 0 ? (
                <p className="text-[10px] text-center text-[#64748b] font-mono py-8">No defense assets deployed. Access Procurement catalog to deploy batteries.</p>
              ) : (
                procuredList.map(p => {
                  const upgradeCost = Math.round(p.purchaseCost * 0.2 * p.level);
                  
                  return (
                    <div key={p.id} className="flex justify-between items-center p-2.5 bg-[#131a2b] border border-[rgba(148,163,184,0.04)] font-mono text-[10px]">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#cbd5e1]">{p.system.name}</span>
                          <span className="text-[8px] px-1 py-0.25 bg-[#1b2340] border border-[rgba(56,189,248,0.15)] text-[#38bdf8]">
                            LEVEL {p.level}
                          </span>
                        </div>
                        <span className="text-[8px] text-[#475569] block mt-0.5">
                          CATEGORY: {p.system.category} // MAX RANGE: {p.system.maxRange}km // ACC: {(p.system.accuracy * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-[8px] text-[#64748b] block">UPGRADE COST</span>
                          <span className="font-bold text-[#f59e0b]">${upgradeCost}M</span>
                        </div>
                        <button
                          onClick={() => upgradeSystem(p.id)}
                          disabled={p.level >= 5}
                          className={`px-2 py-1 text-[8px] font-mono font-bold rounded-sm border 
                            ${p.level >= 5
                              ? 'border-[#475569] text-[#475569] cursor-not-allowed'
                              : 'border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/5'}`}
                        >
                          {p.level >= 5 ? 'MAX LEVEL' : 'REFIT'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Procurement Catalog Modal */}
      {activeModal === 'catalog' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="card w-full max-w-2xl p-4 bg-[#0d1220] border-[rgba(56,189,248,0.2)]">
            <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] pb-2 mb-3">
              <div>
                <h3 className="text-xs font-mono font-bold text-[#cbd5e1] uppercase tracking-wider">
                  Operational Procurement Catalog
                </h3>
                <span className="text-[9px] font-mono text-[#64748b] block mt-0.5">
                  AVAILABLE BUDGET: <strong className="text-[#4ade80]">${budget}M</strong> // SPENT DEPLOYMENT: <strong className="text-[#38bdf8]">${spent}M</strong>
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-[#64748b] hover:text-[#cbd5e1] font-bold">×</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
              {catalog.map(sys => {
                const ownedCount = procuredList.filter(p => p.system.id === sys.id || p.systemId === sys.id).length;
                const canBuy = budget >= sys.cost;
                
                return (
                  <div key={sys.id} className="p-3 bg-[#131a2b] border border-[rgba(148,163,184,0.04)] font-mono flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-[#cbd5e1] text-[11px] leading-snug">{sys.name}</span>
                        <span className="text-[8px] bg-[#1b2340] border border-[rgba(148,163,184,0.1)] px-1 py-0.25 text-[#94a3b8]">
                          {ownedCount} DEPLOYED
                        </span>
                      </div>
                      <p className="text-[9px] text-[#64748b] leading-normal mb-2.5 h-10 overflow-hidden">{sys.description}</p>
                      
                      <div className="grid grid-cols-2 gap-1.5 text-[8px] text-[#94a3b8] mb-3 bg-[#0b0f19] p-1.5">
                        <div>CATEGORY: <span className="text-[#cbd5e1] font-semibold">{sys.category}</span></div>
                        <div>MAX RANGE: <span className="text-[#cbd5e1] font-semibold">{sys.maxRange}km</span></div>
                        <div>ACCURACY: <span className="text-[#cbd5e1] font-semibold">{(sys.accuracy * 100).toFixed(0)}%</span></div>
                        <div>ORIGIN: <span className="text-[#cbd5e1] font-semibold">{sys.countryOfOrigin || 'IND'}</span></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[rgba(148,163,184,0.04)]">
                      <div>
                        <span className="text-[8px] text-[#475569] block">UNIT COST</span>
                        <span className="font-bold text-[#4ade80] text-[11px]">${sys.cost}M</span>
                      </div>
                      <button
                        onClick={() => purchaseSystem(sys)}
                        disabled={!canBuy}
                        className={`px-3 py-1 text-[9px] font-mono font-bold rounded-sm border uppercase
                          ${canBuy 
                            ? 'border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/5' 
                            : 'border-[#475569] text-[#475569] cursor-not-allowed'}`}
                      >
                        Procure
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Threat Intelligence Details Modal */}
      {activeModal === 'threat_intel' && selectedCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="card w-full max-w-md p-4 bg-[#0d1220] border-[rgba(220,38,38,0.2)]">
            <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold text-[#cbd5e1] uppercase tracking-wider">
                Threat Intelligence Briefing
              </h3>
              <button onClick={() => { setActiveModal(null); setSelectedCatalogItem(null); }} className="text-[#64748b] hover:text-[#cbd5e1] font-bold">×</button>
            </div>
            
            <div className="font-mono text-[10px] space-y-3">
              <div className="flex justify-between items-center border-b border-[rgba(148,163,184,0.04)] pb-1.5">
                <span className="text-sm font-bold text-[#cbd5e1]">{selectedCatalogItem.label}</span>
                <span className="badge" style={{ backgroundColor: `${selectedCatalogItem.color}15`, color: selectedCatalogItem.color, border: `1px solid ${selectedCatalogItem.color}25` }}>
                  {selectedCatalogItem.level} SEVERITY
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[#94a3b8] leading-relaxed">
                  The {selectedCatalogItem.label} presents a {selectedCatalogItem.level.toLowerCase()} level risk profile to airspace integrity.
                  Operating at velocities exceeding {selectedCatalogItem.typicalSpeed}, it requires advanced early-warning radar arrays and rapid fire solutions.
                </p>
                
                <div className="grid grid-cols-2 gap-2 bg-[#0b0f19] p-2 text-[9px] border border-[rgba(148,163,184,0.06)]">
                  <div>RCS INDEX: <span className="text-[#cbd5e1] font-semibold">{selectedCatalogItem.rcs}</span></div>
                  <div>SPEED PROFILE: <span className="text-[#cbd5e1] font-semibold">{selectedCatalogItem.typicalSpeed}</span></div>
                  <div>TACTICAL COUNTER: <span className="text-[#cbd5e1] font-semibold">{selectedCatalogItem.defaultBest}</span></div>
                  <div>CLUTTER SENSITIVITY: <span className="text-[#cbd5e1] font-semibold">High (Rain/Fog)</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
