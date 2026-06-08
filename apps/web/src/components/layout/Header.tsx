'use client';

import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-[#6b7280]">IADES</span>
          <span className="text-[#4b5563]">/</span>
          <span className="text-[#e5e7eb] font-medium">Command Center</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems, threats, scenarios..."
            className="w-full bg-[#111827]/80 border border-white/[0.08] rounded-lg px-4 py-2 pl-10 text-sm text-[#e5e7eb] 
              placeholder-[#4b5563] focus:outline-none focus:border-[#00ff88]/30 focus:shadow-[0_0_0_3px_rgba(0,255,136,0.05)]
              transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Right: Status & User */}
      <div className="flex items-center gap-4">
        {/* Live Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827]/80 border border-white/[0.06]">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[10px] text-[#00ff88] font-medium tracking-wider uppercase">System Online</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-[#6b7280] hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00b4d8] flex items-center justify-center text-[#0a0e17] text-xs font-bold">
            U
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-[#e5e7eb]">Commander</div>
            <div className="text-[10px] text-[#6b7280]">Player</div>
          </div>
        </button>
      </div>
    </header>
  );
}
