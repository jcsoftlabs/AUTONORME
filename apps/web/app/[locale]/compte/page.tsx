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

type Appointment = {
  id: string;
  scheduledAt?: string;
  datetime?: string;
  status: string;
  garage?: { name: string };
  vehicle?: { make: string; model: string; year: number };
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

function Stat({ label, value, hint, loading }: { label: string; value: React.ReactNode; hint: string; loading?: boolean }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>
        {loading ? <span style={{ fontSize: '1rem', color: 'var(--color-neutral-400)' }}>…</span> : value}
      </span>
      <span className={styles.statHint}>{hint}</span>
    </div>
  );
}

export default function DashboardOverview() {
  const { user, token } = useAuthStore();
  const locale = useLocale();
  const t = useTranslations('Account');

  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    // MODE FACTICE : Si on utilise le jeton de démo, on renvoie des données de test
    if (token === 'mock-jwt-token-for-demo') {
      setTimeout(() => {
        setVehicles([{
          id: 'v-demo',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          isPrimaryVehicle: true,
          openRemindersCount: 1,
          maintenanceRecordsCount: 3
        }]);
        setAppointments([{
          id: 'demo-1',
          scheduledAt: new Date().toISOString(),
          status: 'CONFIRMED',
          garage: { name: 'Garage Moderne' },
          vehicle: { make: 'Toyota', model: 'Corolla', year: 2020 }
        }]);
        setOrders([]);
        setNotifications([{
          id: 'n-demo',
          title: 'Bienvenue sur AUTONORME',
          body: 'Profitez de nos services pour entretenir votre véhicule.',
          type: 'INFO',
          isRead: false,
          createdAt: new Date().toISOString()
        }]);
        setLoading(false);
      }, 600);
      return;
    }

    Promise.all([
      fetchAuthenticatedApi<VehicleSummary[]>('/vehicles', token).catch(() => []),
      fetchAuthenticatedApi<Appointment[]>('/appointments', token).catch(() => []),
      fetchAuthenticatedApi<Order[]>('/orders', token).catch(() => []),
      fetchAuthenticatedApi<Notification[]>('/notifications', token).catch(() => []),
    ]).then(([v, a, o, n]) => {
      setVehicles(v);
      setAppointments(a);
      setOrders(o);
      setNotifications(n);
    }).finally(() => setLoading(false));
  }, [token]);

  const primaryVehicle = vehicles.find(v => v.isPrimaryVehicle) || vehicles[0];

  // Stats calculées
  const activeAppointments = appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status));
  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const openReminders = vehicles.reduce((sum, v) => sum + v.openRemindersCount, 0);
  const unreadNotifications = notifications.filter(n => !n.isRead);

  // Alertes dynamiques : combiner rappels urgents + notifications non-lues récentes
  const alerts: Array<{ title: string; body: string; tone: string; badge: string }> = [];

  if (openReminders > 0) {
    alerts.push({
      title: `${openReminders} rappel(s) de maintenance en attente`,
      body: 'Vérifiez votre calendrier de maintenance pour éviter des pannes.',
      tone: styles.badgeWarning,
      badge: 'Urgent',
    });
  }
  if (activeOrders.length > 0) {
    alerts.push({
      title: `${activeOrders.length} commande(s) en cours de livraison`,
      body: activeOrders.map(o => `#${o.id.slice(0, 6).toUpperCase()}`).join(', '),
      tone: styles.badgePrimary,
      badge: 'En route',
    });
  }
  if (activeAppointments.length > 0) {
    alerts.push({
      title: `${activeAppointments.length} rendez-vous à venir`,
      body: activeAppointments[0].garage?.name
        ? `Prochain : ${activeAppointments[0].garage.name}`
        : 'Consultez vos rendez-vous.',
      tone: styles.badgePrimary,
      badge: 'Confirmé',
    });
  }
  unreadNotifications.slice(0, 1).forEach(n => {
    alerts.push({
      title: n.title,
      body: n.body,
      tone: styles.badge,
      badge: 'Nouveau',
    });
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>
            {t('dashboard_greeting', { name: user?.firstName || t('customer_fallback') })}
          </h1>
          <p className={styles.subtitle}>{t('dashboard_intro')}</p>
        </div>
        <div className={styles.pillRow}>
          {unreadNotifications.length > 0 && (
            <span className={styles.pill} style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--color-accent-gold)' }}>
              🔔 {unreadNotifications.length} notification(s)
            </span>
          )}
          <span className={styles.pill}>{t('dashboard_pill_1')}</span>
          <span className={styles.pill}>{t('dashboard_pill_2')}</span>
        </div>
      </div>

      {/* Stats — 100% dynamiques */}
      <div className={styles.statsGrid}>
        <Stat
          loading={loading}
          label={t('stat_appointments')}
          value={activeAppointments.length}
          hint={activeAppointments.length === 0 ? 'Aucun RDV à venir' : `${activeAppointments.length} confirmé(s)`}
        />
        <Stat
          loading={loading}
          label={t('stat_orders')}
          value={activeOrders.length}
          hint={activeOrders.length === 0 ? 'Aucune commande active' : 'En cours de traitement'}
        />
        <Stat
          loading={loading}
          label={t('stat_vehicles')}
          value={vehicles.length}
          hint={vehicles.length ? t('vehicle_count_hint', { count: vehicles.length }) : t('vehicle_hint')}
        />
        <Stat
          loading={loading}
          label={t('dashboard_maintenance_stat')}
          value={openReminders}
          hint={openReminders === 0 ? 'Tout est à jour ✅' : t('dashboard_maintenance_hint')}
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.stack}>
          {/* Actions rapides */}
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

          {/* Alertes — 100% dynamiques */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_alerts_title')}</h2>
            {loading ? (
              <p className={styles.cardText} style={{ color: 'var(--color-neutral-400)' }}>Chargement...</p>
            ) : alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-neutral-400)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ fontWeight: 600, color: 'var(--color-neutral-600)', marginBottom: '0.25rem' }}>
                  Tout est en ordre
                </p>
                <p style={{ fontSize: '0.85rem' }}>Aucune alerte active pour le moment.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {alerts.map((alert, i) => (
                  <div key={i} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel}>{alert.title}</span>
                      <div className={styles.itemMeta}>{alert.body}</div>
                    </div>
                    <span className={`${styles.badge} ${alert.tone}`}>{alert.badge}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <aside className={styles.stack}>
          {/* Véhicule principal */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_vehicle_focus_title')}</h2>
            {loading ? (
              <p className={styles.cardText} style={{ color: 'var(--color-neutral-400)' }}>Chargement...</p>
            ) : (
              <p className={styles.cardText}>
                {primaryVehicle
                  ? t('dashboard_vehicle_focus_live', {
                      vehicle: `${primaryVehicle.make} ${primaryVehicle.model} ${primaryVehicle.year}`,
                      records: primaryVehicle.maintenanceRecordsCount,
                      reminders: primaryVehicle.openRemindersCount,
                    })
                  : t('dashboard_vehicle_focus_body')}
              </p>
            )}
            <div className={styles.ctaRow}>
              <Link
                href={primaryVehicle ? `/${locale}/compte/vehicules/${primaryVehicle.id}` : `/${locale}/compte/vehicules`}
                className="btn btn-primary"
              >
                {t('dashboard_vehicle_focus_cta')}
              </Link>
            </div>
          </article>

          {/* Notifications récentes */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>{t('dashboard_notifications_title')}</h2>
            {!loading && unreadNotifications.length > 0 ? (
              <div className={styles.list} style={{ marginBottom: '1rem' }}>
                {unreadNotifications.slice(0, 2).map(n => (
                  <div key={n.id} className={styles.listItem}>
                    <div>
                      <span className={styles.itemLabel} style={{ fontWeight: 700 }}>{n.title}</span>
                      <div className={styles.itemMeta}>{n.body}</div>
                    </div>
                    <span style={{
                      display: 'inline-block', width: '8px', height: '8px',
                      borderRadius: '50%', background: 'var(--color-primary-500)', flexShrink: 0,
                    }} />
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.cardText}>{t('dashboard_notifications_body')}</p>
            )}
            <div className={styles.ctaRow}>
              <Link href={`/${locale}/compte/notifications`} className="btn btn-outline">
                {t('dashboard_notifications_cta')}
                {unreadNotifications.length > 0 && (
                  <span style={{
                    marginLeft: '0.5rem', background: 'var(--color-primary-600)', color: '#fff',
                    fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.45rem',
                    borderRadius: '99px',
                  }}>
                    {unreadNotifications.length}
                  </span>
                )}
              </Link>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
