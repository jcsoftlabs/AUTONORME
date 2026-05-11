'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/api';

interface AddGarageModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGarageModal({ onClose, onSuccess }: AddGarageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Port-au-Prince',
    lat: 18.5392,
    lng: -72.335,
    description: '',
    specialties: '',
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleDetectLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setLocating(false);
      },
      () => {
        alert("Impossible de récupérer votre position.");
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
      };

      await fetchApi('/garages', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (error) {
      alert('Erreur lors de la création du garage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Nouveau Garage Partenaire</h2>
            <p className="text-sm text-gray-500">Ajoutez un nouveau point de service AUTONORME.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du Garage</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Garage Moderne"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+509 ...."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse Complète</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="15, Rue Delmas, Port-au-Prince"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold"
              />
            </div>

            {/* Localisation */}
            <div className="md:col-span-2 p-6 bg-blue-50 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-primary-900 uppercase tracking-widest">Coordonnées GPS</h3>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="text-[10px] font-black bg-primary-700 text-white px-3 py-2 rounded-xl hover:bg-primary-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {locating ? '📡 Détection...' : '📍 Localisation Auto'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary-600 uppercase">Latitude</label>
                  <input readOnly value={formData.lat} className="w-full p-3 bg-white border border-primary-100 rounded-xl font-mono text-sm text-primary-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-primary-600 uppercase">Longitude</label>
                  <input readOnly value={formData.lng} className="w-full p-3 bg-white border border-primary-100 rounded-xl font-mono text-sm text-primary-900" />
                </div>
              </div>
            </div>

             {/* Spécialités */}
             <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Spécialités (séparées par des virgules)</label>
              <input
                type="text"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="Toyota, Diesel, Électricité..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-gold text-primary-900 text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-gold/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le Garage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
