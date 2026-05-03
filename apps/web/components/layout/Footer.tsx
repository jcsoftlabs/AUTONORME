'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

const socialLinks = [
  { href: '#', label: 'WhatsApp', icon: '💬' },
  { href: '#', label: 'Facebook', icon: '📘' },
  { href: '#', label: 'Instagram', icon: '📸' },
  { href: '#', label: 'LinkedIn', icon: '💼' },
];

export default function Footer() {
  const t = useTranslations('Footer');

  const footerLinks = {
    plateforme: [
      { href: '/garages', label: t('find_garage') },
      { href: '/pieces', label: t('parts') },
      { href: '/maintenance', label: t('maintenance') },
      { href: '/autobot', label: t('autobot') },
    ],
    entreprise: [
      { href: '/a-propos', label: t('about') },
      { href: '/blog', label: t('blog') },
      { href: '/rejoindre', label: t('join') },
      { href: '/contact', label: t('contact') },
    ],
    professionnels: [
      { href: '#', label: t('dash_garage') },
      { href: '#', label: t('dash_supplier') },
      { href: '#', label: t('api') },
      { href: '#', label: t('docs') },
    ],
  };

  return (
    <footer
      style={{
        background: 'var(--color-neutral-950)',
        color: 'var(--color-neutral-400)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Section principale */}
      <div className="container" style={{ padding: 'var(--space-5xl) var(--space-lg)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3xl)',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <Image
                src="/log.png"
                alt="AUTONORME"
                width={160}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: 'var(--space-lg)', maxWidth: '260px' }}>
              {t('desc')}
            </p>
            {/* Réseaux sociaux */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              {socialLinks.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    minHeight: '44px',
                    minWidth: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '1.125rem',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary-700)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-primary-500)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Liens Plateforme */}
          <FooterColumn title={t('platform')} links={footerLinks.plateforme} />
          <FooterColumn title={t('company')} links={footerLinks.entreprise} />
          <FooterColumn title={t('professionals')} links={footerLinks.professionnels} />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: 0 }} />

      {/* Bas de page */}
      <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ fontSize: '0.875rem' }}>
            {t('rights', { year: new Date().getFullYear() })}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {[{key: 'privacy', label: t('privacy')}, {key: 'terms', label: t('terms')}, {key: 'cookies', label: t('cookies')}].map((item) => (
              <Link
                key={item.key}
                href="#"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-500)',
                  transition: 'color var(--transition-fast)',
                  minHeight: 'auto',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-neutral-500)'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            {['🇫🇷 FR', '🇭🇹 HT', '🇺🇸 EN'].map((lang) => (
              <button
                key={lang}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--color-neutral-400)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.625rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  minHeight: '44px',
                  fontFamily: 'var(--font-body)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: '#FFFFFF',
          marginBottom: 'var(--space-lg)',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-neutral-500)',
                transition: 'color var(--transition-fast)',
                display: 'inline-block',
                minHeight: 'auto',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary-300)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-neutral-500)'; }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
