'use client';

import { useAuthStore } from '../../../lib/store/useAuthStore';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const locale = useLocale();

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
        Bonjour, {user?.firstName || 'Client'} ! 👋
      </h1>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', marginBottom: 'var(--space-2xl)' }}>
        Bienvenue dans votre espace personnel AUTONORME.
      </p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
        {/* Card 1 */}
        <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-primary-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}>Rendez-vous à venir</h3>
            <span style={{ fontSize: '1.5rem' }}>📅</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>1</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-600)', marginTop: 'var(--space-xs)', fontWeight: 500 }}>Demain à 14h00</div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-accent-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}>Commandes actives</h3>
            <span style={{ fontSize: '1.5rem' }}>📦</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>2</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', marginTop: 'var(--space-xs)' }}>En cours de livraison</div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid #16A34A' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}>Véhicules enregistrés</h3>
            <span style={{ fontSize: '1.5rem' }}>🚗</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>1</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', marginTop: 'var(--space-xs)' }}>Toyota RAV4 (2019)</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-lg)' }}>
        Actions rapides
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
        <Link href={`/${locale}/garages`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', background: '#FFFFFF', cursor: 'pointer' }}>
             <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛠️</div>
             <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>Trouver un garage</div>
          </div>
        </Link>
        <Link href={`/${locale}/pieces`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', background: '#FFFFFF', cursor: 'pointer' }}>
             <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
             <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>Acheter des pièces</div>
          </div>
        </Link>
        <Link href={`/${locale}/autobot`} style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: 'var(--space-lg)', textAlign: 'center', background: '#FFFFFF', cursor: 'pointer' }}>
             <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
             <div style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>Demander à AutoBot</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
