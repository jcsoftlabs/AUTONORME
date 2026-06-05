'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

type JoinRequest = {
  id: string;
  type: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  message?: string | null;
  locale: string;
  status: JoinRequestStatus;
  adminNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
};

export default function OnboardingRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = (await fetchApi('/join-requests')) as JoinRequest[];
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: JoinRequestStatus) => {
    setSavingId(id);
    setError('');
    try {
      await fetchApi(`/join-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Demandes de rejoindre le réseau</h1>
        <p className="text-sm text-gray-500">Les demandes arrivent ici avant validation manuelle par l’équipe.</p>
      </div>

      {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Aucune demande pour le moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <article key={request.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary-700">
                      {request.type === 'garage' ? 'Garage' : 'AUTOparts'}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
                      request.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700'
                        : request.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900">{request.companyName}</h2>
                  <p className="text-sm text-gray-600">
                    {request.contactName} · {request.email} {request.phone ? `· ${request.phone}` : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.city || 'Ville non précisée'} · {new Date(request.createdAt).toLocaleString('fr-FR')}
                  </p>
                  {request.message && (
                    <p className="max-w-3xl rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                      {request.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => updateStatus(request.id, 'APPROVED')}
                    disabled={savingId === request.id}
                    className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {savingId === request.id ? '...' : 'Approuver'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(request.id, 'REJECTED')}
                    disabled={savingId === request.id}
                    className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 disabled:opacity-60"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
