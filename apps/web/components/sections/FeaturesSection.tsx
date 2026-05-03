import Link from 'next/link';

const features = [
  {
    icon: '🏪',
    color: '#003B8E',
    colorLight: '#D6E4F7',
    title: 'Réseau de Garages',
    description: 'Accédez à 200+ garages certifiés à travers Haïti. Géolocalisation, spécialités, avis clients et prise de RDV en ligne.',
    link: '/fr/garages',
    cta: 'Explorer les garages',
    highlights: ['Géolocalisation', 'Avis vérifiés', 'RDV en ligne'],
  },
  {
    icon: '⚙️',
    color: '#1565C0',
    colorLight: '#EEF5FC',
    title: 'AUTOparts Catalogue',
    description: 'Plus de 5 000 pièces disponibles. Vérification automatique de compatibilité avec votre véhicule, stock en temps réel.',
    link: '/fr/pieces',
    cta: 'Parcourir le catalogue',
    highlights: ['5 000+ pièces', 'Compatibilité auto', 'Stock en temps réel'],
  },
  {
    icon: '🤖',
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    title: 'AutoBot IA',
    description: 'Votre assistant automobile intelligent en Français, Créole haïtien et Anglais. Conseils, diagnostic, recommandations personnalisées.',
    link: '/fr/autobot',
    cta: 'Essayer AutoBot',
    highlights: ['Trilingue FR/HT/EN', 'Disponible 24/7', 'IA contextuelle'],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Ce que nous offrons</span>
          <h2 className="section-title">
            Tout ce dont vous avez besoin,<br />
            <span style={{ color: 'var(--color-primary-500)' }}>en un seul endroit</span>
          </h2>
          <p className="section-subtitle">
            AUTONORME réunit garages, pièces automobiles et intelligence artificielle pour transformer 
            votre expérience automobile en Haïti.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="card"
              style={{
                padding: 'var(--space-2xl)',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {/* Icône */}
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  background: feature.colorLight,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                {feature.icon}
              </div>

              {/* Titre */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.375rem',
                  color: 'var(--color-neutral-900)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
                {feature.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
                {feature.highlights.map((h) => (
                  <span
                    key={h}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      background: feature.colorLight,
                      color: feature.color,
                      border: `1px solid ${feature.color}22`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={feature.link}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  color: feature.color,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  minHeight: '44px',
                  transition: 'gap var(--transition-fast)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.75rem'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.375rem'; }}
              >
                {feature.cta}
                <span style={{ fontSize: '1.125rem' }}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
