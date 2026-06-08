'use client';

import { useState } from 'react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  simulationsRun: number;
  joinedDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const mockUsers: UserItem[] = [
  { id: 'usr-101', name: 'Commander K. Singh', email: 'k.singh@iaf.edu.in', role: 'INSTRUCTOR', simulationsRun: 42, joinedDate: '2026-03-12', status: 'ACTIVE' },
  { id: 'usr-102', name: 'Aarav Mehta', email: 'aarav.m@iitd.ac.in', role: 'STUDENT', simulationsRun: 15, joinedDate: '2026-05-18', status: 'ACTIVE' },
  { id: 'usr-103', name: 'Priya Sharma', email: 'priya.sharma@def.res.in', role: 'ADMIN', simulationsRun: 88, joinedDate: '2026-01-05', status: 'ACTIVE' },
  { id: 'usr-104', name: 'Vikram Malhotra', email: 'vikram.mal@bits-pilani.ac.in', role: 'STUDENT', simulationsRun: 4, joinedDate: '2026-06-01', status: 'ACTIVE' },
  { id: 'usr-105', name: 'Neha Gupta', email: 'neha.g@niti.gov.in', role: 'INSTRUCTOR', simulationsRun: 29, joinedDate: '2026-04-22', status: 'ACTIVE' },
];

export default function AdminPage() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleRoleChange = (userId: string, newRole: UserItem['role']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleStatusChange = (userId: string, currentStatus: UserItem['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444]/5 via-transparent to-[#00ff88]/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">HQ System Administration</h1>
          <p className="text-sm text-[#6b7280]">
            Manage users, adjust simulation parameters, and monitor system health.
          </p>
        </div>
      </div>

      {/* Health Checks & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-white/[0.06]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Database Status</span>
            <span className="text-xs text-[#00ff88] font-mono">ONLINE</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">PostgreSQL v16</div>
          <div className="text-[10px] text-[#4b5563] font-mono">Ping: 8ms • Connections: 12 active</div>
        </div>

        <div className="card p-5 border-white/[0.06]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Socket Server</span>
            <span className="text-xs text-[#00ff88] font-mono">ONLINE</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">Socket.IO Gateway</div>
          <div className="text-[10px] text-[#4b5563] font-mono">Clients: 15 connected • Rooms: 3</div>
        </div>

        <div className="card p-5 border-white/[0.06]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Simulation Engine</span>
            <span className="text-xs text-[#00ff88] font-mono">STANDBY</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">Rule-Based Worker</div>
          <div className="text-[10px] text-[#4b5563] font-mono">CPU: 2.4% • Memory: 142MB / 512MB</div>
        </div>

        <div className="card p-5 border-white/[0.06]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-[#6b7280] uppercase tracking-wider font-semibold">Total Resources</span>
            <span className="text-xs text-[#00b4d8] font-mono">OK</span>
          </div>
          <div className="text-xl font-bold text-white mb-1">18 Systems / 19 Threats</div>
          <div className="text-[10px] text-[#4b5563] font-mono">Seeded catalog matching declassified standard</div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="card p-6 border-white/[0.06] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Personnel & Access Controls</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded bg-[#070b12] border border-white/10 text-xs text-white placeholder-[#4b5563] focus:border-[#00ff88]/30 outline-none min-w-[200px]"
            />

            {/* Filter Dropdown */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1.5 rounded bg-[#070b12] border border-white/10 text-xs text-white focus:border-[#00ff88]/30 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Administrators</option>
              <option value="INSTRUCTOR">Instructors</option>
              <option value="STUDENT">Students</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto border border-white/[0.05] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] text-[#6b7280] uppercase font-mono">
                <th className="p-3">Personnel Name</th>
                <th className="p-3">Credentials</th>
                <th className="p-3">Role Hierarchy</th>
                <th className="p-3 text-center">Simulations Run</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                  <td className="p-3 font-semibold text-white">{user.name}</td>
                  <td className="p-3 font-mono text-[#9ca3af]">{user.email}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserItem['role'])}
                      className="px-2 py-1 rounded bg-[#070b12] border border-white/10 text-[11px] text-white focus:border-[#00ff88]/30 outline-none"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-center font-mono text-white">{user.simulationsRun}</td>
                  <td className="p-3 text-[#9ca3af] font-mono">{user.joinedDate}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                      ${user.status === 'ACTIVE' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleStatusChange(user.id, user.status)}
                      className={`px-3 py-1 rounded text-[10px] font-bold border transition-all
                        ${user.status === 'ACTIVE' 
                          ? 'border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10' 
                          : 'border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10'}`}
                    >
                      {user.status === 'ACTIVE' ? 'SUSPEND' : 'ACTIVATE'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#4b5563] font-mono">
                    No matching personnel records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Config Settings */}
      <div className="card p-6 border-white/[0.06] space-y-4">
        <h2 className="text-lg font-bold text-white">Educational Physics Engine Modifiers</h2>
        <p className="text-xs text-[#6b7280]">
          Adjust coefficients and calculations dynamically below to demonstrate radar behavior under varying environmental effects.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
              Base Radar Power Multiplier (1.0x)
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              defaultValue="1.0"
              className="w-full accent-[#00ff88]"
            />
            <div className="flex justify-between text-[10px] text-[#4b5563] font-mono">
              <span>0.5x (EW Heavy)</span>
              <span>2.0x (Clear Sky)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
              Interceptor Speed Offset (Mach)
            </label>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.1"
              defaultValue="0.0"
              className="w-full accent-[#00b4d8]"
            />
            <div className="flex justify-between text-[10px] text-[#4b5563] font-mono">
              <span>-1.0 Mach</span>
              <span>+1.0 Mach</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
              Standard Deviation margin of error
            </label>
            <input
              type="range"
              min="0.01"
              max="0.20"
              step="0.01"
              defaultValue="0.05"
              className="w-full accent-[#a855f7]"
            />
            <div className="flex justify-between text-[10px] text-[#4b5563] font-mono">
              <span>1% (Deterministic)</span>
              <span>20% (High Volatility)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
