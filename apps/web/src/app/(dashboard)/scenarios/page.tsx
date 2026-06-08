'use client';

import { useState } from 'react';

const DEMO_SCENARIOS = [
  { id: '1', name: 'Delhi NCR Defence', creator: 'Admin', zones: 5, systems: 6, threats: 3, isPublic: true, createdAt: '2024-12-01' },
  { id: '2', name: 'Western Border Shield', creator: 'Commander_X', zones: 8, systems: 10, threats: 5, isPublic: true, createdAt: '2024-11-15' },
  { id: '3', name: 'Coastal Defence Exercise', creator: 'NavalOps', zones: 4, systems: 5, threats: 4, isPublic: true, createdAt: '2024-10-20' },
  { id: '4', name: 'Mountain Forward Base', creator: 'Admin', zones: 3, systems: 4, threats: 6, isPublic: true, createdAt: '2024-09-10' },
  { id: '5', name: 'Drone Swarm Overload', creator: 'Demo User', zones: 2, systems: 8, threats: 1, isPublic: false, createdAt: '2024-08-05' },
];

export default function ScenariosPage() {
  const [tab, setTab] = useState<'browse' | 'create'>('browse');
  const [editorData, setEditorData] = useState({
    name: '', description: '', zones: [] as any[], isPublic: false,
  });

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">📋 Scenario Editor</h1>
        <p className="text-sm text-[#6b7280]">Create, browse, and manage simulation scenarios — export/import as JSON</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('browse')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'browse' ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' : 'text-[#6b7280]'}`}>📂 Browse Scenarios</button>
        <button onClick={() => setTab('create')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'create' ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' : 'text-[#6b7280]'}`}>✏️ Create New</button>
      </div>

      {tab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {DEMO_SCENARIOS.map((scenario, i) => (
            <div key={scenario.id} className="card card-interactive p-5 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-white">{scenario.name}</h3>
                {scenario.isPublic ? <span className="badge badge-green text-[9px]">Public</span> : <span className="badge text-[9px]" style={{ backgroundColor: '#4b556322', color: '#6b7280', border: '1px solid #4b556344' }}>Private</span>}
              </div>
              <div className="text-xs text-[#4b5563] mb-3">By {scenario.creator} • {scenario.createdAt}</div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                <div className="p-2 rounded bg-white/[0.03] text-center">
                  <div className="font-mono text-[#00ff88]">{scenario.zones}</div>
                  <div className="text-[10px] text-[#4b5563]">Zones</div>
                </div>
                <div className="p-2 rounded bg-white/[0.03] text-center">
                  <div className="font-mono text-[#00b4d8]">{scenario.systems}</div>
                  <div className="text-[10px] text-[#4b5563]">Systems</div>
                </div>
                <div className="p-2 rounded bg-white/[0.03] text-center">
                  <div className="font-mono text-[#ef4444]">{scenario.threats}</div>
                  <div className="text-[10px] text-[#4b5563]">Waves</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs py-1.5 flex-1">▶ Play</button>
                <button className="btn-ghost text-xs py-1.5">📥 Export</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Scenario Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Scenario Name</label>
                <input className="input-field" value={editorData.name} onChange={e => setEditorData({ ...editorData, name: e.target.value })} placeholder="e.g., Western Sector Defence" />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Description</label>
                <textarea className="input-field h-24 resize-none" value={editorData.description} onChange={e => setEditorData({ ...editorData, description: e.target.value })} placeholder="Describe the scenario..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#9ca3af] cursor-pointer">
                <input type="checkbox" checked={editorData.isPublic} onChange={e => setEditorData({ ...editorData, isPublic: e.target.checked })} className="accent-[#00ff88]" />
                Make public
              </label>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Import / Export</h3>
            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed border-white/10 rounded-lg text-center hover:border-[#00ff88]/30 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📤</div>
                <div className="text-sm text-[#6b7280]">Drop JSON file to import scenario</div>
                <div className="text-xs text-[#4b5563] mt-1">or click to browse</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1">💾 Save Scenario</button>
                <button className="btn-secondary flex-1">📥 Export JSON</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
