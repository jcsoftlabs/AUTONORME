'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { fetchApi } from '@/lib/api';

type PartCategory = 'FREINAGE' | 'MOTEUR' | 'SUSPENSION' | 'ELECTRIQUE' | 'CARROSSERIE' | 'AUTRE';
type PartCondition = 'NEW' | 'USED' | 'REFURBISHED';

type Supplier = {
  id: string;
  shopName: string;
  city?: string | null;
  isActive: boolean;
};

type CompatibleVehicle = {
  make: string;
  model: string;
  years: number[];
};

type Part = {
  id: string;
  name: string;
  brand?: string | null;
  description?: string | null;
  category: PartCategory;
  condition: PartCondition;
  sku?: string | null;
  warrantyInfo?: string | null;
  supplierId: string;
  supplier?: { shopName: string; city?: string | null };
  compatibleVehicles: CompatibleVehicle[];
  oemReference?: string | null;
  priceHtg: string | number;
  stockQty: number;
  location: string;
  importAvailable: boolean;
  importDelayDays?: number | null;
  images: string[];
  isActive: boolean;
};

type PartFormState = {
  id?: string;
  name: string;
  brand: string;
  description: string;
  category: PartCategory;
  condition: PartCondition;
  sku: string;
  warrantyInfo: string;
  supplierId: string;
  oemReference: string;
  priceHtg: string;
  stockQty: string;
  location: string;
  importAvailable: boolean;
  importDelayDays: string;
  imagesText: string;
  compatibilityRows: Array<{ make: string; model: string; yearsText: string }>;
  isActive: boolean;
};

const categories: Array<{ value: PartCategory; label: string }> = [
  { value: 'FREINAGE', label: 'Freinage' },
  { value: 'MOTEUR', label: 'Moteur' },
  { value: 'SUSPENSION', label: 'Suspension' },
  { value: 'ELECTRIQUE', label: 'Électrique' },
  { value: 'CARROSSERIE', label: 'Carrosserie' },
  { value: 'AUTRE', label: 'Autre' },
];

const conditions: Array<{ value: PartCondition; label: string }> = [
  { value: 'NEW', label: 'Neuf' },
  { value: 'USED', label: 'Usagé' },
  { value: 'REFURBISHED', label: 'Reconditionné' },
];

const emptyForm: PartFormState = {
  name: '',
  brand: '',
  description: '',
  category: 'FREINAGE',
  condition: 'NEW',
  sku: '',
  warrantyInfo: '',
  supplierId: '',
  oemReference: '',
  priceHtg: '',
  stockQty: '0',
  location: '',
  importAvailable: false,
  importDelayDays: '',
  imagesText: '',
  compatibilityRows: [{ make: '', model: '', yearsText: '' }],
  isActive: true,
};

