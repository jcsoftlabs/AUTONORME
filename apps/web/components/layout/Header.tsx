'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/garages', label: 'Garages' },
  { href: '/pieces', label: 'AUTOparts' },
  { href: '/maintenance', label: 'Maintenance' },
  { href: '/autobot', label: 'AutoBot IA' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        background: isScrolled
          ? 'rgba(255, 255, 255, 0.95)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--color-neutral-200)' : '1px solid transparent',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
      }}
    >
      <div className="container">
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4.5rem',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-500))',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 59, 142, 0.3)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.125rem', fontFamily: 'var(--font-heading)' }}>A</span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: isScrolled ? 'var(--color-primary-700)' : '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              AUTO<span style={{ color: isScrolled ? 'var(--color-primary-500)' : 'rgba(255,255,255,0.7)' }}>NORME</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
            className="nav-desktop"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/fr${link.href}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: isScrolled ? 'var(--color-neutral-700)' : 'rgba(255,255,255,0.9)',
                    transition: 'all var(--transition-fast)',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = isScrolled ? 'var(--color-neutral-100)' : 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLAnchorElement).style.color = isScrolled ? 'var(--color-primary-700)' : '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = isScrolled ? 'var(--color-neutral-700)' : 'rgba(255,255,255,0.9)';
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + langue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }} className="nav-desktop">
            <Link href="/fr/compte" className="btn btn-sm btn-outline"
              style={{
                borderColor: isScrolled ? 'var(--color-primary-500)' : 'rgba(255,255,255,0.5)',
                color: isScrolled ? 'var(--color-primary-500)' : '#FFFFFF',
              }}
            >
              Connexion
            </Link>
            <Link href="/fr/garages" className="btn btn-sm btn-primary">
              Trouver un garage
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="nav-mobile-btn"
            aria-label="Menu"
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
                  background: isScrolled ? 'var(--color-neutral-800)' : '#FFFFFF',
                  borderRadius: '2px',
                  transition: 'all var(--transition-fast)',
                }}
              />
            ))}
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-neutral-200)',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/fr${link.href}`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-neutral-700)',
                    fontWeight: 500,
                    minHeight: '44px',
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <Link href="/fr/compte" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Connexion</Link>
              <Link href="/fr/garages" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Trouver un garage</Link>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
