'use client';

import { useState } from 'react';

interface Room {
  id: string;
  code: string;
  mode: string;
  players: number;
  maxPlayers: number;
  host: string;
  status: string;
}

const DEMO_ROOMS: Room[] = [
  { id: '1', code: 'ALPHA7', mode: '1v1', players: 1, maxPlayers: 2, host: 'Commander_X', status: 'WAITING' },
  { id: '2', code: 'BRAVO3', mode: '2v2', players: 3, maxPlayers: 4, host: 'Delta_Force', status: 'WAITING' },
  { id: '3', code: 'CHARLIE', mode: '5v5', players: 8, maxPlayers: 10, host: 'AirDefPro', status: 'WAITING' },
  { id: '4', code: 'FOXTRT', mode: '1v1', players: 2, maxPlayers: 2, host: 'ShieldWall', status: 'IN_PROGRESS' },
  { id: '5', code: 'GOLF22', mode: '2v2', players: 4, maxPlayers: 4, host: 'Interceptor', status: 'IN_PROGRESS' },
];

const MODES = [
  { value: '1v1', label: '1 vs 1', desc: 'Defender vs Attacker', icon: '⚔️', maxPlayers: 2 },
  { value: '2v2', label: '2 vs 2', desc: 'Team battle', icon: '🤝', maxPlayers: 4 },
  { value: '5v5', label: '5 vs 5', desc: 'Full-scale engagement', icon: '🏟️', maxPlayers: 10 },
  { value: 'OBSERVER', label: 'Observer', desc: 'Watch live matches', icon: '👁️', maxPlayers: 50 },
  { value: 'TOURNAMENT', label: 'Tournament', desc: 'Bracket elimination', icon: '🏆', maxPlayers: 16 },
];

export default function MultiplayerPage() {
  const [tab, setTab] = useState<'browse' | 'create' | 'join'>('browse');
  const [joinCode, setJoinCode] = useState('');
  const [selectedMode, setSelectedMode] = useState('1v1');
  const [roomName, setRoomName] = useState('');

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-1">👥 Multiplayer</h1>
        <p className="text-sm text-[#6b7280]">Real-time multiplayer air defence simulations via Socket.IO</p>
      </div>

      {/* Online Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-xs text-[#4b5563] uppercase mb-1">Players Online</div>
          <div className="text-2xl font-bold text-[#00ff88] font-mono">47</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xs text-[#4b5563] uppercase mb-1">Active Rooms</div>
          <div className="text-2xl font-bold text-[#00b4d8] font-mono">{DEMO_ROOMS.length}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xs text-[#4b5563] uppercase mb-1">In Match</div>
          <div className="text-2xl font-bold text-[#f59e0b] font-mono">{DEMO_ROOMS.filter(r => r.status === 'IN_PROGRESS').reduce((s, r) => s + r.players, 0)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['browse', 'create', 'join'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
            tab === t ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30' : 'text-[#6b7280] hover:text-white'
          }`}>{t === 'browse' ? '🔍 Browse Rooms' : t === 'create' ? '➕ Create Room' : '🔗 Join by Code'}</button>
        ))}
      </div>

      {/* Browse Rooms */}
      {tab === 'browse' && (
        <div className="card overflow-hidden animate-fade-in-up">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Mode</th>
                <th>Host</th>
                <th>Players</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ROOMS.map(room => (
                <tr key={room.id}>
                  <td className="font-mono text-[#00ff88]">{room.code}</td>
                  <td><span className="badge badge-cyan text-[10px]">{room.mode}</span></td>
                  <td className="text-[#e5e7eb]">{room.host}</td>
                  <td>
                    <span className="font-mono">{room.players}/{room.maxPlayers}</span>
                    <div className="progress-bar mt-1" style={{ width: '60px' }}>
                      <div className="progress-fill" style={{ width: `${(room.players / room.maxPlayers) * 100}%` }} />
                    </div>
                  </td>
                  <td>
                    <span className={`badge text-[10px] ${room.status === 'WAITING' ? 'badge-green' : 'badge-amber'}`}>
                      {room.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {room.status === 'WAITING' && room.players < room.maxPlayers ? (
                      <button className="btn-primary text-xs py-1.5 px-3">Join</button>
                    ) : room.status === 'IN_PROGRESS' ? (
                      <button className="btn-ghost text-xs py-1.5 px-3">Spectate</button>
                    ) : (
                      <span className="text-xs text-[#4b5563]">Full</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Room */}
      {tab === 'create' && (
        <div className="card p-6 max-w-lg animate-fade-in-up">
          <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Create Game Room</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Room Name (optional)</label>
              <input className="input-field" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="My Game Room" />
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-2 block">Game Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setSelectedMode(mode.value)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      selectedMode === mode.value
                        ? 'bg-[#00ff88]/10 border border-[#00ff88]/30'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mode.icon}</span>
                      <div>
                        <div className={`text-sm font-medium ${selectedMode === mode.value ? 'text-[#00ff88]' : 'text-[#e5e7eb]'}`}>{mode.label}</div>
                        <div className="text-[10px] text-[#4b5563]">{mode.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full">🎮 Create Room</button>
          </div>
        </div>
      )}

      {/* Join by Code */}
      {tab === 'join' && (
        <div className="card p-6 max-w-md animate-fade-in-up">
          <h3 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">Join by Room Code</h3>
          <div className="flex gap-3">
            <input
              className="input-field font-mono text-lg tracking-[0.3em] uppercase text-center"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="XXXXXX"
              maxLength={6}
            />
            <button className="btn-primary flex-shrink-0" disabled={joinCode.length < 4}>Join</button>
          </div>
          <p className="text-xs text-[#4b5563] mt-2">Enter the 6-character room code shared by the host</p>
        </div>
      )}
    </div>
  );
}
