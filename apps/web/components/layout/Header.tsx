'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { useCartStore } from '../../lib/store/useCartStore';

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/fr' || pathname === '/ht' || pathname === '/en' || pathname === '/';
  const solidHeader = !isHomePage || isScrolled;

  const navLinks = [
    { href: '/garages', label: t('garages') },
    { href: '/pieces', label: t('parts') },
    { href: '/maintenance', label: t('maintenance') },
    { href: '/autobot', label: t('autobot') },
  ];
  const utilityLinks = [
    { href: '/a-propos', label: t('support_center'), icon: 'support' },
    { href: 'tel:+50900000000', label: t('call_us'), icon: 'phone', external: true },
    { href: '/blog', label: t('blog'), icon: 'blog' },
  ];

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
        backdropFilter: solidHeader ? 'blur(18px)' : 'none',
        borderBottom: solidHeader ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent',
        boxShadow: solidHeader ? '0 14px 30px rgba(15, 23, 42, 0.08)' : 'none',
      }}
    >
      <div
        className="nav-desktop"
        style={{
          background: solidHeader ? 'var(--color-primary-900)' : 'rgba(0, 24, 72, 0.85)',
          color: '#FFFFFF',
          borderBottom: solidHeader ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="container"
          style={{
            minHeight: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          <span>{t('promo_bar')}</span>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(280px, 1fr) auto',
            alignItems: 'center',
            gap: '0.85rem',
            minHeight: '5.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsMenuOpen((value) => !value)}
              className="nav-mobile-btn"
              aria-label={t('menu')}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
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
                  }}
                />
              ))}
            </button>

            <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/log.png"
                alt="AUTONORME"
                width={224}
                height={50}
                unoptimized
                priority
                style={{ objectFit: 'contain', width: 'auto', height: '50px' }}
              />
            </Link>
          </div>

          <div className="nav-desktop">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minHeight: '3rem',
                padding: '0 1rem',
                borderRadius: '0.95rem',
                border: solidHeader ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255,255,255,0.24)',
                background: solidHeader ? '#FFFFFF' : 'rgba(255,255,255,0.12)',
                boxShadow: solidHeader ? '0 8px 18px rgba(15, 23, 42, 0.05)' : 'none',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={solidHeader ? 'var(--color-neutral-500)' : 'rgba(255,255,255,0.75)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                  fontSize: '0.96rem',
                  fontWeight: 500,
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.55rem' }}>
            <div className="nav-desktop">
              <LanguageSwitcher isSolid={solidHeader} />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="nav-desktop"
              aria-label={t('menu')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                minHeight: '44px',
                padding: '0.58rem 0.95rem',
                borderRadius: '999px',
                background: solidHeader ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255,255,255,0.12)',
                border: solidHeader ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255,255,255,0.2)',
                color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>{t('menu')}</span>
            </button>

            <Link
              href={`/${locale}/compte/login`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '44px',
                padding: '0.58rem 0.9rem',
                borderRadius: '999px',
                textDecoration: 'none',
                color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                background: solidHeader ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255,255,255,0.12)',
                border: solidHeader ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255,255,255,0.2)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="nav-desktop">{t('login')}</span>
            </Link>

            <Link
              href={`/${locale}/panier`}
              style={{
                color: solidHeader ? 'var(--color-neutral-800)' : '#FFFFFF',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                minWidth: '44px',
                borderRadius: '999px',
                textDecoration: 'none',
                background: solidHeader ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255,255,255,0.12)',
                border: solidHeader ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {mounted && itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
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
                    border: '1px solid #FFFFFF',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Overlay sombre derrière le drawer ───────────────────── */}
      <div
        onClick={() => setIsMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 998,
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.25s ease, visibility 0.25s ease',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* ── Drawer plein écran (style référence) ─────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
        }}
      >
        {/* ── Top bar : ✕ Menu / Account / Cart ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--color-primary-900)',
            padding: '0 1.25rem',
            minHeight: '3.5rem',
            flexShrink: 0,
            background: '#FFFFFF',
          }}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary-900)',
              fontWeight: 800,
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0.5rem',
            }}
          >
            {/* Croix ✕ */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {t('menu')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Account */}
            <Link
              href={`/${locale}/compte/login`}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                color: 'var(--color-primary-900)',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.5rem',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {t('login')}
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/panier`}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                color: 'var(--color-primary-900)',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.5rem',
                position: 'relative',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {mounted && itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--color-accent-gold)',
                    color: 'var(--color-primary-900)',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {itemCount}
                </span>
              )}
              <span style={{ background: 'var(--color-primary-900)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                {mounted ? itemCount : 0}
              </span>
            </Link>
          </div>
        </div>

        {/* ── Liste des liens ── */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
          {utilityLinks.map((link) => (
            <li key={link.href} style={{ borderBottom: '1px solid #e5e7eb' }}>
              {link.external ? (
                <a
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.1rem',
                    minHeight: '4rem',
                    padding: '0 1.5rem',
                    color: '#111827',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {link.icon === 'phone' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z" />
                    </svg>
                  )}
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  href={`/${locale}${link.href}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.1rem',
                    minHeight: '4rem',
                    padding: '0 1.5rem',
                    color: '#111827',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {link.icon === 'support' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                  {link.icon === 'blog' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-900)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      <line x1="8" y1="7" x2="16" y2="7" />
                      <line x1="8" y1="11" x2="16" y2="11" />
                    </svg>
                  )}
                  <span>{link.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-primary-900)', fontSize: '1.1rem' }}>›</span>
                </Link>
              )}
            </li>
          ))}

          {navLinks.map((link) => (
            <li key={link.href} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <Link
                href={`/${locale}${link.href}`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '4rem',
                  padding: '0 1.5rem',
                  color: '#111827',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: 'var(--color-primary-900)', fontSize: '1.1rem' }}>›</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          header .container > div {
            grid-template-columns: auto 1fr auto !important;
            min-height: 4.8rem !important;
          }
        }
      `}</style>
    </header>
  );
}
