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
    { label: t('nav_overview'), href: `/${locale}/compte`, icon: '📊' },
    { label: t('nav_appointments'), href: `/${locale}/compte/rdv`, icon: '📅' },
    { label: t('nav_orders'), href: `/${locale}/compte/commandes`, icon: '📦' },
    { label: t('nav_vehicle'), href: `/${locale}/compte/vehicule`, icon: '🚗' },
  ];

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
                    <span>{item.icon}</span>
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
            }
          `}</style>
          <Image src="/log.png" alt="AUTONORME" width={120} height={30} style={{ objectFit: 'contain' }} />
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>🚪</button>
        </div>

        {/* Dynamic Content */}
        <div style={{ padding: 'var(--space-2xl)', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
