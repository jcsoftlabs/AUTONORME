import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }: { params: { id: string } }) {
  // En production, fetch data pour le titre
  return {
    title: `Garage ${params.id} — AUTONORME`,
    description: 'Prenez rendez-vous dans ce garage certifié AUTONORME.',
    openGraph: {
      title: `Garage ${params.id} — AUTONORME`,
      description: 'Prenez rendez-vous dans ce garage certifié AUTONORME.',
      url: `https://autonorme.com/garages/${params.id}`,
      siteName: 'AUTONORME',
      images: [
        {
          url: '/og-garage-detail.png',
          width: 1200,
          height: 630,
          alt: `Garage ${params.id} AUTONORME`,
        },
      ],
      locale: 'fr_FR',
      type: 'article',
    },
  };
}

export default function GarageDetailsPage({ params }: { params: { id: string } }) {
  const t = useTranslations('Garages');
  // MOCK DATA pour la structure visuelle
  const garage = {
    id: params.id,
    name: 'Garage Moderne Auto',
    address: '15 Rue Delmas, Port-au-Prince',
    rating: 4.8,
    reviewsCount: 124,
    isCertified: true,
    specialties: ['Mécanique générale', 'Climatisation', 'Électricité'],
    description: 'Le Garage Moderne Auto est votre partenaire de confiance depuis plus de 10 ans. Nous offrons des services rapides et fiables pour tous types de véhicules.',
    services: [
      { name: 'Vidange et filtres', price: 'À partir de 5000 HTG' },
      { name: 'Diagnostic électronique', price: 'À partir de 2500 HTG' },
      { name: 'Changement plaquettes de frein', price: 'À partir de 4000 HTG' },
    ]
  };

  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--color-neutral-50)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ background: 'var(--color-primary-900)', paddingTop: '11rem', paddingBottom: '3rem', color: '#FFFFFF' }}>
        <div className="container">
          <Link href="/fr/garages" style={{ color: 'var(--color-primary-200)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
            {t('back_list')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.5rem)', margin: 0 }}>
                  {garage.name}
                </h1>
                {garage.isCertified && (
                  <span style={{ background: '#DCFCE7', color: '#16A34A', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                    CERTIFIÉ AUTONORME
                  </span>
                )}
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📍 {garage.address}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: 'var(--space-md) var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent-gold)', marginBottom: '0.25rem' }}>
                ⭐ {garage.rating}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-200)' }}>
                {garage.reviewsCount} avis clients
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: 'var(--space-2xl) 0', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
        <style>{`
          @media (min-width: 1024px) {
            .details-layout { grid-template-columns: 2fr 1fr !important; }
          }
        `}</style>
        
        <div className="details-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
          
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{t('details_title')}</h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-neutral-600)' }}>
                {garage.description}
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{t('specialties')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {garage.specialties.map(spec => (
                  <span key={spec} style={{ background: 'var(--color-neutral-200)', color: 'var(--color-neutral-800)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{t('services')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {garage.services.map((service, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--color-neutral-200)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-neutral-800)' }}>{service.name}</span>
                    <span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>{service.price}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Action */}
          <div style={{ position: 'sticky', top: '6rem', background: '#FFFFFF', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-neutral-200)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>
              {t('need_maintenance')}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-xl)' }}>
              {t('book_desc')}
            </p>
            
            <Link href="/fr/compte/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                {t('book_btn')}
              </button>
            </Link>
            <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-neutral-400)' }}>
              {t('login_required')}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
