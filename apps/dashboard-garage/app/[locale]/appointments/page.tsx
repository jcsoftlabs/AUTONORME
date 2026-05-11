'use client';

import GarageLayout from '@/components/layout/GarageLayout';

export default function AppointmentsPage() {
  const appointments = [
    { id: 'RDV-001', customer: 'Jean Destine', vehicle: 'Toyota Corolla 2020', service: 'Vidange + Filtres', date: '11 Mai 2026', time: '14:30', status: 'Confirmé' },
    { id: 'RDV-002', customer: 'Marie Laurent', vehicle: 'Toyota RAV4 2019', service: 'Diagnostic Freins', date: '12 Mai 2026', time: '09:00', status: 'En attente' },
    { id: 'RDV-003', customer: 'Pierre Louis', vehicle: 'Honda CR-V 2022', service: 'Révision Générale', date: '10 Mai 2026', time: '11:00', status: 'Terminé' },
  ];

  return (
    <GarageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h1>
            <p className="text-gray-500 text-sm">Gérez les interventions prévues dans votre garage.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span>➕</span> Nouveau RDV
          </button>
        </div>

        <div className="admin-card overflow-hidden !p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Véhicule</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date / Heure</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((rdv) => (
                <tr key={rdv.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-bold text-gray-400">{rdv.id}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">{rdv.customer}</td>
                  <td className="p-4 text-sm text-gray-600">{rdv.vehicle}</td>
                  <td className="p-4 text-sm text-gray-600">{rdv.service}</td>
                  <td className="p-4 text-sm text-gray-900 font-semibold">
                    <div>{rdv.date}</div>
                    <div className="text-[10px] text-primary-600">{rdv.time}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={
                      rdv.status === 'Confirmé' ? 'badge-verified' : 
                      rdv.status === 'En attente' ? 'badge-pending' : 
                      'bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase'
                    }>
                      {rdv.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <button className="text-primary-600 font-bold hover:underline">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GarageLayout>
  );
}
