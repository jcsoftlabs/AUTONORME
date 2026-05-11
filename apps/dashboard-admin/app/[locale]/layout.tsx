import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import AdminGuard from '../../components/auth/AdminGuard';
import AdminLayout from '@/components/layout/AdminLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AUTONORME | Administration",
  description: "Plateforme centrale d'administration AUTONORME",
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AdminGuard>
            <AdminLayout>
              {children}
            </AdminLayout>
          </AdminGuard>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
