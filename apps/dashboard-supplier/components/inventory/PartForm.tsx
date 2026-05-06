'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PartCategory, PartCondition, VEHICLE_DATA, YEARS, VehicleMake } from '@autonorme/types';
import { useTranslations } from 'next-intl';

const compatibilitySchema = z.object({
  make: z.string().min(1, 'La marque est requise'),
  model: z.string().min(1, 'Le modèle est requis'),
  years: z.array(z.number()).min(1, 'Au moins une année est requise'),
});

const partSchema = z.object({
  name: z.string().min(3, 'Le nom doit faire au moins 3 caractères'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  category: z.nativeEnum(PartCategory),
  condition: z.nativeEnum(PartCondition),
  priceHtg: z.number().min(0),
  stockQty: z.number().min(0),
  description: z.string().optional(),
  warrantyInfo: z.string().optional(),
  oemReference: z.string().optional(),
  location: z.string().min(1, 'La localisation est requise'),
  compatibleVehicles: z.array(compatibilitySchema).min(1, 'Ajoutez au moins une compatibilité'),
});

type PartFormValues = z.infer<typeof partSchema>;

interface PartFormProps {
  initialValues?: Partial<PartFormValues>;
  onSubmit: (values: PartFormValues) => void;
  onCancel: () => void;
}

export default function PartForm({ initialValues, onSubmit, onCancel }: PartFormProps) {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      condition: PartCondition.NEW,
      category: PartCategory.MOTEUR,
      compatibleVehicles: [],
      ...initialValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'compatibleVehicles',
  });

  const [newCompat, setNewCompat] = useState({ make: '' as VehicleMake | '', model: '', selectedYears: [] as number[] });

  const availableModels = useMemo(() => {
    if (!newCompat.make) return [];
    return VEHICLE_DATA[newCompat.make as VehicleMake] || [];
  }, [newCompat.make]);

  const addCompatibility = () => {
    if (!newCompat.make || !newCompat.model || newCompat.selectedYears.length === 0) return;
    
    append({
      make: newCompat.make,
      model: newCompat.model,
      years: newCompat.selectedYears,
    });

    setNewCompat({ make: '', model: '', selectedYears: [] });
  };

  const toggleYear = (year: number) => {
    setNewCompat(prev => ({
      ...prev,
      selectedYears: prev.selectedYears.includes(year)
        ? prev.selectedYears.filter(y => y !== year)
        : [...prev.selectedYears, year].sort((a, b) => b - a)
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="card-premium space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Informations Générales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nom de la pièce *</label>
            <input 
              {...register('name')} 
              placeholder="Ex: Filtre à Huile Haute Performance"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
            />
            {errors.name && <span className="text-red-500 text-[10px] font-bold uppercase">{errors.name.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Marque (Fabricant)</label>
            <input 
              {...register('brand')} 
              placeholder="Ex: Bosch, Toyota, Denso" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Catégorie *</label>
            <select 
              {...register('category')} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
            >
              {Object.values(PartCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">État *</label>
            <select 
              {...register('condition')} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
            >
              {Object.values(PartCondition).map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SKU / Ref Interne</label>
            <input 
              {...register('sku')} 
              placeholder="Ex: OIL-FIL-001"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prix (HTG) *</label>
            <div className="relative">
              <input 
                type="number" 
                {...register('priceHtg', { valueAsNumber: true })} 
                className="w-full p-3 pl-14 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-black" 
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">HTG</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Quantité en Stock *</label>
            <input 
              type="number" 
              {...register('stockQty', { valueAsNumber: true })} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-primary-600" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Localisation (Entrepôt/Rayon) *</label>
          <input 
            {...register('location')} 
            placeholder="Ex: Entrepôt Delmas 33, Section A2" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
          />
        </div>
      </div>

      {/* COMPATIBILITÉ */}
      <div className="card-premium space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Compatibilité Véhicule</h2>
        
        <div className="p-6 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">Marque</label>
              <select 
                value={newCompat.make} 
                onChange={(e) => setNewCompat({...newCompat, make: e.target.value as VehicleMake, model: ''})}
                className="w-full p-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-bold text-primary-900"
              >
                <option value="">Choisir...</option>
                {Object.keys(VEHICLE_DATA).map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">Modèle</label>
              <select 
                value={newCompat.model} 
                onChange={(e) => setNewCompat({...newCompat, model: e.target.value})}
                disabled={!newCompat.make}
                className="w-full p-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none font-bold text-primary-900 disabled:opacity-50"
              >
                <option value="">Choisir...</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">Années compatibles</label>
            <div className="flex flex-wrap gap-2 p-3 bg-white border border-primary-200 rounded-xl min-h-[60px]">
              {YEARS.map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => toggleYear(year)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    newCompat.selectedYears.includes(year) 
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="button" 
            onClick={addCompatibility}
            disabled={!newCompat.make || !newCompat.model || newCompat.selectedYears.length === 0}
            className="w-full py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            <span>➕</span> Ajouter cette compatibilité
          </button>
        </div>

        {errors.compatibleVehicles && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.compatibleVehicles.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group hover:border-primary-200 transition-all">
              <div>
                <span className="text-sm font-black text-gray-900 uppercase">{field.make} {field.model}</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {field.years.map(y => (
                    <span key={y} className="text-[9px] font-bold bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase">{y}</span>
                  ))}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => remove(index)} 
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-end pt-6">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-colors order-2 md:order-1"
        >
          {common('cancel')}
        </button>
        <button 
          type="submit" 
          className="px-12 py-4 bg-gold text-primary-900 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all order-1 md:order-2"
        >
          {common('save')}
        </button>
      </div>
    </form>
  );
}
