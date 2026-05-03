'use client';

import { useTranslations } from 'next-intl';

export default function VehiculePage() {
  const t = useTranslations('Account');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
            {t('vehicle_title')}
          </h1>
          <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', margin: 0 }}>
            {t('vehicle_subtitle')}
          </p>
        </div>
        <button className="btn btn-primary">+ {t('vehicle_add')}</button>
      </div>

      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid #16A34A' }}>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            🚙
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>
              Toyota RAV4
            </h2>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>
              <span><strong>{t('vehicle_year_label')}</strong> 2019</span>
              <span><strong>{t('vehicle_engine_label')}</strong> 2.5L 4-cyl</span>
              <span><strong>VIN:</strong> JTMBREXV9JD******</span>
            </div>
          </div>
          <div>
            <button className="btn btn-sm btn-outline">{t('vehicle_edit')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
