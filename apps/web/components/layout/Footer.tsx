'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../homepage.module.css';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const platformLinks = [
    { href: `/${locale}/garages`, label: t('find_garage') },
    { href: `/${locale}/pieces`, label: t('parts') },
    { href: `/${locale}/maintenance`, label: t('maintenance') },
    { href: `/${locale}/autobot`, label: t('autobot') },
    { href: `/${locale}/compte/login`, label: t('customer_space') },
  ];

  const companyLinks = [
    { href: `/${locale}/a-propos`, label: t('about') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/rejoindre`, label: t('join') },
  ];

  const resources = [t('support_fr_ht_en'), t('verified_network'), t('smart_guidance')];

  const footerPills = [t('support_label'), t('coverage_label'), t('language_label')];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <div className={styles.footerGrid}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <Image src="/log.png" alt="AUTONORME" width={160} height={40} style={{ objectFit: 'contain' }} />
            </div>
            <p className={styles.footerBrandText}>{t('desc')}</p>
            <div className={styles.footerPills}>
              {footerPills.map((pill) => (
                <span key={pill} className={styles.footerPill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <FooterColumn title={t('platform')} links={platformLinks} />
          <FooterColumn title={t('company')} links={companyLinks} />
          <FooterFacts title={t('professionals')} facts={resources} />
        </div>
      </div>

      <hr className={styles.footerDivider} />

      <div className="container">
        <div className={styles.footerBottom}>
          <p className={styles.footerMuted}>{t('rights', { year: new Date().getFullYear() })}</p>
          <div className={styles.footerLegal}>
            <span>{t('privacy')}</span>
            <span>{t('terms')}</span>
            <span>{t('cookies')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className={styles.footerColumnTitle}>{title}</h3>
      <ul className={styles.footerList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.footerLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterFacts({ title, facts }: { title: string; facts: string[] }) {
  return (
    <div>
      <h3 className={styles.footerColumnTitle}>{title}</h3>
      <ul className={styles.footerList}>
        {facts.map((fact) => (
          <li key={fact} className={styles.footerMuted}>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}
