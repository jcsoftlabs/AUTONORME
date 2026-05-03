import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import styles from '../../../components/editorial.module.css';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('AboutPage');

  const values = [1, 2, 3].map((item) => ({
    title: t(`value_${item}_title`),
    body: t(`value_${item}_body`),
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

            <div className={styles.statRow}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.statBox}>
                  <span className={styles.statValue}>{t(`stat_${item}_value`)}</span>
                  <span className={styles.statLabel}>{t(`stat_${item}_label`)}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('mission_title')}</h2>
            <p className={styles.sectionText}>{t('mission_body')}</p>
          </div>

          <div className={styles.grid3}>
            {values.map((value) => (
              <article key={value.title} className={styles.card}>
                <div className={styles.cardKicker}>{t('value_kicker')}</div>
                <h3 className={styles.cardTitle}>{value.title}</h3>
                <p className={styles.cardText}>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid2}>
            <article className={styles.card}>
              <div className={styles.cardKicker}>{t('ecosystem_kicker')}</div>
              <h2 className={styles.cardTitle}>{t('ecosystem_title')}</h2>
              <p className={styles.cardText}>{t('ecosystem_body')}</p>
            </article>

            <article className={styles.card}>
              <div className={styles.cardKicker}>{t('partners_kicker')}</div>
              <h2 className={styles.cardTitle}>{t('partners_title')}</h2>
              <p className={styles.cardText}>{t('partners_body')}</p>
            </article>
          </div>

          <div className={styles.ctaBand}>
            <h3>{t('cta_title')}</h3>
            <p>{t('cta_body')}</p>
            <div className={styles.ctaLinks}>
              <Link href={`/${locale}/rejoindre`} className={`${styles.ctaLink} ${styles.ctaLinkPrimary}`}>
                {t('cta_primary')}
              </Link>
              <Link href={`/${locale}/blog`} className={`${styles.ctaLink} ${styles.ctaLinkSecondary}`}>
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
