'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { fetchApi } from '@/lib/api';

type PartCategory = 'FREINAGE' | 'MOTEUR' | 'SUSPENSION' | 'ELECTRIQUE' | 'CARROSSERIE' | 'AUTRE';
type PartCondition = 'NEW' | 'USED' | 'REFURBISHED';

type Supplier = {
  id: string;
  shopName: string;
  city?: string | null;
  isActive: boolean;
};

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
  images: string[];
  imageInputUrl: string;
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
  images: [],
  imageInputUrl: '',
  compatibilityRows: [{ make: '', model: '', yearsText: '' }],
  isActive: true,
};

export default function AdminPartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [vehicleCatalog, setVehicleCatalog] = useState<VehicleCatalogMake[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<PartFormState>(emptyForm);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

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

      const [partsData, suppliersData, catalogData] = await Promise.all([
        fetchApi(`/parts/admin/all${params.toString() ? `?${params}` : ''}`) as Promise<Part[]>,
        fetchApi('/parts/admin/suppliers') as Promise<Supplier[]>,
        fetchApi('/content/vehicle-catalog') as Promise<{ makes: VehicleCatalogMake[] }>,
      ]);

      setParts(Array.isArray(partsData) ? partsData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      setVehicleCatalog(Array.isArray(catalogData?.makes) ? catalogData.makes : []);
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
    const defaultVehicle = vehicleCatalog[0]?.models[0];
    setForm({
      ...emptyForm,
      supplierId: activeSuppliers[0]?.id ?? '',
      compatibilityRows: defaultVehicle
        ? [{ make: vehicleCatalog[0]?.value ?? '', model: defaultVehicle.value, yearsText: defaultVehicle.years.slice(0, 3).join(', ') }]
        : emptyForm.compatibilityRows,
    });
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
      images: part.images ?? [],
      imageInputUrl: '',
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
    const defaultVehicle = vehicleCatalog[0]?.models[0];
    setForm((previous) => ({
      ...previous,
      compatibilityRows: [
        ...previous.compatibilityRows,
        defaultVehicle
          ? {
              make: vehicleCatalog[0]?.value ?? '',
              model: defaultVehicle.value,
              yearsText: defaultVehicle.years.slice(0, 3).join(', '),
            }
          : { make: '', model: '', yearsText: '' },
      ],
    }));
  };

  const uploadPartImage = async (file: File) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload?folder=parts`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erreur serveur: ${response.status}`);
    }

    const result = await response.json();
    return result.data?.url || result.url;
  };

  const handleImagesUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploadingImages(true);
    setError('');

    try {
      const uploadedUrls = await Promise.all(files.map((file) => uploadPartImage(file)));
      setForm((previous) => ({
        ...previous,
        images: [
          ...previous.images,
          ...uploadedUrls.filter((url): url is string => Boolean(url)),
        ],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'uploader l'image.");
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const addImageUrl = () => {
    const url = form.imageInputUrl.trim();
    if (!url) return;
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, url],
      imageInputUrl: '',
    }));
  };

  const removeImage = (index: number) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, currentIndex) => currentIndex !== index),
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
      supplierId: form.supplierId || undefined,
      compatibleVehicles,
      oemReference: form.oemReference.trim() || undefined,
      priceHtg: Number(form.priceHtg),
      stockQty: Number(form.stockQty),
      location: form.location.trim(),
      importAvailable: form.importAvailable,
      importDelayDays: form.importAvailable && form.importDelayDays
        ? Number(form.importDelayDays)
        : undefined,
      images: form.images,
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
    `${new Intl.NumberFormat('fr-HT', { maximumFractionDigits: 0 }).format(Number(value))} HTG`;

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
                  <select value={form.supplierId} onChange={(event) => updateForm('supplierId', event.target.value)} className="form-input">
                    <option value="">Pièce générique / aucun fournisseur</option>
                    {activeSuppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.shopName}{supplier.city ? ` — ${supplier.city}` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Laissez vide pour une pièce générique hors fournisseur.</p>
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
                  <input value={form.oemReference} onChange={(event) => updateForm('oemReference', event.target.value)} className="form-input" placeholder="Référence fabricant, pas le numéro de série" />
                  <p className="mt-1 text-xs text-gray-500">La référence OEM identifie la pièce d&apos;origine du fabricant, pas le numéro de série du véhicule.</p>
                </Field>
              </div>

              <Field label="Description">
                <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="form-input min-h-[96px]" />
              </Field>

              <Field label="Images produit">
                <div className="space-y-3">
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                  >
                    <span className="text-3xl">📸</span>
                    <span className="mt-2 text-sm font-semibold text-gray-700">Uploader des photos</span>
                    <span className="text-xs text-gray-500">PNG, JPG, WEBP jusqu&apos;à 10MB par image</span>
                    <span className="mt-2 text-xs font-medium text-primary-700">Cliquez pour sélectionner un ou plusieurs fichiers</span>
                  </div>
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagesUpload}
                  />
                  <div className="flex gap-2">
                    <input
                      value={form.imageInputUrl}
                      onChange={(event) => updateForm('imageInputUrl', event.target.value)}
                      className="form-input flex-1"
                      placeholder="Ou collez une URL Cloudinary"
                    />
                    <button type="button" onClick={addImageUrl} className="btn-secondary px-4">
                      Ajouter
                    </button>
                  </div>
                  {uploadingImages && (
                    <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
                      Upload des images en cours...
                    </div>
                  )}
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {form.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          <img src={image} alt={`Aperçu ${index + 1}`} className="h-28 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            Retirer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                      <div>
                        <input
                          list={`vehicle-makes-${index}`}
                          value={row.make}
                          onChange={(event) => updateCompatibilityRow(index, 'make', event.target.value)}
                          className="form-input"
                          placeholder="Marque"
                        />
                        <datalist id={`vehicle-makes-${index}`}>
                          {vehicleCatalog.map((make) => (
                            <option key={make.value} value={make.label} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <input
                          list={`vehicle-models-${index}-${row.make || 'all'}`}
                          value={row.model}
                          onChange={(event) => updateCompatibilityRow(index, 'model', event.target.value)}
                          className="form-input"
                          placeholder="Modèle"
                        />
                        <datalist id={`vehicle-models-${index}-${row.make || 'all'}`}>
                          {(vehicleCatalog.find((make) => make.label === row.make || make.value === row.make)?.models ?? vehicleCatalog.flatMap((make) => make.models)).map((model) => (
                            <option key={`${model.value}-${model.label}`} value={model.label} />
                          ))}
                        </datalist>
                      </div>
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
