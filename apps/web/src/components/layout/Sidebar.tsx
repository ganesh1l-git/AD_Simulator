'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠', description: 'Home' },
  { href: '/encyclopedia', label: 'Encyclopedia', icon: '📖', description: 'Air Defence Systems' },
  { href: '/structure', label: 'Structure', icon: '🛡️', description: 'Indian AD Network' },
  { href: '/threats', label: 'Threats', icon: '⚠️', description: 'Threat Database' },
  { href: '/map', label: 'Strategy Map', icon: '🗺️', description: 'Interactive Map' },
  { href: '/simulation/new', label: 'Simulation', icon: '🎯', description: 'Run Simulation' },
  { href: '/campaign', label: 'Campaign', icon: '⚔️', description: 'Campaign Mode' },
  { href: '/multiplayer', label: 'Multiplayer', icon: '👥', description: 'Online Play' },
  { href: '/procurement', label: 'Procurement', icon: '🛒', description: 'Buy & Upgrade' },
  { href: '/analytics', label: 'Analytics', icon: '📊', description: 'Statistics' },
  { href: '/scenarios', label: 'Scenarios', icon: '📋', description: 'Scenario Editor' },
  { href: '/replay', label: 'Replay', icon: '🔄', description: 'Watch Replays' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        bg-[#0d1117]/95 backdrop-blur-xl border-r border-white/[0.06]`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00b4d8] flex items-center justify-center text-[#0a0e17] font-black text-lg flex-shrink-0">
          IA
        </div>
        {!collapsed && (
          <div className="animate-fade-in-up">
            <div className="text-sm font-bold text-white tracking-wide">IADES</div>
            <div className="text-[10px] text-[#6b7280] tracking-widest uppercase">Air Defence Sim</div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1f2937] border border-white/10 
          flex items-center justify-center text-[10px] text-[#9ca3af] hover:text-white hover:border-[#00ff88]/30
          transition-all z-50"
      >
        {collapsed ? '›' : '‹'}
      </button>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20'
                  : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00ff88] rounded-r-full" />
              )}

              <span className="text-lg flex-shrink-0">{item.icon}</span>

              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-[#00ff88]/60' : 'text-[#4b5563]'}`}>
                    {item.description}
                  </div>
                </div>
              )}

              {/* Hover glow for active */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-[#00ff88]/[0.03] pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.06] ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <div className="text-[10px] text-[#4b5563] leading-relaxed">
            <div className="text-[#6b7280] font-medium mb-1">EDUCATIONAL USE ONLY</div>
            Uses publicly available data
          </div>
        )}
        {collapsed && <div className="text-[10px] text-[#4b5563]">EDU</div>}
      </div>
    </aside>
  );
}
