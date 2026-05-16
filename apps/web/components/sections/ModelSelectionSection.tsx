'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../homepage.module.css';

interface FeaturedModel {
  id: string;
  title: string;
  years: string;
  imageUrl: string;
  filterMake: string;
  filterModel: string;
}

export default function ModelSelectionSection() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const [models, setModels] = useState<FeaturedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const quickCategories = [
    { key: 'brakes', href: `/${locale}/pieces?category=FREINAGE` },
    { key: 'engine', href: `/${locale}/pieces?category=MOTEUR` },
    { key: 'suspension', href: `/${locale}/pieces?category=SUSPENSION` },
    { key: 'electrical', href: `/${locale}/pieces?category=ELECTRIQUE` },
  ];

  const trustCards = [
    { value: '24h', label: t('catalog_trust_1') },
    { value: '5 000+', label: t('catalog_trust_2') },
    { value: 'FR/HT/EN', label: t('catalog_trust_3') },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/featured-models`);
        const result = await response.json();
        if (result.success) {
          setModels(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  if (loading) {
    return (
      <section className={styles.modelSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
             <div className="skeleton" style={{ width: '300px', height: '40px', margin: '0 auto' }}></div>
          </div>
          <div className={styles.modelGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.modelCard} style={{ opacity: 0.5 }}>
                <div className={styles.imageWrapper}>
                   <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (models.length === 0) return null;

  return (
    <section className={styles.modelSelection}>
      <div className={styles.container}>
        <div className={styles.catalogUtilityGrid}>
          <div className={styles.catalogPromoCard}>
            <span className={styles.catalogPromoEyebrow}>{t('catalog_promo_eyebrow')}</span>
            <h2 className={styles.catalogPromoTitle}>{t('catalog_promo_title')}</h2>
            <p className={styles.catalogPromoBody}>{t('catalog_promo_body')}</p>

            <div className={styles.catalogCategoryRow}>
              {quickCategories.map((category) => (
                <Link key={category.key} href={category.href} className={styles.catalogCategoryChip}>
                  {t(`catalog_category_${category.key}`)}
                </Link>
              ))}
            </div>

            <div className={styles.catalogTrustGrid}>
              {trustCards.map((card) => (
                <div key={card.label} className={styles.catalogTrustCard}>
                  <span className={styles.catalogTrustValue}>{card.value}</span>
                  <span className={styles.catalogTrustLabel}>{card.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.catalogOfferCard}>
            <span className={styles.catalogOfferEyebrow}>{t('catalog_offer_eyebrow')}</span>
            <div className={styles.catalogOfferTitle}>{t('catalog_offer_title')}</div>
            <p className={styles.catalogOfferBody}>{t('catalog_offer_body')}</p>
            <Link href={`/${locale}/pieces`} className={styles.catalogOfferButton}>
              {t('catalog_offer_cta')}
            </Link>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{t('shop_by_model_title')}</h2>
            <div className={styles.titleUnderline}></div>
          </div>
          <div className={styles.scrollActions}>
             <button onClick={() => scroll('left')} className={styles.scrollBtn}>←</button>
             <button onClick={() => scroll('right')} className={styles.scrollBtn}>→</button>
          </div>
        </div>

        <div className={styles.scrollWrapper}>
          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            <div className={styles.modelGrid}>
              {models.map((model) => (
                <Link
                  key={model.id}
                  href={`/${locale}/pieces?make=${model.filterMake || ''}&model=${model.filterModel || ''}`}
                  className={styles.modelCard}
                >
                  <div className={styles.imageWrapper}>
                    {model.imageUrl ? (
                      <Image
                        src={model.imageUrl}
                        alt={model.title || 'Modèle'}
                        fill
                        className={styles.modelImage}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>🚗</div>
                    )}
                  </div>
                  <div className={styles.modelInfo}>
                    <h3 className={styles.modelName}>
                      {model.title || `${model.filterMake || ''} ${model.filterModel || ''}`.trim() || 'Modèle Auto'}
                    </h3>
                    <p className={styles.modelYear}>{model.years || 'Tous modèles'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
