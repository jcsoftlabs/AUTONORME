'use client';

import { useState, type FormEvent } from 'react';

type JoinType = 'garage' | 'supplier';

export default function JoinInterestForm({ locale }: { locale: string }) {
  const [type, setType] = useState<JoinType>('garage');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      type,
      companyName: String(form.get('companyName') || ''),
      contactName: String(form.get('contactName') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      city: String(form.get('city') || ''),
      message: String(form.get('message') || ''),
      locale,
    };

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Échec de l’envoi');

      setSuccess(
        type === 'garage'
          ? 'Demande envoyée. Un membre AUTONORME vous recontactera pour la suite.'
          : 'Demande envoyée. Votre dossier fournisseur sera examiné par l’équipe.',
      );
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setType('garage')}
          className={`rounded-2xl border px-4 py-3 text-left transition ${type === 'garage' ? 'border-[#0B2A66] bg-[#0B2A66] text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">Garage</div>
          <div className="text-sm font-semibold">Je veux ajouter mon garage</div>
        </button>
        <button
          type="button"
          onClick={() => setType('supplier')}
          className={`rounded-2xl border px-4 py-3 text-left transition ${type === 'supplier' ? 'border-[#0B2A66] bg-[#0B2A66] text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">AUTOparts</div>
          <div className="text-sm font-semibold">Je veux ajouter ma boutique</div>
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label={type === 'garage' ? 'Nom du garage' : 'Nom de la boutique'} name="companyName" required />
        <Field label="Nom du contact" name="contactName" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Téléphone" name="phone" />
        <Field label="Ville" name="city" />
        <div className="md:col-span-2">
          <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Message</label>
          <textarea
            name="message"
            rows={4}
            placeholder={type === 'garage' ? 'Spécialités, quartier, horaires, besoins...' : 'Catégories de pièces, stock, livraison, marques...'}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#0B2A66] focus:ring-4 focus:ring-[#0B2A66]/10"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {type === 'garage'
            ? 'Votre demande sera examinée avant l’activation du compte garage.'
            : 'Votre demande sera examinée avant l’activation du compte fournisseur.'}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-[#0B2A66] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </div>

      {success && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}
      {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#0B2A66] focus:ring-4 focus:ring-[#0B2A66]/10"
      />
    </label>
  );
}
