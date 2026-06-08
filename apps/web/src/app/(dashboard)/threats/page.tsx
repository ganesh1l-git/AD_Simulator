'use client';

import { useState, useMemo } from 'react';

const THREATS = [
  { id: '1', name: 'Shaheen-III', type: 'BALLISTIC_MISSILE', country: 'Pakistan', speed: 12.0, speedClass: 'HYPERSONIC', altClass: 'EXOATMOSPHERIC', altitude: '0-150km', rcs: 1.0, visibility: 'HIGH', score: 95, cost: 10000, range: 2750, warhead: 500 },
  { id: '2', name: 'Ghauri-II', type: 'BALLISTIC_MISSILE', country: 'Pakistan', speed: 10.0, speedClass: 'HYPERSONIC', altClass: 'EXOATMOSPHERIC', altitude: '0-120km', rcs: 2.0, visibility: 'VERY_HIGH', score: 85, cost: 3000, range: 1800, warhead: 700 },
  { id: '3', name: 'DF-21D (Ref)', type: 'BALLISTIC_MISSILE', country: 'China', speed: 10.0, speedClass: 'HYPERSONIC', altClass: 'EXOATMOSPHERIC', altitude: '0-100km', rcs: 0.8, visibility: 'HIGH', score: 90, cost: 10000, range: 1770, warhead: 600 },
  { id: '4', name: 'Babur-3', type: 'CRUISE_MISSILE', country: 'Pakistan', speed: 0.8, speedClass: 'SUBSONIC', altClass: 'LOW', altitude: '30-1000m', rcs: 0.05, visibility: 'LOW', score: 80, cost: 2000, range: 450, warhead: 300 },
  { id: '5', name: "Ra'ad-II ALCM", type: 'CRUISE_MISSILE', country: 'Pakistan', speed: 0.85, speedClass: 'SUBSONIC', altClass: 'MEDIUM', altitude: '100-8000m', rcs: 0.08, visibility: 'LOW', score: 75, cost: 1200, range: 600, warhead: 250 },
  { id: '6', name: 'CJ-20 ALCM (Ref)', type: 'CRUISE_MISSILE', country: 'China', speed: 0.9, speedClass: 'SUBSONIC', altClass: 'LOW', altitude: '20-5000m', rcs: 0.05, visibility: 'LOW', score: 82, cost: 2000, range: 2000, warhead: 500 },
  { id: '7', name: 'Wing Loong II', type: 'UAV', country: 'China', speed: 0.28, speedClass: 'SUBSONIC', altClass: 'MEDIUM', altitude: '1-9km', rcs: 1.0, visibility: 'MEDIUM', score: 50, cost: 3000, range: 4000, warhead: 480 },
  { id: '8', name: 'Drone Swarm (50)', type: 'DRONE_SWARM', country: 'Generic', speed: 0.15, speedClass: 'SUBSONIC', altClass: 'LOW', altitude: '30-500m', rcs: 0.01, visibility: 'LOW', score: 70, cost: 1000, range: 100, warhead: 5 },
  { id: '9', name: 'JF-17 Block III', type: 'FIGHTER_AIRCRAFT', country: 'Pakistan/China', speed: 1.6, speedClass: 'SUPERSONIC', altClass: 'HIGH', altitude: '50-16800m', rcs: 3.0, visibility: 'HIGH', score: 65, cost: 25000, range: 1200, warhead: 3600 },
  { id: '10', name: 'J-10C (Ref)', type: 'FIGHTER_AIRCRAFT', country: 'China', speed: 2.0, speedClass: 'SUPERSONIC', altClass: 'HIGH', altitude: '50-18000m', rcs: 1.5, visibility: 'MEDIUM', score: 70, cost: 35000, range: 1600, warhead: 6000 },
  { id: '11', name: 'F-16 Block 52+ (Ref)', type: 'FIGHTER_AIRCRAFT', country: 'USA', speed: 2.0, speedClass: 'SUPERSONIC', altClass: 'HIGH', altitude: '50-15240m', rcs: 1.2, visibility: 'MEDIUM', score: 72, cost: 70000, range: 1500, warhead: 7700 },
  { id: '12', name: 'H-6K (Ref)', type: 'BOMBER_AIRCRAFT', country: 'China', speed: 0.85, speedClass: 'SUBSONIC', altClass: 'HIGH', altitude: '3-12km', rcs: 30, visibility: 'VERY_HIGH', score: 80, cost: 50000, range: 3500, warhead: 12000 },
  { id: '13', name: 'Z-10 (Ref)', type: 'ATTACK_HELICOPTER', country: 'China', speed: 0.24, speedClass: 'SUBSONIC', altClass: 'LOW', altitude: '10-6400m', rcs: 3.0, visibility: 'MEDIUM', score: 55, cost: 20000, range: 800, warhead: 1500 },
  { id: '14', name: 'Loitering Munition', type: 'LOITERING_MUNITION', country: 'Generic', speed: 0.2, speedClass: 'SUBSONIC', altClass: 'LOW', altitude: '100-4500m', rcs: 0.05, visibility: 'LOW', score: 55, cost: 100, range: 200, warhead: 15 },
  { id: '15', name: 'Nasr (Hatf-IX)', type: 'TACTICAL_MISSILE', country: 'Pakistan', speed: 3.0, speedClass: 'SUPERSONIC', altClass: 'MEDIUM', altitude: '500-15km', rcs: 0.5, visibility: 'HIGH', score: 75, cost: 500, range: 70, warhead: 200 },
  { id: '16', name: 'HGV (Conceptual)', type: 'HYPERSONIC', country: 'Generic', speed: 8.0, speedClass: 'HYPERSONIC', altClass: 'VERY_HIGH', altitude: '20-80km', rcs: 0.1, visibility: 'LOW', score: 98, cost: 15000, range: 2000, warhead: 500 },
  { id: '17', name: 'HCM (Conceptual)', type: 'HYPERSONIC', country: 'Generic', speed: 6.0, speedClass: 'HYPERSONIC', altClass: 'HIGH', altitude: '15-35km', rcs: 0.08, visibility: 'LOW', score: 95, cost: 12000, range: 1500, warhead: 300 },
];

