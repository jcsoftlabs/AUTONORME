'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { VEHICLE_DATA, YEARS } from '@autonorme/types';
import styles from '../homepage.module.css';

type VehicleCatalogModel = {
  value: string;
  label: string;
  years: number[];
};

type VehicleCatalogMake = {
  value: string;
  label: string;
  models: VehicleCatalogModel[];
};

function buildCatalogFromSharedData(): VehicleCatalogMake[] {
  return Object.entries(VEHICLE_DATA).map(([make, models]) => ({
    value: make,
    label: make,
    models: models.map((model) => ({
      value: model,
      label: model,
      years: [...YEARS],
    })),
  }));
}

function mergeCatalogs(baseCatalog: VehicleCatalogMake[], apiCatalog: VehicleCatalogMake[]): VehicleCatalogMake[] {
  const makeMap = new Map<string, Map<string, Set<number>>>();

  const addCatalog = (catalog: VehicleCatalogMake[]) => {
    catalog.forEach((makeEntry) => {
      if (!makeMap.has(makeEntry.value)) {
        makeMap.set(makeEntry.value, new Map());
      }

      const modelMap = makeMap.get(makeEntry.value)!;
      makeEntry.models.forEach((modelEntry) => {
        if (!modelMap.has(modelEntry.value)) {
          modelMap.set(modelEntry.value, new Set());
        }
        const years = modelMap.get(modelEntry.value)!;
        (modelEntry.years?.length ? modelEntry.years : YEARS).forEach((year) => years.add(year));
      });
    });
  };

  addCatalog(baseCatalog);
  addCatalog(apiCatalog);

  return Array.from(makeMap.entries())
    .map(([make, models]) => ({
      value: make,
      label: make,
      models: Array.from(models.entries())
        .map(([model, years]) => ({
          value: model,
          label: model,
          years: Array.from(years).sort((a, b) => b - a),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

const FALLBACK_CATALOG: VehicleCatalogMake[] = buildCatalogFromSharedData();

export default function HeroSection() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const [catalog, setCatalog] = useState<VehicleCatalogMake[]>(FALLBACK_CATALOG);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  const selectedMake = useMemo(
    () => catalog.find((entry) => entry.value === make),
    [catalog, make],
  );
  const years = useMemo(() => YEARS.map(String), []);
  const makes = catalog;
  const models = selectedMake?.models ?? [];
  const canSearch = Boolean(year && make && model);

  useEffect(() => {
    let active = true;

    async function fetchCatalog() {
      try {
        const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const apiBase = configuredApiUrl.endsWith('/api/v1')
          ? configuredApiUrl
          : `${configuredApiUrl}/api/v1`;
        const response = await fetch(`${apiBase}/content/vehicle-catalog`);
        const result = await response.json();
        const makesData = result?.data?.makes ?? result?.makes;

        if (active && Array.isArray(makesData) && makesData.length > 0) {
          setCatalog(mergeCatalogs(FALLBACK_CATALOG, makesData));
        }
      } catch (error) {
        console.error('Failed to fetch vehicle catalog:', error);
      }
    }

    fetchCatalog();
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = () => {
    if (!canSearch) return;
    const params = new URLSearchParams({ year, make, model });
    router.push(`/${locale}/pieces?${params.toString()}`);
  };

  return (
    <section
      id="hero"
      className={styles.hero}
    >
      <div className="container">
        <div className={styles.heroContentSimple}>
          <h1 className={styles.heroSimpleTitle}>{t('selector_title')}</h1>
          <p className={styles.heroLeadCompact}>{t('hero_focus_subtitle')}</p>
          <div className={styles.heroTrustRow}>
            <span className={styles.heroTrustPill}>{t('trust_1')}</span>
            <span className={styles.heroTrustPill}>{t('trust_2')}</span>
            <span className={styles.heroTrustPill}>{t('trust_3')}</span>
          </div>
          <div className={styles.heroSelectorShell}>
            <div className={styles.heroSelectorCardSimple}>
              <div className={styles.heroSelectorGrid}>
                <select
                  className={styles.heroSelect}
                  value={make}
                  onChange={(event) => {
                    setMake(event.target.value);
                    setModel('');
                  }}
                >
                  <option value="">{t('selector_make')}</option>
                  {makes.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.heroSelect}
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  disabled={!make}
                >
                  <option value="">{t('selector_model')}</option>
                  {models.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.heroSelect}
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  <option value="">{t('selector_year')}</option>
                  {years.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.heroSelectorActions}>
                <button
                  type="button"
                  className={styles.heroGoButtonSimple}
                  onClick={handleSearch}
                  disabled={!canSearch}
                >
                  {t('selector_cta')}
                </button>
              </div>

              <div className={styles.mobileQuickActions}>
                <Link href={`/${locale}/pieces`} className={styles.mobileQuickAction}>
                  {t('catalog_parts')}
                </Link>
                <Link href={`/${locale}/garages`} className={styles.mobileQuickAction}>
                  {t('find_garage')}
                </Link>
              </div>

              <p className={styles.mobileTrustNote}>
                {t('trust_2')} · {t('trust_3')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
