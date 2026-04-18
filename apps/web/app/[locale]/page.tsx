import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'AUTONORME — La première plateforme numérique du secteur automobile haïtien. Garages, pièces, maintenance et assistant IA AutoBot.',
};

/**
 * Page d'accueil AUTONORME
 * Contenu Phase 3 : Hero, valeur proposition, CTA, chiffres clés, témoignages
 */
export default function HomePage() {
  const t = useTranslations('nav');

  return (
    <main>
      {/* TODO Phase 3 — Sections homepage :
          - HeroSection
          - ValuePropositionSection
          - StatsSection (garages actifs, pièces disponibles, clients)
          - FeaturesSection
          - GaragesPreviewSection
          - AutoBotPreviewSection
          - TestimonialsSection
          - CTASection
          - Footer
      */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #003B8E 0%, #1565C0 100%)',
          color: '#FFFFFF',
          fontFamily: 'Poppins, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          AUTONORME
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '0.5rem' }}>
          L&apos;auto. Normée. Connectée.
        </p>
        <p style={{ fontSize: '1rem', opacity: 0.7 }}>
          Phase 0 — Fondations monorepo ✅
        </p>
        <p style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.5rem' }}>
          Navigation : {t('garages')} · {t('parts')} · {t('autobot')}
        </p>
      </div>
    </main>
  );
}
