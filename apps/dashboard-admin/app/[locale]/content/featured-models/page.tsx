'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface FeaturedModel {
  id: string;
  title: string | null;
  years: string;
  imageUrl: string;
  filterMake: string | null;
  filterModel: string | null;
  order: number;
  isActive: boolean;
}

export default function FeaturedModelsPage() {
  const [models, setModels] = useState<FeaturedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingModel, setEditingModel] = useState<Partial<FeaturedModel> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/featured-models`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setModels(result.data);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload?folder=misc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.url) {
        setEditingModel(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    try {
      const token = localStorage.getItem('admin_token');
      const isNew = !editingModel.id;
      const url = isNew 
        ? `${process.env.NEXT_PUBLIC_API_URL}/content/featured-models`
        : `${process.env.NEXT_PUBLIC_API_URL}/content/featured-models/${editingModel.id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingModel)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingModel(null);
        fetchModels(); // Rafraîchir la liste
      } else {
        alert('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      alert('Erreur de connexion');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce modèle ?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/featured-models/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchModels();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modèles en Vedette (CMS)</h1>
            <p className="text-gray-500 text-sm">Gérez les véhicules affichés sur la Landing Page.</p>
          </div>
          <button 
            onClick={() => { setEditingModel({ isActive: true, order: 1 }); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <span>✨</span> Ajouter un modèle
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model) => (
              <div key={model.id} className="admin-card !p-0 group overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all">
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={model.imageUrl} 
                    alt={model.title || ''} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${model.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {model.isActive ? 'Actif' : 'Masqué'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{model.filterMake || 'Marque'}</span>
                    <span className="text-xs text-gray-400 font-medium">{model.years}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{model.title || model.filterModel}</h3>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => { setEditingModel(model); setIsModalOpen(true); }}
                      className="flex-1 py-2 text-sm font-bold bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(model.id)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => { setEditingModel({ isActive: true, order: 1 }); setIsModalOpen(true); }}
              className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-primary-50 hover:border-primary-200 transition-all text-gray-400 hover:text-primary-500 group min-h-[300px]"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</span>
              <span className="font-bold text-sm uppercase tracking-widest">Nouveau Modèle</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingModel?.id ? 'Modifier le modèle' : 'Nouveau modèle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {editingModel?.imageUrl ? (
                  <>
                    <img src={editingModel.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold">Changer l'image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-sm font-medium text-gray-500">Cliquez pour uploader</span>
                    <span className="text-[10px] text-gray-400 mt-1">WebP, JPG ou PNG (max 10MB)</span>
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marque</label>
                  <input 
                    type="text" 
                    value={editingModel?.filterMake || ''} 
                    onChange={e => setEditingModel(prev => ({ ...prev, filterMake: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Ex: TOYOTA"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Modèle</label>
                  <input 
                    type="text" 
                    value={editingModel?.filterModel || ''} 
                    onChange={e => setEditingModel(prev => ({ ...prev, filterModel: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Ex: HILUX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Titre d'affichage (Optionnel)</label>
                <input 
                  type="text" 
                  value={editingModel?.title || ''} 
                  onChange={e => setEditingModel(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Ex: HILUX 2015-2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Années</label>
                  <input 
                    type="text" 
                    value={editingModel?.years || ''} 
                    onChange={e => setEditingModel(prev => ({ ...prev, years: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Ex: 2015-2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ordre</label>
                  <input 
                    type="number" 
                    value={editingModel?.order || 1} 
                    onChange={e => setEditingModel(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 text-sm font-bold bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-600 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
