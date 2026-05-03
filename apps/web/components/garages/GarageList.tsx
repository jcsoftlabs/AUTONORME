'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../lib/api-client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../marketplace.module.css';

interface Garage {
  id: string;
  slug: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  isCertified: boolean;
  isVerified: boolean;
  rating?: number;
  totalReviews: number;
  specialties: string[];
  description?: string;
}

export default function GarageList() {
  const t = useTranslations('Garages');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  const { data: garages, isLoading, error } = useQuery<Garage[]>({
    queryKey: ['garages', selectedSpecialty],
    queryFn: () =>
      fetchApi('/garages', {
        params: selectedSpecialty === 'ALL' ? undefined : { specialty: selectedSpecialty },
      }),
  });

  const specialties = Array.from(
    new Set((garages ?? []).flatMap((garage) => garage.specialties ?? [])),
  ).slice(0, 8);

  const filteredGarages = garages?.filter((garage) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      garage.name.toLowerCase().includes(query) ||
      (garage.city ?? '').toLowerCase().includes(query) ||
      (garage.address ?? '').toLowerCase().includes(query) ||
      (garage.specialties ?? []).some((specialty) => specialty.toLowerCase().includes(query))
    );
  });

  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    return phone.replace(/\s+/g, ' ').trim();
  };

  return (
    <div className={styles.listRail}>
      <div className={`${styles.panel} ${styles.panelPadding}`}>
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

      <div className={`${styles.panel} ${styles.panelPadding}`}>
        <span className={styles.sectionLabel}>{t('specialty_filter_label')}</span>
        <div className={styles.chipRow}>
          <button
            type="button"
            className={`${styles.chip} ${selectedSpecialty === 'ALL' ? styles.chipActive : ''}`}
            onClick={() => setSelectedSpecialty('ALL')}
          >
            {t('specialty_all')}
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              type="button"
              className={`${styles.chip} ${selectedSpecialty === specialty ? styles.chipActive : ''}`}
              onClick={() => setSelectedSpecialty(specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultsMeta}>
        <span>
          {filteredGarages?.length ?? 0} {t('results_count')}
        </span>
        <span>{t('results_hint')}</span>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {error && <div className={styles.errorBox}>{t('load_error')}</div>}

      {!isLoading && !error && (!filteredGarages || filteredGarages.length === 0) && (
        <div className={styles.stateBox}>
          <h3 className={styles.stateTitle}>{t('empty_title')}</h3>
          <p className={styles.panelText}>
            {search ? t('empty_search') : t('empty_default')}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filteredGarages?.map((garage) => {
          const phone = formatPhone(garage.phone);
          const reviewText =
            garage.totalReviews > 0
              ? t('reviews_label', { count: garage.totalReviews })
              : t('reviews_new');

          return (
            <Link
              href={`/${locale}/garages/${garage.slug}`}
              key={garage.id}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <article className={styles.garageCard}>
                <div className={styles.garageTop}>
                  <div>
                    <h3 className={styles.garageName}>{garage.name}</h3>
                    <div className={styles.garageCity}>
                      {garage.city || t('city_unavailable')} · {garage.address}
                    </div>
                  </div>
                  {garage.isVerified && (
                    <span className={styles.verifiedBadge}>{t('verified_badge')}</span>
                  )}
                </div>

                <div className={styles.garageInfoRow}>
                  <div className={styles.garageInfoItem}>
                    <strong>{t('rating_short')}</strong> {garage.rating ? garage.rating.toFixed(1) : t('rating_unavailable')}
                  </div>
                  <div className={styles.garageInfoItem}>
                    <strong>{t('reviews_short')}</strong> {reviewText}
                  </div>
                  <div className={styles.garageInfoItem}>
                    <strong>{t('contact_short')}</strong> {phone ?? t('contact_request_only')}
                  </div>
                </div>

                {garage.specialties?.length > 0 && (
                  <div className={styles.specialtyRow}>
                    {garage.specialties.slice(0, 4).map((specialty) => (
                      <span key={specialty} className={styles.specialtyTag}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.garageFooter}>
                  <div className={styles.rating}>
                    {garage.description
                      ? garage.description.slice(0, 96) + (garage.description.length > 96 ? '…' : '')
                      : t('description_fallback')}
                  </div>
                  <div className={styles.garageLinkText}>{t('view_details')}</div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
