'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../../lib/authenticated-api';
import styles from '../../../../components/account.module.css';

type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  email?: string;
  locale?: string;
  createdAt?: string;
};

export default function ProfilPage() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', locale: 'fr' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchAuthenticatedApi<UserProfile>('/users/me', token)
      .then(data => {
        setProfile(data);
        setForm({ name: data.name ?? `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(), locale: data.locale ?? 'fr' });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setSuccess('');
    try {
      const updated = await fetchAuthenticatedApi<UserProfile>('/users/me', token, {
        method: 'PATCH',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      setProfile(updated);
      setEditing(false);
      setSuccess('Profil mis à jour avec succès !');
    } finally {
      setSaving(false);
    }
  };

  const displayName = (profile?.name ?? `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim()) || '—';

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1 className={styles.title}>Mon Profil</h1>
          <p className={styles.subtitle}>Gérez vos informations personnelles et préférences.</p>
        </div>
        {!editing && (
          <div className={styles.pillRow}>
            <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm">
              Modifier
            </button>
          </div>
        )}
      </div>

      {loading && <p className={styles.cardText}>Chargement...</p>}
      {success && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#166534', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
          ✅ {success}
        </div>
      )}

      {!loading && profile && (
        <div className={styles.twoCol}>
          {/* Identité */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Informations personnelles</h2>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-neutral-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nom complet
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                      border: '1px solid var(--color-neutral-300)', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-neutral-500)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Langue préférée
                  </label>
                  <select
                    value={form.locale}
                    onChange={e => setForm(f => ({ ...f, locale: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                      border: '1px solid var(--color-neutral-300)', fontSize: '0.95rem',
                      background: '#fff', outline: 'none',
                    }}
                  >
                    <option value="fr">Français</option>
                    <option value="ht">Kreyòl Ayisyen</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn btn-outline" style={{ flex: 1 }}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.dataGrid}>
                {[
                  { label: 'Nom complet', value: displayName },
                  { label: 'Téléphone', value: profile.phone ?? '—' },
                  { label: 'Email', value: profile.email ?? '—' },
                  { label: 'Langue', value: profile.locale === 'fr' ? 'Français' : profile.locale === 'ht' ? 'Kreyòl' : 'English' },
                  { label: 'Membre depuis', value: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—' },
                ].map(field => (
                  <div key={field.label} className={styles.dataCell}>
                    <span className={styles.dataLabel}>{field.label}</span>
                    <span className={styles.dataValue}>{field.value}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Sécurité */}
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Sécurité</h2>
            <p className={styles.cardText}>Votre compte est protégé par une authentification OTP via WhatsApp/SMS.</p>
            <div className={styles.list}>
              {[
                { title: 'Authentification OTP', body: 'Connexion via code WhatsApp ou SMS', status: 'Actif' },
                { title: 'Session en cours', body: 'Token JWT valide et sécurisé', status: 'Connecté' },
              ].map(item => (
                <div key={item.title} className={styles.listItem}>
                  <div>
                    <span className={styles.itemLabel}>{item.title}</span>
                    <div className={styles.itemMeta}>{item.body}</div>
                  </div>
                  <span className={`${styles.badge} ${styles.badgePrimary}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
