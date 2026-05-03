'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api-client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface Part {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export default function PartsCatalog() {
  const t = useTranslations('Parts');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const { data: parts, isLoading, error } = useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: () => fetchApi('/parts'),
  });

  const filteredParts = parts?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    // MOCK FILTER: In a real app, backend handles filtering or category matches part category id
    return matchesSearch;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
      <style>{`
        @media (min-width: 1024px) {
          .catalog-layout { grid-template-columns: 280px 1fr !important; }
        }
      `}</style>
      
      <div className="catalog-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        
        {/* Sidebar: Filters */}
        <div style={{ background: '#FFFFFF', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-neutral-200)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.125rem', marginBottom: 'var(--space-lg)' }}>
            Filtres
          </h3>
          
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 'var(--space-sm)' }}>
              Rechercher une pièce
            </label>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral-300)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 'var(--space-sm)' }}>
              Catégorie
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {['Toutes', 'Freinage', 'Moteur', 'Transmission', 'Suspension'].map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--color-neutral-600)' }}>
                  <input type="radio" name="category" value={cat} checked={category === (cat === 'Toutes' ? 'ALL' : cat)} onChange={() => setCategory(cat === 'Toutes' ? 'ALL' : cat)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
            <div style={{ color: 'var(--color-neutral-600)', fontSize: '0.9375rem' }}>
              {filteredParts?.length || 0} résultat(s)
            </div>
            <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-300)', fontSize: '0.875rem' }}>
              <option>Trier par popularité</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse" style={{ height: '320px', background: 'var(--color-neutral-200)', borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding: 'var(--space-xl)', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              Une erreur s&apos;est produite lors du chargement du catalogue.
            </div>
          )}

          {/* Empty */}
          {(!isLoading && !error && (!filteredParts || filteredParts.length === 0)) && (
            <div style={{ padding: 'var(--space-4xl)', textAlign: 'center', background: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-neutral-300)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🛒</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Aucune pièce trouvée</h3>
              <p style={{ color: 'var(--color-neutral-500)', maxWidth: '300px', margin: '0 auto' }}>
                {search ? 'Essayez avec un autre mot-clé.' : 'Le catalogue est actuellement en cours de mise à jour.'}
              </p>
            </div>
          )}

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
            {filteredParts?.map(part => (
              <Link href={`/${locale}/pieces/${part.id}`} key={part.id} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', padding: '0', overflow: 'hidden', height: '100%' }}>
                  {/* Image Placeholder */}
                  <div style={{ height: '180px', background: 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    ⚙️
                  </div>
                  
                  <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {part.brand}
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-neutral-900)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {part.name}
                  </h4>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-md)' }}>
                    Réf: {part.partNumber}
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-neutral-900)' }}>
                        {part.price.toLocaleString('fr-HT')} HTG
                      </div>
                      <div style={{ fontSize: '0.75rem', color: part.stockQuantity > 0 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                        {part.stockQuantity > 0 ? `${part.stockQuantity} ${t('stock_in')}` : t('stock_out')}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
