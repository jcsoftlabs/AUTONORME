import Header from '../../../components/layout/Header';
import AutoBotInterface from '../../../components/autobot/AutoBotInterface';

export const metadata = {
  title: 'AutoBot IA — Votre Assistant Automobile Intelligent',
  description: 'Discutez avec AutoBot, l\'IA d\'AUTONORME conçue pour répondre à toutes vos questions sur les pièces automobiles et les garages.',
  openGraph: {
    title: 'AutoBot IA — Votre Assistant Automobile Intelligent',
    description: 'Discutez avec AutoBot, l\'IA d\'AUTONORME conçue pour répondre à toutes vos questions.',
    url: 'https://autonorme.com/autobot',
    siteName: 'AUTONORME',
    images: [
      {
        url: '/og-autobot.png',
        width: 1200,
        height: 630,
        alt: 'AutoBot AUTONORME',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function AutoBotPage() {
  return (
    <main style={{ fontFamily: 'var(--font-body)', background: 'var(--color-neutral-50)', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header />
      
      {/* Container Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '4.5rem', overflow: 'hidden' }}>
        <AutoBotInterface />
      </div>
    </main>
  );
}
