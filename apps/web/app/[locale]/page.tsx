import type { Metadata } from 'next';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/sections/HeroSection';
import ShopGridSection from '../../components/sections/ShopGridSection';
import styles from '../../components/homepage.module.css';

export const metadata: Metadata = {
  title: 'AUTONORME — L\'auto. Normée. Connectée.',
  description:
    'AUTONORME — La première plateforme numérique nationale du secteur automobile haïtien. Garages certifiés, AUTOparts, maintenance et assistant IA AutoBot en Français, Créole et Anglais.',
  keywords: ['automobile', 'haïti', 'garage', 'pièces auto', 'maintenance', 'autonorme', 'autobot'],
};

export default function HomePage() {
  return (
    <main className={styles.homePage} style={{ fontFamily: 'var(--font-body)' }}>
      <Header />
      <HeroSection />
      <ShopGridSection />
      <Footer />
    </main>
  );
}
