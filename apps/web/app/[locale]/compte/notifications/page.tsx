'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

const TYPE_STYLE: Record<string, string> = {
  MAINTENANCE: styles.badgeWarning,
  ORDER:       styles.badgePrimary,
  APPOINTMENT: styles.badgeSuccess,
  INFO:        styles.badge,
};

export default function NotificationsPage() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchAuthenticatedApi<Notification[]>('/notifications', token)
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [token]);

  const markRead = async (id: string) => {
    if (!token) return;
    await fetchAuthenticatedApi(`/notifications/${id}/read`, token, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    if (!token) return;
    await fetchAuthenticatedApi('/notifications/read-all', token, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className={styles.pillRow}>
            <button
              onClick={markAllRead}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.85rem' }}
            >
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Centre de notifications</h2>

        {loading && <p className={styles.cardText}>Chargement...</p>}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-neutral-400)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <p style={{ fontWeight: 600, color: 'var(--color-neutral-600)' }}>
              Aucune notification
            </p>
          </div>
        )}

        <div className={styles.list}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={styles.listItem}
              style={{
                background: notif.isRead ? 'transparent' : 'rgba(74,144,217,0.04)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                cursor: notif.isRead ? 'default' : 'pointer',
              }}
              onClick={() => !notif.isRead && markRead(notif.id)}
            >
              <div>
                <span className={styles.itemLabel} style={{ fontWeight: notif.isRead ? 500 : 700 }}>
                  {notif.title}
                  {!notif.isRead && (
                    <span style={{
                      display: 'inline-block', width: '7px', height: '7px',
                      borderRadius: '50%', background: 'var(--color-primary-500)',
                      marginLeft: '0.5rem', verticalAlign: 'middle',
                    }} />
                  )}
                </span>
                <div className={styles.itemMeta}>{notif.body}</div>
                <div className={styles.itemMeta}>
                  {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
              <span className={`${styles.badge} ${TYPE_STYLE[notif.type] ?? styles.badge}`}>
                {notif.type.charAt(0) + notif.type.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
