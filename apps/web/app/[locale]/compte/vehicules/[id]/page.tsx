'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '../../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../../lib/authenticated-api';
import styles from '../../../../../components/account.module.css';

type Reminder = {
  id: string;
  type: string;
  dueDate: string | null;
  dueMileage: number | null;
  status: string;
};

type RecordEntry = {
  id: string;
  type: string;
  date: string;
  mileageAt: number | null;
  totalCostHtg: string | number | null;
};

type AppointmentEntry = {
  id: string;
  datetime: string;
  status: string;
  notes: string | null;
  garage: {
    name: string;
    city: string | null;
  };
};

type RiskFlag = {
  id: string;
  type: string;
  severity: string;
  message: string;
};

type VehicleDetail = {
  id: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  vin: string | null;
  fuelType: string;
  transmission: string | null;
  engine: string | null;
  drivetrain: string | null;
  mileage: number | null;
  color: string | null;
  plate: string | null;
  usageType: string | null;
  primaryCity: string | null;
  primaryZone: string | null;
  isPrimaryVehicle: boolean;
  tireSize: string | null;
  batterySpec: string | null;
  oilSpec: string | null;
  brakeSpec: string | null;
  vehicleScore: number | null;
  maintenanceRecordsCount: number;
  openRemindersCount: number;
  records: RecordEntry[];
  reminders: Reminder[];
  recentAppointments: AppointmentEntry[];
  riskFlags: RiskFlag[];
};

const statusBadgeMap: Record<string, string> = {
  PENDING: 'badgeWarning',
  CONFIRMED: 'badgePrimary',
  COMPLETED: 'badgeSuccess',
  CANCELLED: 'badgeWarning',
};

