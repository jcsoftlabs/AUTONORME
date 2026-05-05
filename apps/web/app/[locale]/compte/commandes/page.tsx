'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';

type Order = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  items?: Array<{ partName?: string; quantity: number; unitPrice: number }>;
};

const STATUS_STYLE: Record<string, string> = {
  SHIPPED:   styles.badgeWarning,
  PREPARING: styles.badgePrimary,
  CONFIRMED: styles.badgePrimary,
  DELIVERED: styles.badgeSuccess,
  PENDING:   styles.badgeWarning,
  CANCELLED: styles.badge,
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:   'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  SHIPPED:   'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

const BORDER_COLOR: Record<string, string> = {
  SHIPPED:   'var(--color-accent-gold)',
  PREPARING: 'var(--color-primary-600)',
  DELIVERED: 'var(--color-accent-green)',
  default:   'var(--color-neutral-300)',
};

export default function CommandesPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchAuthenticatedApi<Order[]>('/orders', token)
      .then(setOrders)
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
        Mes Commandes
      </h1>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', marginBottom: 'var(--space-2xl)' }}>
        Suivez vos commandes de pièces AUTOparts en temps réel.
      </p>

      {loading && <p style={{ color: 'var(--color-neutral-500)' }}>Chargement...</p>}
      {error && <p style={{ color: 'var(--color-accent-red)', fontSize: '0.9rem' }}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-neutral-400)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-neutral-600)' }}>
            Aucune commande pour l&apos;instant
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Commandez des pièces certifiées depuis notre catalogue AUTOparts.
          </p>
          <a href="/fr/pieces" className="btn btn-primary">Voir le catalogue</a>
        </div>
      )}

      {orders.map(order => (
        <div
          key={order.id}
          className="card"
          style={{
            padding: 'var(--space-xl)',
            background: '#FFFFFF',
            borderLeft: `4px solid ${BORDER_COLOR[order.status] ?? BORDER_COLOR.default}`,
            marginBottom: 'var(--space-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>
                Commande #{order.id.slice(0, 8).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
                {order.items?.map(i => i.partName ?? 'Pièce').join(', ') || 'Commande de pièces'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>
                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>
                {order.totalPrice.toLocaleString('fr-FR')} HTG
              </div>
              <span className={`${styles.badge} ${STATUS_STYLE[order.status] ?? styles.badge}`}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)' }}>
            {order.items?.map((item, i) => (
              <p key={i} style={{ margin: '0.25rem 0' }}>
                {item.quantity}× {item.partName ?? 'Pièce'} — {item.unitPrice.toLocaleString('fr-FR')} HTG/u
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
