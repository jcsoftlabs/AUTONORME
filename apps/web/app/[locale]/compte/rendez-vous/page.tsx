'use client';

import { useTranslations } from 'next-intl';
import styles from '../../../../components/account.module.css';

export default function RendezVousPage() {
  const t = useTranslations('Account');

  const appointments = [1, 2, 3].map((item) => ({
    title: t(`appointment_${item}_title`),
    service: t(`appointment_${item}_service`),
    schedule: t(`appointment_${item}_schedule`),
    location: t(`appointment_${item}_location`),
    status: t(`appointment_${item}_status`),
    tone: item === 1 ? styles.badgePrimary : item === 2 ? styles.badgeWarning : styles.badgeSuccess,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('appointments_title_new')}</h1>
          <p className={styles.subtitle}>{t('appointments_subtitle_new')}</p>
        </div>
        <div className={styles.pillRow}>
          <span className={styles.pill}>{t('appointments_pill_1')}</span>
          <span className={styles.pill}>{t('appointments_pill_2')}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('appointments_list_title')}</h2>
        <p className={styles.cardText}>{t('appointments_list_body')}</p>

        <div className={styles.list}>
          {appointments.map((appointment) => (
            <div key={`${appointment.title}-${appointment.schedule}`} className={styles.listItem}>
              <div>
                <span className={styles.itemLabel}>{appointment.title}</span>
                <div className={styles.itemMeta}>{appointment.service}</div>
                <div className={styles.itemMeta}>
                  {appointment.schedule} • {appointment.location}
                </div>
              </div>
              <span className={`${styles.badge} ${appointment.tone}`}>{appointment.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
