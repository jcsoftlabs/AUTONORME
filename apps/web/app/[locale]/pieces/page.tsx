import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import PartsCatalog from '../../../components/parts/PartsCatalog';
import { useTranslations } from 'next-intl';
import styles from '../../../components/marketplace.module.css';

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
        <PartsCatalog />
      </div>

      <Footer />
    </main>
  );
}
