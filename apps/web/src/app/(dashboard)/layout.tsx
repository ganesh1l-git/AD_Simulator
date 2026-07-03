import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="ml-[220px] transition-all duration-200">
        <Header />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