const THREAT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'BALLISTIC_MISSILE', label: 'Ballistic Missile', color: '#ef4444' },
  { value: 'CRUISE_MISSILE', label: 'Cruise Missile', color: '#f97316' },
  { value: 'UAV', label: 'UAV', color: '#eab308' },
  { value: 'DRONE_SWARM', label: 'Drone Swarm', color: '#a3e635' },
  { value: 'FIGHTER_AIRCRAFT', label: 'Fighter Aircraft', color: '#22d3ee' },
  { value: 'BOMBER_AIRCRAFT', label: 'Bomber', color: '#818cf8' },
  { value: 'ATTACK_HELICOPTER', label: 'Attack Helicopter', color: '#c084fc' },
  { value: 'LOITERING_MUNITION', label: 'Loitering Munition', color: '#f472b6' },
  { value: 'TACTICAL_MISSILE', label: 'Tactical Missile', color: '#fb923c' },
  { value: 'HYPERSONIC', label: 'Hypersonic', color: '#ff0055' },
];

const getTypeColor = (type: string) => THREAT_TYPES.find(t => t.value === type)?.color || '#6b7280';
const getTypeLabel = (type: string) => THREAT_TYPES.find(t => t.value === type)?.label || type;

function getScoreColor(score: number) {
  if (score >= 90) return '#ff0055';
  if (score >= 75) return '#ef4444';
  if (score >= 60) return '#f59e0b';
  return '#00ff88';
}

export default function ThreatsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'speed' | 'range' | 'cost'>('score');

  const filtered = useMemo(() => {
    let result = [...THREATS];
    if (type) result = result.filter(t => t.type === type);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.country.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'speed') return b.speed - a.speed;
      if (sortBy === 'range') return b.range - a.range;
      return b.cost - a.cost;
    });
    return result;
  }, [search, type, sortBy]);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">Threat Encyclopedia</h1>
        <p className="text-sm text-[#6b7280]">Threat database — educational reference data from public sources</p>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {THREAT_TYPES.filter(t => t.value).slice(0, 5).map(tt => {
          const count = THREATS.filter(t => t.type === tt.value).length;
          return (
            <button
              key={tt.value}
              onClick={() => setType(type === tt.value ? '' : tt.value)}
              className={`card p-3 text-center transition-all ${type === tt.value ? 'border-opacity-50' : ''}`}
              style={{ borderColor: type === tt.value ? tt.color : undefined }}
            >
              <div className="text-xl font-bold font-mono" style={{ color: tt.color }}>{count}</div>
              <div className="text-[10px] text-[#6b7280] uppercase">{tt.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threats..." className="input-field max-w-xs" />
        <select value={type} onChange={e => setType(e.target.value)} className="input-field max-w-xs">
          {THREAT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input-field max-w-[150px]">
          <option value="score">Threat Score</option>
          <option value="speed">Speed</option>
          <option value="range">Range</option>
          <option value="cost">Cost</option>
        </select>
        <span className="text-xs text-[#4b5563] ml-auto">{filtered.length} threats</span>
      </div>

      {/* Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((threat, i) => (
          <div key={threat.id} className="card p-5 animate-fade-in-up hover:border-white/10 transition-all" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{threat.name}</h3>
                <p className="text-xs text-[#6b7280]">{threat.country}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: `${getScoreColor(threat.score)}15` }}>
                <span className="text-lg font-bold font-mono" style={{ color: getScoreColor(threat.score) }}>{threat.score}</span>
              </div>
            </div>

            <span className="badge text-[10px] mb-3" style={{ backgroundColor: `${getTypeColor(threat.type)}22`, color: getTypeColor(threat.type), border: `1px solid ${getTypeColor(threat.type)}44` }}>
              {getTypeLabel(threat.type)}
            </span>

            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div>
                <span className="text-[#4b5563]">Speed</span>
                <div className="font-mono text-[#e5e7eb]">Mach {threat.speed}</div>
              </div>
              <div>
                <span className="text-[#4b5563]">Range</span>
                <div className="font-mono text-[#e5e7eb]">{threat.range} km</div>
              </div>
              <div>
                <span className="text-[#4b5563]">RCS</span>
                <div className="font-mono text-[#e5e7eb]">{threat.rcs} m²</div>
              </div>
              <div>
                <span className="text-[#4b5563]">Altitude</span>
                <div className="font-mono text-[#e5e7eb] text-[11px]">{threat.altitude}</div>
              </div>
              <div>
                <span className="text-[#4b5563]">Warhead</span>
                <div className="font-mono text-[#e5e7eb]">{threat.warhead} kg</div>
              </div>
              <div>
                <span className="text-[#4b5563]">Cost</span>
                <div className="font-mono text-[#e5e7eb]">${threat.cost}K</div>
              </div>
            </div>

            {/* Threat Level Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#4b5563]">THREAT LEVEL</span>
                <span style={{ color: getScoreColor(threat.score) }}>{threat.score}/100</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${threat.score}%`, background: getScoreColor(threat.score) }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
