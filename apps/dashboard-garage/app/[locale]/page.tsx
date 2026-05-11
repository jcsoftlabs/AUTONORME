'use client';

export default function GarageDashboardHome() {
  const stats = [
    { label: 'Rendez-vous du jour', value: '5', trend: '+2', color: 'bg-primary-50', icon: '📅' },
    { label: 'En attente validation', value: '3', trend: 'Urgent', color: 'bg-amber-50', icon: '🔔' },
    { label: 'Véhicules en cours', value: '12', trend: 'Capacité 80%', color: 'bg-blue-50', icon: '🛠️' },
    { label: 'Chiffre du mois', value: '45,200', trend: '+15%', color: 'bg-green-50', icon: '💰', unit: 'HTG' },
  ];

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue, Garage Moderne !</h1>
          <p className="text-gray-500">Voici le résumé de votre activité pour aujourd'hui.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className={`stat-icon ${stat.color.includes('amber') ? 'warning' : ''}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  {stat.unit && <span className="text-xs font-bold text-gray-400">{stat.unit}</span>}
                </div>
                <p className={`text-[10px] font-bold mt-1 ${
                  stat.trend.includes('+') ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {stat.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Next Appointments */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Prochains Rendez-vous</h3>
              <button className="text-sm font-bold text-primary-600 hover:underline">Voir tout</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                      🚗
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Toyota Corolla - JT-5432</p>
                      <p className="text-xs text-gray-500">Vidange + Filtres • 14:30</p>
                    </div>
                  </div>
                  <span className="badge-verified">Confirmé</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="admin-card">
             <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Activité Récente</h3>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 2 && <div className="absolute left-3 top-8 bottom-[-24px] w-[2px] bg-gray-100"></div>}
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex-shrink-0 z-10 border-4 border-white shadow-sm"></div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-gray-900">Service terminé</span> pour le client Jean Destine
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Il y a 2 heures</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
