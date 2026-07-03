'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <>
      {/* Classification Banner */}
      <div className="classification-banner">
        UNCLASSIFIED // FOR OFFICIAL USE ONLY — EDUCATIONAL SIMULATOR
      </div>

      {/* Main Header */}
      <header className="h-11 bg-[#0d1220] border-b border-[rgba(148,163,184,0.08)] flex items-center justify-between px-4 sticky top-0 z-30">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#475569]">IADES</span>
            <span className="text-[#334155]">/</span>
            <span className="text-[#94a3b8] font-medium">C2 OPS CENTER</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search systems, threats, scenarios..."
              className="w-full bg-[#0b0f19] border border-[rgba(148,163,184,0.08)] px-3 py-1.5 pl-8 text-[11px] text-[#cbd5e1] 
                placeholder-[#475569] focus:outline-none focus:border-[rgba(56,189,248,0.25)]
                transition-colors font-mono"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right: Status & User */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-[10px]">
            <div className="flex items-center gap-1.5 text-[#475569]">
              <span className="text-[#64748b]">SYS</span>
              <div className="w-1.5 h-1.5 bg-[#4ade80]" />
              <span className="text-[#4ade80]">NOMINAL</span>
            </div>
            <div className="w-px h-3 bg-[rgba(148,163,184,0.10)]" />
            <div className="flex items-center gap-1.5 text-[#475569]">
              <span>UPTIME</span>
              <span className="text-[#94a3b8]">{formatUptime(uptime)}</span>
            </div>
          </div>

          <div className="w-px h-4 bg-[rgba(148,163,184,0.08)]" />

          {/* Notifications */}
          <button className="relative p-1.5 text-[#64748b] hover:text-[#94a3b8] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#dc2626]" />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-[rgba(148,163,184,0.04)] transition-colors">
            <div className="w-6 h-6 bg-[#1b2340] border border-[rgba(148,163,184,0.12)] flex items-center justify-center text-[#94a3b8] text-[10px] font-mono font-semibold">
              OP
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[10px] font-medium text-[#94a3b8] font-mono">OPERATOR</div>
              <div className="text-[9px] text-[#475569] font-mono">SESSION ACTIVE</div>
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
