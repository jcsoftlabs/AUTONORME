'use client';

export default function CustomersPage() {
  const customers = [
    { id: 'C-001', name: 'Jean Destine', phone: '+509 3456 7890', visits: 4, lastVisit: '10 Mai 2026', vehicle: 'Toyota Corolla' },
    { id: 'C-002', name: 'Marie Laurent', phone: '+509 4567 8901', visits: 1, lastVisit: 'Nouveau', vehicle: 'Toyota RAV4' },
    { id: 'C-003', name: 'Pierre Louis', phone: '+509 3210 5678', visits: 8, lastVisit: '15 Avril 2026', vehicle: 'Honda CR-V' },
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ma Clientèle</h1>
            <p className="text-gray-500 text-sm">Retrouvez l'historique et les contacts de vos clients.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="admin-card group hover:border-primary-300 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-xl font-bold text-primary-600">
                  {customer.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{customer.name}</h3>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">{customer.id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Téléphone</span>
                  <span className="font-semibold">{customer.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Véhicule principal</span>
                  <span className="font-semibold text-gray-900">{customer.vehicle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Visites</span>
                  <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-bold">{customer.visits}</span>
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Dernier passage</span>
                  <span className="text-xs font-bold text-gray-600">{customer.lastVisit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
