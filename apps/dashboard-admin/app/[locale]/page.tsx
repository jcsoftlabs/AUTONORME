import { useTranslations } from 'next-intl';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';

export default function AdminDashboardPage() {
  const t = useTranslations('Dashboard');

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('welcome')}</h1>
          <p className="text-gray-500 mt-2">Voici ce qui se passe sur la plateforme aujourd&apos;hui.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('stats.totalUsers')} value="1,284" trend="+12%" icon="👥" />
          <StatCard title={t('stats.activeGarages')} value="42" trend="+2" icon="🛠️" />
          <StatCard title={t('stats.pendingValidations')} value="8" trend="Urgent" isWarning icon="⏳" />
          <StatCard title={t('stats.totalOrders')} value="312" trend="+18%" icon="📦" />
        </div>

        {/* Charts Section */}
        <AnalyticsCharts />

        {/* Placeholder pour les futurs graphiques ou tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="admin-card min-h-[300px]">
            <h2 className="text-xl font-semibold mb-6">Dernières demandes d&apos;inscription</h2>
            <p className="text-gray-400 italic">Aucune demande en attente.</p>
          </div>
          <div className="admin-card min-h-[300px]">
            <h2 className="text-xl font-semibold mb-6">Activité récente</h2>
            <p className="text-gray-400 italic">Journal d&apos;activité vide.</p>
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
