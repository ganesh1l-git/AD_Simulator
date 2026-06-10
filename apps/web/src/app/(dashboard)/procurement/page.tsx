'use client';

import { useState } from 'react';

const CATALOG = [
  { id: '1', name: 'S-400 Triumf Regiment', category: 'LONG_RANGE', cost: 1090, maintenance: 47.7, range: 400, accuracy: 90, color: '#ef4444', owned: 2, maxLevel: 5 },
  { id: '2', name: 'Barak 8 ER Regiment', category: 'MEDIUM_RANGE', cost: 650, maintenance: 32.5, range: 150, accuracy: 88, color: '#f59e0b', owned: 1, maxLevel: 5 },
  { id: '3', name: 'MRSAM / Barak-8 Regiment', category: 'MEDIUM_RANGE', cost: 500, maintenance: 25.0, range: 100, accuracy: 85, color: '#f59e0b', owned: 4, maxLevel: 5 },
  { id: '4', name: 'Akash-NG Regiment', category: 'MEDIUM_RANGE', cost: 480, maintenance: 24.0, range: 80, accuracy: 85, color: '#f59e0b', owned: 6, maxLevel: 5 },
  { id: '5', name: 'Akash SAM Regiment', category: 'MEDIUM_RANGE', cost: 350, maintenance: 17.5, range: 30, accuracy: 75, color: '#f59e0b', owned: 4, maxLevel: 5 },
  { id: '6', name: 'Pechora-2M', category: 'MEDIUM_RANGE', cost: 15, maintenance: 5.0, range: 35, accuracy: 72, color: '#f59e0b', owned: 4, maxLevel: 4 },
  { id: '7', name: 'SPYDER SAM Battery', category: 'SHORT_RANGE', cost: 50, maintenance: 2.5, range: 50, accuracy: 82, color: '#00ff88', owned: 2, maxLevel: 5 },
  { id: '8', name: 'QRSAM Regiment', category: 'SHORT_RANGE', cost: 600, maintenance: 30.0, range: 30, accuracy: 82, color: '#00ff88', owned: 8, maxLevel: 5 },
  { id: '9', name: 'VSHORAD MANPAD', category: 'VERY_SHORT_RANGE', cost: 0.1, maintenance: 0.5, range: 6.5, accuracy: 70, color: '#00b4d8', owned: 16, maxLevel: 3 },
  { id: '10', name: 'Igla-S', category: 'VERY_SHORT_RANGE', cost: 0.06, maintenance: 0.4, range: 6, accuracy: 65, color: '#00b4d8', owned: 24, maxLevel: 3 },
  { id: '11', name: 'DRDO Anti-Drone', category: 'ANTI_DRONE', cost: 0.5, maintenance: 0.9, range: 3, accuracy: 75, color: '#a855f7', owned: 4, maxLevel: 4 },
  { id: '12', name: 'Arudhra AESA', category: 'RADAR', cost: 25, maintenance: 7.0, range: 500, accuracy: 0, color: '#6366f1', owned: 3, maxLevel: 3 },
];

const TECH_TREE = [
  { level: 1, name: 'Basic Systems', unlocked: true, systems: ['Igla-S', 'VSHORAD MANPAD', 'OSA-AKM'], color: '#4b5563' },
  { level: 2, name: 'Modern SHORAD', unlocked: true, systems: ['QRSAM Regiment', 'SPYDER SAM Battery', 'Mistral'], color: '#00b4d8' },
  { level: 3, name: 'Medium Range', unlocked: true, systems: ['Akash SAM', 'Pechora-2M', 'Akash-NG', 'MRSAM', 'Barak 8 ER'], color: '#f59e0b' },
  { level: 4, name: 'Long Range', unlocked: true, systems: ['S-400 Triumf Regiment'], color: '#ef4444' },
  { level: 5, name: 'Future Tech', unlocked: false, systems: ['Directed Energy', 'Hypersonic Interceptor', 'AI Command'], color: '#a855f7' },
];

