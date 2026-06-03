'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

type Supplier = {
  id: string;
  shopName: string;
  city?: string | null;
  phone?: string | null;
  isVerified: boolean;
  isActive: boolean;
  user?: { name?: string | null; email?: string | null };
};

export default function SuppliersManagementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    ownerName: '',
    shopName: '',
    address: '',
    city: '',
    phone: '',
    zones: '',
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/suppliers/admin/all');
      setSuppliers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchApi('/suppliers', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        zones: form.zones.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    setOpen(false);
    setForm({ email: '', ownerName: '', shopName: '', address: '', city: '', phone: '', zones: '' });
    await loadSuppliers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h1>
          <p className="text-gray-500 text-sm">Créez et pilotez les comptes fournisseurs AUTOParts.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
          <span>➕</span> Nouveau Fournisseur
        </button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Fournisseur</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Compte</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Ville</th>
              <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td className="px-6 py-8 text-gray-400" colSpan={4}>Chargement...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td className="px-6 py-8 text-gray-400" colSpan={4}>Aucun fournisseur pour le moment.</td></tr>
            ) : suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{supplier.shopName}</div>
                  <div className="text-xs text-gray-400">{supplier.phone ?? '—'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{supplier.user?.email ?? supplier.user?.name ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{supplier.city ?? '—'}</td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge verified={supplier.isVerified} active={supplier.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="w-full max-w-2xl rounded-3xl bg-white p-8 space-y-5">
            <div>
              <h2 className="text-xl font-black text-gray-900">Nouveau Fournisseur</h2>
              <p className="text-sm text-gray-500">Le compte est créé avec accès OTP email.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email du compte" value={form.email} onChange={(value) => setForm({ ...form, email: value })} type="email" required />
              <Input label="Nom du contact" value={form.ownerName} onChange={(value) => setForm({ ...form, ownerName: value })} />
              <Input label="Nom de boutique" value={form.shopName} onChange={(value) => setForm({ ...form, shopName: value })} required />
              <Input label="Téléphone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <Input label="Ville" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
              <Input label="Adresse" value={form.address} onChange={(value) => setForm({ ...form, address: value })} required />
              <div className="md:col-span-2">
                <Input label="Zones de livraison" value={form.zones} onChange={(value) => setForm({ ...form, zones: value })} placeholder="Port-au-Prince, Pétion-Ville" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100">Annuler</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-[#0B2A66] text-white font-semibold">Créer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 block">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
      />
    </label>
  );
}

function StatusBadge({ verified, active }: { verified: boolean; active: boolean }) {
  const label = verified ? (active ? 'Actif' : 'Désactivé') : 'En attente';
  const style = verified
    ? active
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-600'
    : 'bg-amber-100 text-amber-700';

  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>{label}</span>;
}
