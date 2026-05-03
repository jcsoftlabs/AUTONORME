'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../../../../../components/account.module.css';

export default function VehicleDetailPage() {
  const t = useTranslations('Account');
  const locale = useLocale();

  const specs = [1, 2, 3, 4].map((item) => ({
    label: t(`vehicle_detail_${item}_label`),
    value: t(`vehicle_detail_${item}_value`),
  }));

  const history = [1, 2, 3].map((item) => ({
    title: t(`vehicle_history_${item}_title`),
    meta: t(`vehicle_history_${item}_meta`),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('vehicle_detail_title')}</h1>
          <p className={styles.subtitle}>{t('vehicle_detail_subtitle')}</p>
        </div>
        <div className={styles.pillRow}>
          <span className={styles.pill}>{t('vehicle_detail_score')}</span>
          <span className={styles.pill}>{t('vehicle_detail_reminder')}</span>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_snapshot_title')}</h2>
            <p className={styles.cardText}>{t('vehicle_snapshot_body')}</p>

            <div className={styles.dataGrid}>
              {specs.map((spec) => (
                <div key={spec.label} className={styles.dataCell}>
                  <span className={styles.dataLabel}>{spec.label}</span>
                  <span className={styles.dataValue}>{spec.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_history_title')}</h2>
            <div className={styles.list}>
              {history.map((entry) => (
                <div key={entry.title} className={styles.listItem}>
                  <div>
                    <span className={styles.itemLabel}>{entry.title}</span>
                    <div className={styles.itemMeta}>{entry.meta}</div>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>{t('vehicle_history_done')}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_next_title')}</h2>
            <p className={styles.cardText}>{t('vehicle_next_body')}</p>
            <div className={styles.ctaRow}>
              <Link href={`/${locale}/compte/maintenance`} className="btn btn-primary">
                {t('vehicle_next_cta')}
              </Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_back_title')}</h2>
            <p className={styles.cardText}>{t('vehicle_back_body')}</p>
            <div className={styles.ctaRow}>
              <Link href={`/${locale}/compte/vehicules`} className="btn btn-outline">
                {t('vehicle_back_cta')}
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
