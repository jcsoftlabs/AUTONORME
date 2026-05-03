import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import styles from '../../../components/editorial.module.css';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('BlogPage');

  const articles = [1, 2, 3].map((item) => ({
    category: t(`article_${item}_category`),
    title: t(`article_${item}_title`),
    body: t(`article_${item}_body`),
    meta: t(`article_${item}_meta`),
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
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t('articles_title')}</h2>
            <p className={styles.sectionText}>{t('articles_body')}</p>
          </div>

          <div className={styles.grid3}>
            {articles.map((article) => (
              <article key={article.title} className={styles.card}>
                <div className={styles.articleMeta}>
                  <span>{article.category}</span>
                  <span>{article.meta}</span>
                </div>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardText}>{article.body}</p>
              </article>
            ))}
          </div>

          <div className={styles.ctaBand}>
            <h3>{t('cta_title')}</h3>
            <p>{t('cta_body')}</p>
            <div className={styles.ctaLinks}>
              <Link href={`/${locale}/maintenance`} className={`${styles.ctaLink} ${styles.ctaLinkPrimary}`}>
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
