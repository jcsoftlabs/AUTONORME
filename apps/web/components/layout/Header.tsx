'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../lib/store/useCartStore';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomePage = pathname === '/fr' || pathname === '/ht' || pathname === '/en' || pathname === '/';
  const solidHeader = !isHomePage || isScrolled;

  const navLinks = [
    { href: '/garages', label: t('garages') },
    { href: '/pieces', label: t('parts') },
    { href: '/maintenance', label: t('maintenance') },
    { href: '/autobot', label: t('autobot') },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-sticky)' as unknown as number,
        transition: 'all var(--transition-base)',
        background: solidHeader ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        backdropFilter: solidHeader ? 'blur(20px)' : 'none',
        borderBottom: solidHeader ? '1px solid var(--color-neutral-200)' : '1px solid transparent',
        boxShadow: solidHeader ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '5rem',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-mobile-btn"
              aria-label={t('menu')}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                marginRight: '0.5rem',
                minHeight: '44px',
                minWidth: '44px',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '22px',
                    height: '2px',
                    background: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                    borderRadius: '2px',
                    transition: 'all var(--transition-fast)',
                  }}
                />
              ))}
            </button>

            <div className="nav-desktop" style={{ width: '100%', maxWidth: '280px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: solidHeader ? 'var(--color-neutral-100)' : 'rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 1rem',
                  border: solidHeader ? '1px solid var(--color-neutral-200)' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={solidHeader ? 'var(--color-neutral-500)' : 'rgba(255,255,255,0.7)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '8px' }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                    fontSize: '0.875rem',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/log.png"
                alt="AUTONORME"
                width={200}
                height={50}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div className="nav-desktop">
              <LanguageSwitcher isSolid={solidHeader} />
            </div>
            <Link
              href={`/${locale}/panier`}
              style={{
                color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {mounted && itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'var(--color-accent-gold)',
                  color: 'var(--color-primary-900)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #FFFFFF'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href={`/${locale}/compte/login`}
              style={{
                color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                padding: '0.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="nav-desktop">{t('login')}</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="nav-desktop"
        style={{
          borderTop: solidHeader ? '1px solid var(--color-neutral-200)' : '1px solid rgba(255,255,255,0.1)',
          background: solidHeader ? 'transparent' : 'rgba(0,0,0,0.2)',
        }}
      >
        <div className="container">
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-xl)',
              listStyle: 'none',
              margin: 0,
              padding: '0.75rem 0',
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href}`}
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: solidHeader ? 'var(--color-neutral-600)' : 'rgba(255,255,255,0.8)',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = solidHeader ? 'var(--color-primary-600)' : '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = solidHeader ? 'var(--color-neutral-600)' : 'rgba(255,255,255,0.8)';
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-neutral-200)',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-neutral-100)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-neutral-800)',
                  fontSize: '1rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-neutral-700)',
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: 'var(--space-md)', borderTop: '1px solid var(--color-neutral-200)', paddingTop: 'var(--space-md)' }}>
              <LanguageSwitcher isSolid={true} />
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
