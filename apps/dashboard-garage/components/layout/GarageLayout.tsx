'use client';

import Sidebar from './Sidebar';

export default function GarageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-200">/</span>
            <span className="font-semibold">Vue d'ensemble</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold">Garage Moderne</div>
              <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">En ligne</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-900 border border-primary-200">
              GM
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
