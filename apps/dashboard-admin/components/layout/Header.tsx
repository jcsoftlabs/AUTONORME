'use client';

import { useTranslations } from 'next-intl';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const t = useTranslations('Common');

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        {/* Search Bar - Hidden on small mobile */}
        <div className="relative w-40 md:w-96 hidden xs:block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder={t('search')}
          className="w-full bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 transition-all outline-none"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {/* Language Placeholder */}
        <div className="flex gap-2 text-xs font-bold text-gray-400">
          <span className="text-[#FF6B00]">FR</span>
          <span>HT</span>
          <span>EN</span>
        </div>

        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B00] text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Admin</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-orange-100 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
