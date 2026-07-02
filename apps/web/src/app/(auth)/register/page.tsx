'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.auth.register({ name, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err?.message || 'Enlistment rejected. Please verify form integrity.');
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider text-center mb-6">
        Personnel Registration
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-[#ef4444]/10 border border-[#ef4444]/20 text-xs text-[#ef4444] font-mono">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] text-[#6b7280] uppercase tracking-widest font-semibold mb-1.5">
            Full Name / Callsign
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cadet / Instructor Name"
            className="w-full px-3 py-2 rounded bg-[#070b12] border border-white/10 text-sm text-white placeholder-[#4b5563] focus:border-[#00ff88]/30 outline-none transition-colors"
          />
        </div>

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
            Role Category
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-3 py-2 rounded bg-[#070b12] border border-white/10 text-sm text-white focus:border-[#00ff88]/30 outline-none transition-colors"
          >
            <option value="STUDENT">Student Cadet</option>
            <option value="INSTRUCTOR">Instructor Officer</option>
          </select>
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
          className="w-full py-2.5 rounded bg-[#00b4d8] text-[#0a0e17] font-bold text-xs tracking-wider uppercase hover:bg-[#0093b2] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#0a0e17] border-t-transparent animate-spin" />
          ) : (
            'ENLIST PERSONNEL'
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-[11px] text-[#6b7280]">
        Already enlisted?{' '}
        <Link href="/login" className="text-[#00ff88] hover:underline">
          Return to HQ Entry
        </Link>
      </div>
    </div>
  );
}
