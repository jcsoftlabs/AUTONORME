'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('Common');
  const locale = useLocale();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const isActive = (path: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(1).join('/');
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  const navGroups = [
    {
      label: 'Général',
      items: [
        { label: 'Vue d\'ensemble', path: '/', icon: '📊' },
        { label: 'Mes Rendez-vous', path: '/appointments', icon: '📅' },
      ],
    },
    {
      label: 'Opérations',
      items: [
        { label: 'Clients', path: '/customers', icon: '👥' },
        { label: 'Historique Services', path: '/history', icon: '📜' },
      ],
    },
    {
      label: 'Garage',
      items: [
        { label: 'Mon Profil', path: '/profile', icon: '🏠' },
        { label: 'Paramètres', path: '/settings', icon: '⚙️' },
      ],
    },
  ];

  const withLocale = (path: string) => (path === '/' ? `/${locale}` : `/${locale}${path}`);

  const handleLogout = () => {
    localStorage.removeItem('garage_token');
    window.location.href = `/${locale}/login`;
  };

  return (
    <aside className="admin-sidebar h-full">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link href={`/${locale}`} onClick={handleLinkClick} style={{ display: 'flex', flexDirection: 'column', gap: '4px', textDecoration: 'none', flex: 1 }}>
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
            Garage Portal
          </div>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                key={item.path}
                href={withLocale(item.path)}
                onClick={handleLinkClick}
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
            transition: 'all 0.15s ease',
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
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
