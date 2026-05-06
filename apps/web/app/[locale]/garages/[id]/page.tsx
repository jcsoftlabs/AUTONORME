import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import Header from '../../../../components/layout/Header';
import Footer from '../../../../components/layout/Footer';
import BookingButton from '../../../../components/garages/BookingButton';
import styles from '../../../../components/marketplace.module.css';

type Garage = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city?: string | null;
  lat: number;
  lng: number;
  phone?: string | null;
  description?: string | null;
  specialties: string[];
  isVerified: boolean;
  rating?: number | null;
  totalReviews: number;
};

async function getGarage(slug: string): Promise<Garage | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/v1/garages/${slug}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to load garage');

  const payload = await response.json();
  return payload.data as Garage;
}

function sanitizePhone(phone?: string | null) {
  if (!phone) return null;
  return phone.replace(/[^\d+]/g, '');
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Garage ${params.id} — AUTONORME`,
    description: 'Prenez rendez-vous dans ce garage certifié AUTONORME.',
  };
}

export default async function GarageDetailsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Garages' });
  const garage = await getGarage(params.id);

  if (!garage) {
    notFound();
  }

  const phone = sanitizePhone(garage.phone);
  const whatsappLink = phone ? `https://wa.me/${phone.replace(/^\+/, '')}` : null;
  const telLink = phone ? `tel:${phone}` : null;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${garage.lat},${garage.lng}`;

  return (
    <main className={styles.pageShell} style={{ fontFamily: 'var(--font-body)' }}>
      <Header />

      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <Link href={`/${params.locale}/garages`} className={styles.backLink}>
            {t('back_list')}
          </Link>
          <span className={styles.pageEyebrow}>{t('detail_eyebrow')}</span>
          <h1 className={styles.pageTitle}>{garage.name}</h1>
          <p className={styles.pageSubtitle}>
            {garage.city || t('city_unavailable')} · {garage.address}
          </p>
          <div className={styles.heroHighlights}>
            {garage.isVerified && <span className={styles.heroHighlight}>{t('verified_badge')}</span>}
            <span className={styles.heroHighlight}>
              {t('rating_short')} {garage.rating ? garage.rating.toFixed(1) : t('rating_unavailable')}
            </span>
            <span className={styles.heroHighlight}>
              {garage.totalReviews > 0
                ? t('reviews_label', { count: garage.totalReviews })
                : t('reviews_new')}
            </span>
          </div>
        </div>
      </section>

      <div className={`container ${styles.contentWrap}`}>
        <div className={styles.detailGrid}>
          <div className={styles.detailContent}>
            <section className={styles.detailSection}>
              <h2 className={styles.detailSectionTitle}>{t('details_title')}</h2>
              <p className={styles.detailText}>
                {garage.description || t('detail_description_fallback')}
              </p>
            </section>

            <section className={styles.detailSection}>
              <h2 className={styles.detailSectionTitle}>{t('specialties')}</h2>
              <div className={styles.specialtyRow}>
                {garage.specialties?.length > 0 ? (
                  garage.specialties.map((specialty) => (
                    <span key={specialty} className={styles.specialtyTag}>
                      {specialty}
                    </span>
                  ))
                ) : (
                  <p className={styles.detailText}>{t('specialties_fallback')}</p>
                )}
              </div>
            </section>

            <section className={styles.detailSection}>
              <h2 className={styles.detailSectionTitle}>{t('field_observations_title')}</h2>
              <div className={styles.detailStats}>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('field_city')}</span>
                  <span className={styles.detailStatValue}>{garage.city || t('city_unavailable')}</span>
                </div>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('field_phone')}</span>
                  <span className={styles.detailStatValue}>{garage.phone || t('contact_request_only')}</span>
                </div>
                <div className={styles.detailStat}>
                  <span className={styles.detailStatLabel}>{t('field_status')}</span>
                  <span className={styles.detailStatValue}>
                    {garage.isVerified ? t('verified_badge') : t('verification_pending')}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className={styles.detailSidebar}>
            <div className={styles.ctaPanel}>
              <h3 className={styles.panelTitle}>{t('need_maintenance')}</h3>
              <p className={styles.panelText}>{t('book_desc')}</p>

              <div className={styles.ctaButtons}>
                <BookingButton
                  garageId={garage.id}
                  garageName={garage.name}
                  bookBtnLabel={t('book_btn')}
                />
                {telLink && (
                  <Link href={telLink} className={styles.secondaryLinkBtn}>
                    {t('call_cta')}
                  </Link>
                )}
                {whatsappLink && (
                  <Link href={whatsappLink} className={styles.secondaryLinkBtn} target="_blank" rel="noreferrer">
                    {t('whatsapp_cta')}
                  </Link>
                )}
                <Link href={mapsLink} className={styles.secondaryLinkBtn} target="_blank" rel="noreferrer">
                  {t('directions_cta')}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
