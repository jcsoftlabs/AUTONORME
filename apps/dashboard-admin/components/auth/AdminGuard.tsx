'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const isLoginPage = pathname.includes('/login');

    if (!token && !isLoginPage) {
      router.push(`/${locale}/login`);
    } else {
      setAuthorized(true);
    }
  }, [router, pathname, locale]);

  if (!authorized && !pathname.includes('/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return <>{children}</>;
}
