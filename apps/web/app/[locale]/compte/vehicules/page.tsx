'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';

type VehicleSummary = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string | null;
  fuelType: string;
  mileage: number | null;
  primaryCity: string | null;
  primaryZone: string | null;
  vehicleScore: number | null;
  isPrimaryVehicle: boolean;
  openRemindersCount: number;
  maintenanceRecordsCount: number;
};

export default function VehiculesPage() {
  const t = useTranslations('Account');
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);

  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    fetchAuthenticatedApi<VehicleSummary[]>('/vehicles', token)
      .then((data) => setVehicles(data))
      .catch((err: Error) => setError(err.message || t('vehicles_error')))
      .finally(() => setIsLoading(false));
  }, [token, t]);

  const primaryVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.isPrimaryVehicle) || vehicles[0],
    [vehicles],
  );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('vehicles_title')}</h1>
          <p className={styles.subtitle}>{t('vehicles_subtitle')}</p>
        </div>
        {primaryVehicle ? (
          <Link href={`/${locale}/compte/vehicules/${primaryVehicle.id}`} className="btn btn-primary">
            {t('vehicles_primary_cta')}
          </Link>
        ) : (
          <Link href={`/${locale}/autobot`} className="btn btn-primary">
            {t('vehicles_primary_cta_empty')}
          </Link>
        )}
      </div>

      {!token ? (
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>{t('vehicles_auth_required')}</h2>
          <p className={styles.cardText}>{t('vehicle_back_body')}</p>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/compte/login`} className="btn btn-primary">
              {t('vehicle_back_to_login')}
            </Link>
          </div>
        </article>
      ) : null}

      {token && isLoading ? (
        <article className={styles.card}>
          <p className={styles.cardText}>{t('vehicles_loading')}</p>
        </article>
      ) : null}

      {token && !isLoading && error ? (
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>{t('vehicles_error')}</h2>
          <p className={styles.cardText}>{error}</p>
        </article>
      ) : null}

      {token && !isLoading && !error && vehicles.length === 0 ? (
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>{t('vehicles_empty_title')}</h2>
          <p className={styles.cardText}>{t('vehicles_empty_body')}</p>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/autobot`} className="btn btn-outline">
              {t('quick_ask_autobot')}
            </Link>
          </div>
        </article>
      ) : null}

      {token && !isLoading && !error && vehicles.length > 0 ? (
        <div className={styles.grid2}>
          {vehicles.map((vehicle) => (
            <article key={vehicle.id} className={styles.card}>
              <div className={styles.vehicleCard}>
                <div className={styles.vehicleIcon}>🚗</div>
                <div>
                  <h2 className={styles.cardTitle}>
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </h2>
                  <p className={styles.cardText}>
                    {vehicle.fuelType.toUpperCase()} • {vehicle.vin || t('vehicles_vin_unknown')} •{' '}
                    {vehicle.primaryZone || vehicle.primaryCity || t('vehicles_zone_unknown')}
                  </p>
                  <div className={styles.pillRow} style={{ marginTop: '1rem' }}>
                    {vehicle.isPrimaryVehicle ? <span className={styles.pill}>{t('vehicles_primary_badge')}</span> : null}
                    <span className={styles.pill}>
                      {vehicle.vehicleScore !== null
                        ? t('vehicles_score_label', { score: vehicle.vehicleScore })
                        : t('vehicle_score_unavailable')}
                    </span>
                  </div>
                  <div className={styles.list}>
                    <div className={styles.listItem}>
                      <div>
                        <span className={styles.itemLabel}>{t('vehicles_stats_records')}</span>
                        <div className={styles.itemMeta}>{vehicle.maintenanceRecordsCount}</div>
                      </div>
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>{t('vehicle_history_title')}</span>
                    </div>
                    <div className={styles.listItem}>
                      <div>
                        <span className={styles.itemLabel}>{t('vehicles_stats_reminders')}</span>
                        <div className={styles.itemMeta}>{vehicle.openRemindersCount}</div>
                      </div>
                      <span className={`${styles.badge} ${vehicle.openRemindersCount > 0 ? styles.badgeWarning : styles.badgePrimary}`}>
                        {vehicle.openRemindersCount > 0 ? t('vehicle_detail_reminder') : t('vehicle_reminder_none')}
                      </span>
                    </div>
                    <div className={styles.listItem}>
                      <div>
                        <span className={styles.itemLabel}>{t('vehicle_detail_2_label')}</span>
                        <div className={styles.itemMeta}>
                          {vehicle.mileage !== null ? `${vehicle.mileage.toLocaleString(locale)} km` : t('vehicles_mileage_unknown')}
                        </div>
                      </div>
                    </div>
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
      ) : null}
    </div>
  );
}
