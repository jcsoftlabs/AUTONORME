'use client';

import { useTranslations } from 'next-intl';
import styles from '../../../../components/account.module.css';

export default function MaintenanceAccountPage() {
  const t = useTranslations('Account');

  const items = [1, 2, 3].map((item) => ({
    title: t(`maintenance_item_${item}_title`),
    meta: t(`maintenance_item_${item}_meta`),
    status: t(`maintenance_item_${item}_status`),
    tone: item === 1 ? styles.badgeWarning : styles.badgePrimary,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('maintenance_title')}</h1>
          <p className={styles.subtitle}>{t('maintenance_subtitle')}</p>
        </div>
        <div className={styles.pillRow}>
          <span className={styles.pill}>{t('maintenance_pill_1')}</span>
          <span className={styles.pill}>{t('maintenance_pill_2')}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('maintenance_schedule_title')}</h2>
        <p className={styles.cardText}>{t('maintenance_schedule_body')}</p>

        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.title} className={styles.listItem}>
              <div>
                <span className={styles.itemLabel}>{item.title}</span>
                <div className={styles.itemMeta}>{item.meta}</div>
              </div>
              <span className={`${styles.badge} ${item.tone}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
