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
