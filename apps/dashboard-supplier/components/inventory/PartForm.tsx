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

  // État local pour l'ajout d'une nouvelle compatibilité
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
    <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom de la pièce *</label>
          <input {...register('name')} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
          {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name.message}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Marque (Fabricant)</label>
          <input {...register('brand')} placeholder="ex: Bosch, Toyota" style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Catégorie *</label>
          <select {...register('category')} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            {Object.values(PartCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>État *</label>
          <select {...register('condition')} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            {Object.values(PartCondition).map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>SKU / Ref Interne</label>
          <input {...register('sku')} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Prix (HTG) *</label>
          <input type="number" {...register('priceHtg', { valueAsNumber: true })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Quantité en Stock *</label>
          <input type="number" {...register('stockQty', { valueAsNumber: true })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description détaillée</label>
        <textarea {...register('description')} rows={4} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Localisation (Entrepôt/Rayon) *</label>
        <input {...register('location')} placeholder="ex: Entrepôt Delmas 33, Section A2" style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }} />
      </div>

      {/* SECTION IMAGES */}
      <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', background: '#fcfcfc' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#b45309' }}>Photos de la pièce</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }}>
            <span style={{ fontSize: '1.5rem' }}>+</span>
            <span style={{ fontSize: '0.7rem' }}>Ajouter photo</span>
          </div>
          {/* Simulation d'une image ajoutée */}
          <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', background: '#eee', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'url(https://res.cloudinary.com/autonorme/image/upload/v1/placeholder-part) center/cover' }} />
            <button type="button" style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>X</button>
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>Maximum 5 photos. Format JPG/PNG uniquement.</p>
      </div>

      {/* SECTION COMPATIBILITÉ EXPLICITE */}
      <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', background: '#fcfcfc' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#b45309' }}>Gestion de la Compatibilité Véhicule</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'white', border: '1px solid #eee', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Marque</label>
              <select 
                value={newCompat.make} 
                onChange={(e) => setNewCompat({...newCompat, make: e.target.value as VehicleMake, model: ''})}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px' }}
              >
                <option value="">Sélectionner une marque</option>
                {Object.keys(VEHICLE_DATA).map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Modèle</label>
              <select 
                value={newCompat.model} 
                onChange={(e) => setNewCompat({...newCompat, model: e.target.value})}
                disabled={!newCompat.make}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px', background: !newCompat.make ? '#f9f9f9' : 'white' }}
              >
                <option value="">Sélectionner un modèle</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Années compatibles</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '100px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #eee', borderRadius: '6px' }}>
              {YEARS.map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => toggleYear(year)}
                  style={{ 
                    padding: '0.2rem 0.5rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    background: newCompat.selectedYears.includes(year) ? '#1a1a1a' : 'white',
                    color: newCompat.selectedYears.includes(year) ? 'white' : 'black',
                    cursor: 'pointer'
                  }}
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
            style={{ 
              padding: '0.8rem', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              opacity: (!newCompat.make || !newCompat.model || newCompat.selectedYears.length === 0) ? 0.5 : 1
            }}
          >
            + Ajouter cette compatibilité
          </button>
        </div>

        {errors.compatibleVehicles && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.compatibleVehicles.message}</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {fields.map((field, index) => (
            <li key={field.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'white', border: '1px solid #eee', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{field.make} {field.model}</span>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                  {field.years.map(y => (
                    <span key={y} style={{ fontSize: '0.7rem', background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>{y}</span>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => remove(index)} style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button type="button" onClick={onCancel} style={{ padding: '0.8rem 2rem', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {common('cancel')}
        </button>
        <button type="submit" style={{ padding: '0.8rem 3rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {common('save')}
        </button>
      </div>
    </form>
  );
}
