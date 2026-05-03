import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import PartsCatalog from '../../../components/parts/PartsCatalog';
import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Catalogue AUTOparts — AUTONORME',
  description: 'Le plus grand catalogue en ligne de pièces automobiles certifiées en Haïti. Plus de 5000 références en stock.',
  openGraph: {
    title: 'Catalogue AUTOparts — AUTONORME',
    description: 'Le plus grand catalogue en ligne de pièces automobiles certifiées en Haïti.',
    url: 'https://autonorme.com/pieces',
    siteName: 'AUTONORME',
    images: [
      {
        url: '/og-pieces.png',
        width: 1200,
        height: 630,
        alt: 'Catalogue AUTOparts',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function PartsPage() {
  const t = useTranslations('Parts');

  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--color-neutral-50)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800))', paddingTop: '11rem', paddingBottom: '4rem', color: '#FFFFFF' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 'var(--space-md)' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ flex: 1, padding: 'var(--space-2xl) 0' }}>
        <PartsCatalog />
      </div>

      <Footer />
    </main>
  );
}
