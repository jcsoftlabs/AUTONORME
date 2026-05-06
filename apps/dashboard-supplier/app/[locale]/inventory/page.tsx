'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api-client';
import PartForm from '../../../components/inventory/PartForm';

type Part = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  stockQty: number;
  priceHtg: number | string;
  condition: string;
};

export default function InventoryPage() {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  async function loadParts() {
    setLoading(true);
    try {
      const data = await fetchApi<Part[]>('/parts');
      setParts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParts();
  }, []);

  const handleAddPart = async (values: any) => {
    try {
      // Simulation d'envoi à l'API
      // En prod, on enverrait POST /parts avec le supplierId du JWT
      console.log('Submitting part:', values);
      
      // Simulation succès
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAdding(false);
      loadParts();
    } catch (err) {
      alert('Erreur lors de l\'ajout de la pièce');
    }
  };

  if (isAdding) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Ajouter une nouvelle pièce</h1>
        <PartForm 
          onSubmit={handleAddPart} 
          onCancel={() => setIsAdding(false)} 
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>{t('inventory')}</h1>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ 
            padding: '0.8rem 1.5rem', 
            background: '#d4af37', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {common('add')}
        </button>
      </div>

      {loading ? (
        <p>{common('loading')}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Produit</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Marque</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Catégorie</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>État</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Stock</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Prix (HTG)</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{part.name}</td>
                <td style={{ padding: '1rem' }}>{part.brand || '-'}</td>
                <td style={{ padding: '1rem' }}>{part.category}</td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ 
                     fontSize: '0.75rem', 
                     padding: '0.2rem 0.5rem', 
                     background: '#eee', 
                     borderRadius: '4px' 
                   }}>
                     {part.condition}
                   </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: part.stockQty < 5 ? 'red' : 'inherit', fontWeight: part.stockQty < 5 ? 'bold' : 'normal' }}>
                    {part.stockQty}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{Number(part.priceHtg).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>{common('edit')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
