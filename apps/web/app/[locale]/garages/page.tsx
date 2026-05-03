import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import GarageList from '../../../components/garages/GarageList';
import GarageMapPlaceholder from '../../../components/garages/GarageMapPlaceholder';
import { useTranslations } from 'next-intl';
import styles from '../../../components/marketplace.module.css';

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
    <main className={styles.pageShell} style={{ fontFamily: 'var(--font-body)' }}>
      <Header />

      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <span className={styles.pageEyebrow}>{t('eyebrow')}</span>
          <h1 className={styles.pageTitle}>{t('title')}</h1>
          <p className={styles.pageSubtitle}>{t('subtitle')}</p>
          <div className={styles.heroHighlights}>
            <span className={styles.heroHighlight}>{t('highlight_1')}</span>
            <span className={styles.heroHighlight}>{t('highlight_2')}</span>
            <span className={styles.heroHighlight}>{t('highlight_3')}</span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.contentWrap}`}>
        <div className={styles.twoColumnLayout}>
          <div>
            <GarageList />
          </div>

          <div className={styles.stickyRail}>
            <GarageMapPlaceholder />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
