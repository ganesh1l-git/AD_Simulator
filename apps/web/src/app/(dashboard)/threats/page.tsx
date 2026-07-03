'use client';

import { useState, useMemo } from 'react';
import mergedThreats from '../simulation/new/merged_threat_catalog.json';

// lookup map for real-world ranges (km) and warheads (kg) for core threat assets
const REAL_WORLD_SPECS: Record<string, { range: number; warhead: number }> = {
  'Shaheen-III': { range: 2750, warhead: 500 },
  'Ghauri-II': { range: 1800, warhead: 700 },
  'Babur-3': { range: 450, warhead: 300 },
  'Ra\'ad-II ALCM': { range: 600, warhead: 250 },
  'JF-17 Thunder Block III': { range: 1350, warhead: 1200 },
  'JF-17 Thunder Block II': { range: 1350, warhead: 1200 },
  'J-10C (Educational Reference)': { range: 1850, warhead: 1000 },
  'Nasr (Hatf-IX)': { range: 90, warhead: 150 },
  'Shahpar-2': { range: 1000, warhead: 120 },
  'Burraq UAV': { range: 1000, warhead: 100 },
  'Akinci UCAV (PAF)': { range: 7500, warhead: 1350 },
  'Bayraktar TB2 (UCAV)': { range: 300, warhead: 150 },
  'Mirage III (PAF)': { range: 1200, warhead: 1000 },
  'Mirage 5 (PAF)': { range: 1300, warhead: 1200 },
  'Ababeel': { range: 2200, warhead: 1500 },
  'Ghaznavi': { range: 290, warhead: 500 },
  'Harbah': { range: 750, warhead: 300 },
  'Fateh-1': { range: 140, warhead: 150 },
  'Fateh-2': { range: 200, warhead: 200 },
  'Taimoor ALCM': { range: 290, warhead: 200 },
  'DF-21D (Educational Reference)': { range: 1770, warhead: 600 },
  'CJ-20 ALCM (Educational Reference)': { range: 2000, warhead: 500 },
  'Wing Loong II': { range: 1500, warhead: 480 },
  'H-6K (Educational Reference)': { range: 6000, warhead: 12000 },
  'CM-302': { range: 290, warhead: 250 },
  'CH-901': { range: 15, warhead: 3.5 },
  'C-802AK': { range: 180, warhead: 165 },
  'C-705KD': { range: 140, warhead: 130 },
  'DF-41 Heavy ICBM': { range: 13000, warhead: 2500 },
  'DF-100 Supersonic LACM': { range: 1500, warhead: 500 },
  'JH-7A': { range: 3100, warhead: 6500 },
  'H-6K Strategic Bomber': { range: 6000, warhead: 12000 },
  'H-6N': { range: 6500, warhead: 15000 },
  'J-8II': { range: 1000, warhead: 2000 },
  'J-11B': { range: 3500, warhead: 4000 },
  'J-15 Flying Shark': { range: 3500, warhead: 4500 },
  'J-35': { range: 2000, warhead: 2000 },
  'Su-35S Flanker-E (Chinese)': { range: 3600, warhead: 8000 },
  'J-20 Mighty Dragon': { range: 3400, warhead: 2500 },
  'J-16': { range: 3900, warhead: 6000 },
  'BrahMos Land-Attack': { range: 450, warhead: 300 },
  'Nirbhay': { range: 1000, warhead: 450 },
  'Agni-P (Agni-Prime)': { range: 2000, warhead: 1000 },
  'Pralay': { range: 500, warhead: 400 },
  'Su-30MKI': { range: 3000, warhead: 8000 },
  'Rafale': { range: 3700, warhead: 6000 },
  'Mirage 2000I': { range: 1550, warhead: 6300 },
  'Tapas BH-201': { range: 1000, warhead: 350 },
  'Archer ALFA': { range: 250, warhead: 50 },
  'Pinaka Guided Rocket': { range: 90, warhead: 100 },
  'ALS-50 Loitering Munition': { range: 50, warhead: 6 },
  'Agni-I': { range: 900, warhead: 1000 },
  'Agni-II': { range: 3000, warhead: 1000 },
  'Agni-III': { range: 5000, warhead: 1500 },
  'Agni-IV': { range: 4000, warhead: 1000 },
  'Agni-V': { range: 8000, warhead: 1500 },
  'Prithvi-I': { range: 150, warhead: 1000 },
  'Prithvi-II': { range: 350, warhead: 500 },
  'Prithvi-III': { range: 600, warhead: 1000 },
  'Prahaar': { range: 150, warhead: 200 },
  'Pragati': { range: 170, warhead: 200 },
  'Suryastra Heavy MLRS': { range: 120, warhead: 150 },
  'MiG-29UPG': { range: 2100, warhead: 4000 },
  'Jaguar IS': { range: 1600, warhead: 4500 },
  'MQ-9 Reaper (India)': { range: 1900, warhead: 1700 },
  'IAI Heron TP (India)': { range: 1000, warhead: 450 },
  'IAI Harop (India)': { range: 200, warhead: 23 },
  'Minuteman III ICBM': { range: 13000, warhead: 1000 },
  'PrSM Tactical Missile': { range: 500, warhead: 91 },
  'F-16C/D Fighting Falcon (USA)': { range: 1500, warhead: 5000 },
  'F-15C/D Eagle': { range: 1900, warhead: 0 },
  'F-15E Strike Eagle': { range: 3900, warhead: 10400 },
  'F-15EX Eagle II': { range: 3900, warhead: 13300 },
  'F/A-18E/F Super Hornet': { range: 2300, warhead: 8000 },
  'A-10C Warthog': { range: 1300, warhead: 7200 },
  'B-1B Lancer': { range: 9400, warhead: 34000 },
  'B-2A Spirit': { range: 11000, warhead: 23000 },
  'B-52H Stratofortress': { range: 16000, warhead: 32000 },
  'F-35A Lightning II (USA)': { range: 2200, warhead: 8100 },
  'F-22 Raptor (USA)': { range: 2000, warhead: 2000 },
  '3M22 Zircon Hypersonic LACM': { range: 1000, warhead: 400 },
  'Tu-160M White Swan Bomber': { range: 12300, warhead: 40000 },
  'Su-34 Fullback': { range: 4000, warhead: 12000 },
  'MiG-31K Foxhound-D': { range: 2000, warhead: 800 },
  'Tu-22M3 Backfire': { range: 6800, warhead: 24000 },
  'Tu-95MS Bear': { range: 15000, warhead: 20000 },
  'MiG-29SMT Fulcrum-E': { range: 1800, warhead: 4500 },
  'MiG-35 Fulcrum-F': { range: 2000, warhead: 6000 },
  'Su-27S Flanker-B': { range: 3500, warhead: 4430 },
  'Su-30SM Flanker-H': { range: 3000, warhead: 8000 },
  'MiG-31 Foxhound': { range: 1450, warhead: 0 },
  'Su-35S Flanker-E': { range: 3600, warhead: 8000 },
  'Su-57 Felon': { range: 3500, warhead: 6000 },
  'Type-88 SSM Coastal Launcher': { range: 180, warhead: 225 },
  'Type-93 ASM Airborne ALCM': { range: 170, warhead: 200 },
  'F-15J Eagle (JASDF)': { range: 1900, warhead: 0 },
  'F-15DJ Eagle (JASDF Trainer)': { range: 1900, warhead: 0 },
  'F-35A Lightning II (JASDF)': { range: 2200, warhead: 8100 },
  'F-35B Lightning II (JASDF STOVL)': { range: 1670, warhead: 6800 },
  'F-2A Viper Zero (JASDF)': { range: 830, warhead: 6000 },
  'RQ-4B Global Hawk (JASDF)': { range: 22000, warhead: 0 },
  'Hyunmoo-5 Heavy Ballistic': { range: 300, warhead: 8000 },
  'Hyunmoo-3C LACM': { range: 1500, warhead: 500 },
  'FA-50 Block 20 / FA-50PL': { range: 1800, warhead: 4500 },
  'KF-21 Boramae (ROKAF)': { range: 2900, warhead: 7700 },
  'F-15K Slam Eagle (ROKAF)': { range: 3800, warhead: 10400 },
  'RQ-4 Block 30 Global Hawk (ROKAF)': { range: 22000, warhead: 0 },
  'SPEAR 3 Standoff ALCM': { range: 140, warhead: 40 },
  'Protector RG Mk1 (GA-ASI MQ-9B)': { range: 11000, warhead: 1000 },
  'Eurofighter Typhoon FGR4 (RAF)': { range: 2900, warhead: 7500 },
  'F-35B Lightning II (RAF)': { range: 1670, warhead: 6800 },
  'MQ-9A Reaper (RAF)': { range: 1850, warhead: 1700 },
  'SCALP Naval (MdCN)': { range: 1400, warhead: 500 },
  'AASM Hammer 1000 Glide Bomb': { range: 70, warhead: 1000 },
  'Rafale C (French Air Force)': { range: 3700, warhead: 9500 },
  'Rafale M (French Navy)': { range: 3700, warhead: 9500 },
  'Mirage 2000-5F (French Air Force)': { range: 1550, warhead: 6300 },
  'nEUROn UCAV (Stealth Drone)': { range: 2100, warhead: 500 },
  'DeepStrike Missile (Standalone)': { range: 500, warhead: 200 },
  'Eurofighter Typhoon (Luftwaffe)': { range: 2900, warhead: 7500 },
  'Panavia Tornado IDS (Luftwaffe)': { range: 1390, warhead: 9000 },
  'Heron TP (Luftwaffe UAV)': { range: 1000, warhead: 450 }
};

