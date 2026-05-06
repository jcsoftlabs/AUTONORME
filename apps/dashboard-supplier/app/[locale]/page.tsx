'use client';

import { useTranslations } from 'next-intl';
import SupplierLayout from '@/components/layout/SupplierLayout';

export default function SupplierDashboardHome() {
  const t = useTranslations('Supplier');

  const stats = [
    { label: 'Ventes du mois', value: '142,500', unit: 'HTG', trend: '+12%', color: 'border-gold', icon: '💰' },
    { label: 'Commandes à traiter', value: '8', unit: '', trend: '4 urgentes', color: 'border-primary-900', icon: '🛒' },
    { label: 'Ruptures de stock', value: '3', unit: '', trend: 'Action requise', color: 'border-red-500', icon: '⚠️' },
    { label: 'Score Service', value: '4.8', unit: '/5', trend: 'Excellent', color: 'border-green-500', icon: '⭐' },
  ];

  return (
    <SupplierLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-500 text-sm">Gérez votre inventaire et suivez vos performances.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
               Exporter (.csv)
             </button>
             <button className="btn-supplier flex items-center gap-2">
               <span>➕</span> Ajouter une pièce
             </button>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`card-premium border-l-4 ${stat.color} hover:scale-[1.02] transition-transform cursor-pointer`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                  stat.trend.includes('+') || stat.trend === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                {stat.value} <span className="text-sm font-medium text-gray-400">{stat.unit}</span>
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 card-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Dernières Commandes</h3>
              <button className="text-primary-600 text-sm font-bold hover:underline">Voir tout</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="group p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase">Commande</span>
                      <p className="font-bold text-gray-900">CMD-2026-00{i + 2}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-[10px] font-black uppercase rounded">En attente</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-600">1x Filtre à huile Toyota Hilux</p>
                    <p className="font-bold text-gray-900">4,500 HTG</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AutoBot AI Card */}
          <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-900/20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-gold/20">
                🤖
              </div>
              <h3 className="text-xl font-bold text-gold mb-4 text-balance">AutoBot AI Assistant</h3>
              <p className="text-primary-100 text-sm leading-relaxed mb-8 italic">
                &quot;Le stock de Plaquettes Bosch est bas. Voulez-vous que je crée une alerte de réapprovisionnement ?&quot;
              </p>
              
              <button className="w-full py-4 bg-gold hover:bg-gold/90 text-primary-900 font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-95">
                Parler à l&apos;IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
