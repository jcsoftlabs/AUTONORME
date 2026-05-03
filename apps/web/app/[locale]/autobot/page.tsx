import Header from '../../../components/layout/Header';
import AutoBotInterface from '../../../components/autobot/AutoBotInterface';
import Footer from '../../../components/layout/Footer';
import styles from '../../../components/autobot/autobot.module.css';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'AutoBot IA — Votre Assistant Automobile Intelligent',
  description: 'Discutez avec AutoBot, l\'IA d\'AUTONORME conçue pour répondre à toutes vos questions sur les pièces automobiles et les garages.',
  openGraph: {
    title: 'AutoBot IA — Votre Assistant Automobile Intelligent',
    description: 'Discutez avec AutoBot, l\'IA d\'AUTONORME conçue pour répondre à toutes vos questions.',
    url: 'https://autonorme.com/autobot',
    siteName: 'AUTONORME',
    images: [
      {
        url: '/og-autobot.png',
        width: 1200,
        height: 630,
        alt: 'AutoBot AUTONORME',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default async function AutoBotPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'AutoBot' });

  return (
    <main className={styles.page} style={{ fontFamily: 'var(--font-body)' }}>
      <Header />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>{t('hero_eyebrow')}</span>
          <h1 className={styles.title}>{t('hero_title')}</h1>
          <p className={styles.subtitle}>{t('hero_subtitle')}</p>
          <div className={styles.heroHighlights}>
            <span className={styles.heroHighlight}>{t('hero_highlight_1')}</span>
            <span className={styles.heroHighlight}>{t('hero_highlight_2')}</span>
            <span className={styles.heroHighlight}>{t('hero_highlight_3')}</span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.content}`}>
        <AutoBotInterface />
      </div>

      <Footer />
    </main>
  );
}
