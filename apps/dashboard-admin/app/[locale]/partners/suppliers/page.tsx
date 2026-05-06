import AdminLayout from '@/components/layout/AdminLayout';

export default function SuppliersManagementPage() {
  const suppliers = [
    { id: '1', name: 'Parts Haiti', city: 'Port-au-Prince', category: 'Pièces Neuves', status: 'Approved', activeItems: 124 },
    { id: '2', name: 'Turbo Import', city: 'Pétion-Ville', category: 'Moteurs & Turbos', status: 'Pending', activeItems: 0 },
    { id: '3', name: 'Carib Parts', city: 'Cap-Haïtien', category: 'Accessoires', status: 'Approved', activeItems: 45 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h1>
            <p className="text-gray-500 text-sm">Gérez les distributeurs de pièces AUTOparts.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span>➕</span> Nouveau Fournisseur
          </button>
        </div>

        {/* Table */}
        <div className="admin-card !p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Fournisseur</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Ville</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Catégorie</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500 text-center">Produits Actifs</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Statut</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{supplier.city}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{supplier.category}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">{supplier.activeItems}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={supplier.status} />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-gray-400 hover:text-[#FF6B00] transition-colors p-2">✏️</button>
                    <button className="text-red-400 hover:text-red-600 transition-colors p-2">🚫</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700',
    Pending: 'bg-amber-100 text-amber-700',
  };
  
  const labels: Record<string, string> = {
    Approved: 'Actif',
    Pending: 'En attente',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}
