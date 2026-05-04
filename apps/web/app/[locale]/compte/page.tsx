'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../../../components/account.module.css';
import { fetchAuthenticatedApi } from '../../../lib/authenticated-api';

type VehicleSummary = {
  id: string;
  make: string;
  model: string;
  year: number;
  isPrimaryVehicle: boolean;
  openRemindersCount: number;
  maintenanceRecordsCount: number;
};

export default function DashboardOverview() {
  const { user, token } = useAuthStore();
  const locale = useLocale();
  const t = useTranslations('Account');
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);

  useEffect(() => {
    if (!token) return;

    fetchAuthenticatedApi<VehicleSummary[]>('/vehicles', token)
      .then(setVehicles)
      .catch(() => setVehicles([]));
  }, [token]);

  const primaryVehicle = vehicles.find((vehicle) => vehicle.isPrimaryVehicle) || vehicles[0];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('dashboard_greeting', { name: user?.firstName || t('customer_fallback') })}</h1>
          <p className={styles.subtitle}>{t('dashboard_intro')}</p>
        </div>
        <div className={styles.pillRow}>
          <span className={styles.pill}>{t('dashboard_pill_1')}</span>
          <span className={styles.pill}>{t('dashboard_pill_2')}</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t('stat_appointments')}</span>
          <span className={styles.statValue}>1</span>
          <span className={styles.statHint}>{t('appointment_hint')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t('stat_orders')}</span>
          <span className={styles.statValue}>2</span>
          <span className={styles.statHint}>{t('orders_hint')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t('stat_vehicles')}</span>
          <span className={styles.statValue}>{vehicles.length || 0}</span>
          <span className={styles.statHint}>{vehicles.length ? t('vehicle_count_hint', { count: vehicles.length }) : t('vehicle_hint')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t('dashboard_maintenance_stat')}</span>
          <span className={styles.statValue}>
            {vehicles.reduce((sum, vehicle) => sum + vehicle.openRemindersCount, 0)}
          </span>
          <span className={styles.statHint}>{t('dashboard_maintenance_hint')}</span>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('quick_actions')}</h2>
            <div className={styles.grid2}>
              <Link href={`/${locale}/compte/rendez-vous`} className="btn btn-outline">
                {t('quick_manage_appointments')}
              </Link>
              <Link href={`/${locale}/compte/maintenance`} className="btn btn-outline">
                {t('quick_plan_maintenance')}
              </Link>
              <Link href={`/${locale}/pieces`} className="btn btn-outline">
                {t('quick_buy_parts')}
              </Link>
              <Link href={`/${locale}/autobot`} className="btn btn-outline">
                {t('quick_ask_autobot')}
              </Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_alerts_title')}</h2>
            <div className={styles.list}>
              {[1, 2].map((item) => (
                <div key={item} className={styles.listItem}>
                  <div>
                    <span className={styles.itemLabel}>{t(`dashboard_alert_${item}_title`)}</span>
                    <div className={styles.itemMeta}>{t(`dashboard_alert_${item}_body`)}</div>
                  </div>
                  <span className={`${styles.badge} ${item === 1 ? styles.badgeWarning : styles.badgePrimary}`}>
                    {t(`dashboard_alert_${item}_status`)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_vehicle_focus_title')}</h2>
            <p className={styles.cardText}>
              {primaryVehicle
                ? t('dashboard_vehicle_focus_live', {
                    vehicle: `${primaryVehicle.make} ${primaryVehicle.model} ${primaryVehicle.year}`,
                    records: primaryVehicle.maintenanceRecordsCount,
                    reminders: primaryVehicle.openRemindersCount,
                  })
                : t('dashboard_vehicle_focus_body')}
            </p>
            <div className={styles.ctaRow}>
              <Link href={primaryVehicle ? `/${locale}/compte/vehicules/${primaryVehicle.id}` : `/${locale}/compte/vehicules`} className="btn btn-primary">
                {t('dashboard_vehicle_focus_cta')}
              </Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_notifications_title')}</h2>
            <p className={styles.cardText}>{t('dashboard_notifications_body')}</p>
            <div className={styles.ctaRow}>
              <Link href={`/${locale}/compte/notifications`} className="btn btn-outline">
                {t('dashboard_notifications_cta')}
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
