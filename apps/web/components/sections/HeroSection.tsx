import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 50%, var(--color-primary-500) 100%)',
      }}
    >
      {/* Fond animé — blobs décoratifs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          className="animate-blob"
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(74, 144, 217, 0.25) 0%, transparent 70%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          }}
        />
        <div
          className="animate-blob delay-300"
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0, 71, 176, 0.3) 0%, transparent 70%)',
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          }}
        />
        {/* Grille en pointillés */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Gradient en overlay pour lisibilité */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,31,92,0.3) 0%, transparent 50%, rgba(0,31,92,0.5) 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '760px' }}>

          {/* Badge */}
          <div
            className="animate-fade-up badge badge-glow"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            <span>🇭🇹</span>
            <span>Première plateforme automobile nationale d&apos;Haïti</span>
          </div>

          {/* Titre principal */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: 'var(--space-xl)',
              letterSpacing: '-0.03em',
            }}
          >
            L&apos;auto.{' '}
            <span className="text-gradient-gold">Normée.</span>
            <br />
            Connectée.
          </h1>

          {/* Sous-titre */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              maxWidth: '580px',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            Trouvez un garage certifié, commandez vos pièces auto, gérez votre maintenance
            et consultez <strong style={{ color: '#FFFFFF' }}>AutoBot</strong> — votre assistant IA automobile — tout en un.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up delay-300"
            style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link href="/fr/garages" className="btn btn-lg btn-white">
              <span>🔍</span>
              Trouver un garage
            </Link>
            <Link href="/fr/autobot" className="btn btn-lg btn-ghost-white">
              <span>🤖</span>
              Parler à AutoBot
            </Link>
          </div>

          {/* Indicateurs de confiance */}
          <div
            className="animate-fade-up delay-400"
            style={{
              display: 'flex',
              gap: 'var(--space-2xl)',
              marginTop: 'var(--space-3xl)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '200+', label: 'Garages partenaires' },
              { value: '5 000+', label: 'Pièces disponibles' },
              { value: '3', label: 'Langues (FR, HT, EN)' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '1.875rem',
                    color: '#FFFFFF',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carte flottante décorative */}
      <div
        className="animate-float"
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'none',
          zIndex: 1,
        }}
        id="hero-card-float"
      >
        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
            width: '320px',
            boxShadow: 'var(--shadow-2xl)',
          }}
        >
          {/* Mini chat AutoBot preview */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-gold))',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.125rem',
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'var(--font-heading)' }}>AutoBot</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>● En ligne</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#FFFFFF',
                  maxWidth: '80%',
                }}
              >
                Bonjou! Kijan mwen ka ede ou jodi a? 🇭🇹
              </div>
              <div
                style={{
                  background: 'var(--color-primary-500)',
                  borderRadius: 'var(--radius-md) 0 var(--radius-md) var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#FFFFFF',
                  alignSelf: 'flex-end',
                  maxWidth: '80%',
                }}
              >
                Mwen bezwen chanje frèn Toyota RAV4 2019
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#FFFFFF',
                  maxWidth: '90%',
                }}
              >
                ✅ En stock: 8 unités — 4 500 HTG. 3 garages certifiés près de vous!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche scroll */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-xl)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Découvrir
        </span>
        <div
          style={{
            width: '1.5rem',
            height: '2.5rem',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '0.25rem',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '8px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 'var(--radius-full)',
              animation: 'float 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          #hero-card-float { display: block !important; }
        }
      `}</style>
    </section>
  );
}
