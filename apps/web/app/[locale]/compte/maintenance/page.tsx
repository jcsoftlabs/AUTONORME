'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';

type Reminder = {
  id: string;
  type: string;
  description?: string;
  dueDate?: string;
  status: 'OPEN' | 'DONE' | 'SNOOZED';
  vehicle?: { make: string; model: string; year: number };
};

type MaintenanceRecord = {
  id: string;
  type: string;
  description?: string;
  performedAt: string;
  mileage?: number;
  vehicle?: { make: string; model: string; year: number };
  garage?: { name: string };
};

const REM_STYLE: Record<string, string> = {
  OPEN:    styles.badgeWarning,
  SNOOZED: styles.badgePrimary,
  DONE:    styles.badgeSuccess,
};

export default function MaintenancePage() {
  const { token } = useAuthStore();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetchAuthenticatedApi<Reminder[]>('/maintenance/reminders', token).catch(() => []),
      fetchAuthenticatedApi<MaintenanceRecord[]>('/maintenance', token).catch(() => []),
    ]).then(([rems, recs]) => {
      setReminders(rems);
      setRecords(recs);
    }).finally(() => setLoading(false));
  }, [token]);

  const markDone = async (id: string) => {
    if (!token) return;
    await fetchAuthenticatedApi(`/maintenance/reminders/${id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DONE' }),
      headers: { 'Content-Type': 'application/json' },
    });
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'DONE' } : r));
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Maintenance</h1>
          <p className={styles.subtitle}>Rappels actifs et historique complet de vos véhicules.</p>
        </div>
      </div>

      {loading && <p className={styles.cardText}>Chargement...</p>}

      {/* Rappels actifs */}
      {!loading && (
        <div className={styles.card} style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 className={styles.cardTitle}>Rappels actifs</h2>
          {reminders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-neutral-400)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <p>Aucun rappel en attente — tout est à jour !</p>
            </div>
          ) : (
            <div className={styles.list}>
              {reminders.filter(r => r.status !== 'DONE').map(rem => (
                <div key={rem.id} className={styles.listItem}>
                  <div>
                    <span className={styles.itemLabel}>{rem.type}</span>
                    {rem.vehicle && (
                      <div className={styles.itemMeta}>
                        {rem.vehicle.make} {rem.vehicle.model} {rem.vehicle.year}
                      </div>
                    )}
                    {rem.dueDate && (
                      <div className={styles.itemMeta}>
                        Échéance : {new Date(rem.dueDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    <button
                      onClick={() => markDone(rem.id)}
                      style={{
                        marginTop: '0.4rem', background: 'none', border: 'none',
                        color: 'var(--color-primary-600)', cursor: 'pointer',
                        fontSize: '0.8rem', padding: 0, fontWeight: 600,
                      }}
                    >
                      Marquer comme fait
                    </button>
                  </div>
                  <span className={`${styles.badge} ${REM_STYLE[rem.status] ?? styles.badge}`}>
                    {rem.status === 'OPEN' ? 'En attente' : rem.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Historique maintenance */}
      {!loading && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Historique des interventions</h2>
          {records.length === 0 ? (
            <p className={styles.cardText} style={{ color: 'var(--color-neutral-400)' }}>
              Aucun historique de maintenance enregistré.
            </p>
          ) : (
            <div className={styles.list}>
              {records.map(rec => (
                <div key={rec.id} className={styles.listItem}>
                  <div>
                    <span className={styles.itemLabel}>{rec.type}</span>
                    {rec.vehicle && (
                      <div className={styles.itemMeta}>
                        {rec.vehicle.make} {rec.vehicle.model} {rec.vehicle.year}
                      </div>
                    )}
                    <div className={styles.itemMeta}>
                      {new Date(rec.performedAt).toLocaleDateString('fr-FR')}
                      {rec.mileage ? ` — ${rec.mileage.toLocaleString()} km` : ''}
                      {rec.garage ? ` • ${rec.garage.name}` : ''}
                    </div>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>Effectuée</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
