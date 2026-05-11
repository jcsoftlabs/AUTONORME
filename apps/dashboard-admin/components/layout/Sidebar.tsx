'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Sidebar({ isSidebarOpen, onClose }: { isSidebarOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('Common');

  const isActive = (path: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(1).join('/');
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  const locale = useLocale();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = `/${locale}/login`;
  };

  const navGroups = [
    {
      label: 'Général',
      items: [
        { label: t('dashboard'), path: '/', icon: '📊' },
      ],
    },
    {
      label: 'Partenaires',
      items: [
        { label: t('garages'), path: '/partners/garages', icon: '🛠️' },
        { label: t('suppliers'), path: '/partners/suppliers', icon: '📦' },
      ],
    },
    {
      label: 'Contenu',
      items: [
        { label: t('featuredModels'), path: '/content/featured-models', icon: '🚗' },
      ],
    },
    {
      label: 'Système',
      items: [
        { label: t('users'), path: '/users', icon: '👥' },
        { label: t('settings'), path: '/settings', icon: '⚙️' },
      ],
    },
  ];

  return (
    <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo */}
      <div className="sidebar-logo flex justify-between items-center">
        <Link href="/" onClick={onClose} style={{ display: 'flex', flexDirection: 'column', gap: '4px', textDecoration: 'none' }}>
          <Image
            src="/log.png"
            alt="AUTONORME"
            width={160}
            height={40}
            unoptimized
            style={{ 
              objectFit: 'contain'
            }}
            priority
          />
          <div style={{ 
            fontSize: '0.6rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            color: 'rgba(255,255,255,0.4)', 
            fontWeight: 800,
            paddingLeft: '4px'
          }}>
            Admin Panel
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-2">✕</button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', borderRadius: '8px',
            width: '100%', background: 'transparent',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem',
            fontWeight: 500, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
          }}
        >
          <span>🚪</span>
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