const mapCountry = (c: string): string => {
  const mapping: Record<string, string> = {
    'india': 'India',
    'pakistan': 'Pakistan',
    'usa': 'USA',
    'china': 'China',
    'russia': 'Russia',
    'japan': 'Japan',
    'south_korea': 'South Korea',
    'uk': 'UK',
    'france': 'France',
    'germany': 'Germany',
    'generic': 'Generic'
  };
  return mapping[c.toLowerCase()] || c.charAt(0).toUpperCase() + c.slice(1);
};

const mapType = (t: string): string => {
  const mapping: Record<string, string> = {
    'BALLISTIC': 'BALLISTIC_MISSILE',
    'CRUISE': 'CRUISE_MISSILE',
    'FIGHTER': 'FIGHTER_AIRCRAFT',
    'UAV': 'UAV',
    'SWARM': 'DRONE_SWARM',
    'LOITERING_MUNITION': 'LOITERING_MUNITION',
    'TACTICAL_MISSILE': 'TACTICAL_MISSILE',
    'HYPERSONIC': 'HYPERSONIC'
  };
  return mapping[t] || t;
};

// Dynamically generate the THREATS list from the simulator catalog
export const THREATS = mergedThreats.map((t: any, index: number) => {
  const typeStr = mapType(t.type);
  const countryStr = mapCountry(t.country);
  
  // Real world specs lookup or fallback
  const lookup = REAL_WORLD_SPECS[t.name] || {
    range: t.type === 'BALLISTIC' ? 1500 : t.type === 'CRUISE' ? 800 : t.type === 'FIGHTER' ? 2000 : 300,
    warhead: t.type === 'BALLISTIC' ? 600 : t.type === 'CRUISE' ? 300 : t.type === 'FIGHTER' ? 1500 : 100
  };

  const speedClass = t.speed >= 5 ? 'HYPERSONIC' : t.speed >= 1.2 ? 'SUPERSONIC' : 'SUBSONIC';
  const altClass = t.altitude >= 100000 ? 'EXOATMOSPHERIC' : t.altitude >= 25000 ? 'HIGH' : t.altitude >= 6000 ? 'MEDIUM' : 'LOW';
  
  // Visibility based on RCS
  let visibility = 'MEDIUM';
  if (t.rcs >= 5.0) visibility = 'VERY_HIGH';
  else if (t.rcs >= 1.0) visibility = 'HIGH';
  else if (t.rcs <= 0.01) visibility = 'STEALTH';
  else if (t.rcs <= 0.1) visibility = 'LOW';

  return {
    id: t.id || `thr-${index}`,
    name: t.name,
    type: typeStr,
    country: countryStr,
    speed: t.speed,
    speedClass,
    altClass,
    altitude: `0-${t.altitude}m`,
    rcs: t.rcs,
    visibility,
    score: t.threatScore,
    cost: Math.round(t.cost * 1000), // Cost in thousands of USD
    range: lookup.range,
    warhead: lookup.warhead
  };
});