export default function AdminPartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<PartFormState>(emptyForm);

  const activeSuppliers = useMemo(
    () => suppliers.filter((supplier) => supplier.isActive),
    [suppliers],
  );

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category) params.set('category', category);

      const [partsData, suppliersData] = await Promise.all([
        fetchApi(`/parts/admin/all${params.toString() ? `?${params}` : ''}`) as Promise<Part[]>,
        fetchApi('/parts/admin/suppliers') as Promise<Supplier[]>,
      ]);

      setParts(partsData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les pièces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setForm({ ...emptyForm, supplierId: activeSuppliers[0]?.id ?? '' });
    setIsModalOpen(true);
  };

  const openEditModal = (part: Part) => {
    const compatibleVehicles = Array.isArray(part.compatibleVehicles)
      ? part.compatibleVehicles
      : [];

    setForm({
      id: part.id,
      name: part.name,
      brand: part.brand ?? '',
      description: part.description ?? '',
      category: part.category,
      condition: part.condition,
      sku: part.sku ?? '',
      warrantyInfo: part.warrantyInfo ?? '',
      supplierId: part.supplierId,
      oemReference: part.oemReference ?? '',
      priceHtg: String(part.priceHtg ?? ''),
      stockQty: String(part.stockQty ?? 0),
      location: part.location,
      importAvailable: part.importAvailable,
      importDelayDays: part.importDelayDays ? String(part.importDelayDays) : '',
      imagesText: (part.images ?? []).join('\n'),
      compatibilityRows: compatibleVehicles.length
        ? compatibleVehicles.map((vehicle) => ({
            make: vehicle.make,
            model: vehicle.model,
            yearsText: vehicle.years.join(', '),
          }))
        : [{ make: '', model: '', yearsText: '' }],
      isActive: part.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const updateForm = <K extends keyof PartFormState>(key: K, value: PartFormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateCompatibilityRow = (
    index: number,
    key: 'make' | 'model' | 'yearsText',
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      compatibilityRows: previous.compatibilityRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const addCompatibilityRow = () => {
    setForm((previous) => ({
      ...previous,
      compatibilityRows: [
        ...previous.compatibilityRows,
        { make: '', model: '', yearsText: '' },
      ],
    }));
  };

  const removeCompatibilityRow = (index: number) => {
    setForm((previous) => ({
      ...previous,
      compatibilityRows:
        previous.compatibilityRows.length === 1
          ? previous.compatibilityRows
          : previous.compatibilityRows.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const buildPayload = () => {
    const compatibleVehicles = form.compatibilityRows
      .map((row) => ({
        make: row.make.trim(),
        model: row.model.trim(),
        years: row.yearsText
          .split(',')
          .map((year) => Number(year.trim()))
          .filter((year) => Number.isInteger(year) && year >= 1900),
      }))
      .filter((row) => row.make && row.model && row.years.length > 0);

    if (!compatibleVehicles.length) {
      throw new Error('Ajoutez au moins une compatibilité véhicule valide.');
    }

    return {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      description: form.description.trim() || undefined,
      category: form.category,
      condition: form.condition,
      sku: form.sku.trim() || undefined,
      warrantyInfo: form.warrantyInfo.trim() || undefined,
      supplierId: form.supplierId,
      compatibleVehicles,
      oemReference: form.oemReference.trim() || undefined,
      priceHtg: Number(form.priceHtg),
      stockQty: Number(form.stockQty),
      location: form.location.trim(),
      importAvailable: form.importAvailable,
      importDelayDays: form.importAvailable && form.importDelayDays
        ? Number(form.importDelayDays)
        : undefined,
      images: form.imagesText
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
      isActive: form.isActive,
    };
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = buildPayload();
      if (form.id) {
        await fetchApi(`/parts/${form.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/parts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      closeModal();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de sauvegarder la pièce.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (part: Part) => {
    await fetchApi(`/parts/${part.id}/toggle-active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !part.isActive }),
    });
    await loadData();
  };

  const removePart = async (part: Part) => {
    if (!window.confirm(`Supprimer ${part.name} du catalogue actif ?`)) return;
    await fetchApi(`/parts/${part.id}`, { method: 'DELETE' });
    await loadData();
  };

  const formatPrice = (value: string | number) =>
    `${Number(value).toLocaleString('fr-HT', { maximumFractionDigits: 0 })} HTG`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogue AUTOparts</h1>
          <p className="text-gray-500 text-sm">
            Ajoutez, modifiez et désactivez les pièces vendues sur AUTONORME.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <span>➕</span> Ajouter une pièce
        </button>
      </div>

      <div className="admin-card">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Rechercher par nom, marque, SKU, référence OEM..."
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button onClick={() => void loadData()} className="btn-secondary px-5">
            Filtrer
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="admin-card !p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left border-collapse">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Pièce</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Catégorie</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Fournisseur</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Prix</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parts.map((part) => (
                  <tr key={part.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                          {part.images?.[0] ? (
                            <img src={part.images[0]} alt={part.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-lg">🔩</div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{part.name}</div>
                          <div className="text-xs text-gray-500">
                            {[part.brand, part.sku, part.oemReference].filter(Boolean).join(' · ') || 'Sans référence'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{part.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {part.supplier?.shopName ?? 'Fournisseur'}
                      {part.supplier?.city ? <span className="block text-xs text-gray-400">{part.supplier.city}</span> : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        part.stockQty > 5 ? 'bg-green-100 text-green-700' : part.stockQty > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {part.stockQty} en stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(part.priceHtg)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        part.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {part.isActive ? 'Actif' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(part)} className="p-2 text-gray-400 transition-colors hover:text-[#FF6B00]">✏️</button>
                      <button onClick={() => void toggleActive(part)} className="p-2 text-gray-400 transition-colors hover:text-primary-600">
                        {part.isActive ? '🙈' : '👁️'}
                      </button>
                      <button onClick={() => void removePart(part)} className="p-2 text-red-400 transition-colors hover:text-red-600">🗑️</button>
                    </td>
                  </tr>
                ))}
                {parts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm font-semibold text-gray-400">
                      Aucune pièce trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {form.id ? 'Modifier la pièce' : 'Ajouter une pièce'}
                </h2>
                <p className="text-sm text-gray-500">Catalogue, stock, fournisseur et compatibilité véhicule.</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Nom de la pièce">
                  <input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="form-input" />
                </Field>
                <Field label="Marque">
                  <input value={form.brand} onChange={(event) => updateForm('brand', event.target.value)} className="form-input" placeholder="Brembo, Denso..." />
                </Field>
                <Field label="Catégorie">
                  <select value={form.category} onChange={(event) => updateForm('category', event.target.value as PartCategory)} className="form-input">
                    {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </Field>
                <Field label="État">
                  <select value={form.condition} onChange={(event) => updateForm('condition', event.target.value as PartCondition)} className="form-input">
                    {conditions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </Field>
                <Field label="Fournisseur">
                  <select required value={form.supplierId} onChange={(event) => updateForm('supplierId', event.target.value)} className="form-input">
                    <option value="">Sélectionner un fournisseur</option>
                    {activeSuppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.shopName}{supplier.city ? ` — ${supplier.city}` : ''}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Localisation">
                  <input required value={form.location} onChange={(event) => updateForm('location', event.target.value)} className="form-input" placeholder="Entrepôt Delmas 33" />
                </Field>
                <Field label="Prix HTG">
                  <input required type="number" min="0" value={form.priceHtg} onChange={(event) => updateForm('priceHtg', event.target.value)} className="form-input" />
                </Field>
                <Field label="Stock">
                  <input required type="number" min="0" value={form.stockQty} onChange={(event) => updateForm('stockQty', event.target.value)} className="form-input" />
                </Field>
                <Field label="SKU">
                  <input value={form.sku} onChange={(event) => updateForm('sku', event.target.value)} className="form-input" />
                </Field>
                <Field label="Référence OEM">
                  <input value={form.oemReference} onChange={(event) => updateForm('oemReference', event.target.value)} className="form-input" />
                </Field>
              </div>

              <Field label="Description">
                <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="form-input min-h-[96px]" />
              </Field>

              <Field label="Images Cloudinary ou URLs publiques (une par ligne)">
                <textarea value={form.imagesText} onChange={(event) => updateForm('imagesText', event.target.value)} className="form-input min-h-[86px]" placeholder="https://..." />
              </Field>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">Compatibilité véhicules</h3>
                    <p className="text-xs text-gray-500">Années séparées par virgules. Exemple : 2018, 2019, 2020</p>
                  </div>
                  <button type="button" onClick={addCompatibilityRow} className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-primary-700 shadow-sm">
                    Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {form.compatibilityRows.map((row, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                      <input value={row.make} onChange={(event) => updateCompatibilityRow(index, 'make', event.target.value)} className="form-input" placeholder="Marque" />
                      <input value={row.model} onChange={(event) => updateCompatibilityRow(index, 'model', event.target.value)} className="form-input" placeholder="Modèle" />
                      <input value={row.yearsText} onChange={(event) => updateCompatibilityRow(index, 'yearsText', event.target.value)} className="form-input" placeholder="2018, 2019, 2020" />
                      <button type="button" onClick={() => removeCompatibilityRow(index)} className="rounded-lg bg-white px-3 py-2 text-sm text-red-500 shadow-sm">
                        Retirer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm font-bold text-gray-700">
                  <input type="checkbox" checked={form.importAvailable} onChange={(event) => updateForm('importAvailable', event.target.checked)} />
                  Import disponible
                </label>
                <Field label="Délai import (jours)">
                  <input type="number" min="0" value={form.importDelayDays} onChange={(event) => updateForm('importDelayDays', event.target.value)} className="form-input" disabled={!form.importAvailable} />
                </Field>
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-sm font-bold text-gray-700">
                  <input type="checkbox" checked={form.isActive} onChange={(event) => updateForm('isActive', event.target.checked)} />
                  Visible dans le catalogue
                </label>
              </div>

              <Field label="Garantie">
                <input value={form.warrantyInfo} onChange={(event) => updateForm('warrantyInfo', event.target.value)} className="form-input" placeholder="Garantie 90 jours" />
              </Field>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase text-gray-500">{label}</span>
      {children}
    </label>
  );
}
