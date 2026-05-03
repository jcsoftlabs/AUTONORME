'use client';

export default function RDVPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--color-neutral-900)', marginBottom: 'var(--space-xs)' }}>
        Mes Rendez-vous
      </h1>
      <p style={{ color: 'var(--color-neutral-500)', fontSize: '1rem', marginBottom: 'var(--space-2xl)' }}>
        Consultez et gérez vos rendez-vous dans les garages certifiés AUTONORME.
      </p>

      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-primary-600)', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-600)', marginBottom: '0.25rem' }}>À VENIR</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>Garage Moderne Auto</h3>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', margin: 0 }}>Diagnostic électronique complet</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>Demain, 14:00</div>
            <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>15 Rue Delmas, Port-au-Prince</div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: 'var(--space-xl)', background: '#FFFFFF', borderLeft: '4px solid var(--color-neutral-300)', opacity: 0.7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '0.25rem' }}>TERMINÉ</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>Auto Service Plus</h3>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', margin: 0 }}>Vidange et changement de filtres</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-neutral-600)' }}>12 Octobre 2023</div>
            <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>Pétion-Ville</div>
          </div>
        </div>
      </div>
    </div>
  );
}
