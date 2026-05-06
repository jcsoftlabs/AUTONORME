'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Common');

  // Helper pour savoir si un lien est actif
  const isActive = (path: string) => {
    // On ignore la locale dans le pathname pour la comparaison
    const segments = pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(1).join('/');
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  const navItems = [
    { label: t('dashboard'), path: '/', icon: '📊' },
    { label: t('garages'), path: '/partners/garages', icon: '🛠️' },
    { label: t('suppliers'), path: '/partners/suppliers', icon: '📦' },
    { label: t('featuredModels'), path: '/content/featured-models', icon: '🚗' },
    { label: t('users'), path: '/users', icon: '👥' },
    { label: t('settings'), path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white text-xl font-black group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#FF6B00] transition-colors">
            AUTO<span className="text-[#FF6B00]">NORME</span>
          </span>
        </Link>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold px-1">
          Admin Control Panel
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={isActive(item.path) ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-6 border-t border-gray-50">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-colors font-medium">
          <span>🚪</span>
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
