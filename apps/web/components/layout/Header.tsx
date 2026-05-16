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

  const trustItems = [t('trust_fit'), t('trust_network'), t('trust_support')];

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
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          <span>{t('promo_bar')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.9)' }}>
            {trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto minmax(280px, 1fr) auto',
            alignItems: 'center',
            gap: '0.85rem',
            minHeight: '4.9rem',
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
                width={178}
                height={40}
                unoptimized
                priority
                style={{ objectFit: 'contain', width: 'auto', height: '40px' }}
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

      {isMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            padding: '1rem',
            boxShadow: '0 18px 30px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-neutral-100)',
                borderRadius: '0.95rem',
                padding: '0.8rem 1rem',
                marginBottom: '1rem',
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

            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.55rem', margin: 0, padding: 0 }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.95rem 1rem',
                      borderRadius: '0.95rem',
                      color: 'var(--color-neutral-800)',
                      background: 'var(--color-neutral-50)',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {trustItems.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: '2.2rem',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '999px',
                      background: 'rgba(0, 46, 122, 0.06)',
                      color: 'var(--color-primary-900)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <LanguageSwitcher isSolid={true} />
                <Link
                  href={`/${locale}/compte/login`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '44px',
                    padding: '0 1rem',
                    borderRadius: '999px',
                    background: 'var(--color-primary-900)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  {t('login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
