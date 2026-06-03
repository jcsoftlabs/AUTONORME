'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from '../homepage.module.css';

type MockProduct = {
  name: string;
  category: string;
  fitment: string;
  price: string;
  stock: string;
  badge: string;
  accent: string;
};

const products: MockProduct[] = [
  {
    name: 'Plaquettes de frein avant',
    category: 'Freinage',
    fitment: 'Toyota Corolla 2014-2022',
    price: '4 850 HTG',
    stock: 'En stock à Delmas',
    badge: 'Top vente',
    accent: 'brake',
  },
  {
    name: 'Filtre à huile premium',
    category: 'Moteur',
    fitment: 'Honda CR-V / Civic',
    price: '1 250 HTG',
    stock: 'Livraison rapide',
    badge: 'Essentiel',
    accent: 'filter',
  },
  {
    name: 'Batterie 12V renforcée',
    category: 'Électrique',
    fitment: 'SUV & berlines',
    price: '18 900 HTG',
    stock: 'Stock limité',
    badge: 'Garantie',
    accent: 'battery',
  },
  {
    name: 'Amortisseur arrière',
    category: 'Suspension',
    fitment: 'Toyota RAV4 2013-2018',
    price: '7 600 HTG',
    stock: 'Sur commande',
    badge: 'Compatible',
    accent: 'shock',
  },
  {
    name: 'Alternateur reconditionné',
    category: 'Moteur',
    fitment: 'Hyundai Tucson / Kia Sportage',
    price: '22 500 HTG',
    stock: 'Import disponible',
    badge: 'Testé',
    accent: 'alternator',
  },
  {
    name: 'Ampoules LED H11',
    category: 'Électrique',
    fitment: 'Universel',
    price: '2 950 HTG',
    stock: 'En stock',
    badge: 'Upgrade',
    accent: 'light',
  },
  {
    name: 'Kit essuie-glaces',
    category: 'Accessoires',
    fitment: 'Honda Fit / Toyota Vitz',
    price: '1 800 HTG',
    stock: 'Disponible',
    badge: 'Pluie',
    accent: 'wiper',
  },
  {
    name: 'Disque de frein ventilé',
    category: 'Freinage',
    fitment: 'Nissan X-Trail 2015-2020',
    price: '6 400 HTG',
    stock: 'En stock',
    badge: 'OEM fit',
    accent: 'disc',
  },
];

const copy = {
  fr: {
    eyebrow: 'Boutique AUTOparts',
    title: 'Pièces populaires cette semaine',
    subtitle: 'Sélection mock en attendant le catalogue live: pièces utiles, compatibilité lisible, prix visibles.',
    all: 'Toutes',
    cta: 'Voir le catalogue',
    details: 'Voir détails',
  },
  ht: {
    eyebrow: 'Boutik AUTOparts',
    title: 'Pyès popilè semèn sa a',
    subtitle: 'Seleksyon mock pandan n ap tann katalòg live la: pyès itil, konpatibilite klè, pri vizib.',
    all: 'Tout',
    cta: 'Wè katalòg la',
    details: 'Wè detay',
  },
  en: {
    eyebrow: 'AUTOparts shop',
    title: 'Popular parts this week',
    subtitle: 'Mock selection while the live catalog is finalized: useful parts, readable fitment, visible prices.',
    all: 'All',
    cta: 'View catalog',
    details: 'View details',
  },
};

export default function ShopGridSection() {
  const locale = useLocale() as 'fr' | 'ht' | 'en';
  const t = copy[locale] ?? copy.fr;

  return (
    <section className={styles.shopSection}>
      <div className="container">
        <div className={styles.shopHeader}>
          <div>
            <span className={styles.shopEyebrow}>{t.eyebrow}</span>
            <h2 className={styles.shopTitle}>{t.title}</h2>
            <p className={styles.shopSubtitle}>{t.subtitle}</p>
          </div>
          <Link href={`/${locale}/pieces`} className={styles.shopCatalogLink}>
            {t.cta}
          </Link>
        </div>

        <div className={styles.shopFilters} aria-label="Catégories produits">
          {[t.all, 'Freinage', 'Moteur', 'Électrique', 'Suspension', 'Accessoires'].map((item) => (
            <span key={item} className={styles.shopFilterPill}>{item}</span>
          ))}
        </div>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <article key={product.name} className={styles.productCard}>
              <div className={`${styles.productVisual} ${styles[`productVisual_${product.accent}`]}`}>
                <div className={styles.productVisualCore}></div>
                <span className={styles.productBadge}>{product.badge}</span>
              </div>
              <div className={styles.productBody}>
                <div className={styles.productCategory}>{product.category}</div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productFitment}>{product.fitment}</p>
                <div className={styles.productMeta}>
                  <span>{product.stock}</span>
                  <strong>{product.price}</strong>
                </div>
                <Link href={`/${locale}/pieces`} className={styles.productAction}>
                  {t.details}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
