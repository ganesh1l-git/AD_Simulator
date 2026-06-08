'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.auth.login({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Invalid operational coordinates.');
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    setEmail('demo@iades.edu');
    setPassword('demo123');
    setLoading(true);
    setError('');

    api.auth.login({ email: 'demo@iades.edu', password: 'demo123' })
      .then(() => {
        router.push('/');
      })
      .catch((err: any) => {
        setError(err?.message || 'Failed to authenticate guest pass.');
        setLoading(false);
      });
  };

  return (
    <div className="card p-6 border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider text-center mb-6">
        Personnel Sign In
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-[#ef4444]/10 border border-[#ef4444]/20 text-xs text-[#ef4444] font-mono">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] text-[#6b7280] uppercase tracking-widest font-semibold mb-1.5">
            Operational Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.edu.in"
            className="w-full px-3 py-2 rounded bg-[#070b12] border border-white/10 text-sm text-white placeholder-[#4b5563] focus:border-[#00ff88]/30 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] text-[#6b7280] uppercase tracking-widest font-semibold mb-1.5">
            HQ Keyphrase (Password)
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded bg-[#070b12] border border-white/10 text-sm text-white placeholder-[#4b5563] focus:border-[#00ff88]/30 outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded bg-[#00ff88] text-[#0a0e17] font-bold text-xs tracking-wider uppercase hover:bg-[#00e676] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#0a0e17] border-t-transparent animate-spin" />
          ) : (
            'AUTHENTICATE'
          )}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-[11px] text-[#6b7280]">
        <button
          type="button"
          onClick={handleDemoAccess}
          className="hover:text-white transition-colors underline"
        >
          Request Declassified Guest Pass
        </button>
        <Link href="/register" className="text-[#00b4d8] hover:underline">
          Register Cadet
        </Link>
      </div>
    </div>
  );
}
