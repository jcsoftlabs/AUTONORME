'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';
import Link from 'next/link';

type Appointment = {
  id: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  garage?: { name: string; address?: string };
  vehicle?: { make: string; model: string; year: number };
  notes?: string;
};

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: styles.badgePrimary,
  PENDING: styles.badgeWarning,
  COMPLETED: styles.badgeSuccess,
  CANCELLED: styles.badgeNeutral ?? styles.badge,
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmé',
  PENDING: 'En attente',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

export default function RendezVousPage() {
  const t = useTranslations('Account');
  const locale = useLocale();
  const { token } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchAuthenticatedApi<Appointment[]>('/appointments', token)
      .then(setAppointments)
      .catch(() => setError('Impossible de charger les rendez-vous.'))
      .finally(() => setLoading(false));
  }, [token]);

  const cancelAppointment = async (id: string) => {
    if (!token) return;
    await fetchAuthenticatedApi(`/appointments/${id}`, token, { method: 'DELETE' });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{t('appointments_title_new')}</h1>
          <p className={styles.subtitle}>{t('appointments_subtitle_new')}</p>
        </div>
        <div className={styles.pillRow}>
          <Link href={`/${locale}/garages`} className="btn btn-primary btn-sm">
            + Prendre un rendez-vous
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{t('appointments_list_title')}</h2>

        {loading && <p className={styles.cardText}>Chargement...</p>}
        {error && <p style={{ color: 'var(--color-accent-red)', fontSize: '0.9rem' }}>{error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-neutral-400)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-neutral-600)' }}>
              Aucun rendez-vous pour l&apos;instant
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Trouvez un garage certifié et réservez votre créneau.
            </p>
            <Link href={`/${locale}/garages`} className="btn btn-primary">
              Trouver un garage
            </Link>
          </div>
        )}

        <div className={styles.list}>
          {appointments.map(appt => (
            <div key={appt.id} className={styles.listItem}>
              <div>
                <span className={styles.itemLabel}>
                  {appt.vehicle ? `${appt.vehicle.make} ${appt.vehicle.model} ${appt.vehicle.year}` : 'Véhicule inconnu'}
                </span>
                <div className={styles.itemMeta}>
                  {appt.garage?.name ?? 'Garage non précisé'}
                </div>
                <div className={styles.itemMeta}>
                  {new Date(appt.scheduledAt).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
                {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    style={{
                      marginTop: '0.5rem', background: 'none', border: 'none',
                      color: 'var(--color-accent-red)', cursor: 'pointer', fontSize: '0.8rem', padding: 0,
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
              <span className={`${styles.badge} ${STATUS_STYLE[appt.status] ?? styles.badge}`}>
                {STATUS_LABEL[appt.status] ?? appt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
