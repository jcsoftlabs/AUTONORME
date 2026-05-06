import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import AddToCartButton from '../../../../components/cart/AddToCartButton';
import styles from '../../../../components/marketplace.module.css';

type CompatibleVehicle = {
  make: string;
  model: string;
  years: number[];
};

type Supplier = {
  shopName: string;
  city?: string | null;
  zones: string[];
};

type Part = {
  id: string;
  name: string;
  category: string;
  supplierId: string;
  supplier: Supplier;
  compatibleVehicles: CompatibleVehicle[];
  oemReference?: string | null;
  priceHtg: string | number;
  stockQty: number;
  location: string;
  importAvailable: boolean;
  importDelayDays?: number | null;
  images: string[];
};

async function getPart(id: string): Promise<Part | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/v1/parts/${id}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to load part');

  const payload = await response.json();
  return payload.data as Part;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Pièce ${params.id} — AUTONORME`,
    description: 'Achetez cette pièce automobile en ligne avec garantie.',
  };
}

export default async function PartDetailsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Parts' });
  const part = await getPart(params.id);

  if (!part) notFound();

  const price = Number(part.priceHtg).toLocaleString(params.locale === 'en' ? 'en-US' : 'fr-HT');
  const stockLabel =
    part.stockQty > 0
      ? `${part.stockQty} ${t('stock_in')}`
      : part.importAvailable && part.importDelayDays
        ? t('import_delay', { days: part.importDelayDays })
        : part.importAvailable
          ? t('import_available')
          : t('stock_out');

  return (
    <main className={styles.pageShell} style={{ fontFamily: 'var(--font-body)' }}>
      <Header />

      <div className={styles.breadcrumbWrap}>
        <div className="container" style={{ padding: 'var(--space-md) 0' }}>
          <div className={styles.breadcrumb}>
            <Link href={`/${params.locale}/pieces`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {t('back_catalog')}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--color-neutral-900)' }}>{part.name}</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.contentWrap}`}>
        <div className={styles.productGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            <div className={styles.productVisual}>
              {part.category.slice(0, 2)}
            </div>

            <section className={styles.productSection}>
              <h2 className={styles.detailSectionTitle}>{t('desc_title')}</h2>
              <p className={styles.detailText}>{t('detail_description')}</p>
            </section>

            <section className={styles.productSection}>
              <h2 className={styles.detailSectionTitle}>{t('compatibility')}</h2>
              {part.compatibleVehicles?.length > 0 ? (
                <ul className={styles.compatibilityList}>
                  {part.compatibleVehicles.map((vehicle) => (
                    <li key={`${vehicle.make}-${vehicle.model}`}>
                      {vehicle.make} {vehicle.model} ({vehicle.years.join(', ')})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.detailText}>{t('compatibility_fallback')}</p>
              )}
            </section>

            <section className={styles.productSection}>
              <h2 className={styles.detailSectionTitle}>{t('supplier_title')}</h2>
              <div className={styles.detailStats}>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('supplier_shop')}</span>
                  <span className={styles.detailStatValue}>{part.supplier?.shopName || t('supplier_fallback')}</span>
                </div>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('supplier_city')}</span>
                  <span className={styles.detailStatValue}>{part.supplier?.city || t('city_unavailable')}</span>
                </div>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('supplier_location')}</span>
                  <span className={styles.detailStatValue}>{part.location}</span>
                </div>
              </div>

              {part.supplier?.zones?.length > 0 && (
                <div className={styles.zoneList}>
                  {part.supplier.zones.map((zone) => (
                    <span key={zone} className={styles.specialtyTag}>
                      {zone}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className={styles.productSidebar}>
            <div className={styles.partBadge}>{t(`category_${part.category.toLowerCase()}`)}</div>
            <div style={{ marginTop: '0.9rem' }} className={styles.partBrand}>
              {part.supplier?.shopName || t('supplier_fallback')}
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', margin: '0.45rem 0 0.6rem', lineHeight: 1.2 }}>
              {part.name}
            </h1>
            <div className={styles.partMeta}>
              {t('ref')} {part.oemReference || t('reference_missing')}
            </div>

            <div style={{ margin: '1.2rem 0 0.8rem' }} className={styles.partPrice}>
              {price} HTG
            </div>

            <div className={part.stockQty > 0 ? styles.stockOk : part.importAvailable ? styles.stockWarn : styles.stockOut}>
              {stockLabel}
            </div>

            <div className={styles.ctaButtons}>
              <AddToCartButton 
                item={{
                  id: part.id,
                  name: part.name,
                  price: Number(part.priceHtg),
                  quantity: 1,
                  supplierId: part.supplierId,
                  supplierName: part.supplier?.shopName
                }}
                disabled={part.stockQty === 0 && !part.importAvailable}
                label={t('add_cart')}
              />
              <Link href={`/${params.locale}/autobot`} className={styles.secondaryLinkBtn}>
                {t('autobot_cta')}
              </Link>
              <Link href={`/${params.locale}/compte/login`} className={styles.secondaryLinkBtn}>
                {t('compatibility_login_cta')}
              </Link>
            </div>

            <div className={styles.ctaNote}>
              {t('compatibility_note')}
            </div>

            <div className={styles.ctaNote}>
              {t('warranty')}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
