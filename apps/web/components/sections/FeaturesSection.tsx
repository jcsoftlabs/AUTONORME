'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function FeaturesSection() {
  const locale = useLocale();
  const t = useTranslations('Features');
  const features = [
    {
      icon: '🛠️',
      color: 'var(--color-primary-700)',
      colorLight: 'var(--color-primary-100)',
      title: t('garage_title'),
      description: t('garage_description'),
      href: '/garages',
      cta: t('garage_cta'),
      highlights: [t('garage_highlight_1'), t('garage_highlight_2'), t('garage_highlight_3')],
    },
    {
      icon: '⚙️',
      color: 'var(--color-primary-500)',
      colorLight: 'var(--color-primary-50)',
      title: t('parts_title'),
      description: t('parts_description'),
      href: '/pieces',
      cta: t('parts_cta'),
      highlights: [t('parts_highlight_1'), t('parts_highlight_2'), t('parts_highlight_3')],
    },
    {
      icon: '🤖',
      color: 'var(--color-accent-purple)',
      colorLight: '#EDE9FE',
      title: t('autobot_title'),
      description: t('autobot_description'),
      href: '/autobot',
      cta: t('autobot_cta'),
      highlights: [t('autobot_highlight_1'), t('autobot_highlight_2'), t('autobot_highlight_3')],
    },
  ];

  return (
    <section id="features" className="section" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="container">
        <div className="section-header">
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.875rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-50)',
            color: 'var(--color-primary-500)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: 'var(--space-md)',
          }}>{t('badge')}</span>
          <h2 className="section-title">
            {t('title_line_1')}<br />
            <span style={{ color: 'var(--color-primary-500)' }}>{t('title_line_2')}</span>
          </h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </div>

        <style>{`
          .features-grid { grid-template-columns: 1fr !important; }
          @media (min-width: 640px) { .features-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (hover: hover) {
            .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg) !important; }
          }
          .feature-card:active { transform: scale(0.98); }
        `}</style>

        <div className="features-grid" style={{ display: 'grid', gap: 'var(--space-xl)' }}>
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="card feature-card"
              style={{
                padding: 'var(--space-2xl)',
                animationDelay: `${i * 0.15}s`,
                transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Icône */}
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  background: feature.colorLight,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                {feature.icon}
              </div>

              {/* Titre */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.375rem',
                  color: 'var(--color-neutral-900)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
                {feature.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
                {feature.highlights.map((h) => (
                  <span
                    key={h}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      background: feature.colorLight,
                      color: feature.color,
                      border: `1px solid ${feature.color}22`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}${feature.href}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: feature.color,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  minHeight: '48px',
                  transition: 'gap var(--transition-fast)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.75rem'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.375rem'; }}
              >
                {feature.cta}
                <span style={{ fontSize: '1.125rem' }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
