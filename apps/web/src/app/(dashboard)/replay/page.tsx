'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface ReplayEvent {
  id: string;
  timestamp: number;
  type: 'DETECTION' | 'CLASSIFICATION' | 'ASSIGNMENT' | 'LAUNCH' | 'TRACKING' | 'INTERCEPTION' | 'SUMMARY';
  title: string;
  description: string;
  system?: string;
  threat?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'INFO';
}

interface ReplayItem {
  id: string;
  scenarioName: string;
  date: string;
  threatCount: number;
  interceptorCount: number;
  successRate: number;
  cost: string;
  duration: number; // in seconds
  events: ReplayEvent[];
  config?: any;
}

const mockReplays: ReplayItem[] = [
  {
    id: 'rep-001',
    scenarioName: 'Western Border Intrusions - Saturation Wave',
    date: '2026-06-08 10:14',
    threatCount: 5,
    interceptorCount: 8,
    successRate: 80,
    cost: '$14.2M',
    duration: 120,
    events: [
      { id: 'e1', timestamp: 2, type: 'DETECTION', title: 'RCS Anomaly Detected', description: 'Arudhra Radar identified incoming projectile at 240km, altitude 18,000m, Speed Mach 4.2', threat: 'Shaheen-I (Ballistic)', status: 'INFO' },
      { id: 'e2', timestamp: 8, type: 'CLASSIFICATION', title: 'Target Classified', description: 'Threat identified as Short Range Ballistic Missile (SRBM)', threat: 'Shaheen-I (Ballistic)', status: 'INFO' },
      { id: 'e3', timestamp: 12, type: 'ASSIGNMENT', title: 'Weapons Assignment', description: 'Command & Control assigned S-400 Triumf Regiment Alpha', system: 'S-400 Triumf', threat: 'Shaheen-I (Ballistic)', status: 'SUCCESS' },
      { id: 'e4', timestamp: 15, type: 'LAUNCH', title: '48N6DM Interceptor Fired', description: 'S-400 Regiment Alpha launched two interceptor missiles', system: 'S-400 Triumf', status: 'SUCCESS' },
      { id: 'e5', timestamp: 35, type: 'TRACKING', title: 'Midcourse Tracking Lock', description: 'Dual tracking active. Probability of Intercept calculated at 92%', system: 'S-400 Triumf', threat: 'Shaheen-I (Ballistic)', status: 'INFO' },
      { id: 'e6', timestamp: 54, type: 'INTERCEPTION', title: 'KINETIC KILL SECURED', description: 'Interceptor 1 successfully engaged and destroyed Shaheen-I at 64km altitude (exo-atmospheric)', system: 'S-400 Triumf', threat: 'Shaheen-I (Ballistic)', status: 'SUCCESS' },
      { id: 'e7', timestamp: 60, type: 'DETECTION', title: 'Low RCS Threat Detected', description: 'Rohini Radar detected low altitude signature at 85km, altitude 150m, Speed Mach 0.8', threat: 'Babur-2 (Cruise)', status: 'INFO' },
      { id: 'e8', timestamp: 65, type: 'CLASSIFICATION', title: 'Target Classified', description: 'Subsonic Land Attack Cruise Missile (LACM)', threat: 'Babur-2 (Cruise)', status: 'INFO' },
      { id: 'e9', timestamp: 70, type: 'ASSIGNMENT', title: 'Weapons Assignment', description: 'Assigned MRSAM (Barak-8) Regiment Gamma', system: 'MRSAM (Barak-8)', threat: 'Babur-2 (Cruise)', status: 'SUCCESS' },
      { id: 'e10', timestamp: 73, type: 'LAUNCH', title: 'Barak-8 Missile Launched', description: 'Single interceptor launched from Vertical Launch System', system: 'MRSAM (Barak-8)', status: 'SUCCESS' },
      { id: 'e11', timestamp: 92, type: 'INTERCEPTION', title: 'Interception Failure', description: 'Countermeasure deployment resulted in interceptor guidance loss', system: 'MRSAM (Barak-8)', threat: 'Babur-2 (Cruise)', status: 'FAILED' },
      { id: 'e12', timestamp: 98, type: 'ASSIGNMENT', title: 'Emergency Assignment', description: 'QRSAM Regiment Delta assigned for terminal defence engagement', system: 'QRSAM', threat: 'Babur-2 (Cruise)', status: 'SUCCESS' },
      { id: 'e13', timestamp: 100, type: 'LAUNCH', title: 'QRSAM Quick-Reaction Missile Fired', description: 'Dual salvo launched', system: 'QRSAM', status: 'SUCCESS' },
      { id: 'e14', timestamp: 112, type: 'INTERCEPTION', title: 'TERMINAL ENGAGEMENT SUCCESS', description: 'QRSAM destroyed Babur-2 cruise missile at 8.2km range, altitude 80m', system: 'QRSAM', threat: 'Babur-2 (Cruise)', status: 'SUCCESS' },
      { id: 'e15', timestamp: 120, type: 'SUMMARY', title: 'Simulation Wave Terminated', description: 'All threats resolved. 4/5 targets intercepted. Total defensive expenditure $14.2M', status: 'SUCCESS' }
    ]
  },
  {
    id: 'rep-002',
    scenarioName: 'Eastern Border Defensive Patrol',
    date: '2026-06-07 14:22',
    threatCount: 3,
    interceptorCount: 4,
    successRate: 100,
    cost: '$6.8M',
    duration: 90,
    events: [
      { id: 'e2-1', timestamp: 5, type: 'DETECTION', title: 'Aerial Intruder Spotted', description: 'Rohini Radar detected fighter class contact at 150km, altitude 8,000m, Speed Mach 1.6', threat: 'JF-17 (Fighter)', status: 'INFO' },
      { id: 'e2-2', timestamp: 12, type: 'CLASSIFICATION', title: 'Target Classified', description: 'JF-17 Thunder multi-role fighter aircraft', threat: 'JF-17 (Fighter)', status: 'INFO' },
      { id: 'e2-3', timestamp: 18, type: 'ASSIGNMENT', title: 'Combat Air Patrol / SAM Assignment', description: 'MRSAM Regiment Alpha assigned to hold lock. Su-30MKI CAP directed to intercept vector', system: 'MRSAM (Barak-8)', threat: 'JF-17 (Fighter)', status: 'SUCCESS' },
      { id: 'e2-4', timestamp: 25, type: 'LAUNCH', title: 'MRSAM Salvo Fired', description: 'Salvo of two Barak-8 missiles launched', system: 'MRSAM (Barak-8)', status: 'SUCCESS' },
      { id: 'e2-5', timestamp: 55, type: 'INTERCEPTION', title: 'INTERCEPTION CONFIRMED', description: 'JF-17 signature disappeared. Remote optical feed confirms interception at 68km range', system: 'MRSAM (Barak-8)', threat: 'JF-17 (Fighter)', status: 'SUCCESS' }
    ]
  },
  {
    id: 'rep-003',
    scenarioName: 'Northern Sector Multi-Vector UAV Raid',
    date: '2026-06-05 18:51',
    threatCount: 12,
    interceptorCount: 16,
    successRate: 75,
    cost: '$3.5M',
    duration: 180,
    events: [
      { id: 'e3-1', timestamp: 1, type: 'DETECTION', title: 'UAV Swarm Contact', description: 'Low RCS drone swarm detected at 45km, altitude 800m, speed 150km/h', threat: 'Wing Loong II & Swarm', status: 'INFO' },
      { id: 'e3-2', timestamp: 5, type: 'ASSIGNMENT', title: 'Multi-layer Assignment', description: 'Assigned L-70 Anti-Aircraft Guns, Akash SAM and electronic warfare jamming systems', system: 'Akash SAM & EW', status: 'SUCCESS' }
    ]
  }
];

