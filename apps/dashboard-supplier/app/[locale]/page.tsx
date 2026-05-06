'use client';

import { useTranslations } from 'next-intl';

export default function SupplierDashboardHome() {
  const t = useTranslations('Supplier');

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>{t('title')}</h1>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #d4af37' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Ventes du mois</p>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>142,500 <span style={{ fontSize: '1rem' }}>HTG</span></h2>
          <span style={{ color: '#28a745', fontSize: '0.8rem' }}>↑ 12% vs mois dernier</span>
        </div>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #1a1a1a' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Commandes à traiter</p>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>8</h2>
          <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>4 urgentes</span>
        </div>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #dc3545' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Ruptures de stock</p>
          <h2 style={{ margin: '0.5rem 0', fontSize: '1.8rem' }}>3</h2>
          <span style={{ color: '#dc3545', fontSize: '0.8rem' }}>Action requise</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Dernières Commandes</h3>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>Visualisez et gérez vos ventes récentes.</p>
          <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
               <strong>CMD-2026-002</strong>
               <span style={{ color: '#888' }}>Il y a 2h</span>
             </div>
             <div style={{ fontSize: '0.9rem' }}>1x Filtre à huile Toyota - 4,500 HTG</div>
          </div>
          <button style={{ background: '#f5f5f5', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Voir tout</button>
        </div>
        <div style={{ padding: '1.5rem', background: '#1a1a1a', color: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#d4af37' }}>AutoBot Assistant</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>&quot;Le stock de Plaquettes Bosch est bas. Voulez-vous que je crée une alerte de réapprovisionnement ?&quot;</p>
          <button style={{ width: '100%', padding: '0.8rem', background: '#d4af37', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
            Parler à l&apos;IA
          </button>
        </div>
      </div>
    </div>
  );
}
