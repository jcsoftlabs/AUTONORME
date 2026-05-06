'use client';

import { useCartStore } from '../../lib/store/useCartStore';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export default function CartFloatingButton() {
  const locale = useLocale();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || itemCount === 0) return null;

  return (
    <Link
      href={`/${locale}/panier`}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '25px',
        zIndex: 1000,
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--color-primary-600)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        textDecoration: 'none',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
        border: '2px solid rgba(255, 255, 255, 0.2)',
      }}
      className="cart-float-btn"
    >
      <style>{`
        @media (max-width: 768px) {
          .cart-float-btn {
            bottom: 20px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
          }
          .cart-badge {
            width: 20px !important;
            height: 20px !important;
            font-size: 0.65rem !important;
          }
        }
        .cart-float-btn:hover {
          transform: translateY(-4px) scale(1.05);
          background: var(--color-primary-500);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-accent-gold);
          color: var(--color-primary-900);
          font-weight: 800;
          font-size: 0.75rem;
          min-width: 24px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          alignItems: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }
      `}</style>
      
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      
      <span className="cart-badge">
        {itemCount}
      </span>
    </Link>
  );
}
