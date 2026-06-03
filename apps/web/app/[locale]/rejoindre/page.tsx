import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import JoinInterestForm from '../../../components/join/JoinInterestForm';
import styles from '../../../components/editorial.module.css';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('JoinPage');

  return (
    <main className={styles.pageShell}>
      <Header />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <span className={styles.eyebrow}>{t('eyebrow')}</span>
            <h1 className={styles.heroTitle}>{t('title')}</h1>
            <p className={styles.heroBody}>{t('subtitle')}</p>

            <div className={styles.heroHighlights}>
              <span className={styles.highlightChip}>{t('highlight_1')}</span>
              <span className={styles.highlightChip}>{t('highlight_2')}</span>
              <span className={styles.highlightChip}>{t('highlight_3')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('form_title')}</h2>
            <p className={styles.sectionText}>{t('form_body')}</p>
          </div>

          <JoinInterestForm locale={locale} />

          <p className={styles.sectionText} style={{ marginTop: '1rem' }}>
            {t('cta_body')}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
