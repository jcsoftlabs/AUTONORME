'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api-client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface Garage {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isCertified: boolean;
  rating?: number;
}

export default function GarageList() {
  const t = useTranslations('Garages');
  const locale = useLocale();
  const [search, setSearch] = useState('');

  const { data: garages, isLoading, error } = useQuery<Garage[]>({
    queryKey: ['garages'],
    queryFn: () => fetchApi('/garages'),
  });

  const filteredGarages = garages?.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={t('search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem 0.875rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-neutral-300)',
            fontSize: '0.9375rem',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
            fontFamily: 'var(--font-body)',
          }}
        />
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
      </div>

      {/* State: Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse" style={{ padding: 'var(--space-lg)', height: '140px', background: 'var(--color-neutral-200)' }} />
          ))}
        </div>
      )}

      {/* State: Error */}
      {error && (
        <div style={{ padding: 'var(--space-lg)', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-lg)', fontSize: '0.9375rem' }}>
          Impossible de charger les garages. Vérifiez votre connexion.
        </div>
      )}

      {/* State: Empty API or No results */}
      {(!isLoading && !error && (!filteredGarages || filteredGarages.length === 0)) && (
        <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-neutral-300)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🏪</div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-neutral-900)', marginBottom: '0.25rem' }}>Aucun garage trouvé</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
            {search ? 'Modifiez vos critères de recherche.' : 'La base de données est actuellement vide.'}
          </p>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
        {filteredGarages?.map(garage => (
          <Link href={`/${locale}/garages/${garage.id}`} key={garage.id} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div
              className="card"
              style={{
                padding: 'var(--space-lg)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary-300)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-neutral-900)', margin: 0 }}>
                  {garage.name}
                </h3>
                {garage.isCertified && (
                  <span style={{ background: '#DCFCE7', color: '#16A34A', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.6875rem', fontWeight: 700 }}>
                    CERTIFIÉ
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-neutral-500)' }}>
                <span>📍</span>
                <span>{garage.address}, {garage.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent-gold)' }}>
                  ⭐ {garage.rating ? garage.rating.toFixed(1) : 'Nouveau'}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary-600)', fontWeight: 500 }}>
                  Voir détails →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
