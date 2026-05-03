import { useTranslations } from 'next-intl';
import styles from '../marketplace.module.css';

export default function GarageMapPlaceholder() {
  const t = useTranslations('Garages');

  return (
    <div className={`${styles.panel} ${styles.panelPadding}`}>
      <h3 className={styles.panelTitle}>{t('trust_panel_title')}</h3>
      <p className={styles.panelText}>{t('trust_panel_desc')}</p>

      <div className={styles.insightList} style={{ marginTop: '1rem' }}>
        <div className={styles.insightItem}>
          <div className={styles.insightTitle}>{t('trust_item_1_title')}</div>
          <div className={styles.insightText}>{t('trust_item_1_desc')}</div>
        </div>
        <div className={styles.insightItem}>
          <div className={styles.insightTitle}>{t('trust_item_2_title')}</div>
          <div className={styles.insightText}>{t('trust_item_2_desc')}</div>
        </div>
        <div className={styles.insightItem}>
          <div className={styles.insightTitle}>{t('trust_item_3_title')}</div>
          <div className={styles.insightText}>{t('trust_item_3_desc')}</div>
        </div>
      </div>
    </div>
  );
}
