'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import styles from '../homepage.module.css';

const POPULAR_MODELS = [
  {
    id: 'hilux',
    name: 'TOYOTA HILUX',
    years: '2015-2025',
    image: 'https://images.unsplash.com/photo-1622321453264-f67455a02484?auto=format&fit=crop&q=80&w=400', // Exemple d'image propre
  },
  {
    id: 'patrol',
    name: 'NISSAN PATROL',
    years: '2010-2024',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'grand-vitara',
    name: 'SUZUKI GV',
    years: '2005-2024',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'land-cruiser',
    name: 'PRADO',
    years: '2010-2025',
    image: 'https://images.unsplash.com/photo-1626233519828-5692019910d6?auto=format&fit=crop&q=80&w=400',
  },
];

export default function ModelSelectionSection() {
  const locale = useLocale();

  return (
    <section className={styles.modelSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>SHOP BY MODEL</h2>
          <div className={styles.titleUnderline}></div>
        </div>

        <div className={styles.modelGrid}>
          {POPULAR_MODELS.map((model) => (
            <Link 
              key={model.id} 
              href={`/${locale}/pieces?model=${model.name}`}
              className={styles.modelCard}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={model.image} 
                  alt={model.name}
                  width={400}
                  height={225}
                  className={styles.modelImage}
                />
              </div>
              <div className={styles.modelInfo}>
                <h3 className={styles.modelName}>{model.name}</h3>
                <span className={styles.modelYears}>{model.years}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
