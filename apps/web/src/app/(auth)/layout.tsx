'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b12] text-[#e5e7eb] flex items-center justify-center relative px-4 overflow-hidden">
      {/* Background Matrix/Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,136,0.02),rgba(0,0,0,0),rgba(0,180,216,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      
      {/* Dynamic ambient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00ff88]/[0.02] filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#00b4d8]/[0.02] filter blur-[80px] pointer-events-none" />
      
      {/* Outer border wrapper */}
      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00b4d8] text-[#0a0e17] font-black text-xl mb-3 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            IA
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">IADES HQ GATEWAY</h1>
          <p className="text-xs text-[#6b7280] uppercase tracking-widest mt-1">Indian Air Defence Simulator</p>
        </div>
        
        {children}
        
        <div className="text-center mt-6 text-[10px] text-[#4b5563]">
          SECURE PROTOCOL • EDUCATIONAL ACCESS ONLY
        </div>
      </div>
    </div>
  );
}
