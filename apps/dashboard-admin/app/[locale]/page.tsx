'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { fetchApi } from '@/lib/api';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';

type DashboardSummary = {
  totals: {
    totalUsers: number;
    activeGarages: number;
    pendingValidations: number;
    totalOrders: number;
    adminUsers: number;
  };
  recent: {
    garages: Array<{ id: string; name: string; city?: string | null; isVerified: boolean; isActive: boolean; createdAt: string }>;
    suppliers: Array<{ id: string; shopName: string; city?: string | null; isVerified: boolean; isActive: boolean; createdAt: string }>;
    orders: Array<{ id: string; status: string; totalHtg: string; createdAt: string; user: { name: string } }>;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export default function AdminDashboardPage() {
  const t = useTranslations('Dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetchApi('/dashboard/summary') as ApiResponse<DashboardSummary>;
        if (active) setSummary(response?.data ?? null);
      } catch (error) {
        console.error('Failed to load dashboard summary:', error);
        if (active) setSummary(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('welcome')}</h1>
          <p className="text-gray-500 mt-2">Aperçu réel de la plateforme, basé sur les données actives en base.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('stats.totalUsers')} value={loading ? '…' : formatNumber(summary?.totals?.totalUsers)} trend="Base" icon="👥" />
          <StatCard title={t('stats.activeGarages')} value={loading ? '…' : formatNumber(summary?.totals?.activeGarages)} trend="Actifs" icon="🛠️" />
          <StatCard title={t('stats.pendingValidations')} value={loading ? '…' : formatNumber(summary?.totals?.pendingValidations)} trend="À traiter" isWarning icon="⏳" />
          <StatCard title={t('stats.totalOrders')} value={loading ? '…' : formatNumber(summary?.totals?.totalOrders)} trend="Historique" icon="📦" />
        </div>

        <AnalyticsCharts hasData={Boolean(summary)} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="admin-card min-h-[300px]">
            <h2 className="text-xl font-semibold mb-6">Derniers garages</h2>
            {(summary?.recent?.garages ?? []).length ? (
              <ul className="space-y-4">
                {(summary?.recent?.garages ?? []).map((garage) => (
                  <li key={garage.id} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{garage.name}</p>
                      <p className="text-sm text-gray-500">{garage.city || 'Ville non renseignée'}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${garage.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {garage.isVerified ? 'Vérifié' : 'En attente'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">Aucun garage enregistré pour le moment.</p>
            )}
          </div>
          <div className="admin-card min-h-[300px]">
            <h2 className="text-xl font-semibold mb-6">Dernières commandes</h2>
            {(summary?.recent?.orders ?? []).length ? (
              <ul className="space-y-4">
                {(summary?.recent?.orders ?? []).map((order) => (
                  <li key={order.id} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-500">HTG {formatCurrency(order.totalHtg)}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {order.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">Aucune commande enregistrée pour le moment.</p>
            )}
          </div>
        </div>
      </div>
  );
}

function StatCard({ title, value, trend, icon, isWarning }: { title: string, value: string, trend: string, icon: string, isWarning?: boolean }) {
  return (
    <div className="admin-card hover:border-orange-100 transition-colors cursor-default">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isWarning ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0);
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(value));
}
