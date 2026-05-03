'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../homepage.module.css';

export default function CTASection() {
  const locale = useLocale();
  const t = useTranslations('HomeCTA');

  return (
    <section id="cta" className={`section ${styles.ctaSection}`}>
      <div className="container">
        <div className={styles.ctaPanel}>
          <div className={styles.ctaBadge}>{t('badge')}</div>
          <h2 className={styles.ctaTitle}>{t('title')}</h2>
          <p className={styles.ctaSubtitle}>{t('subtitle')}</p>

          <div className={styles.ctaActions}>
            <Link href={`/${locale}/compte/login`} className="btn btn-lg btn-white">
              {t('primary_cta')}
            </Link>
            <Link href={`/${locale}/garages`} className="btn btn-lg btn-ghost-white">
              {t('secondary_cta')}
            </Link>
          </div>

          <div className={styles.ctaProofs}>
            <div className={styles.ctaProof}>{t('proof_1')}</div>
            <div className={styles.ctaProof}>{t('proof_2')}</div>
            <div className={styles.ctaProof}>{t('proof_3')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
