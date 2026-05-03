'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../homepage.module.css';

type Stat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
}

function StatCard({ stat, visible, locale }: { stat: Stat; visible: boolean; locale: string }) {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>
        {count.toLocaleString(locale)}{stat.suffix}
      </span>
      <div className={styles.statLabel}>{stat.label}</div>
      <div className={styles.statDescription}>{stat.description}</div>
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations('Stats');
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const stats: Stat[] = [
    { value: 200, suffix: '+', label: t('garages_label'), description: t('garages_description') },
    { value: 5000, suffix: '+', label: t('parts_label'), description: t('parts_description') },
    { value: 15000, suffix: '+', label: t('clients_label'), description: t('clients_description') },
    { value: 99, suffix: '%', label: t('satisfaction_label'), description: t('satisfaction_description') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="stats" className={`section ${styles.statsSection}`}>
      <div className="container">
        <div className={styles.statsWrap}>
          <div className={styles.statsIntro}>
            <span className={`badge ${'badge-glow'}`}>{t('badge')}</span>
            <h2 className={styles.statsTitle}>{t('title')}</h2>
            <p className={styles.statsSubtitle}>{t('subtitle')}</p>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} visible={visible} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
