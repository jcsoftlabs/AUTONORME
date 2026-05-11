'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { fetchApi } from '@/lib/api';
import AddGarageModal from '@/components/partners/AddGarageModal';

interface Garage {
  id: string;
  name: string;
  city: string | null;
  specialties: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function GaragesManagementPage() {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadGarages = async () => {
    try {
      const data = await fetchApi('/garages/admin/all');
      if (Array.isArray(data)) {
        setGarages(data);
      } else {
        console.error('API did not return an array:', data);
        setGarages([]);
      }
    } catch (error) {
      console.error('Failed to load garages:', error);
      setGarages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarages();
  }, []);

  const handleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await fetchApi(`/garages/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified: !currentStatus }),
      });
      // Refresh local state
      setGarages(garages.map(g => g.id === id ? { ...g, isVerified: !currentStatus } : g));
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Garages</h1>
            <p className="text-gray-500 text-sm">Validez et gérez le réseau de garages partenaires.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span> Nouveau Garage
          </button>
        </div>

        {isModalOpen && (
          <AddGarageModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={loadGarages} 
          />
        )}

        {/* Table */}
        <div className="admin-card !p-0 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Chargement des garages...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Nom du Garage</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Ville</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Spécialités</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Statut</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.isArray(garages) && garages.map((garage) => (
                  <tr key={garage.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{garage.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{garage.city || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {garage.specialties.map(s => (
                          <span key={s} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge isVerified={garage.isVerified} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleVerify(garage.id, garage.isVerified)}
                        className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors ${garage.isVerified ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                      >
                        {garage.isVerified ? 'Révoquer' : 'Approuver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
      {isVerified ? 'Validé' : 'En attente'}
    </span>
  );
}
