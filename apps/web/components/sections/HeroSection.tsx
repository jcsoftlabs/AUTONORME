import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../homepage.module.css';

export default function HeroSection() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <section id="hero" className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div>
            <div className={styles.heroEyebrow}>{t('badge')}</div>
            <h1 className={styles.heroTitle}>
              {t('title_start')}{' '}
              <span className="text-gradient-gold">{t('title_highlight')}</span>
              <br />
              {t('title_end')}
            </h1>
            <p className={styles.heroLead}>
              {t('subtitle')} <strong>{t('subtitle_strong')}</strong> {t('subtitle_end')}
            </p>
            <div className={styles.heroActions}>
              <Link href={`/${locale}/garages`} className="btn btn-lg btn-white">
                {t('find_garage')}
              </Link>
              <Link href={`/${locale}/pieces`} className={`btn btn-lg ${styles.heroSecondaryBtn}`}>
                {t('catalog_parts')}
              </Link>
            </div>
            <div className={styles.heroMeta}>
              {[
                { value: '200+', label: t('stat_garages') },
                { value: '5 000+', label: t('stat_parts') },
                { value: '3', label: t('stat_langs') },
              ].map((stat) => (
                <div key={stat.label} className={styles.heroMetaItem}>
                  <span className={styles.heroMetaValue}>{stat.value}</span>
                  <span className={styles.heroMetaLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.heroPanelTop}>
              <div className={styles.heroPanelTitle}>{t('panel_title')}</div>
              <span className={styles.heroPanelBadge}>{t('panel_badge')}</span>
            </div>

            <div className={styles.heroPanelCard}>
              <span className={styles.heroPanelLabel}>{t('panel_vehicle_label')}</span>
              <div className={styles.heroPanelValue}>{t('panel_vehicle_value')}</div>
              <div className={styles.heroPanelDetail}>{t('panel_vehicle_detail')}</div>
            </div>

            <div className={styles.heroPanelCard}>
              <span className={styles.heroPanelLabel}>{t('panel_service_label')}</span>
              <div className={styles.heroPanelValue}>{t('panel_service_value')}</div>
              <div className={styles.heroPanelDetail}>{t('panel_service_detail')}</div>
            </div>

            <div className={styles.heroPanelFooter}>
              <div className={styles.heroPanelMetric}>
                <span className={styles.heroPanelMetricValue}>{t('panel_metric_one_value')}</span>
                <span className={styles.heroPanelMetricLabel}>{t('panel_metric_one_label')}</span>
              </div>
              <div className={styles.heroPanelMetric}>
                <span className={styles.heroPanelMetricValue}>{t('panel_metric_two_value')}</span>
                <span className={styles.heroPanelMetricLabel}>{t('panel_metric_two_label')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
