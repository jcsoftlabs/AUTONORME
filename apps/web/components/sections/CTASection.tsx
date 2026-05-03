import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      id="cta"
      style={{
        padding: 'var(--space-5xl) 0',
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-600) 60%, #7C3AED 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Décoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(21,101,192,0.4) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: 'var(--space-xl)',
          }}
        >
          <span>🚀</span>
          <span>Gratuit — Aucune carte de crédit requise</span>
        </div>

        {/* Titre */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: 'var(--space-xl)',
            letterSpacing: '-0.02em',
          }}
        >
          Prêt à moderniser votre<br />
          <span className="text-gradient-gold">expérience automobile ?</span>
        </h2>

        {/* Sous-titre */}
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            maxWidth: '560px',
            margin: '0 auto var(--space-2xl)',
          }}
        >
          Rejoignez des milliers d&apos;automobilistes haïtiens qui font confiance à AUTONORME pour la gestion de leurs véhicules.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-md)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-3xl)',
          }}
        >
          <Link href="/fr/compte" className="btn btn-lg btn-white">
            <span>✨</span>
            Créer un compte gratuit
          </Link>
          <Link href="/fr/garages" className="btn btn-lg btn-ghost-white">
            <span>🏪</span>
            Explorer les garages
          </Link>
        </div>

        {/* Garanties */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2xl)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: '🔒', text: 'Données sécurisées' },
            { icon: '📱', text: 'Application mobile' },
            { icon: '💬', text: 'Support WhatsApp 24/7' },
            { icon: '🇭🇹', text: 'Fait pour Haïti' },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9375rem',
                fontWeight: 500,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
