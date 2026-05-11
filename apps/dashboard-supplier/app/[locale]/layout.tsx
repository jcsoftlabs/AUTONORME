import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import SupplierGuard from '../../components/auth/SupplierGuard';
import '../../styles/globals.css';
import SupplierLayout from '@/components/layout/SupplierLayout';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SupplierGuard locale={locale}>
            <SupplierLayout>
              {children}
            </SupplierLayout>
          </SupplierGuard>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
