import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import QueryProvider from '../../lib/query-provider';
import CartFloatingButton from '../../components/cart/CartFloatingButton';

// Polices AUTONORME (BLOC 1 — Identité)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const locales = ['fr', 'ht', 'en'] as const;

export const metadata: Metadata = {
  title: {
    default: 'AUTONORME — L\'auto. Normée. Connectée.',
    template: '%s | AUTONORME',
  },
  description:
    'La première plateforme numérique nationale du secteur automobile haïtien. Trouvez un garage, commandez vos pièces, planifiez votre maintenance.',
  keywords: ['automobile', 'haiti', 'garage', 'pièces auto', 'maintenance', 'autonorme'],
  authors: [{ name: 'AUTONORME S.A.' }],
  creator: 'AUTONORME S.A.',
  openGraph: {
    type: 'website',
    locale: 'fr_HT',
    alternateLocale: ['ht', 'en'],
    siteName: 'AUTONORME',
    title: 'AUTONORME — L\'auto. Normée. Connectée.',
    description: 'La première plateforme automobile nationale d\'Haïti.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUTONORME',
    description: 'La première plateforme automobile nationale d\'Haïti.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-inter antialiased bg-white text-neutral-900">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
            <CartFloatingButton />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