export default function ProcurementPage() {
  const [tab, setTab] = useState<'catalog' | 'owned' | 'tech'>('catalog');
  const totalSpent = CATALOG.reduce((s, c) => s + c.cost * c.owned, 0);
  const yearlyMaintenance = CATALOG.reduce((s, c) => s + c.maintenance * c.owned, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">🛒 Procurement Center</h1>
        <p className="text-sm text-[#6b7280]">Purchase, upgrade, and manage air defence systems</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#00ff88' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Total Invested</div>
          <div className="text-xl font-bold text-[#00ff88] font-mono">${totalSpent.toFixed(0)}M</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Yearly Maintenance</div>
          <div className="text-xl font-bold text-[#f59e0b] font-mono">${yearlyMaintenance.toFixed(1)}M</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#00b4d8' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Systems Owned</div>
          <div className="text-xl font-bold text-[#00b4d8] font-mono">{CATALOG.reduce((s, c) => s + c.owned, 0)}</div>
        </div>
        <div className="card p-4 text-center stat-card" style={{ '--accent-color': '#a855f7' } as React.CSSProperties}>
          <div className="text-[10px] text-[#4b5563] uppercase">Available Budget</div>
          <div className="text-xl font-bold text-[#a855f7] font-mono">$2,500M</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['catalog', '📦 Catalog'], ['owned', '🗂️ My Systems'], ['tech', '🔬 Tech Tree']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === t ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' : 'text-[#6b7280] hover:text-white'
          }`}>{label}</button>
        ))}
      </div>

      {/* Catalog */}
      {tab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {CATALOG.map(sys => (
            <div key={sys.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{sys.name}</h3>
                  <span className="badge text-[9px] mt-1" style={{ backgroundColor: `${sys.color}22`, color: sys.color, border: `1px solid ${sys.color}44` }}>{sys.category.replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00ff88] font-mono">${sys.cost}M</div>
                  <div className="text-[10px] text-[#4b5563]">+${sys.maintenance}M/yr</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-[#4b5563]">Range:</span> <span className="font-mono text-[#e5e7eb]">{sys.range}km</span></div>
                <div><span className="text-[#4b5563]">Accuracy:</span> <span className="font-mono text-[#e5e7eb]">{sys.accuracy}%</span></div>
                <div><span className="text-[#4b5563]">Owned:</span> <span className="font-mono text-[#e5e7eb]">{sys.owned}</span></div>
                <div><span className="text-[#4b5563]">Max Level:</span> <span className="font-mono text-[#e5e7eb]">{sys.maxLevel}</span></div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs py-1.5 flex-1">Purchase</button>
                <button className="btn-secondary text-xs py-1.5 flex-1">Upgrade</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owned */}
      {tab === 'owned' && (
        <div className="card overflow-hidden animate-fade-in-up">
          <table className="data-table">
            <thead><tr><th>System</th><th>Category</th><th>Owned</th><th>Total Cost</th><th>Yearly Maintenance</th><th>Status</th></tr></thead>
            <tbody>
              {CATALOG.filter(c => c.owned > 0).map(sys => (
                <tr key={sys.id}>
                  <td className="font-medium text-white">{sys.name}</td>
                  <td><span className="badge text-[10px]" style={{ backgroundColor: `${sys.color}22`, color: sys.color, border: `1px solid ${sys.color}44` }}>{sys.category.replace('_', ' ')}</span></td>
                  <td className="font-mono">{sys.owned}</td>
                  <td className="font-mono text-[#00ff88]">${(sys.cost * sys.owned).toFixed(1)}M</td>
                  <td className="font-mono text-[#f59e0b]">${(sys.maintenance * sys.owned).toFixed(1)}M</td>
                  <td><span className="badge badge-green text-[10px]">OPERATIONAL</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tech Tree */}
      {tab === 'tech' && (
        <div className="space-y-4 animate-fade-in-up">
          {TECH_TREE.map((level, i) => (
            <div key={level.level} className={`card p-5 ${!level.unlocked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  level.unlocked ? 'bg-gradient-to-br from-[#00ff88]/20 to-[#00b4d8]/20 text-[#00ff88]' : 'bg-[#1f2937] text-[#4b5563]'
                }`}>
                  {level.unlocked ? `L${level.level}` : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold" style={{ color: level.color }}>{level.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {level.systems.map(sys => (
                      <span key={sys} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#9ca3af]">{sys}</span>
                    ))}
                  </div>
                </div>
                {!level.unlocked && <button className="btn-secondary text-xs">Research — $100M</button>}
              </div>
              {i < TECH_TREE.length - 1 && <div className="ml-6 mt-3 w-px h-4 bg-white/10" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
