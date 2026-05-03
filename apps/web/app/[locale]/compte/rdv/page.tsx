'use client';

import { useTranslations } from 'next-intl';

export default function RDVPage() {
  const t = useTranslations('Account');

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
        {t('appointments_title')}
      </h1>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', marginBottom: 'var(--space-2xl)' }}>
        {t('appointments_subtitle')}
      </p>

      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-primary-600)', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-600)', marginBottom: '0.25rem' }}>{t('appointment_upcoming_badge')}</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>{t('appointment_garage_1')}</h3>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', margin: 0 }}>{t('appointment_service_1')}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>{t('appointment_date_1')}</div>
            <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>{t('appointment_location_1')}</div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-neutral-300)', opacity: 0.7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>{t('appointment_done_badge')}</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>{t('appointment_garage_2')}</h3>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', margin: 0 }}>{t('appointment_service_2')}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-600)' }}>{t('appointment_date_2')}</div>
            <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>{t('appointment_location_2')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
