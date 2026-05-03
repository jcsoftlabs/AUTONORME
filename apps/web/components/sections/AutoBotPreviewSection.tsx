'use client';

import { useState } from 'react';
import Link from 'next/link';

const chatMessages = [
  { role: 'assistant', text: 'Bonjou! Mwen se AutoBot, asistan otomobil ou. Kijan mwen ka ede ou jodi a? 🇭🇹' },
  { role: 'user', text: 'J\'ai besoin de changer les plaquettes de frein de ma Toyota Corolla 2020' },
  { role: 'assistant', text: '✅ J\'ai trouvé 3 options compatibles pour votre Toyota Corolla 2020:\n\n• **Brembo OEM** — 3 200 HTG (En stock: 12 unités)\n• **Bosch QuietCast** — 2 800 HTG (En stock: 8 unités)\n• **ATE Power** — 2 500 HTG (Sur commande, 3j)\n\nVoulez-vous que je cherche un garage certifié près de vous pour l\'installation? 🔧' },
  { role: 'user', text: 'Oui, je suis à Port-au-Prince, zone Pétion-Ville' },
  { role: 'assistant', text: '📍 J\'ai trouvé 3 garages certifiés à Pétion-Ville:\n\n1. **Garage Central Motors** ⭐ 4.9 — 2.3 km\n2. **Auto Plus PV** ⭐ 4.7 — 3.1 km\n3. **TechAuto Haïti** ⭐ 4.8 — 4.0 km\n\nJe peux prendre un RDV pour vous. Quel jour vous convient?' },
];

const langOptions = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'ht', flag: '🇭🇹', label: 'Kreyòl' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

export default function AutoBotPreviewSection() {
  const [activeLang, setActiveLang] = useState('fr');

  return (
    <section
      id="autobot"
      className="section"
      style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}
    >
      {/* Décoration */}
      <div
        style={{
          position: 'absolute',
          right: '-200px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, var(--color-primary-50) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-4xl)',
            alignItems: 'center',
          }}
        >
          {/* Texte gauche */}
          <div>
            <span className="section-eyebrow">Intelligence Artificielle</span>
            <h2 className="section-title">
              Rencontrez{' '}
              <span style={{ color: 'var(--color-primary-500)' }}>AutoBot</span>,<br />
              votre conseiller IA
            </h2>
            <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.8, marginBottom: 'var(--space-xl)', fontSize: '1.0625rem' }}>
              AutoBot répond à toutes vos questions automobiles en <strong>Français</strong>, 
              <strong> Créole haïtien</strong> et <strong>Anglais</strong>. Il connaît votre véhicule, 
              vérifie la compatibilité des pièces en temps réel, et peut réserver un RDV chez un garage.
            </p>

            {/* Capacités */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
              {[
                { icon: '🔍', title: 'Diagnostic intelligent', desc: 'Identifie le problème depuis vos symptômes' },
                { icon: '⚙️', title: 'Vérification de compatibilité', desc: 'Confirme que la pièce convient à votre voiture' },
                { icon: '📅', title: 'Prise de RDV', desc: 'Réserve directement chez le garage de votre choix' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '2.75rem',
                      height: '2.75rem',
                      minWidth: '2.75rem',
                      background: 'var(--color-primary-50)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '0.125rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/fr/autobot" className="btn btn-primary btn-lg">
              <span>🤖</span>
              Essayer AutoBot gratuitement
            </Link>
          </div>

          {/* Chat preview droite */}
          <div>
            {/* Sélecteur de langue */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              {langOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: `2px solid ${activeLang === lang.code ? 'var(--color-primary-500)' : 'var(--color-neutral-200)'}`,
                    background: activeLang === lang.code ? 'var(--color-primary-50)' : '#FFFFFF',
                    color: activeLang === lang.code ? 'var(--color-primary-700)' : 'var(--color-neutral-600)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    minHeight: '44px',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            {/* Fenêtre chat */}
            <div
              style={{
                background: 'var(--color-neutral-900)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-2xl)',
                border: '1px solid var(--color-neutral-800)',
              }}
            >
              {/* Barre de titre */}
              <div
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-neutral-800)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  borderBottom: '1px solid var(--color-neutral-700)',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#FF5F57', '#FFBB2C', '#28C840'].map((c) => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      background: 'linear-gradient(135deg, var(--color-primary-500), #7C3AED)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                    }}
                  >🤖</div>
                  <span style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600 }}>AutoBot — AUTONORME</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>● En ligne</span>
                </div>
              </div>

              {/* Messages */}
              <div
                style={{
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  maxHeight: '360px',
                  overflowY: 'auto',
                }}
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: msg.role === 'user'
                          ? 'var(--radius-lg) var(--radius-md) var(--radius-md) var(--radius-lg)'
                          : 'var(--radius-md) var(--radius-lg) var(--radius-lg) var(--radius-md)',
                        background: msg.role === 'user' ? 'var(--color-primary-500)' : 'var(--color-neutral-800)',
                        color: '#FFFFFF',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div
                style={{
                  padding: 'var(--space-md) var(--space-lg)',
                  borderTop: '1px solid var(--color-neutral-700)',
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: 'var(--color-neutral-800)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: 'var(--color-neutral-500)',
                    fontSize: '0.875rem',
                  }}
                >
                  Posez votre question ici...
                </div>
                <Link href="/fr/autobot" className="btn btn-primary btn-sm" style={{ minWidth: 'auto' }}>
                  →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
