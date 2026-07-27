'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useUIStore } from '@/stores/uiStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-[56px]' : 'ml-[220px]'}`}>
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
