'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// SVG icon components — minimal, utilitarian defense UI style
const icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  encyclopedia: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
  structure: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l8 4.5v7L12 18l-8-4.5v-7L12 2z" />
      <path d="M12 18v4" />
      <path d="M4 6.5L12 11l8-4.5" />
      <path d="M12 11v7" />
    </svg>
  ),
  threats: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  map: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  simulation: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  ),
  campaign: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  multiplayer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  procurement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 7V5a4 4 0 00-8 0v2" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  ),
  analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  scenarios: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  replay: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  ),
};

const navItems = [
  { href: '/', label: 'DASHBOARD', icon: icons.dashboard },
  { href: '/encyclopedia', label: 'ENCYCLOPEDIA', icon: icons.encyclopedia },
  { href: '/structure', label: 'FORCE STRUCTURE', icon: icons.structure },
  { href: '/threats', label: 'THREAT DATABASE', icon: icons.threats },
  { href: '/map', label: 'STRATEGY MAP', icon: icons.map },
  { href: '/simulation/new', label: 'SIMULATION', icon: icons.simulation },
  { href: '/campaign', label: 'CAMPAIGN', icon: icons.campaign },
  { href: '/multiplayer', label: 'MULTIPLAYER', icon: icons.multiplayer },
  { href: '/procurement', label: 'PROCUREMENT', icon: icons.procurement },
  { href: '/analytics', label: 'ANALYTICS', icon: icons.analytics },
  { href: '/scenarios', label: 'SCENARIOS', icon: icons.scenarios },
  { href: '/replay', label: 'REPLAY CENTER', icon: icons.replay },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-200 ease-in-out
        ${collapsed ? 'w-[56px]' : 'w-[220px]'}
        bg-[#0d1220] border-r border-[rgba(148,163,184,0.08)]`}
    >
      {/* Logo / System ID */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-[rgba(148,163,184,0.08)]">
        <div className="w-8 h-8 rounded-none bg-[#1b2340] border border-[rgba(56,189,248,0.2)] flex items-center justify-center text-[#38bdf8] font-mono font-bold text-[11px] flex-shrink-0 tracking-wider">
          AD
        </div>
        {!collapsed && (
          <div>
            <div className="text-[11px] font-bold text-[#cbd5e1] tracking-[0.15em] font-mono">IADES</div>
            <div className="text-[9px] text-[#475569] tracking-[0.1em] font-mono uppercase">v2.0 // AIR DEF SIM</div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-5 h-5 bg-[#1b2340] border border-[rgba(148,163,184,0.12)]
          flex items-center justify-center text-[9px] text-[#64748b] hover:text-[#cbd5e1] hover:border-[rgba(56,189,248,0.25)]
          transition-colors z-50"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {/* Section Label */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-1">
          <span className="text-[9px] font-mono text-[#475569] tracking-[0.15em] uppercase">Operations</span>
        </div>
      )}

      {/* Navigation */}
      <nav className={`${collapsed ? 'mt-4' : 'mt-1'} px-1.5 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-[7px] transition-colors duration-150 relative
                ${isActive
                  ? 'bg-[rgba(56,189,248,0.06)] text-[#38bdf8]'
                  : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[rgba(148,163,184,0.04)]'
                }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator — left border */}
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#38bdf8]" />
              )}

              <span className="flex-shrink-0 opacity-80">{item.icon}</span>

              {!collapsed && (
                <span className="text-[11px] font-medium tracking-[0.04em]">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — Classification Marking */}
      <div className={`absolute bottom-0 left-0 right-0 px-3 py-2.5 border-t border-[rgba(148,163,184,0.06)] ${collapsed ? 'text-center' : ''}`}>
        {!collapsed && (
          <div className="font-mono text-[8px] text-[#475569] leading-relaxed tracking-[0.1em] uppercase">
            <div className="text-[#64748b] font-semibold mb-0.5">UNCLASSIFIED // FOUO</div>
            EDUCATIONAL USE ONLY
          </div>
        )}
        {collapsed && <div className="text-[8px] text-[#475569] font-mono tracking-wider">EDU</div>}
      </div>
    </aside>
  );
}
