'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../homepage.module.css';

export default function AutoBotPreviewSection() {
  const locale = useLocale();
  const t = useTranslations('AutoBotPreview');

  const benefits = [
    { mark: '01', title: t('benefit_1_title'), description: t('benefit_1_desc') },
    { mark: '02', title: t('benefit_2_title'), description: t('benefit_2_desc') },
    { mark: '03', title: t('benefit_3_title'), description: t('benefit_3_desc') },
  ];

  const options = [
    { title: t('option_1_title'), meta: t('option_1_meta') },
    { title: t('option_2_title'), meta: t('option_2_meta') },
    { title: t('option_3_title'), meta: t('option_3_meta') },
  ];

  return (
    <section id="autobot" className={`section ${styles.autobotSection}`}>
      <div className="container">
        <div className={styles.autobotWrap}>
          <div className={styles.autobotIntro}>
            <span className="section-eyebrow">{t('eyebrow')}</span>
            <h2 className="section-title">{t('title')}</h2>
            <p className={styles.autobotBody}>{t('body')}</p>

            <div className={styles.autobotBenefits}>
              {benefits.map((benefit) => (
                <div key={benefit.mark} className={styles.autobotBenefit}>
                  <span className={styles.autobotBenefitMark}>{benefit.mark}</span>
                  <div>
                    <div className={styles.autobotBenefitTitle}>{benefit.title}</div>
                    <div className={styles.autobotBenefitDesc}>{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/autobot`} className="btn btn-primary btn-lg">
              {t('cta')}
            </Link>
          </div>

          <div className={styles.autobotPanel}>
            <div className={styles.autobotPanelHeader}>
              <div className={styles.autobotPanelTitle}>{t('panel_title')}</div>
              <div className={styles.autobotPanelStatus}>
                <span aria-hidden="true">●</span>
                {t('panel_status')}
              </div>
            </div>

            <div className={styles.autobotScenario}>
              <div className={styles.autobotScenarioCard}>
                <span className={styles.autobotScenarioLabel}>{t('scenario_label')}</span>
                <div className={styles.autobotScenarioTitle}>{t('scenario_title')}</div>
                <div className={styles.autobotScenarioText}>{t('scenario_text')}</div>
              </div>

              <div className={styles.autobotScenarioCard}>
                <span className={styles.autobotScenarioLabel}>{t('recommendation_label')}</span>
                <div className={styles.autobotScenarioTitle}>{t('recommendation_title')}</div>
                <div className={styles.autobotScenarioList}>
                  {options.map((option) => (
                    <div key={option.title} className={styles.autobotScenarioListItem}>
                      <span className={styles.autobotScenarioMain}>{option.title}</span>
                      <span className={styles.autobotScenarioMeta}>{option.meta}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.autobotScenarioCard}>
                <span className={styles.autobotScenarioLabel}>{t('next_step_label')}</span>
                <div className={styles.autobotScenarioTitle}>{t('next_step_title')}</div>
                <div className={styles.autobotScenarioText}>{t('next_step_text')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
