'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../lib/authenticated-api';

type Vehicle = { id: string; make: string; model: string; year: number };

type Props = {
  garageId: string;
  garageName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1.5px solid var(--color-neutral-200)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--color-neutral-500)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function BookingModal({ garageId, garageName, onClose, onSuccess }: Props) {
  const { token, isAuthenticated } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({
    vehicleId: '',
    date: '',
    time: '09:00',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Minimum date = aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!token) return;
    fetchAuthenticatedApi<Vehicle[]>('/vehicles', token)
      .then(v => {
        setVehicles(v);
        if (v.length > 0) setForm(f => ({ ...f, vehicleId: v[0].id }));
      })
      .catch(() => {});
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.vehicleId) { setError('Veuillez sélectionner un véhicule.'); return; }
    if (!form.date) { setError('Veuillez choisir une date.'); return; }

    setSubmitting(true);
    setError('');

    try {
      const datetime = new Date(`${form.date}T${form.time}:00`).toISOString();
      await fetchAuthenticatedApi('/appointments', token, {
        method: 'POST',
        body: JSON.stringify({ vehicleId: form.vehicleId, garageId, datetime, notes: form.notes }),
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '1.5rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-primary-900)', margin: 0 }}>
              Prendre un rendez-vous
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)', marginTop: '0.25rem' }}>
              {garageName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              background: 'var(--color-neutral-100)', border: 'none', cursor: 'pointer',
              width: '36px', height: '36px', borderRadius: '50%', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-neutral-500)', flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Non connecté */}
        {!isAuthenticated && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <p style={{ fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '1rem' }}>
              Connectez-vous pour prendre un rendez-vous
            </p>
            <a href="/fr/compte/login" className="btn btn-primary">Se connecter</a>
          </div>
        )}

        {/* Succès */}
        {success && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '0.5rem' }}>
              Rendez-vous confirmé !
            </h3>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Votre demande a été envoyée à {garageName}. Vous recevrez une confirmation sous 24h.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Fermer
            </button>
          </div>
        )}

        {/* Formulaire */}
        {isAuthenticated && !success && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Véhicule */}
            <div>
              <label style={labelStyle}>Votre véhicule *</label>
              {vehicles.length === 0 ? (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', fontSize: '0.9rem', color: 'var(--color-neutral-500)' }}>
                  Aucun véhicule enregistré —{' '}
                  <a href="/fr/compte/vehicules/nouveau" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
                    Ajouter un véhicule
                  </a>
                </div>
              ) : (
                <select
                  value={form.vehicleId}
                  onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                  required
                  style={inputStyle}
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} {v.year}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Heure *</label>
                <select
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  style={inputStyle}
                >
                  {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
                    '11:00','11:30','12:00','13:00','13:30','14:00','14:30',
                    '15:00','15:30','16:00','16:30','17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Description du problème (optionnel)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Ex : Bruit suspect au freinage, révision générale, changement de pneus..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            {/* Résumé */}
            {form.date && (
              <div style={{
                padding: '0.9rem 1rem', borderRadius: '0.9rem',
                background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-100)',
              }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-800)', margin: 0 }}>
                  📅 {new Date(`${form.date}T${form.time}`).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  })} à {form.time}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-primary-600)', margin: '0.2rem 0 0' }}>
                  📍 {garageName}
                </p>
              </div>
            )}

            {error && (
              <p style={{ color: 'var(--color-accent-red)', fontSize: '0.875rem', margin: 0 }}>
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || vehicles.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
            >
              {submitting ? 'Envoi en cours...' : 'Confirmer le rendez-vous'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
