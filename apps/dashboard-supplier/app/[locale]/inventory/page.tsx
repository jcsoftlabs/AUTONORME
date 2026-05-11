'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '../../../lib/api-client';
import PartForm from '../../../components/inventory/PartForm';
import SupplierLayout from '@/components/layout/SupplierLayout';

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
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [isAdding, setIsAdding] = useState(searchParams.get('add') === 'true');

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
      console.log('Submitting part:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAdding(false);
      loadParts();
    } catch (err) {
      alert('Erreur lors de l\'ajout de la pièce');
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Inventaire</h1>
            <p className="text-gray-500 text-sm">Gérez vos pièces détachées et vos niveaux de stock.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-supplier flex items-center gap-2"
          >
            <span>➕</span> Ajouter une pièce
          </button>
        </div>

        {isAdding ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6 flex items-center gap-2">
               <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">Retour</button>
               <span className="text-gray-300">/</span>
               <span className="font-bold">Nouvelle pièce</span>
            </div>
            <PartForm 
              onSubmit={handleAddPart} 
              onCancel={() => setIsAdding(false)} 
            />
          </div>
        ) : (
          <div className="card-premium !p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
               <div className="relative flex-1 min-w-[300px]">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                 <input 
                   type="text" 
                   placeholder="Rechercher une pièce, un SKU ou une marque..." 
                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                 />
               </div>
               <div className="flex gap-2">
                 <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none">
                   <option>Toutes les catégories</option>
                 </select>
                 <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium outline-none">
                   <option>Tous les états</option>
                 </select>
               </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="text-gray-500 font-medium">{common('loading')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-4">Produit</th>
                      <th className="px-6 py-4">Marque</th>
                      <th className="px-6 py-4">Catégorie</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {parts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <span className="text-4xl italic opacity-20">📦</span>
                             <p className="text-gray-400 font-medium">Aucune pièce dans votre inventaire</p>
                             <button onClick={() => setIsAdding(true)} className="text-primary-600 font-bold hover:underline">Ajouter votre première pièce</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      parts.map((part) => (
                        <tr key={part.id} className="hover:bg-gray-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">⚙️</div>
                               <div>
                                 <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{part.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">SKU: {part.id.slice(0, 8)}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">{part.brand || '-'}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{part.category}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <span className={`w-2 h-2 rounded-full ${part.stockQty < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                               <span className={`font-bold ${part.stockQty < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                 {part.stockQty} en stock
                               </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-black text-gray-900">{Number(part.priceHtg).toLocaleString()} <span className="text-[10px] text-gray-400">HTG</span></p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-primary-600 font-bold hover:text-primary-800 transition-colors text-sm">Modifier</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
