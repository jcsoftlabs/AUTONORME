'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../homepage.module.css';

export default function FeaturesSection() {
  const locale = useLocale();
  const t = useTranslations('Features');
  const quickSearches = [
    { label: t('quick_1'), href: '/pieces?category=FREINAGE' },
    { label: t('quick_2'), href: '/pieces?category=MOTEUR' },
    { label: t('quick_3'), href: '/pieces?category=ELECTRIQUE' },
    { label: t('quick_4'), href: '/garages' },
  ];
  const features = [
    {
      tag: 'GAR',
      color: 'var(--color-primary-700)',
      colorLight: 'var(--color-primary-100)',
      title: t('garage_title'),
      description: t('garage_description'),
      href: '/garages',
      cta: t('garage_cta'),
      highlights: [t('garage_highlight_1'), t('garage_highlight_2'), t('garage_highlight_3')],
    },
    {
      tag: 'PRT',
      color: 'var(--color-primary-500)',
      colorLight: 'var(--color-primary-50)',
      title: t('parts_title'),
      description: t('parts_description'),
      href: '/pieces',
      cta: t('parts_cta'),
      highlights: [t('parts_highlight_1'), t('parts_highlight_2'), t('parts_highlight_3')],
    },
    {
      tag: 'AI',
      color: 'var(--color-accent-purple)',
      colorLight: '#EDE9FE',
      title: t('autobot_title'),
      description: t('autobot_description'),
      href: '/autobot',
      cta: t('autobot_cta'),
      highlights: [t('autobot_highlight_1'), t('autobot_highlight_2'), t('autobot_highlight_3')],
    },
  ];

  return (
    <section id="features" className={`section ${styles.featuresSection}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">{t('badge')}</span>
          <h2 className="section-title">
            {t('title_line_1')}<br />
            <span style={{ color: 'var(--color-primary-500)' }}>{t('title_line_2')}</span>
          </h2>
          <p className="section-subtitle">{t('subtitle')}</p>
        </div>

        <div className={styles.featureQuickRow}>
          <span className={styles.featureQuickLabel}>{t('quick_label')}</span>
          <div className={styles.featureQuickLinks}>
            {quickSearches.map((item) => (
              <Link key={item.label} href={`/${locale}${item.href}`} className={styles.featureQuickLink}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={styles.featureCard}
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div
                className={styles.featureTag}
                style={{
                  background: feature.colorLight,
                  color: feature.color,
                }}
              >
                {feature.tag}
              </div>

              <h3 className={styles.featureTitle}>{feature.title}</h3>

              <p className={styles.featureDescription}>{feature.description}</p>

              <ul className={styles.featureList}>
                {feature.highlights.map((h) => (
                  <li
                    key={h}
                    className={styles.featureListItem}
                  >
                    <span className={styles.featureDot} style={{ background: feature.color }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}${feature.href}`}
                className={styles.featureCta}
                style={{
                  color: feature.color,
                }}
              >
                {feature.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
