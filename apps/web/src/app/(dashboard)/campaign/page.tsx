'use client';

import { useState } from 'react';

interface CampaignDay {
  day: number;
  budget: number;
  threats: string[];
  intercepted: number;
  total: number;
  cost: number;
  status: 'completed' | 'active' | 'locked';
}

const DEMO_CAMPAIGN: CampaignDay[] = [
  { day: 1, budget: 100, threats: ['UAV Recon', 'Fighter Patrol'], intercepted: 5, total: 6, cost: 8.2, status: 'completed' },
  { day: 2, budget: 92, threats: ['Cruise Missile Strike', 'UAV'], intercepted: 8, total: 9, cost: 15.5, status: 'completed' },
  { day: 3, budget: 76, threats: ['Mixed Wave', 'Drone Swarm'], intercepted: 12, total: 15, cost: 22.0, status: 'completed' },
  { day: 4, budget: 54, threats: ['Ballistic Strike', 'SEAD Mission'], intercepted: 6, total: 8, cost: 35.0, status: 'active' },
  { day: 5, budget: 19, threats: ['Unknown'], intercepted: 0, total: 0, cost: 0, status: 'locked' },
  { day: 6, budget: 0, threats: ['Unknown'], intercepted: 0, total: 0, cost: 0, status: 'locked' },
  { day: 7, budget: 0, threats: ['Unknown'], intercepted: 0, total: 0, cost: 0, status: 'locked' },
];

const OWNED_SYSTEMS = [
  { name: 'S-400 Triumf', health: 100, ammo: 28, maxAmmo: 32, status: 'READY' },
  { name: 'MRSAM / Barak-8', health: 85, ammo: 14, maxAmmo: 24, status: 'READY' },
  { name: 'Akash', health: 92, ammo: 8, maxAmmo: 12, status: 'READY' },
  { name: 'QRSAM', health: 70, ammo: 4, maxAmmo: 8, status: 'REPAIRING' },
  { name: 'Igla-S Squad', health: 100, ammo: 18, maxAmmo: 24, status: 'READY' },
];

export default function CampaignPage() {
  const [activeCampaign, setActiveCampaign] = useState(true);
  const [selectedDay, setSelectedDay] = useState(4);
  const [difficulty, setDifficulty] = useState('MEDIUM');

  const currentDay = DEMO_CAMPAIGN.find(d => d.day === selectedDay);
  const completedDays = DEMO_CAMPAIGN.filter(d => d.status === 'completed');
  const totalIntercepted = completedDays.reduce((s, d) => s + d.intercepted, 0);
  const totalThreats = completedDays.reduce((s, d) => s + d.total, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444]/5 via-transparent to-[#f59e0b]/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">⚔️ Campaign Mode</h1>
            <p className="text-sm text-[#6b7280]">Multi-day persistent defence campaign with resource management</p>
          </div>
          {!activeCampaign && (
            <button onClick={() => setActiveCampaign(true)} className="btn-primary">Start New Campaign</button>
          )}
        </div>
      </div>

      {activeCampaign && (
        <>
          {/* Campaign Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Current Day', value: `${selectedDay}/7`, color: '#00ff88' },
              { label: 'Budget Left', value: `$${DEMO_CAMPAIGN[selectedDay - 1]?.budget || 0}M`, color: '#f59e0b' },
              { label: 'Total Intercepted', value: totalIntercepted, color: '#00b4d8' },
              { label: 'Total Threats', value: totalThreats, color: '#ef4444' },
              { label: 'Difficulty', value: difficulty, color: '#a855f7' },
            ].map(stat => (
              <div key={stat.label} className="card p-4 text-center">
                <div className="text-[10px] text-[#4b5563] uppercase mb-1">{stat.label}</div>
                <div className="text-xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Day Timeline */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Campaign Timeline</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {DEMO_CAMPAIGN.map(day => (
                <button
                  key={day.day}
                  onClick={() => day.status !== 'locked' && setSelectedDay(day.day)}
                  className={`flex-shrink-0 w-24 p-3 rounded-lg border transition-all text-center ${
                    selectedDay === day.day ? 'border-[#00ff88]/40 bg-[#00ff88]/10' :
                    day.status === 'completed' ? 'border-white/10 bg-white/[0.03]' :
                    day.status === 'active' ? 'border-[#f59e0b]/30 bg-[#f59e0b]/5' :
                    'border-white/5 bg-white/[0.01] opacity-50'
                  }`}
                  disabled={day.status === 'locked'}
                >
                  <div className="text-xs text-[#6b7280]">Day {day.day}</div>
                  <div className={`text-sm font-bold mt-1 ${
                    day.status === 'completed' ? 'text-[#00ff88]' :
                    day.status === 'active' ? 'text-[#f59e0b]' : 'text-[#4b5563]'
                  }`}>
                    {day.status === 'completed' ? `${day.intercepted}/${day.total}` :
                     day.status === 'active' ? 'ACTIVE' : '🔒'}
                  </div>
                  <div className="text-[10px] text-[#4b5563] mt-1">${day.budget}M</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Day Detail */}
            {currentDay && (
              <div className="card p-5 animate-fade-in-up">
                <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
                  Day {currentDay.day} — {currentDay.status === 'active' ? '⚡ Active' : '✓ Complete'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Threats</span>
                    <span className="text-[#e5e7eb]">{currentDay.threats.join(', ')}</span>
                  </div>
                  {currentDay.status === 'completed' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6b7280]">Intercepted</span>
                        <span className="text-[#00ff88] font-mono">{currentDay.intercepted}/{currentDay.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6b7280]">Cost</span>
                        <span className="text-[#f59e0b] font-mono">${currentDay.cost}M</span>
                      </div>
                      <div>
                        <div className="text-xs text-[#4b5563] mb-1">Interception Rate</div>
                        <div className="progress-bar h-3">
                          <div className="progress-fill h-3" style={{ width: `${(currentDay.intercepted / currentDay.total) * 100}%` }} />
                        </div>
                      </div>
                    </>
                  )}
                  {currentDay.status === 'active' && (
                    <button className="btn-primary w-full mt-4">🎯 Start Day {currentDay.day} Simulation</button>
                  )}
                </div>
              </div>
            )}

            {/* Force Status */}
            <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Force Status</h3>
              <div className="space-y-3">
                {OWNED_SYSTEMS.map(sys => (
                  <div key={sys.name} className="p-3 rounded-lg bg-white/[0.02]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#e5e7eb]">{sys.name}</span>
                      <span className={`badge text-[9px] ${sys.status === 'READY' ? 'badge-green' : 'badge-amber'}`}>
                        {sys.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10px] text-[#4b5563] mb-1">Health</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${sys.health}%`, background: sys.health > 80 ? '#00ff88' : sys.health > 50 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#4b5563] mb-1">Ammo: {sys.ammo}/{sys.maxAmmo}</div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(sys.ammo / sys.maxAmmo) * 100}%`, background: '#00b4d8' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
