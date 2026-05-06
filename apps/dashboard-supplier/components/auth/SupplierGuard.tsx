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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#d4af37', margin: 0 }}>AUTONORME Pro</h2>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>{user?.shopName}</p>
        </div>
        
        <nav style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href={`/${locale}`} style={{ color: pathname === `/${locale}` ? 'white' : '#888', textDecoration: 'none', fontWeight: 600 }}>📊 Tableau de bord</a>
          <a href={`/${locale}/inventory`} style={{ color: pathname.includes('/inventory') ? 'white' : '#888', textDecoration: 'none', fontWeight: 600 }}>📦 Inventaire</a>
          <a href={`/${locale}/orders`} style={{ color: pathname.includes('/orders') ? 'white' : '#888', textDecoration: 'none', fontWeight: 600 }}>📝 Commandes</a>
          <a href={`/${locale}/profile`} style={{ color: pathname.includes('/profile') ? 'white' : '#888', textDecoration: 'none', fontWeight: 600 }}>👤 Profil</a>
        </nav>

        <div style={{ padding: '2rem', borderTop: '1px solid #333' }}>
          <button 
            onClick={() => { logout(); router.push(`/${locale}/login`); }}
            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: '#f8f9fa', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
