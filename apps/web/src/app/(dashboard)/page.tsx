'use client';

import { useState, useEffect } from 'react';

// ---- Stat Card Component ----
function StatCard({ 
  label, value, suffix, abbr, color, delay 
}: { 
  label: string; value: string | number; suffix?: string; abbr: string; color: string; delay: number;
}) {
  return (
    <div 
      className="stat-card card p-3 animate-fade-in-up"
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
    </div>
  );
}

// ---- Radar Display Component ----
function RadarDisplay() {
  const threats = [
    { id: 1, x: 35, y: 25, label: 'BM-1', type: 'BALLISTIC', color: '#dc2626' },
    { id: 2, x: 65, y: 40, label: 'CM-2', type: 'CRUISE', color: '#d97706' },
    { id: 3, x: 20, y: 60, label: 'UAV-3', type: 'UAV', color: '#ca8a04' },
    { id: 4, x: 75, y: 70, label: 'FT-4', type: 'FIGHTER', color: '#0284c7' },
    { id: 5, x: 50, y: 50, label: 'DEF', type: 'FRIENDLY', color: '#4ade80' },
  ];

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">
          Tactical Radar Display
        </h3>
        <span className="text-[9px] font-mono text-[#475569]">SWEEP ACTIVE</span>
      </div>
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        {/* Radar background */}
        <div className="absolute inset-0 rounded-full bg-[#0b0f19] border border-[rgba(56,189,248,0.12)] overflow-hidden">
          {/* Concentric rings */}
          {[25, 50, 75].map(size => (
            <div
              key={size}
              className="absolute rounded-full border border-[rgba(56,189,248,0.06)]"
              style={{
                width: `${size}%`, height: `${size}%`,
                top: `${(100 - size) / 2}%`, left: `${(100 - size) / 2}%`,
              }}
            />
          ))}
          {/* Cross lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[rgba(56,189,248,0.06)]" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-[rgba(56,189,248,0.06)]" />
          
          {/* Sweep */}
          <div className="absolute inset-0 animate-radar-sweep origin-center">
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background: 'conic-gradient(from 0deg, rgba(56,189,248,0.08), transparent 25deg)',
              }}
            />
          </div>

          {/* Threat dots */}
          {threats.map(t => (
            <div
              key={t.id}
              className="absolute w-2 h-2 animate-threat-blink"
              style={{
                left: `${t.x}%`, top: `${t.y}%`,
                backgroundColor: t.color,
                boxShadow: `0 0 4px ${t.color}`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`${t.label} (${t.type})`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {[
          { color: '#dc2626', label: 'BM' },
          { color: '#d97706', label: 'CM' },
          { color: '#ca8a04', label: 'UAV' },
          { color: '#0284c7', label: 'FTR' },
          { color: '#4ade80', label: 'DEF' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] font-mono text-[#475569]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Recent Activity Component ----
function RecentActivity({ activities }: { activities?: any[] }) {
  const defaultActivities = [
    { time: '00:45', event: 'INTERCEPT SUCCESS', system: 'S-400 Triumf', threat: 'Shaheen-III', color: '#4ade80' },
    { time: '00:38', event: 'MISSILE LAUNCHED', system: 'Akash', threat: 'Babur-3', color: '#38bdf8' },
    { time: '00:32', event: 'THREAT DETECTED', system: 'Arudhra Radar', threat: 'JF-17', color: '#f59e0b' },
    { time: '00:28', event: 'INTERCEPT FAILED', system: 'QRSAM', threat: 'UAV Swarm', color: '#dc2626' },
    { time: '00:22', event: 'INTERCEPT SUCCESS', system: 'MRSAM', threat: 'CJ-20 ALCM', color: '#4ade80' },
    { time: '00:15', event: 'THREAT CLASSIFIED', system: 'Rohini 3D CAR', threat: 'DF-21D', color: '#7c3aed' },
    { time: '00:08', event: 'INTERCEPTOR ASSIGNED', system: 'S-400 Triumf', threat: 'HGV', color: '#4f46e5' },
  ];

  const list = activities && activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em]">
          Event Log — Recent Simulation Activity
        </h3>
        <span className="text-[9px] font-mono text-[#475569]">{list.length} EVENTS</span>
      </div>
      <div className="space-y-0 max-h-[360px] overflow-y-auto">
        {list.map((act, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-1.5 hover:bg-[rgba(148,163,184,0.02)] transition-colors border-b border-[rgba(148,163,184,0.04)] last:border-0">
            <span className="text-[10px] font-mono text-[#475569] w-10 flex-shrink-0">{act.time}</span>
            <div className="w-[2px] h-3 flex-shrink-0" style={{ backgroundColor: act.color }} />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-mono font-medium" style={{ color: act.color }}>{act.event}</span>
              <span className="text-[10px] text-[#475569] ml-2">{act.system} — {act.threat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- System Distribution Component ----
function SystemDistribution() {
  const categories = [
    { name: 'LONG RANGE', count: 2, total: 8, color: '#dc2626' },
    { name: 'MEDIUM RANGE', count: 5, total: 8, color: '#d97706' },
    { name: 'SHORT RANGE', count: 3, total: 8, color: '#16a34a' },
    { name: 'VSHORAD', count: 3, total: 8, color: '#0284c7' },
    { name: 'ANTI-DRONE', count: 2, total: 8, color: '#7c3aed' },
    { name: 'RADAR', count: 3, total: 8, color: '#4f46e5' },
  ];

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em] mb-3">
        System Distribution
      </h3>
      <div className="space-y-2.5">
        {categories.map(cat => (
          <div key={cat.name}>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-[#94a3b8]">{cat.name}</span>
              <span className="font-semibold" style={{ color: cat.color }}>{cat.count}/{cat.total}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(cat.count / cat.total) * 100}%`, background: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Threat Assessment Component ----
function ThreatAssessment() {
  const threats = [
    { name: 'Ballistic Missiles', level: 'HIGH', score: 95, color: '#dc2626' },
    { name: 'Cruise Missiles', level: 'HIGH', score: 82, color: '#d97706' },
    { name: 'Hypersonic Vehicles', level: 'CRITICAL', score: 98, color: '#be123c' },
    { name: 'Drone Swarms', level: 'MEDIUM', score: 70, color: '#ca8a04' },
    { name: 'Fighter Aircraft', level: 'MEDIUM', score: 65, color: '#0284c7' },
  ];

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em] mb-3">
        Threat Assessment Matrix
      </h3>
      <div className="space-y-1">
        {threats.map(t => (
          <div key={t.name} className="flex items-center gap-3 px-2 py-1.5 hover:bg-[rgba(148,163,184,0.02)] transition-colors">
            <div className="flex-1">
              <div className="text-[11px] text-[#94a3b8] font-medium">{t.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 progress-bar">
                  <div className="progress-fill" style={{ width: `${t.score}%`, background: t.color }} />
                </div>
                <span className="text-[10px] font-mono font-semibold w-6 text-right" style={{ color: t.color }}>{t.score}</span>
              </div>
            </div>
            <span
              className="badge text-[9px]"
              style={{
                backgroundColor: `${t.color}15`,
                color: t.color,
                border: `1px solid ${t.color}30`,
              }}
            >
              {t.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Coverage Status ----
function CoverageStatus() {
  const zones = [
    { name: 'Northern Sector', coverage: 87, status: 'SECURED' },
    { name: 'Western Sector', coverage: 92, status: 'SECURED' },
    { name: 'Eastern Sector', coverage: 78, status: 'MODERATE' },
    { name: 'Southern Sector', coverage: 85, status: 'SECURED' },
    { name: 'Central Region', coverage: 95, status: 'OPTIMAL' },
  ];

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-[10px] font-mono font-semibold text-[#64748b] uppercase tracking-[0.1em] mb-3">
        Sector Coverage Status
      </h3>
      <div className="space-y-1">
        {zones.map(zone => {
          const color = zone.coverage >= 90 ? '#4ade80' : zone.coverage >= 80 ? '#f59e0b' : '#dc2626';
          return (
            <div key={zone.name} className="flex items-center justify-between px-2 py-1.5 hover:bg-[rgba(148,163,184,0.02)] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-[#94a3b8]">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold" style={{ color }}>{zone.coverage}%</span>
                <span className="text-[9px] font-mono text-[#475569] uppercase w-16 text-right">{zone.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { api } from '@/lib/api';

// ---- Main Dashboard Page ----
export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentSims, setRecentSims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.analytics.overview();
        if (res && res.success) {
          setStats(res.data);
        }
        const simsRes = await api.analytics.simulations();
        if (simsRes && simsRes.success) {
          setRecentSims(simsRes.data);
        }
      } catch {
        // The dashboard has local fallback data, so an unavailable API should not
        // trigger the Next.js development error overlay.
        console.warn('Live dashboard stats are unavailable; showing local fallback data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Map dynamic backend sims to RecentActivity formats
  const mappedActivities = recentSims && recentSims.length > 0 ? recentSims.map((sim: any) => {
    const date = new Date(sim.createdAt);
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const successPct = (sim.interceptionRate * 100).toFixed(0);
    return {
      time: timeStr,
      event: `NEUTRALIZATION ${successPct}%`,
      system: sim.simulation?.name || 'Simulation Run',
      threat: `Cost: $${sim.costEfficiency ? sim.costEfficiency.toFixed(1) : '0'}M`,
      color: sim.interceptionRate >= 0.8 ? '#4ade80' : sim.interceptionRate >= 0.5 ? '#f59e0b' : '#dc2626'
    };
  }) : [];

  return (
    <div className="space-y-4">
      {/* Header Panel */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">
              C2 Operations Center
            </h1>
            <p className="text-[11px] text-[#475569] font-mono mt-0.5">
              IADES — Indian Air Defence Educational Simulator // Operational Overview
            </p>
          </div>
          <div className="text-right hide-mobile">
            <div className="text-sm font-mono text-[#38bdf8] tracking-wider font-semibold">
              {currentTime ? currentTime.toLocaleTimeString('en-IN', { hour12: false }) : '--:--:--'}
            </div>
            <div className="text-[10px] text-[#475569] font-mono">
              {currentTime ? currentTime.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
            </div>
            <div className="mt-1 badge badge-cyan text-[9px]">SIMULATION MODE</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Active Simulations" value={loading ? '—' : (stats?.activeSimulations ?? 3)} abbr="SIM" color="#38bdf8" delay={0} />
        <StatCard label="Operators Online" value={loading ? '—' : (stats?.totalUsers ?? 147)} abbr="USR" color="#4ade80" delay={40} />
        <StatCard label="Defence Systems" value={loading ? '—' : (stats?.totalSystems ?? 18)} abbr="DEF" color="#d97706" delay={80} />
        <StatCard label="Threat Profiles" value={loading ? '—' : (stats?.totalThreats ?? 19)} abbr="THR" color="#dc2626" delay={120} />
        <StatCard label="Total Engagements" value={loading ? '—' : (stats?.totalSimulations ?? "1,247")} abbr="ENG" color="#7c3aed" delay={160} />
        <StatCard label="Cost Simulated" value={loading ? '—' : (stats?.avgCostEfficiency ? `$${stats.avgCostEfficiency.toFixed(1)}M` : "$2.4B")} abbr="USD" color="#4f46e5" delay={200} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <RecentActivity activities={mappedActivities} />
          <ThreatAssessment />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <RadarDisplay />
          <SystemDistribution />
          <CoverageStatus />
        </div>
      </div>

      {/* Classification Footer */}
      <div className="card p-3 border-[rgba(120,101,13,0.25)]">
        <div className="flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-[#d97706] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-[10px] text-[#d97706] font-mono font-semibold tracking-[0.05em] mb-0.5">EDUCATIONAL PLATFORM DISCLAIMER</p>
            <p className="text-[10px] text-[#475569] leading-relaxed font-mono">
              This platform is for educational and analytical purposes only. NOT a military planning tool.
              All data sourced from publicly available and declassified sources. Where precise values are unavailable,
              documented public estimates or configurable approximation values are used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