export default function ReplayPage() {
  const [replays, setReplays] = useState<ReplayItem[]>(mockReplays);
  const [selectedReplay, setSelectedReplay] = useState<ReplayItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch simulation records and merge to show the latest 3
  useEffect(() => {
    const loadReplays = async () => {
      try {
        const res = await api.simulations.list();
        const sims = (res as any).data || res;
        if (Array.isArray(sims)) {
          const dbReplays: ReplayItem[] = sims.map((sim: any) => {
            const events: ReplayEvent[] = [];
            events.push({
              id: `${sim.id}-e1`,
              timestamp: 0,
              type: 'SUMMARY',
              title: 'Replay Loaded',
              description: `Restoring wargame logs from sandbox simulation.`,
              status: 'INFO'
            });

            // Reconstruct detection / launch / intercept logs from configuration & results
            const attackers = sim.config?.attackerProcured || [];
            const defenders = sim.config?.defenderProcured || [];

            let time = 2;
            attackers.forEach((item: any, idx: number) => {
              events.push({
                id: `${sim.id}-det-${idx}`,
                timestamp: time,
                type: 'DETECTION',
                title: 'RCS Anomaly Detected',
                description: `Radar locked incoming ${item.threat.name} at 200km. Speed: Mach ${item.threat.speed}.`,
                threat: item.threat.name,
                status: 'INFO'
              });
              time += 4;
            });

            time = 10;
            defenders.forEach((item: any, idx: number) => {
              events.push({
                id: `${sim.id}-lnch-${idx}`,
                timestamp: time,
                type: 'LAUNCH',
                title: `${item.selectedMissile?.name || item.system.missileName} Salvo`,
                description: `Salvo launched from ${item.system.name}`,
                system: item.system.name,
                status: 'SUCCESS'
              });
              time += 6;
            });

            // Termination event
            events.push({
              id: `${sim.id}-sum`,
              timestamp: sim.duration || 60,
              type: 'SUMMARY',
              title: 'Wave Intercept Assessment',
              description: `Engagement resolved. ${sim.results?.threatsIntercepted || 0}/${sim.results?.totalThreats || 0} threats neutralized. Defensive cost: $${sim.results?.totalCost?.toFixed(1) || 0}M.`,
              status: 'SUCCESS'
            });

            return {
              id: sim.id,
              scenarioName: sim.name || `Simulation Replay`,
              date: new Date(sim.createdAt || sim.completedAt || Date.now()).toLocaleString(),
              threatCount: sim.results?.totalThreats || 0,
              interceptorCount: sim.results?.threatsIntercepted || 0,
              successRate: Math.round((sim.results?.interceptionRate || 0) * 100),
              cost: `$${sim.results?.totalCost?.toFixed(1) || 0}M`,
              duration: sim.duration || 60,
              events,
              config: sim.config
            };
          });

          const combined = [...dbReplays, ...mockReplays];
          // Sort by timestamp descending
          const getTimestamp = (r: ReplayItem) => new Date(r.date).getTime();
          combined.sort((a, b) => getTimestamp(b) - getTimestamp(a));
          setReplays(combined.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load simulations list:', err);
      }
    };
    loadReplays();
  }, []);

  // Set default selection
  useEffect(() => {
    if (replays.length > 0 && !selectedReplay) {
      setSelectedReplay(replays[0]);
    }
  }, [replays, selectedReplay]);

  // Playback timer loop
  useEffect(() => {
    let timer: any;
    if (isPlaying && selectedReplay) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedReplay.duration) {
            setIsPlaying(false);
            return selectedReplay.duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedReplay, playbackSpeed]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedReplay) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
    ctx.lineWidth = 1;
    for (let r = 50; r < canvas.width; r += 70) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * 0.75, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw sweep lines
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.04)';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height * 0.75);
    ctx.lineTo(canvas.width, canvas.height * 0.75);
    ctx.stroke();

    // Draw HQ Center
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 0.75, 7, 0, Math.PI * 2);
    ctx.fill();

    // Radar Sweep Animation
    if (isPlaying) {
      const angle = (Date.now() / 800) % (Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.02)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height * 0.75);
      ctx.arc(canvas.width / 2, canvas.height * 0.75, canvas.width * 0.5, angle, angle + 0.3);
      ctx.closePath();
      ctx.fill();
    }

    // Configure system positions for this replay
    let defenceSystems: { name: string, x: number, y: number, color: string }[] = [];
    if (selectedReplay.id === 'rep-001') {
      defenceSystems = [
        { name: 'S-400 Regiment Alpha', x: 40, y: 72, color: '#ef4444' },
        { name: 'MRSAM Gamma', x: 60, y: 70, color: '#f59e0b' },
        { name: 'QRSAM Delta', x: 54, y: 73, color: '#00ff88' }
      ];
    } else if (selectedReplay.id === 'rep-002') {
      defenceSystems = [
        { name: 'MRSAM Alpha', x: 65, y: 72, color: '#f59e0b' }
      ];
    } else if (selectedReplay.id === 'rep-003') {
      defenceSystems = [
        { name: 'Akash SAM Regiment', x: 50, y: 70, color: '#00ff88' }
      ];
    } else {
      const configDefenders = selectedReplay.config?.defenderProcured || [];
      defenceSystems = configDefenders.map((d: any) => ({
        name: d.system.name.split(' ')[0],
        x: d.x,
        y: d.y,
        color: d.system.color
      }));
    }

    // Draw systems
    defenceSystems.forEach(sys => {
      const sysX = (sys.x / 100) * canvas.width;
      const sysY = (sys.y / 100) * canvas.height;
      ctx.fillStyle = sys.color;
      ctx.beginPath();
      ctx.arc(sysX, sysY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '8px monospace';
      ctx.fillText(sys.name, sysX - 20, sysY - 8);
    });

    // Parse declassified logs for visual tracks
    const events = selectedReplay.events;

    // Parse threats
    const threats: { name: string, startX: number, startY: number, t_detect: number, t_intercept: number, status: string }[] = [];
    events.forEach(evt => {
      if (evt.type === 'DETECTION') {
        const interceptEvt = events.find(e => e.type === 'INTERCEPTION' && e.threat === evt.threat);
        const t_intercept = interceptEvt ? interceptEvt.timestamp : selectedReplay.duration;
        
        let angle = Math.PI / 4;
        if (evt.threat?.includes('JF-17')) angle = Math.PI / 6;
        if (evt.threat?.includes('Babur')) angle = Math.PI * 3/4;
        if (evt.threat?.includes('Wing')) angle = Math.PI / 2;

        const startX = 50 + Math.cos(angle) * 40;
        const startY = 75 - Math.sin(angle) * 60;

        threats.push({
          name: evt.threat || 'Threat',
          startX,
          startY,
          t_detect: evt.timestamp,
          t_intercept,
          status: interceptEvt ? (interceptEvt.title.includes('FAIL') ? 'FAILED' : 'SUCCESS') : 'SUCCESS'
        });
      }
    });

    // Parse interceptors
    const interceptors: { system: string, threatName: string, t_launch: number, t_intercept: number, success: boolean }[] = [];
    events.forEach(evt => {
      if (evt.type === 'LAUNCH') {
        const nextIntercept = events.find(e => e.type === 'INTERCEPTION' && e.timestamp > evt.timestamp && e.system === evt.system);
        if (nextIntercept) {
          interceptors.push({
            system: evt.system || 'SAM',
            threatName: nextIntercept.threat || '',
            t_launch: evt.timestamp,
            t_intercept: nextIntercept.timestamp,
            success: !nextIntercept.title.includes('FAIL')
          });
        }
      }
    });

    // Render active threats
    threats.forEach(t => {
      if (currentTime >= t.t_detect && currentTime <= t.t_intercept) {
        const progress = (currentTime - t.t_detect) / (t.t_intercept - t.t_detect);
        const curX = t.startX + (50 - t.startX) * progress;
        const curY = t.startY + (75 - t.startY) * progress;

        const canvasX = (curX / 100) * canvas.width;
        const canvasY = (curY / 100) * canvas.height;

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#9ca3af';
        ctx.font = '8px monospace';
        ctx.fillText(t.name.split(' ')[0], canvasX + 8, canvasY + 3);
      }

      // Draw explosion if recently intercepted
      if (currentTime > t.t_intercept && currentTime <= t.t_intercept + 2 && t.status === 'SUCCESS') {
        const canvasX = (50 / 100) * canvas.width;
        const canvasY = (75 / 100) * canvas.height;
        const radius = (currentTime - t.t_intercept) * 15;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Render active interceptors
    interceptors.forEach(interceptor => {
      if (currentTime >= interceptor.t_launch && currentTime <= interceptor.t_intercept) {
        const progress = (currentTime - interceptor.t_launch) / (interceptor.t_intercept - interceptor.t_launch);
        
        const launcher = defenceSystems.find(s => s.name.startsWith(interceptor.system.split(' ')[0])) || defenceSystems[0];
        const startX = launcher ? launcher.x : 50;
        const startY = launcher ? launcher.y : 75;

        const targetThreat = threats.find(t => t.name === interceptor.threatName);
        let targetX = 50;
        let targetY = 75;
        if (targetThreat) {
          const tProgress = (currentTime - targetThreat.t_detect) / (targetThreat.t_intercept - targetThreat.t_detect);
          targetX = targetThreat.startX + (50 - targetThreat.startX) * tProgress;
          targetY = targetThreat.startY + (75 - targetThreat.startY) * tProgress;
        }

        const curX = startX + (targetX - startX) * progress;
        const curY = startY + (targetY - startY) * progress;

        const canvasX = (curX / 100) * canvas.width;
        const canvasY = (curY / 100) * canvas.height;

        ctx.strokeStyle = '#00b4d8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 2.5, 0, Math.PI * 2);
        ctx.stroke();

        const launchCanvasX = (startX / 100) * canvas.width;
        const launchCanvasY = (startY / 100) * canvas.height;
        ctx.strokeStyle = 'rgba(0, 180, 216, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(launchCanvasX, launchCanvasY);
        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
      }
    });

  }, [selectedReplay, currentTime, isPlaying]);

  const selectReplay = (replay: ReplayItem) => {
    setSelectedReplay(replay);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const visibleEvents = selectedReplay
    ? selectedReplay.events.filter((e) => e.timestamp <= currentTime)
    : [];

  const getStatusColor = (status: ReplayEvent['status']) => {
    switch (status) {
      case 'SUCCESS': return 'text-[#00ff88]';
      case 'FAILED': return 'text-[#ef4444]';
      case 'PENDING': return 'text-[#f59e0b]';
      default: return 'text-[#00b4d8]';
    }
  };

  const getEventBadge = (type: ReplayEvent['type']) => {
    const base = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider';
    switch (type) {
      case 'DETECTION': return `${base} bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30`;
      case 'CLASSIFICATION': return `${base} bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30`;
      case 'ASSIGNMENT': return `${base} bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30`;
      case 'LAUNCH': return `${base} bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/30`;
      case 'TRACKING': return `${base} bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30`;
      case 'INTERCEPTION': return `${base} bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30`;
      default: return `${base} bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00b4d8]/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">Replay Analyzer</h1>
          <p className="text-sm text-[#6b7280]">
            Review declassified performance archives and simulate historical engagement exercises.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Replay Selector (Left Side) */}
        <div className="space-y-4">
          <h2 className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Available Missions</h2>
          <div className="space-y-3">
            {replays.map((rep) => {
              const isSelected = selectedReplay?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => selectReplay(rep)}
                  className={`card p-4 cursor-pointer transition-all duration-200 hover:border-[#00ff88]/30
                    ${isSelected ? 'border-[#00ff88] bg-[#00ff88]/[0.02]' : 'border-white/[0.06]'}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-sm font-semibold text-white group-hover:text-[#00ff88] leading-tight">
                      {rep.scenarioName}
                    </span>
                    <span className="text-[10px] font-mono text-[#4b5563] whitespace-nowrap">{rep.date.split(',')[0]}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-white/[0.02] p-1.5 rounded">
                      <div className="text-[10px] text-[#6b7280]">THREATS</div>
                      <div className="text-xs font-mono font-bold text-white">{rep.threatCount}</div>
                    </div>
                    <div className="bg-white/[0.02] p-1.5 rounded">
                      <div className="text-[10px] text-[#6b7280]">INTERCEPT RATE</div>
                      <div className="text-xs font-mono font-bold text-[#00ff88]">{rep.successRate}%</div>
                    </div>
                    <div className="bg-white/[0.02] p-1.5 rounded">
                      <div className="text-[10px] text-[#6b7280]">COST</div>
                      <div className="text-xs font-mono font-bold text-white">{rep.cost}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Replay Player & Log (Right Side) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReplay ? (
            <div className="card p-5 space-y-6 border-white/[0.06] relative">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedReplay.scenarioName}</h3>
                  <p className="text-xs text-[#6b7280]">ID: {selectedReplay.id} • Max Duration: {selectedReplay.duration}s</p>
                </div>
                <div className="badge badge-green text-[10px]">ANALYSIS READY</div>
              </div>

              {/* Graphical Simulator Canvas */}
              <div className="relative rounded-lg bg-[#070b12] border border-[#00ff88]/20 overflow-hidden flex flex-col items-center p-2">
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 border border-[#00ff88]/20 text-[9px] font-mono text-[#00ff88] z-20">
                  PLAYBACK TIME: {currentTime}s / {selectedReplay.duration}s
                </div>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={360}
                  className="w-full aspect-[5/3] bg-[#070b12] rounded"
                />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-1.5 rounded bg-[#00ff88] text-[#0a0e17] font-bold text-xs hover:bg-[#00e676] transition-colors"
                  >
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                  </button>
                  <button
                    onClick={() => setCurrentTime(0)}
                    className="px-3 py-1.5 rounded bg-white/[0.06] text-white border border-white/[0.1] text-xs hover:bg-white/[0.1] transition-colors"
                  >
                    RESET
                  </button>
                </div>

                {/* Progress bar */}
                <div className="flex-1 min-w-[150px] flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#6b7280]">0s</span>
                  <input
                    type="range"
                    min="0"
                    max={selectedReplay.duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                    className="w-full accent-[#00ff88] bg-[#1f2937] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-[#6b7280]">{selectedReplay.duration}s</span>
                </div>

                {/* Playback speed selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#6b7280] font-mono">SPEED:</span>
                  {([1, 2, 5, 10] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`w-8 py-1 rounded text-[10px] font-bold border transition-colors
                        ${playbackSpeed === speed
                          ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30'
                          : 'bg-white/[0.02] text-[#6b7280] border-transparent hover:text-white hover:bg-white/[0.04]'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Log */}
              <div className="space-y-3">
                <h4 className="text-xs text-[#9ca3af] uppercase tracking-wider font-semibold">Decrypted Engagement Log</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto border border-white/[0.05] rounded-lg p-3 bg-black/20">
                  {visibleEvents.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#4b5563] font-mono">
                      No events recorded. Press PLAY to begin.
                    </div>
                  ) : (
                    visibleEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="flex items-start gap-3 p-2.5 rounded hover:bg-white/[0.02] border-b border-white/[0.02] last:border-0"
                      >
                        <span className="text-xs font-mono text-[#6b7280] pt-0.5">{evt.timestamp}s</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold ${getStatusColor(evt.status)}`}>
                              {evt.title}
                            </span>
                            <span className={getEventBadge(evt.type)}>{evt.type}</span>
                          </div>
                          <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed">{evt.description}</p>
                          {(evt.system || evt.threat) && (
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#4b5563]">
                              {evt.system && <span>DEFENCE: <strong className="text-[#e5e7eb]">{evt.system}</strong></span>}
                              {evt.threat && <span>THREAT: <strong className="text-[#e5e7eb]">{evt.threat}</strong></span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-sm text-[#6b7280] border-dashed border-white/10">
              <span className="text-4xl block mb-3">📡</span>
              Select a mission from the list on the left to start analyzing simulated defense data.
            </div>
          )}
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="card p-4 border-[#f59e0b]/20">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="text-xs text-[#f59e0b] font-medium mb-1">Educational Platform Disclaimer</p>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              This replay tool operates on simulated metrics and declassified approximations. It does not reflect active-duty air defense interception parameters or real-world radar vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
