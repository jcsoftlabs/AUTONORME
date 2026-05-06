'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Common');

  const isActive = (path: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const currentPath = '/' + segments.slice(1).join('/');
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
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
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">A</div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'white', letterSpacing: '-0.01em' }}>
            AUTO<span style={{ color: 'var(--color-gold)' }}>NORME</span>
          </div>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: '1px' }}>
            Admin Panel
          </div>
        </div>
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
