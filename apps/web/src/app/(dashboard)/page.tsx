'use client';

import { useState, useEffect } from 'react';

// ---- Stat Card Component ----
function StatCard({ 
  label, value, suffix, icon, color, delay 
}: { 
  label: string; value: string | number; suffix?: string; icon: string; color: string; delay: number;
}) {
  return (
    <div 
      className="stat-card card p-5 animate-fade-in-up"
      style={{ '--accent-color': color, animationDelay: `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6b7280] uppercase tracking-wider font-medium mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
            {suffix && <span className="text-sm text-[#6b7280]">{suffix}</span>}
          </div>
        </div>
        <div className="text-2xl opacity-60">{icon}</div>
      </div>
      <div className="mt-3 progress-bar">
        <div className="progress-fill" style={{ width: '72%', background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

// ---- Radar Display Component ----
function RadarDisplay() {
  const [threats, setThreats] = useState([
    { id: 1, x: 35, y: 25, label: 'BM-1', type: 'BALLISTIC', color: '#ef4444' },
    { id: 2, x: 65, y: 40, label: 'CM-2', type: 'CRUISE', color: '#f97316' },
    { id: 3, x: 20, y: 60, label: 'UAV-3', type: 'UAV', color: '#eab308' },
    { id: 4, x: 75, y: 70, label: 'FT-4', type: 'FIGHTER', color: '#22d3ee' },
    { id: 5, x: 50, y: 50, label: 'DEF', type: 'FRIENDLY', color: '#00ff88' },
  ]);

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        Tactical Radar Display
      </h3>
      <div className="relative w-full aspect-square max-w-[300px] mx-auto">
        {/* Radar background */}
        <div className="absolute inset-0 rounded-full bg-[#0a0e17] border border-[#00ff88]/20 overflow-hidden">
          {/* Concentric rings */}
          {[25, 50, 75].map(size => (
            <div
              key={size}
              className="absolute rounded-full border border-[#00ff88]/10"
              style={{
                width: `${size}%`, height: `${size}%`,
                top: `${(100 - size) / 2}%`, left: `${(100 - size) / 2}%`,
              }}
            />
          ))}
          {/* Cross lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#00ff88]/10" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-[#00ff88]/10" />
          
          {/* Sweep */}
          <div className="absolute inset-0 animate-radar-sweep origin-center">
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background: 'conic-gradient(from 0deg, rgba(0,255,136,0.15), transparent 30deg)',
              }}
            />
          </div>

          {/* Threat dots */}
          {threats.map(t => (
            <div
              key={t.id}
              className="absolute w-3 h-3 rounded-full animate-threat-blink"
              style={{
                left: `${t.x}%`, top: `${t.y}%`,
                backgroundColor: t.color,
                boxShadow: `0 0 8px ${t.color}`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`${t.label} (${t.type})`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {[
          { color: '#ef4444', label: 'Ballistic' },
          { color: '#f97316', label: 'Cruise' },
          { color: '#eab308', label: 'UAV' },
          { color: '#22d3ee', label: 'Fighter' },
          { color: '#00ff88', label: 'Defence' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-[#6b7280]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Recent Activity Component ----
function RecentActivity({ activities }: { activities?: any[] }) {
  const defaultActivities = [
    { time: '00:45', event: 'Interception Success', system: 'S-400 Triumf', threat: 'Shaheen-III', color: '#00ff88' },
    { time: '00:38', event: 'Missile Launched', system: 'Akash', threat: 'Babur-3', color: '#00b4d8' },
    { time: '00:32', event: 'Threat Detected', system: 'Arudhra Radar', threat: 'JF-17', color: '#f59e0b' },
    { time: '00:28', event: 'Interception Failed', system: 'QRSAM', threat: 'UAV Swarm', color: '#ef4444' },
    { time: '00:22', event: 'Interception Success', system: 'MRSAM', threat: 'CJ-20 ALCM', color: '#00ff88' },
    { time: '00:15', event: 'Threat Classified', system: 'Rohini 3D CAR', threat: 'DF-21D', color: '#a855f7' },
    { time: '00:08', event: 'Interceptor Assigned', system: 'S-400 Triumf', threat: 'HGV', color: '#6366f1' },
  ];

  const list = activities && activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        Recent Simulation Activity
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {list.map((act, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color, boxShadow: `0 0 6px ${act.color}` }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6b7280]">{act.time}</span>
                <span className="text-sm font-medium" style={{ color: act.color }}>{act.event}</span>
              </div>
              <div className="text-xs text-[#4b5563] truncate">
                {act.system} • {act.threat}
              </div>
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
    { name: 'Long Range', count: 2, total: 8, color: '#ef4444' },
    { name: 'Medium Range', count: 5, total: 8, color: '#f59e0b' },
    { name: 'Short Range', count: 3, total: 8, color: '#00ff88' },
    { name: 'VSHORAD', count: 3, total: 8, color: '#00b4d8' },
    { name: 'Anti-Drone', count: 2, total: 8, color: '#a855f7' },
    { name: 'Radar', count: 3, total: 8, color: '#6366f1' },
  ];

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        System Distribution
      </h3>
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#9ca3af]">{cat.name}</span>
              <span className="font-mono" style={{ color: cat.color }}>{cat.count}</span>
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
    { name: 'Ballistic Missiles', level: 'HIGH', score: 95, color: '#ef4444' },
    { name: 'Cruise Missiles', level: 'HIGH', score: 82, color: '#f97316' },
    { name: 'Hypersonic', level: 'CRITICAL', score: 98, color: '#ff0055' },
    { name: 'Drone Swarms', level: 'MEDIUM', score: 70, color: '#eab308' },
    { name: 'Fighter Aircraft', level: 'MEDIUM', score: 65, color: '#22d3ee' },
  ];

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        Threat Assessment Matrix
      </h3>
      <div className="space-y-3">
        {threats.map(t => (
          <div key={t.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
            <div className="flex-1">
              <div className="text-sm text-[#e5e7eb] font-medium">{t.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 progress-bar">
                  <div className="progress-fill" style={{ width: `${t.score}%`, background: t.color }} />
                </div>
                <span className="text-xs font-mono" style={{ color: t.color }}>{t.score}</span>
              </div>
            </div>
            <span
              className="badge text-[10px]"
              style={{
                backgroundColor: `${t.color}22`,
                color: t.color,
                border: `1px solid ${t.color}44`,
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
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
      <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        Coverage Status (Educational)
      </h3>
      <div className="space-y-2.5">
        {zones.map(zone => {
          const color = zone.coverage >= 90 ? '#00ff88' : zone.coverage >= 80 ? '#f59e0b' : '#ef4444';
          return (
            <div key={zone.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-2">
                <div className="status-dot" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-sm text-[#e5e7eb]">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color }}>{zone.coverage}%</span>
                <span className="text-[10px] text-[#4b5563] uppercase">{zone.status}</span>
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
      event: `Neutralization success: ${successPct}%`,
      system: sim.simulation?.name || 'Simulation Run',
      threat: `Cost: $${sim.costEfficiency ? sim.costEfficiency.toFixed(1) : '0'}M`,
      color: sim.interceptionRate >= 0.8 ? '#00ff88' : sim.interceptionRate >= 0.5 ? '#f59e0b' : '#ef4444'
    };
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00b4d8]/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Command Center
            </h1>
            <p className="text-sm text-[#6b7280]">
              Indian Air Defence Educational Simulator — Operational Overview
            </p>
          </div>
          <div className="text-right hide-mobile">
            <div className="text-lg font-mono text-[#00ff88] tracking-wider">
              {currentTime ? currentTime.toLocaleTimeString('en-IN', { hour12: false }) : '--:--:--'}
            </div>
            <div className="text-xs text-[#4b5563] font-mono">
              {currentTime ? currentTime.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Loading...'}
            </div>
            <div className="mt-1 badge badge-green text-[10px]">SIMULATION MODE</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Active Sims" value={loading ? '...' : (stats?.activeSimulations ?? 3)} icon="🎯" color="#00ff88" delay={0} />
        <StatCard label="Users" value={loading ? '...' : (stats?.totalUsers ?? 147)} icon="👥" color="#00b4d8" delay={50} />
        <StatCard label="Defence Systems" value={loading ? '...' : (stats?.totalSystems ?? 18)} icon="🛡️" color="#f59e0b" delay={100} />
        <StatCard label="Threat Types" value={loading ? '...' : (stats?.totalThreats ?? 19)} icon="⚠️" color="#ef4444" delay={150} />
        <StatCard label="Interceptions" value={loading ? '...' : (stats?.totalSimulations ?? "1,247")} icon="🎯" color="#a855f7" delay={200} />
        <StatCard label="Cost Simulated" value={loading ? '...' : (stats?.avgCostEfficiency ? `$${stats.avgCostEfficiency.toFixed(1)}M` : "$2.4B")} icon="💰" color="#6366f1" delay={250} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity activities={mappedActivities} />
          <ThreatAssessment />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RadarDisplay />
          <SystemDistribution />
          <CoverageStatus />
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="card p-4 border-[#f59e0b]/20">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="text-xs text-[#f59e0b] font-medium mb-1">Educational Platform Disclaimer</p>
            <p className="text-[11px] text-[#6b7280] leading-relaxed">
              This platform is for educational and analytical purposes only. It is NOT a military planning tool.
              All data used is from publicly available and declassified sources. Where precise values are unavailable,
              documented public estimates or configurable approximation values are used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