const THREAT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'BALLISTIC_MISSILE', label: 'Ballistic Missile', color: '#dc2626' },
  { value: 'CRUISE_MISSILE', label: 'Cruise Missile', color: '#d97706' },
  { value: 'UAV', label: 'UAV', color: '#ca8a04' },
  { value: 'DRONE_SWARM', label: 'Drone Swarm', color: '#84cc16' },
  { value: 'FIGHTER_AIRCRAFT', label: 'Fighter Aircraft', color: '#38bdf8' },
  { value: 'LOITERING_MUNITION', label: 'Loitering Munition', color: '#ec4899' },
  { value: 'TACTICAL_MISSILE', label: 'Tactical Missile', color: '#f97316' },
  { value: 'HYPERSONIC', label: 'Hypersonic Weapon', color: '#be123c' },
];

const getTypeColor = (type: string) => THREAT_TYPES.find(t => t.value === type)?.color || '#64748b';
const getTypeLabel = (type: string) => THREAT_TYPES.find(t => t.value === type)?.label || type.replace('_', ' ');

function getScoreColor(score: number) {
  if (score >= 90) return '#be123c';
  if (score >= 75) return '#dc2626';
  if (score >= 60) return '#d97706';
  return '#4ade80';
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
    <div className="space-y-4">
      {/* Top Header Panel */}
      <div className="card p-4">
        <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">Threat Database</h1>
        <p className="text-[11px] text-[#475569] font-mono mt-0.5">Tactical threat index — operational parameters based on declassified wargaming catalogs</p>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {THREAT_TYPES.filter(t => t.value).slice(0, 5).map(tt => {
          const count = THREATS.filter(t => t.type === tt.value).length;
          return (
            <button
              key={tt.value}
              onClick={() => setType(type === tt.value ? '' : tt.value)}
              className={`card p-2 text-center transition-colors hover:bg-[rgba(148,163,184,0.02)] ${type === tt.value ? 'border-opacity-100 border-[#38bdf8]' : 'border-[rgba(148,163,184,0.08)]'}`}
            >
              <div className="text-lg font-bold font-mono" style={{ color: tt.color }}>{count}</div>
              <div className="text-[9px] text-[#64748b] font-mono uppercase tracking-[0.05em] mt-0.5">{tt.label.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Filter by designation or nation..." 
          className="input-field max-w-xs text-[11px] font-mono" 
        />
        <select 
          value={type} 
          onChange={e => setType(e.target.value)} 
          className="input-field max-w-[180px] text-[11px] font-mono"
        >
          {THREAT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value as any)} 
          className="input-field max-w-[140px] text-[11px] font-mono"
        >
          <option value="score">Sort: Threat Index</option>
          <option value="speed">Sort: Velocity (Mach)</option>
          <option value="range">Sort: Strike Range</option>
          <option value="cost">Sort: Unit Cost</option>
        </select>
        <span className="text-[10px] font-mono text-[#475569] ml-auto uppercase">{filtered.length} targets identified</span>
      </div>

      {/* Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((threat, i) => (
          <div key={threat.id} className="card p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[12px] font-bold text-white font-mono">{threat.name}</h3>
                  <p className="text-[10px] text-[#64748b] font-mono">{threat.country}</p>
                </div>
                <div className="flex items-center px-1.5 py-0.5" style={{ backgroundColor: `${getScoreColor(threat.score)}15`, border: `1px solid ${getScoreColor(threat.score)}30` }}>
                  <span className="text-xs font-bold font-mono" style={{ color: getScoreColor(threat.score) }}>{threat.score}</span>
                </div>
              </div>

              <span className="badge text-[9px] mb-2.5" style={{ backgroundColor: `${getTypeColor(threat.type)}15`, color: getTypeColor(threat.type), border: `1px solid ${getTypeColor(threat.type)}25` }}>
                {getTypeLabel(threat.type)}
              </span>

              <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono border-t border-[rgba(148,163,184,0.04)] pt-2.5">
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Velocity</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5">M {threat.speed}</div>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Range</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5">{threat.range} km</div>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">RCS Profile</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5">{threat.rcs} m²</div>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Ceiling</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5 text-[9px] truncate">{threat.altitude}</div>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Warhead</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5">{threat.warhead > 0 ? `${threat.warhead} kg` : 'N/A'}</div>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Unit Cost</span>
                  <div className="text-[#cbd5e1] font-semibold mt-0.5">${(threat.cost / 1000).toFixed(1)}M</div>
                </div>
              </div>
            </div>

            {/* Threat Index Level Bar */}
            <div className="mt-3 border-t border-[rgba(148,163,184,0.04)] pt-2.5">
              <div className="flex justify-between text-[8px] font-mono mb-1">
                <span className="text-[#475569] uppercase tracking-[0.05em]">Threat Severity Profile</span>
                <span style={{ color: getScoreColor(threat.score) }}>{threat.score}%</span>
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
