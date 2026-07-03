'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#cbd5e1] flex flex-col">
      {/* Classification Banner */}
      <div className="classification-banner">
        UNCLASSIFIED // FOR OFFICIAL USE ONLY — EDUCATIONAL SIMULATOR
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        {/* Login Container */}
        <div className="w-full max-w-[380px] relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#1b2340] border border-[rgba(56,189,248,0.2)] text-[#38bdf8] font-mono font-bold text-sm mb-3">
              AD
            </div>
            <h1 className="text-lg font-bold text-[#cbd5e1] tracking-[0.15em] font-mono uppercase">IADES Gateway</h1>
            <p className="text-[10px] text-[#475569] uppercase tracking-[0.15em] mt-1 font-mono">Air Defence Simulator // Secure Access</p>
          </div>
          
          {children}
          
          <div className="text-center mt-6 text-[9px] text-[#475569] font-mono tracking-[0.1em] uppercase">
            SECURE PROTOCOL — EDUCATIONAL ACCESS ONLY
          </div>
        </div>
      </div>
    </div>
  );
}
