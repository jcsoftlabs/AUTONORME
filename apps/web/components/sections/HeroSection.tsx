import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 50%, var(--color-primary-500) 100%)',
      }}
    >
      {/* Fond structuré Pro */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Lignes diagonales subtiles / texture mécanique */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 12px)`,
            backgroundSize: '100% 100%',
          }}
        />
        {/* Gradient en overlay pour profondeur et lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,31,92,0.8) 0%, rgba(0,31,92,0.4) 50%, transparent 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '11rem', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '760px' }}>

          {/* Badge */}
          <div
            className="animate-fade-up"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-xl)'
            }}
          >
            {t('badge')}
          </div>

          {/* Titre principal */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(1.875rem, 6vw, 5rem)',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: 'var(--space-xl)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('title_start')}{' '}
            <span className="text-gradient-gold">{t('title_highlight')}</span>
            <br />
            {t('title_end')}
          </h1>

          {/* Sous-titre */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              maxWidth: '580px',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            {t('subtitle')} <strong style={{ color: '#FFFFFF' }}>{t('subtitle_strong')}</strong> {t('subtitle_end')}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <style>{`
              @media (max-width: 640px) {
                .hero-ctas { flex-direction: column !important; }
                .hero-ctas a { width: 100%; justify-content: center; min-height: 52px; }
              }
            `}</style>
            <div className="hero-ctas" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
              <Link href={`/${locale}/garages`} className="btn btn-lg" style={{ background: '#FFFFFF', color: 'var(--color-primary-900)', fontWeight: 700, borderRadius: 'var(--radius-sm)' }}>
                {t('find_garage')}
              </Link>
              <Link href={`/${locale}/pieces`} className="btn btn-lg" style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.3)', fontWeight: 700, borderRadius: 'var(--radius-sm)' }}>
                Catalogue de pièces
              </Link>
            </div>
          </div>

          {/* Stat Bar */}
          <div
            className="animate-fade-up delay-400"
            style={{
              display: 'flex',
              gap: 0,
              marginTop: 'var(--space-3xl)',
              background: 'var(--color-primary-800)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '200+', label: t('stat_garages') },
              { value: '5 000+', label: t('stat_parts') },
              { value: '3', label: t('stat_langs') },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  padding: 'var(--space-lg) var(--space-xl)',
                  textAlign: 'center',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
                  color: 'var(--color-accent-gold)',
                  lineHeight: 1,
                  marginBottom: '0.25rem',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary-100)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
