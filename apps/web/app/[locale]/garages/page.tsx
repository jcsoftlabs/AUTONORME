import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import GarageList from '../../../components/garages/GarageList';
import GarageMapPlaceholder from '../../../components/garages/GarageMapPlaceholder';
import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Trouver un Garage Certifié — AUTONORME',
  description: 'Recherchez et prenez rendez-vous avec l\'un des 200+ garages certifiés AUTONORME en Haïti. Filtrage par ville, spécialité et avis clients.',
  openGraph: {
    title: 'Trouver un Garage Certifié — AUTONORME',
    description: 'Recherchez et prenez rendez-vous avec l\'un des 200+ garages certifiés AUTONORME en Haïti.',
    url: 'https://autonorme.com/garages',
    siteName: 'AUTONORME',
    images: [
      {
        url: '/og-garages.png',
        width: 1200,
        height: 630,
        alt: 'Garages AUTONORME',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function GaragesPage() {
  const t = useTranslations('Garages');

  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--color-neutral-50)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Page Header */}
      <div style={{ background: 'var(--color-primary-900)', paddingTop: '11rem', paddingBottom: '4rem', color: '#FFFFFF' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-md)', color: '#FFFFFF' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ flex: 1, padding: 'var(--space-2xl) 0', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
        <style>{`
          @media (min-width: 1024px) {
            .garages-layout { grid-template-columns: 350px 1fr !important; }
          }
        `}</style>
        
        <div className="garages-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
          
          {/* Left Column: List & Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
            <GarageList />
          </div>

          {/* Right Column: Map */}
          <div style={{ position: 'sticky', top: '5.5rem', height: 'calc(100vh - 7rem)' }}>
            <GarageMapPlaceholder />
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
