import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import SupplierGuard from '../../components/auth/SupplierGuard';

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
            {children}
          </SupplierGuard>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
