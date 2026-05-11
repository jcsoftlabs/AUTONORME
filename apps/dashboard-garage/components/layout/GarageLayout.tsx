'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function GarageLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 hidden sm:inline">Dashboard</span>
              <span className="text-gray-200 hidden sm:inline">/</span>
              <span className="font-semibold">Vue d'ensemble</span>
            </div>
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
