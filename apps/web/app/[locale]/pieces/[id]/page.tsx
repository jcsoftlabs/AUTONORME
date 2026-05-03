import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Pièce ${params.id} — AUTONORME`,
    description: 'Achetez cette pièce automobile en ligne avec garantie.',
    openGraph: {
      title: `Pièce ${params.id} — AUTONORME`,
      description: 'Achetez cette pièce automobile en ligne avec garantie.',
      url: `https://autonorme.com/pieces/${params.id}`,
      siteName: 'AUTONORME',
      images: [
        {
          url: '/og-piece-detail.png',
          width: 1200,
          height: 630,
          alt: `Pièce ${params.id} AUTONORME`,
        },
      ],
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default function PartDetailsPage({ params }: { params: { id: string } }) {
  const t = useTranslations('Parts');
  // MOCK DATA pour la structure visuelle
  const part = {
    id: params.id,
    name: 'Plaquettes de frein avant Céramique',
    brand: 'Bosch',
    partNumber: 'BP-12445',
    price: 4500,
    stock: 12,
    description: 'Plaquettes de frein en céramique haute performance. Conçues pour réduire la poussière et offrir un freinage silencieux.',
    compatibility: ['Toyota RAV4 2015-2021', 'Toyota Camry 2018-2022', 'Lexus NX 2015-2020'],
  };

  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--color-neutral-50)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-neutral-200)', paddingTop: '6rem' }}>
        <div className="container" style={{ padding: 'var(--space-md) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
            <Link href="/fr/pieces" style={{ color: 'inherit', textDecoration: 'none' }}>{t('back_catalog')}</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-neutral-900)' }}>{part.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: 'var(--space-2xl) 0', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
        <style>{`
          @media (min-width: 1024px) {
            .product-layout { grid-template-columns: 1fr 400px !important; }
          }
        `}</style>
        
        <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
          
          {/* Main Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Image Placeholder */}
            <div style={{ width: '100%', height: '400px', background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
              ⚙️
            </div>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{t('desc_title')}</h2>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--color-neutral-600)' }}>
                {part.description}
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{t('compatibility')}</h2>
              <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--color-neutral-600)', lineHeight: 1.8 }}>
                {part.compatibility.map(v => <li key={v}>{v}</li>)}
              </ul>
            </section>
          </div>

          {/* Sidebar Action / Cart */}
          <div style={{ position: 'sticky', top: '6rem', background: '#FFFFFF', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-neutral-200)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-600)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              {part.brand}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {part.name}
            </h1>
            <div style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-xl)' }}>
              {t('ref')} {part.partNumber}
            </div>
            
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-neutral-900)', marginBottom: 'var(--space-md)' }}>
              {part.price.toLocaleString('fr-HT')} HTG
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2xl)', fontSize: '0.9375rem', fontWeight: 600, color: part.stock > 0 ? '#16A34A' : '#DC2626' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: part.stock > 0 ? '#16A34A' : '#DC2626' }}></span>
              {part.stock > 0 ? `${part.stock} ${t('stock_in')}` : t('stock_out')}
            </div>
            
            <button className="btn btn-primary" disabled={part.stock === 0} style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
              {t('add_cart')}
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span>🛡️</span> {t('warranty')}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