export default function VehicleDetailPage() {
  const t = useTranslations('Account');
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.token);

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !params.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    fetchAuthenticatedApi<VehicleDetail>(`/vehicles/${params.id}`, token)
      .then((data) => setVehicle(data))
      .catch((err: Error) => setError(err.message || t('vehicle_detail_not_found')))
      .finally(() => setIsLoading(false));
  }, [params.id, token, t]);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale === 'ht' ? 'fr-HT' : locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));

  const snapshot = useMemo(
    () =>
      vehicle
        ? [
            { label: t('vehicle_snapshot_field_make_model'), value: `${vehicle.make} ${vehicle.model} ${vehicle.year}` },
            { label: t('vehicle_snapshot_field_vin'), value: vehicle.vin || t('vehicles_vin_unknown') },
            {
              label: t('vehicle_snapshot_field_mileage'),
              value: vehicle.mileage !== null ? `${vehicle.mileage.toLocaleString(locale)} km` : t('vehicles_mileage_unknown'),
            },
            { label: t('vehicle_snapshot_field_engine'), value: vehicle.engine || '—' },
            {
              label: t('vehicle_snapshot_field_location'),
              value: [vehicle.primaryZone, vehicle.primaryCity].filter(Boolean).join(', ') || t('vehicles_zone_unknown'),
            },
            { label: t('vehicle_snapshot_field_fuel'), value: vehicle.fuelType.toUpperCase() },
            { label: t('vehicle_snapshot_field_transmission'), value: vehicle.transmission || '—' },
            { label: t('vehicle_snapshot_field_plate'), value: vehicle.plate || '—' },
            { label: t('vehicle_snapshot_field_color'), value: vehicle.color || '—' },
            { label: t('vehicle_snapshot_field_usage'), value: vehicle.usageType || '—' },
            { label: t('vehicle_snapshot_field_tire'), value: vehicle.tireSize || '—' },
            { label: t('vehicle_snapshot_field_battery'), value: vehicle.batterySpec || '—' },
            { label: t('vehicle_snapshot_field_oil'), value: vehicle.oilSpec || '—' },
            { label: t('vehicle_snapshot_field_brakes'), value: vehicle.brakeSpec || '—' },
          ]
        : [],
    [locale, t, vehicle],
  );

  if (!token) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <h1 className={styles.cardTitle}>{t('vehicle_auth_required')}</h1>
          <p className={styles.cardText}>{t('vehicle_back_body')}</p>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/compte/login`} className="btn btn-primary">
              {t('vehicle_back_to_login')}
            </Link>
          </div>
        </article>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <p className={styles.cardText}>{t('vehicle_detail_loading')}</p>
        </article>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <h1 className={styles.cardTitle}>{t('vehicle_detail_not_found')}</h1>
          <p className={styles.cardText}>{error || t('vehicle_detail_not_found')}</p>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/compte/vehicules`} className="btn btn-outline">
              {t('vehicle_back_cta')}
            </Link>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>
            {vehicle.make} {vehicle.model} {vehicle.year}
          </h1>
          <p className={styles.subtitle}>{t('vehicle_detail_subtitle')}</p>
        </div>
        <div className={styles.stack} style={{ justifyItems: 'end' }}>
          <div className={styles.pillRow}>
            {vehicle.isPrimaryVehicle ? <span className={styles.pill}>{t('vehicles_primary_badge')}</span> : null}
            <span className={styles.pill}>
              {vehicle.vehicleScore !== null ? t('vehicles_score_label', { score: vehicle.vehicleScore }) : t('vehicle_score_unavailable')}
            </span>
            <span className={styles.pill}>
              {vehicle.openRemindersCount > 0
                ? t('vehicle_detail_reminder_count', { count: vehicle.openRemindersCount })
                : t('vehicle_reminder_none')}
            </span>
          </div>
          <div className={styles.ctaRow} style={{ marginTop: 0 }}>
            <Link href={`/${locale}/compte/vehicules/${vehicle.id}/modifier`} className="btn btn-primary">
              {t('vehicle_edit')}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_snapshot_title')}</h2>
            <p className={styles.cardText}>{t('vehicle_snapshot_body')}</p>

            <div className={styles.dataGrid}>
              {snapshot.map((spec) => (
                <div key={spec.label} className={styles.dataCell}>
                  <span className={styles.dataLabel}>{spec.label}</span>
                  <span className={styles.dataValue}>{spec.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_history_title')}</h2>
            {vehicle.records.length === 0 ? (
              <p className={styles.cardText}>{t('vehicle_history_empty')}</p>
            ) : (
              <div className={styles.list}>
                {vehicle.records.map((entry) => (
                  <div key={entry.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel}>{entry.type}</span>
                      <div className={styles.itemMeta}>
                        {formatDate(entry.date)}
                        {entry.mileageAt !== null ? ` • ${entry.mileageAt.toLocaleString(locale)} km` : ''}
                        {entry.totalCostHtg ? ` • ${entry.totalCostHtg} HTG` : ''}
                      </div>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>{t('vehicle_history_done')}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_reminders_title')}</h2>
            {vehicle.reminders.length === 0 ? (
              <p className={styles.cardText}>{t('vehicle_reminders_empty')}</p>
            ) : (
              <div className={styles.list}>
                {vehicle.reminders.map((reminder) => (
                  <div key={reminder.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel}>{reminder.type}</span>
                      <div className={styles.itemMeta}>
                        {reminder.dueDate ? `${t('vehicle_reminder_due_date')}: ${formatDate(reminder.dueDate)}` : ''}
                        {reminder.dueDate && reminder.dueMileage ? ' • ' : ''}
                        {reminder.dueMileage ? `${t('vehicle_reminder_due_mileage')}: ${reminder.dueMileage.toLocaleString(locale)} km` : ''}
                      </div>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>{reminder.status}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className={styles.stack}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_next_title')}</h2>
            <p className={styles.cardText}>
              {vehicle.openRemindersCount > 0 ? t('vehicle_next_body') : t('vehicle_reminders_empty')}
            </p>
            <div className={styles.ctaRow}>
              <Link href={`/${locale}/compte/maintenance`} className="btn btn-primary">
                {t('vehicle_next_cta')}
              </Link>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_appointments_title')}</h2>
            {vehicle.recentAppointments.length === 0 ? (
              <p className={styles.cardText}>{t('vehicle_appointments_empty')}</p>
            ) : (
              <div className={styles.list}>
                {vehicle.recentAppointments.map((appointment) => (
                  <div key={appointment.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel}>{appointment.garage.name}</span>
                      <div className={styles.itemMeta}>
                        {formatDate(appointment.datetime)}
                        {appointment.garage.city ? ` • ${appointment.garage.city}` : ''}
                      </div>
                    </div>
                    <span
                      className={`${styles.badge} ${styles[statusBadgeMap[appointment.status] || 'badgePrimary']}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('vehicle_risks_title')}</h2>
            {vehicle.riskFlags.length === 0 ? (
              <p className={styles.cardText}>{t('vehicle_risks_empty')}</p>
            ) : (
              <div className={styles.list}>
                {vehicle.riskFlags.map((risk) => (
                  <div key={risk.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel}>{risk.type}</span>
                      <div className={styles.itemMeta}>{risk.message}</div>
                    </div>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>{risk.severity}</span>
                  </div>
                ))}
              </div>
            )}
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
