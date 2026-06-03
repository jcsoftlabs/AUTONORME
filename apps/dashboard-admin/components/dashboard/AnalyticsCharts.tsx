'use client';

type AnalyticsChartsProps = {
  hasData: boolean;
};

export default function AnalyticsCharts({ hasData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="admin-card min-h-[280px]">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Vue d&apos;ensemble</h2>
        <p className="text-sm text-gray-500 mb-6">
          {hasData
            ? 'Les indicateurs ci-dessous proviennent de la base de données et ne sont plus simulés.'
            : 'Les données réelles sont en cours de chargement.'}
        </p>
        <div className="space-y-4">
          <MetricRow label="Utilisateurs" value={hasData ? 'Temps réel' : 'Chargement...'} />
          <MetricRow label="Garages" value={hasData ? 'Temps réel' : 'Chargement...'} />
          <MetricRow label="Commandes" value={hasData ? 'Temps réel' : 'Chargement...'} />
        </div>
      </div>

      <div className="admin-card min-h-[280px]">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Historique</h2>
        <p className="text-sm text-gray-500">
          Nous n&apos;affichons plus de courbes inventées. Quand l&apos;historique sera disponible,
          cette zone pourra recevoir des métriques temporelles réelles.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-sm text-gray-500">
          {hasData ? 'Aucune série temporelle n’est encore exposée par l’API.' : 'Chargement des données...'}
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
