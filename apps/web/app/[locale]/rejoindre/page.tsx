import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import styles from '../../../components/editorial.module.css';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('JoinPage');

  const tracks = [1, 2].map((item) => ({
    kicker: t(`track_${item}_kicker`),
    title: t(`track_${item}_title`),
    body: t(`track_${item}_body`),
  }));

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
              {[t('highlight_1'), t('highlight_2'), t('highlight_3')].map((item) => (
                <span key={item} className={styles.highlightChip}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <h2 className={styles.panelTitle}>{t('panel_title')}</h2>
            <p className={styles.panelText}>{t('panel_body')}</p>

            <div className={styles.panelList}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.panelItem}>
                  <strong>{t(`panel_${item}_title`)}</strong>
                  <span>{t(`panel_${item}_body`)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid2}>
            {tracks.map((track) => (
              <article key={track.title} className={styles.card}>
                <div className={styles.cardKicker}>{track.kicker}</div>
                <h2 className={styles.cardTitle}>{track.title}</h2>
                <p className={styles.cardText}>{track.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('steps_title')}</h2>
            <p className={styles.sectionText}>{t('steps_body')}</p>
          </div>

          <div className={styles.timeline}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.timelineItem}>
                <div className={styles.timelineStep}>{t(`step_${item}_label`)}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.cardTitle}>{t(`step_${item}_title`)}</h3>
                  <p className={styles.cardText}>{t(`step_${item}_body`)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.ctaBand}>
            <h3>{t('cta_title')}</h3>
            <p>{t('cta_body')}</p>
            <div className={styles.ctaLinks}>
              <Link href={`/${locale}/compte/login`} className={`${styles.ctaLink} ${styles.ctaLinkPrimary}`}>
                {t('cta_primary')}
              </Link>
              <Link href={`/${locale}/a-propos`} className={`${styles.ctaLink} ${styles.ctaLinkSecondary}`}>
                {t('cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
