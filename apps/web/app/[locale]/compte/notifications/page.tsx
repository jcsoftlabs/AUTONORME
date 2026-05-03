'use client';

import { useTranslations } from 'next-intl';
import styles from '../../../../components/account.module.css';

export default function NotificationsPage() {
  const t = useTranslations('Account');

  const notifications = [1, 2, 3].map((item) => ({
    title: t(`notification_${item}_title`),
    body: t(`notification_${item}_body`),
    status: t(`notification_${item}_status`),
    tone: item === 1 ? styles.badgeWarning : item === 2 ? styles.badgePrimary : styles.badgeSuccess,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('notifications_title')}</h1>
          <p className={styles.subtitle}>{t('notifications_subtitle')}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('notifications_center_title')}</h2>
        <div className={styles.list}>
          {notifications.map((notification) => (
            <div key={notification.title} className={styles.listItem}>
              <div>
                <span className={styles.itemLabel}>{notification.title}</span>
                <div className={styles.itemMeta}>{notification.body}</div>
              </div>
              <span className={`${styles.badge} ${notification.tone}`}>{notification.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
