'use client';

import { useTranslations } from 'next-intl';

export default function CommandesPage() {
  const t = useTranslations('Account');

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
        {t('orders_title')}
      </h1>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', marginBottom: 'var(--space-2xl)' }}>
        {t('orders_subtitle')}
      </p>

      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-accent-gold)', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>{t('order_label', { id: 'ORD-98234' })}</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>{t('order_item_brakes')}</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>4 500 HTG</div>
            <span style={{ display: 'inline-block', background: '#FEF08A', color: '#854D0E', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {t('order_status_shipping')}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)' }}>
          <p style={{ margin: 0 }}>{t('delivery_estimate')} <strong>{t('delivery_tomorrow')}</strong></p>
        </div>
      </div>
      
      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-primary-600)', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>{t('order_label', { id: 'ORD-88122' })}</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>{t('order_item_battery')}</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>12 000 HTG</div>
            <span style={{ display: 'inline-block', background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}>
              {t('order_status_preparing')}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)' }}>
          <p style={{ margin: 0 }}>{t('delivery_estimate')} <strong>{t('delivery_two_days')}</strong></p>
        </div>
      </div>

    </div>
  );
}
