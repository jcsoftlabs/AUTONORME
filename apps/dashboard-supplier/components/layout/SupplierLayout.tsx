'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Common');

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
      {/* Sidebar */}
      <aside className="supplier-sidebar">
        <div className="p-8">
          <Link href="/" className="flex flex-col gap-2 group decoration-transparent no-underline">
            <Image
              src="/log.png"
              alt="AUTONORME"
              width={160}
              height={40}
              unoptimized
              style={{ 
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)' 
              }}
              priority
            />
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black pl-1">
              Supplier Portal
            </div>
          </Link>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
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
      <main className="supplier-main">
        <header className="supplier-header">
          <div className="flex items-center gap-4">
             <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
             <span className="text-sm font-semibold text-gray-600">Bienvenue sur votre portail fournisseur</span>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900">Espace Fournisseur</span>
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">● Connecté</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold">
                F
             </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
