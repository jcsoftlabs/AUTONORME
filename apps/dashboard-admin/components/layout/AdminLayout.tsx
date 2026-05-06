'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar - Fixe à gauche */}
      <Sidebar />

      {/* Zone de contenu principale */}
      <div className="flex-1 flex flex-col pl-72">
        <Header />
        <main className="p-8 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
