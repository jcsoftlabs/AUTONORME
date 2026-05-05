'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Account');
  const [isMounted, setIsMounted] = useState(false);

  const isLoginPage = pathname.includes('/login');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated && !isLoginPage) {
      router.push(`/${locale}/compte/login`);
    }
  }, [isMounted, isAuthenticated, router, locale, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Éviter le mismatch d'hydratation
  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-neutral-50)' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--color-primary-600)' }}>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-neutral-50)', fontFamily: 'var(--font-body)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>{t('restricted_title')}</h2>
        <p style={{ color: 'var(--color-neutral-500)', marginBottom: '1.5rem' }}>{t('redirecting')}</p>
        <Link href={`/${locale}/compte/login`} style={{ color: 'var(--color-primary-600)', textDecoration: 'underline' }}>
          {t('manual_redirect')}
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    {
      label: t('nav_overview'), href: `/${locale}/compte`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
      emoji: '📊',
    },
    {
      label: t('nav_appointments'), href: `/${locale}/compte/rendez-vous`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
      emoji: '📅',
    },
    {
      label: t('nav_vehicle'), href: `/${locale}/compte/vehicules`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>),
      emoji: '🚗',
    },
    {
      label: t('nav_orders'), href: `/${locale}/compte/commandes`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
      emoji: '📦',
    },
    {
      label: t('nav_profile'), href: `/${locale}/compte/profil`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
      emoji: '👤',
    },
    {
      label: t('nav_maintenance'), href: `/${locale}/compte/maintenance`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
      emoji: '🛎️',
    },
    {
      label: t('nav_notifications'), href: `/${locale}/compte/notifications`,
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
      emoji: '🔔',
    },
  ];

  // 5 items affichés dans la bottom bar mobile
  const bottomNavItems = navItems.slice(0, 5);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-neutral-50)', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar Desktop */}
      <aside style={{ width: '260px', background: 'var(--color-primary-900)', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }} className="desktop-sidebar">
        <style>{`
          @media (max-width: 1023px) {
            .desktop-sidebar { display: none !important; }
          }
        `}</style>
        
        <div style={{ padding: 'var(--space-xl)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Image src="/log.png" alt="AUTONORME" width={160} height={40} style={{ objectFit: 'contain' }} />
        </div>

        <nav style={{ flex: 1, padding: 'var(--space-lg) 0' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem var(--space-xl)',
                      color: isActive ? '#FFFFFF' : 'var(--color-primary-200)',
                      background: isActive ? 'var(--color-primary-800)' : 'transparent',
                      textDecoration: 'none',
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? '4px solid var(--color-accent-gold)' : '4px solid transparent',
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.emoji}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: 'var(--space-xl)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', color: 'var(--color-primary-200)', cursor: 'pointer', fontSize: '0.9375rem', padding: 0 }}
          >
            🚪 {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header */}
        <div style={{ background: '#FFFFFF', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }} className="mobile-header">
           <style>{`
            @media (min-width: 1024px) {
              .mobile-header { display: none !important; }
              .mobile-bottom-nav { display: none !important; }
            }
            @media (max-width: 640px) {
              .account-content { padding: 1.25rem !important; padding-bottom: calc(1.25rem + 72px) !important; }
            }
          `}</style>
          <Image src="/log.png" alt="AUTONORME" width={120} height={30} style={{ objectFit: 'contain' }} />
          <button
            onClick={handleLogout}
            aria-label={t('logout')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '9999px',
              border: '1px solid var(--color-neutral-200)',
              background: '#FFFFFF',
              color: 'var(--color-neutral-700)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Dynamic Content — extra padding-bottom on mobile for bottom nav */}
        <div className="account-content" style={{ padding: 'var(--space-2xl)', flex: 1, overflowY: 'auto', paddingBottom: 'calc(var(--space-2xl) + 72px)' }}>
          {children}
        </div>

        {/* ── Bottom Tab Bar (Mobile) ─────────────────────────────── */}
        <nav
          className="mobile-bottom-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            background: '#ffffff',
            borderTop: '1px solid var(--color-neutral-200)',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-around',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            zIndex: 100,
          }}
        >
          {bottomNavItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-400)',
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'color 0.15s',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                }}
              >
                <span style={{ color: isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-400)' }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
