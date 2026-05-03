'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../../../../components/account.module.css';

export default function VehiculesPage() {
  const t = useTranslations('Account');
  const locale = useLocale();

  const vehicles = [1, 2].map((item) => ({
    id: item === 1 ? 'rav4-2019' : 'corolla-2016',
    name: t(`vehicle_${item}_name`),
    meta: t(`vehicle_${item}_meta`),
    status: t(`vehicle_${item}_status`),
    score: t(`vehicle_${item}_score`),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('vehicles_title')}</h1>
          <p className={styles.subtitle}>{t('vehicles_subtitle')}</p>
        </div>
        <Link href={`/${locale}/compte/vehicules/rav4-2019`} className="btn btn-primary">
          {t('vehicles_primary_cta')}
        </Link>
      </div>

      <div className={styles.grid2}>
        {vehicles.map((vehicle) => (
          <article key={vehicle.id} className={styles.card}>
            <div className={styles.vehicleCard}>
              <div className={styles.vehicleIcon}>🚗</div>
              <div>
                <h2 className={styles.cardTitle}>{vehicle.name}</h2>
                <p className={styles.cardText}>{vehicle.meta}</p>
                <div className={styles.pillRow} style={{ marginTop: '1rem' }}>
                  <span className={styles.pill}>{vehicle.status}</span>
                  <span className={styles.pill}>{vehicle.score}</span>
                </div>
                <div className={styles.ctaRow}>
                  <Link href={`/${locale}/compte/vehicules/${vehicle.id}`} className="btn btn-outline">
                    {t('vehicles_view_cta')}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
