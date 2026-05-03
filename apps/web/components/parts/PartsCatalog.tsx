'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { fetchApi } from '../../lib/api-client';
import styles from '../marketplace.module.css';

type SupplierSummary = {
  shopName: string;
  city?: string | null;
};

type Part = {
  id: string;
  name: string;
  category: string;
  supplier: SupplierSummary;
  oemReference?: string | null;
  priceHtg: string | number;
  stockQty: number;
  location: string;
  importAvailable: boolean;
  importDelayDays?: number | null;
};

const categoryOptions = [
  'FREINAGE',
  'MOTEUR',
  'SUSPENSION',
  'ELECTRIQUE',
  'CARROSSERIE',
  'AUTRE',
] as const;

export default function PartsCatalog() {
  const t = useTranslations('Parts');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('ALL');

  const { data: parts, isLoading, error } = useQuery<Part[]>({
    queryKey: ['parts', category],
    queryFn: () =>
      fetchApi('/parts', {
        params: category === 'ALL' ? undefined : { category },
      }),
  });

  const filteredParts = (parts ?? []).filter((part) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      part.name.toLowerCase().includes(query) ||
      (part.supplier?.shopName ?? '').toLowerCase().includes(query) ||
      (part.supplier?.city ?? '').toLowerCase().includes(query) ||
      (part.oemReference ?? '').toLowerCase().includes(query) ||
      part.category.toLowerCase().includes(query)
    );
  });

  const formatPrice = (value: string | number) =>
    Number(value).toLocaleString(locale === 'en' ? 'en-US' : 'fr-HT');

  const getStockClassName = (part: Part) => {
    if (part.stockQty > 0) return styles.stockOk;
    if (part.importAvailable) return styles.stockWarn;
    return styles.stockOut;
  };

  const getStockLabel = (part: Part) => {
    if (part.stockQty > 0) return `${part.stockQty} ${t('stock_in')}`;
    if (part.importAvailable && part.importDelayDays) {
      return t('import_delay', { days: part.importDelayDays });
    }
    if (part.importAvailable) return t('import_available');
    return t('stock_out');
  };

  return (
    <div className={styles.catalogGrid}>
      <div className={styles.catalogLayout}>
        <aside className={styles.catalogSidebar}>
          <h3 className={styles.panelTitle}>{t('filters_title')}</h3>

          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <span className={styles.sectionLabel}>{t('search_label')}</span>
            <div className={styles.filterInputWrap}>
              <span className={styles.filterIcon}>⌕</span>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>

          <div>
            <span className={styles.sectionLabel}>{t('category_label')}</span>
            <div className={styles.chipRow}>
              <button
                type="button"
                className={`${styles.chip} ${category === 'ALL' ? styles.chipActive : ''}`}
                onClick={() => setCategory('ALL')}
              >
                {t('category_all')}
              </button>
              {categoryOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.chip} ${category === item ? styles.chipActive : ''}`}
                  onClick={() => setCategory(item)}
                >
                  {t(`category_${item.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className={styles.catalogResultsHeader}>
            <div className={styles.resultsMeta}>
              <span>
                {filteredParts.length} {t('results_count')}
              </span>
              <span>{t('results_hint')}</span>
            </div>
            <select className={styles.catalogSelect} defaultValue="stock">
              <option value="stock">{t('sort_stock')}</option>
              <option value="price-asc">{t('sort_price_asc')}</option>
              <option value="price-desc">{t('sort_price_desc')}</option>
            </select>
          </div>

          {isLoading && (
            <div className={styles.partsGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.skeletonCard} style={{ height: '20rem' }} />
              ))}
            </div>
          )}

          {error && <div className={styles.errorBox}>{t('load_error')}</div>}

          {!isLoading && !error && filteredParts.length === 0 && (
            <div className={styles.stateBox}>
              <h3 className={styles.stateTitle}>{t('empty_title')}</h3>
              <p className={styles.panelText}>
                {search ? t('empty_search') : t('empty_default')}
              </p>
            </div>
          )}

          <div className={styles.partsGrid}>
            {filteredParts.map((part) => (
              <Link href={`/${locale}/pieces/${part.id}`} key={part.id} style={{ textDecoration: 'none' }}>
                <article className={styles.partCard}>
                  <div className={styles.partVisual}>{part.category.slice(0, 2)}</div>
                  <div className={styles.partCardBody}>
                    <span className={styles.partBadge}>{t(`category_${part.category.toLowerCase()}`)}</span>
                    <div className={styles.partBrand}>{part.supplier?.shopName || t('supplier_fallback')}</div>
                    <h4 className={styles.partName}>{part.name}</h4>
                    <div className={styles.partMeta}>
                      {t('reference_short')} {part.oemReference || t('reference_missing')}
                    </div>
                    <div className={styles.partMeta}>
                      {part.location} · {part.supplier?.city || t('city_unavailable')}
                    </div>

                    <div className={styles.partBottom}>
                      <div>
                        <div className={styles.partPrice}>{formatPrice(part.priceHtg)} HTG</div>
                        <div className={getStockClassName(part)}>{getStockLabel(part)}</div>
                      </div>
                      <div className={styles.supplierMeta}>
                        <span className={styles.garageLinkText}>{t('view_part')}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
