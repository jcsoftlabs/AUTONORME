'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

interface SupplierGuardProps {
  children: ReactNode;
  locale: string;
}

export default function SupplierGuard({ children, locale }: SupplierGuardProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isLoginPage = pathname.includes('/login');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated && !isLoginPage) {
      router.push(`/${locale}/login`);
    }
  }, [isMounted, isAuthenticated, isLoginPage, router, locale]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isMounted || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'sans-serif' }}>
        <p>Vérification des accès...</p>
      </div>
    );
  }

  return <>{children}</>;
}
