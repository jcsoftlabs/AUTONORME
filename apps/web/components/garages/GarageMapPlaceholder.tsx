import { useTranslations } from 'next-intl';

export default function GarageMapPlaceholder() {
  const t = useTranslations('Garages');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--color-neutral-100)',
        borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--color-neutral-300)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-2xl)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '4rem',
          height: '4rem',
          background: 'var(--color-primary-100)',
          color: 'var(--color-primary-600)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          marginBottom: 'var(--space-lg)',
        }}
      >
        🗺️
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-neutral-800)', marginBottom: '0.5rem' }}>
        Carte Interactive
      </h3>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '280px' }}>
        {t('map_placeholder')}
      </p>
      
      {/* Decorative map elements */}
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-sm)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '0.5rem', height: '0.5rem', background: 'var(--color-neutral-300)', borderRadius: '50%' }} />
        ))}
      </div>
    </div>
  );
}
