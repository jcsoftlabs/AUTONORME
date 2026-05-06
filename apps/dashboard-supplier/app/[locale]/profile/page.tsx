'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { useState } from 'react';
import SupplierLayout from '@/components/layout/SupplierLayout';

export default function SupplierProfilePage() {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');
  const { user, login } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    shopName: user?.shopName || 'Haïti AutoParts Center',
    phone: user?.phone || '',
    city: user?.city || 'Port-au-Prince',
    address: 'Delmas 48, #12',
  });

  const handleSave = async () => {
    if (user) {
      login({ ...user, ...formData }, 'current-token');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-500 text-sm">Gérez les informations de votre boutique.</p>
        </div>

        {/* Profile Banner */}
        <div className="relative bg-primary-900 rounded-3xl p-8 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gold flex items-center justify-center text-4xl shadow-2xl shadow-gold/20 flex-shrink-0">
              🏪
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-white">{formData.shopName}</h2>
              <p className="text-primary-300 text-sm mt-1">ID: {user?.id || 'supp-123'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  ✓ Fournisseur Vérifié
                </span>
                <span className="px-3 py-1 bg-gold/20 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-widest rounded-full">
                  ⭐ Plan Pro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card-premium space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">
            Informations de la boutique
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Nom de la boutique
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Téléphone de contact
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">🔒</span>
                <input
                  type="text"
                  value={formData.phone}
                  disabled
                  className="w-full p-3 pl-10 bg-gray-100 border border-gray-100 rounded-xl text-gray-400 font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-gray-400">Modifiable via l&apos;OTP uniquement.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Adresse physique
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className={`px-10 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 ${
                saved
                  ? 'bg-green-500 text-white shadow-green-200'
                  : 'bg-gold text-primary-900 shadow-gold/20 hover:scale-105'
              }`}
            >
              {saved ? '✓ Enregistré !' : common('save')}
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Pièces en stock', value: '124', icon: '📦' },
            { label: 'Commandes traitées', value: '38', icon: '✅' },
            { label: 'Note moyenne', value: '4.8', icon: '⭐' },
          ].map((stat, i) => (
            <div key={i} className="card-premium text-center hover:scale-105 transition-transform cursor-default">
              <span className="text-3xl block mb-3">{stat.icon}</span>
              <p className="text-2xl font-black text-primary-900">{stat.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sécurité */}
        <div className="card-premium border border-red-100 bg-red-50/30 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h3 className="font-bold text-red-800">Zone de Sécurité</h3>
              <p className="text-sm text-red-500">Votre compte est protégé par authentification OTP WhatsApp.</p>
            </div>
          </div>
          <button className="px-5 py-2.5 border border-red-300 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-colors">
            Réinitialiser les accès
          </button>
        </div>
      </div>
    </SupplierLayout>
  );
}
