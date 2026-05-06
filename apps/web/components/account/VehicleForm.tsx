'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../lib/authenticated-api';
import { VEHICLE_DATA, YEARS, VehicleMake } from '@autonorme/types';
import styles from '../account.module.css';

type VehiclePayload = {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  trim?: string;
  bodyType?: string;
  transmission?: string;
  engine?: string;
  drivetrain?: string;
  vin?: string;
  mileage?: number;
  averageMonthlyMileage?: number;
  color?: string;
  plate?: string;
  usageType?: string;
  primaryCity?: string;
  primaryZone?: string;
  isPrimaryVehicle?: boolean;
  purchaseDate?: string;
  purchaseMileage?: number;
  ownershipType?: string;
  tireSize?: string;
  batterySpec?: string;
  oilSpec?: string;
  coolantSpec?: string;
  brakeSpec?: string;
  locale?: string;
};

type VehicleFormProps = {
  mode: 'create' | 'edit';
  vehicleId?: string;
};

type VehicleFormState = {
  make: string;
  model: string;
  year: string;
  fuelType: string;
  trim: string;
  bodyType: string;
  transmission: string;
  engine: string;
  drivetrain: string;
  vin: string;
  mileage: string;
  averageMonthlyMileage: string;
  color: string;
  plate: string;
  usageType: string;
  primaryCity: string;
  primaryZone: string;
  isPrimaryVehicle: boolean;
  purchaseDate: string;
  purchaseMileage: string;
  ownershipType: string;
  tireSize: string;
  batterySpec: string;
  oilSpec: string;
  coolantSpec: string;
  brakeSpec: string;
  locale: string;
};

const fuelTypeOptions = ['essence', 'diesel', 'hybride', 'electrique'] as const;
const bodyTypeOptions = ['SUV', 'SEDAN', 'HATCHBACK', 'PICKUP', 'VAN', 'MOTO', 'TRICYCLE', 'AUTRE'] as const;
const transmissionOptions = ['MANUELLE', 'AUTOMATIQUE', 'CVT', 'AUTRE'] as const;
const drivetrainOptions = ['FWD', 'RWD', 'AWD', 'FOUR_X_FOUR'] as const;
const usageTypeOptions = ['PERSONNEL', 'COMMERCIAL', 'MIXTE'] as const;
const ownershipOptions = ['OWNER', 'FLEET', 'LEASE'] as const;

const emptyForm: VehicleFormState = {
  make: '',
  model: '',
  year: '',
  fuelType: 'essence',
  trim: '',
  bodyType: '',
  transmission: '',
  engine: '',
  drivetrain: '',
  vin: '',
  mileage: '',
  averageMonthlyMileage: '',
  color: '',
  plate: '',
  usageType: '',
  primaryCity: '',
  primaryZone: '',
  isPrimaryVehicle: false,
  purchaseDate: '',
  purchaseMileage: '',
  ownershipType: '',
  tireSize: '',
  batterySpec: '',
  oilSpec: '',
  coolantSpec: '',
  brakeSpec: '',
  locale: '',
};

function normalizeNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function normalizeString(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function VehicleForm({ mode, vehicleId }: VehicleFormProps) {
  const t = useTranslations('Account');
  const locale = useLocale();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const [form, setForm] = useState(emptyForm);
  const [showAdvanced, setShowAdvanced] = useState(mode === 'edit');
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'edit' || !vehicleId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    fetchAuthenticatedApi<Record<string, unknown>>(`/vehicles/${vehicleId}`, token)
      .then((vehicle) => {
        setForm({
          make: String(vehicle.make || ''),
          model: String(vehicle.model || ''),
          year: vehicle.year ? String(vehicle.year) : '',
          fuelType: String(vehicle.fuelType || 'essence').toLowerCase(),
          trim: String(vehicle.trim || ''),
          bodyType: String(vehicle.bodyType || ''),
          transmission: String(vehicle.transmission || ''),
          engine: String(vehicle.engine || ''),
          drivetrain: String(vehicle.drivetrain || ''),
          vin: String(vehicle.vin || ''),
          mileage: vehicle.mileage ? String(vehicle.mileage) : '',
          averageMonthlyMileage: vehicle.averageMonthlyMileage ? String(vehicle.averageMonthlyMileage) : '',
          color: String(vehicle.color || ''),
          plate: String(vehicle.plate || ''),
          usageType: String(vehicle.usageType || ''),
          primaryCity: String(vehicle.primaryCity || ''),
          primaryZone: String(vehicle.primaryZone || ''),
          isPrimaryVehicle: Boolean(vehicle.isPrimaryVehicle),
          purchaseDate: vehicle.purchaseDate ? String(vehicle.purchaseDate).slice(0, 10) : '',
          purchaseMileage: vehicle.purchaseMileage ? String(vehicle.purchaseMileage) : '',
          ownershipType: String(vehicle.ownershipType || ''),
          tireSize: String(vehicle.tireSize || ''),
          batterySpec: String(vehicle.batterySpec || ''),
          oilSpec: String(vehicle.oilSpec || ''),
          coolantSpec: String(vehicle.coolantSpec || ''),
          brakeSpec: String(vehicle.brakeSpec || ''),
          locale: String(vehicle.locale || ''),
        });
      })
      .catch((err: Error) => setError(err.message || t('vehicle_form_load_error')))
      .finally(() => setIsLoading(false));
  }, [mode, t, token, vehicleId]);

  const formTitle = mode === 'create' ? t('vehicle_form_create_title') : t('vehicle_form_edit_title');
  const formSubtitle = mode === 'create' ? t('vehicle_form_create_subtitle') : t('vehicle_form_edit_subtitle');

  const handleChange = (field: keyof VehicleFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const payload = useMemo<VehiclePayload>(() => ({
    make: form.make.trim(),
    model: form.model.trim(),
    year: Number(form.year),
    fuelType: form.fuelType as string,
    trim: normalizeString(String(form.trim)),
    bodyType: normalizeString(String(form.bodyType)),
    transmission: normalizeString(String(form.transmission)),
    engine: normalizeString(String(form.engine)),
    drivetrain: normalizeString(String(form.drivetrain)),
    vin: normalizeString(String(form.vin)),
    mileage: normalizeNumber(String(form.mileage)),
    averageMonthlyMileage: normalizeNumber(String(form.averageMonthlyMileage)),
    color: normalizeString(String(form.color)),
    plate: normalizeString(String(form.plate)),
    usageType: normalizeString(String(form.usageType)),
    primaryCity: normalizeString(String(form.primaryCity)),
    primaryZone: normalizeString(String(form.primaryZone)),
    isPrimaryVehicle: Boolean(form.isPrimaryVehicle),
    purchaseDate: normalizeString(String(form.purchaseDate)),
    purchaseMileage: normalizeNumber(String(form.purchaseMileage)),
    ownershipType: normalizeString(String(form.ownershipType)),
    tireSize: normalizeString(String(form.tireSize)),
    batterySpec: normalizeString(String(form.batterySpec)),
    oilSpec: normalizeString(String(form.oilSpec)),
    coolantSpec: normalizeString(String(form.coolantSpec)),
    brakeSpec: normalizeString(String(form.brakeSpec)),
    locale: normalizeString(String(form.locale)),
  }), [form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError(t('vehicle_auth_required'));
      return;
    }

    if (!payload.make || !payload.model || !payload.year || !payload.fuelType) {
      setError(t('vehicle_form_required_error'));
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const endpoint = mode === 'create' ? '/vehicles' : `/vehicles/${vehicleId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const result = await fetchAuthenticatedApi<{ id: string }>(endpoint, token, {
        method,
        body: JSON.stringify(payload),
      });

      router.push(`/${locale}/compte/vehicules/${result.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('vehicle_form_submit_error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <h1 className={styles.cardTitle}>{t('vehicle_auth_required')}</h1>
          <p className={styles.cardText}>{t('vehicle_back_body')}</p>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/compte/login`} className="btn btn-primary">
              {t('vehicle_back_to_login')}
            </Link>
          </div>
        </article>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <article className={styles.card}>
          <p className={styles.cardText}>{t('vehicle_form_loading')}</p>
        </article>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>{formTitle}</h1>
          <p className={styles.subtitle}>{formSubtitle}</p>
        </div>
        <div className={styles.ctaRow} style={{ marginTop: 0 }}>
          <Link href={`/${locale}/compte/vehicules`} className="btn btn-outline">
            {t('vehicle_back_cta')}
          </Link>
        </div>
      </div>

      {/* SECTION SCAN IA */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', background: '#f0f7ff', border: '1px dashed #0070f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>📱</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, color: '#0070f3' }}>Gagnez du temps avec l&apos;IA</h3>
            <p style={{ margin: '0.3rem 0', fontSize: '0.9rem', color: '#666' }}>
              Scannez votre carte d&apos;assurance pour remplir automatiquement les infos.
            </p>
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => document.getElementById('scan-input')?.click()}
            style={{ background: '#0070f3' }}
          >
            Scanner la carte
          </button>
          <input 
            id="scan-input" 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              // Logique de scan à venir...
              alert('Analyse de la carte en cours...');
              // Simulation de remplissage après 2s
              setTimeout(() => {
                setForm(f => ({ ...f, make: 'Toyota', model: 'Hilux', year: '2019', vin: 'AHT1234567890' }));
              }, 2000);
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="make">{t('vehicle_form_make')}</label>
            <select 
              id="make" 
              className={styles.select} 
              value={String(form.make)} 
              onChange={(e) => {
                const make = e.target.value;
                setForm(f => ({ ...f, make, model: '' }));
              }}
            >
              <option value="">{t('vehicle_form_optional_select')}</option>
              {Object.keys(VEHICLE_DATA).map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
              <option value="AUTRE">Autre marque</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="model">{t('vehicle_form_model')}</label>
            {form.make && form.make !== 'AUTRE' ? (
              <select 
                id="model" 
                className={styles.select} 
                value={String(form.model)} 
                onChange={(e) => handleChange('model', e.target.value)}
              >
                <option value="">{t('vehicle_form_optional_select')}</option>
                {(VEHICLE_DATA[form.make as VehicleMake] || []).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
                <option value="AUTRE">Autre modèle</option>
              </select>
            ) : (
              <input 
                id="model" 
                className={styles.input} 
                value={String(form.model)} 
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder={form.make === 'AUTRE' ? "Saisir le modèle" : "Sélectionnez d'abord une marque"}
                disabled={!form.make}
              />
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="year">{t('vehicle_form_year')}</label>
            <select 
              id="year" 
              className={styles.select} 
              value={String(form.year)} 
              onChange={(e) => handleChange('year', e.target.value)}
            >
              <option value="">{t('vehicle_form_optional_select')}</option>
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="fuelType">{t('vehicle_form_fuel')}</label>
            <select id="fuelType" className={styles.select} value={String(form.fuelType)} onChange={(e) => handleChange('fuelType', e.target.value)}>
              {fuelTypeOptions.map((option) => (
                <option key={option} value={option}>{t(`vehicle_form_fuel_${option}`)}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="mileage">{t('vehicle_form_mileage')}</label>
            <input id="mileage" type="number" min="0" className={styles.input} value={String(form.mileage)} onChange={(e) => handleChange('mileage', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="plate">{t('vehicle_form_plate')}</label>
            <input id="plate" className={styles.input} value={String(form.plate)} onChange={(e) => handleChange('plate', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="vin">{t('vehicle_form_vin')}</label>
            <input id="vin" className={styles.input} value={String(form.vin)} onChange={(e) => handleChange('vin', e.target.value.toUpperCase())} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="primaryCity">{t('vehicle_form_city')}</label>
            <input id="primaryCity" className={styles.input} value={String(form.primaryCity)} onChange={(e) => handleChange('primaryCity', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="primaryZone">{t('vehicle_form_zone')}</label>
            <input id="primaryZone" className={styles.input} value={String(form.primaryZone)} onChange={(e) => handleChange('primaryZone', e.target.value)} />
          </div>
          <div className={`${styles.field} ${styles.fieldCheckbox}`}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={Boolean(form.isPrimaryVehicle)}
                onChange={(e) => handleChange('isPrimaryVehicle', e.target.checked)}
              />
              <span>{t('vehicle_form_primary')}</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.linkButton} ${styles.advancedToggle}`}
          onClick={() => setShowAdvanced((current) => !current)}
        >
          {showAdvanced ? t('vehicle_form_advanced_hide') : t('vehicle_form_advanced_show')}
        </button>

        {showAdvanced ? (
          <div className={styles.formSection}>
            <h2 className={styles.cardTitle}>{t('vehicle_form_advanced_title')}</h2>
            <p className={styles.cardText}>{t('vehicle_form_advanced_body')}</p>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="trim">{t('vehicle_form_trim')}</label>
                <input id="trim" className={styles.input} value={String(form.trim)} onChange={(e) => handleChange('trim', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="bodyType">{t('vehicle_form_body_type')}</label>
                <select id="bodyType" className={styles.select} value={String(form.bodyType)} onChange={(e) => handleChange('bodyType', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  {bodyTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="transmission">{t('vehicle_form_transmission')}</label>
                <select id="transmission" className={styles.select} value={String(form.transmission)} onChange={(e) => handleChange('transmission', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  {transmissionOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="engine">{t('vehicle_form_engine')}</label>
                <input id="engine" className={styles.input} value={String(form.engine)} onChange={(e) => handleChange('engine', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="drivetrain">{t('vehicle_form_drivetrain')}</label>
                <select id="drivetrain" className={styles.select} value={String(form.drivetrain)} onChange={(e) => handleChange('drivetrain', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  {drivetrainOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="usageType">{t('vehicle_form_usage')}</label>
                <select id="usageType" className={styles.select} value={String(form.usageType)} onChange={(e) => handleChange('usageType', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  {usageTypeOptions.map((option) => (
                    <option key={option} value={option}>{t(`vehicle_form_usage_${option.toLowerCase()}`)}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ownershipType">{t('vehicle_form_ownership')}</label>
                <select id="ownershipType" className={styles.select} value={String(form.ownershipType)} onChange={(e) => handleChange('ownershipType', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  {ownershipOptions.map((option) => (
                    <option key={option} value={option}>{t(`vehicle_form_ownership_${option.toLowerCase()}`)}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="color">{t('vehicle_form_color')}</label>
                <input id="color" className={styles.input} value={String(form.color)} onChange={(e) => handleChange('color', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="purchaseDate">{t('vehicle_form_purchase_date')}</label>
                <input id="purchaseDate" type="date" className={styles.input} value={String(form.purchaseDate)} onChange={(e) => handleChange('purchaseDate', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="purchaseMileage">{t('vehicle_form_purchase_mileage')}</label>
                <input id="purchaseMileage" type="number" min="0" className={styles.input} value={String(form.purchaseMileage)} onChange={(e) => handleChange('purchaseMileage', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="averageMonthlyMileage">{t('vehicle_form_average_monthly_mileage')}</label>
                <input id="averageMonthlyMileage" type="number" min="0" className={styles.input} value={String(form.averageMonthlyMileage)} onChange={(e) => handleChange('averageMonthlyMileage', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="tireSize">{t('vehicle_form_tire_size')}</label>
                <input id="tireSize" className={styles.input} value={String(form.tireSize)} onChange={(e) => handleChange('tireSize', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="batterySpec">{t('vehicle_form_battery')}</label>
                <input id="batterySpec" className={styles.input} value={String(form.batterySpec)} onChange={(e) => handleChange('batterySpec', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="oilSpec">{t('vehicle_form_oil')}</label>
                <input id="oilSpec" className={styles.input} value={String(form.oilSpec)} onChange={(e) => handleChange('oilSpec', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="coolantSpec">{t('vehicle_form_coolant')}</label>
                <input id="coolantSpec" className={styles.input} value={String(form.coolantSpec)} onChange={(e) => handleChange('coolantSpec', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="brakeSpec">{t('vehicle_form_brakes')}</label>
                <input id="brakeSpec" className={styles.input} value={String(form.brakeSpec)} onChange={(e) => handleChange('brakeSpec', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="locale">{t('vehicle_form_locale')}</label>
                <select id="locale" className={styles.select} value={String(form.locale)} onChange={(e) => handleChange('locale', e.target.value)}>
                  <option value="">{t('vehicle_form_optional_select')}</option>
                  <option value="fr">Français</option>
                  <option value="ht">Kreyòl</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {error ? <p className={styles.formError}>{error}</p> : null}

        <div className={styles.ctaRow}>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? t('vehicle_form_saving') : mode === 'create' ? t('vehicle_form_create_submit') : t('vehicle_form_edit_submit')}
          </button>
          <Link href={`/${locale}/compte/vehicules`} className="btn btn-outline">
            {t('vehicle_form_cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
