import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import styles from '../../../components/editorial.module.css';

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('MaintenancePage');

  const highlights = [t('highlight_1'), t('highlight_2'), t('highlight_3')];
  const pillars = [1, 2, 3].map((item) => ({
    title: t(`pillar_${item}_title`),
    body: t(`pillar_${item}_body`),
  }));
  const steps = [1, 2, 3].map((item) => ({
    step: t(`step_${item}_label`),
    title: t(`step_${item}_title`),
    body: t(`step_${item}_body`),
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
              {highlights.map((highlight) => (
                <span key={highlight} className={styles.highlightChip}>
                  {highlight}
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
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('section_value_title')}</h2>
            <p className={styles.sectionText}>{t('section_value_body')}</p>
          </div>

          <div className={styles.grid3}>
            {pillars.map((pillar) => (
              <article key={pillar.title} className={styles.card}>
                <div className={styles.cardKicker}>{t('pillar_kicker')}</div>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardText}>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('section_steps_title')}</h2>
            <p className={styles.sectionText}>{t('section_steps_body')}</p>
          </div>

          <div className={styles.timeline}>
            {steps.map((step) => (
              <div key={step.step} className={styles.timelineItem}>
                <div className={styles.timelineStep}>{step.step}</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardText}>{step.body}</p>
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
              <Link href={`/${locale}/autobot`} className={`${styles.ctaLink} ${styles.ctaLinkSecondary}`}>
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
