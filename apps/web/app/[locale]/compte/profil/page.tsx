'use client';

import { useTranslations } from 'next-intl';
import styles from '../../../../components/account.module.css';

export default function ProfilPage() {
  const t = useTranslations('Account');

  const profileFields = [1, 2, 3, 4].map((item) => ({
    label: t(`profile_field_${item}_label`),
    value: t(`profile_field_${item}_value`),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('profile_title')}</h1>
          <p className={styles.subtitle}>{t('profile_subtitle')}</p>
        </div>
      </div>

      <div className={styles.twoCol}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>{t('profile_identity_title')}</h2>
          <div className={styles.dataGrid}>
            {profileFields.map((field) => (
              <div key={field.label} className={styles.dataCell}>
                <span className={styles.dataLabel}>{field.label}</span>
                <span className={styles.dataValue}>{field.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>{t('profile_security_title')}</h2>
          <p className={styles.cardText}>{t('profile_security_body')}</p>
          <div className={styles.list}>
            {[1, 2].map((item) => (
              <div key={item} className={styles.listItem}>
                <div>
                  <span className={styles.itemLabel}>{t(`profile_security_${item}_title`)}</span>
                  <div className={styles.itemMeta}>{t(`profile_security_${item}_body`)}</div>
                </div>
                <span className={`${styles.badge} ${styles.badgePrimary}`}>{t('profile_security_status')}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
