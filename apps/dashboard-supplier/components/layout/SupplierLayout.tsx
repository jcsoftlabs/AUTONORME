'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '../../lib/store/useAuthStore';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Common');
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(1).join('/');
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  const menuItems = [
    { label: 'Vue d\'ensemble', path: '/', icon: '📊' },
    { label: 'Mon Stock', path: '/inventory', icon: '📦' },
    { label: 'Commandes reçues', path: '/orders', icon: '🛒' },
    { label: 'Mon Profil', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="supplier-layout">
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`supplier-sidebar fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 flex justify-between items-center">
          <Link href="/" className="flex flex-col gap-2 group decoration-transparent no-underline">
            <Image
              src="/log.png"
              alt="AUTONORME"
              width={160}
              height={40}
              unoptimized
              style={{ objectFit: 'contain' }}
              priority
            />
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black pl-1">
              {user?.shopName || 'Supplier Portal'}
            </div>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">✕</button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-400/10 transition-colors font-medium">
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="supplier-main flex-1">
        <header className="supplier-header px-4 md:px-8">
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
             <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
             <span className="text-sm font-semibold text-gray-600 hidden sm:inline">Bienvenue sur votre portail fournisseur</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
             <div className="flex flex-col items-end hidden xs:flex">
                <span className="text-xs font-bold text-gray-900">Espace Fournisseur</span>
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">● Connecté</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
                F
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
