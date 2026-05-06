'use client';

import { useCartStore } from '../../../lib/store/useCartStore';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { fetchAuthenticatedApi } from '../../../lib/authenticated-api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';

export default function PanierPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Cart');
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'MONCASH' | 'STRIPE' | 'VIREMENT'>('MONCASH');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePlaceOrder = async () => {
    if (!token) {
      router.push(`/${locale}/compte/login?redirect=panier`);
      return;
    }

    if (!deliveryAddress.trim()) {
      setError(locale === 'fr' ? 'Veuillez renseigner une adresse de livraison.' : 'Please provide a delivery address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          partId: item.id,
          supplierId: item.supplierId,
          qty: item.quantity
        })),
        deliveryAddress,
        paymentMethod,
        deliveryType: 'HOME_DELIVERY',
        deliveryPhone
      };

      await fetchAuthenticatedApi('/orders', token, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      setSuccess(true);
      clearCart();
      
      // Redirect after success
      setTimeout(() => {
        router.push(`/${locale}/compte/commandes`);
      }, 3000);

    } catch (err: any) {
      setError(err.message || (locale === 'fr' ? 'Une erreur est survenue lors de la commande.' : 'An error occurred during your order.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
          <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎉</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
              {t('success_title')}
            </h1>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-xl)' }}>
              {t('success_desc')}
            </p>
            <Link href={`/${locale}/compte/commandes`} className="btn btn-primary">
              {t('view_orders')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🛒</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
              {t('empty_title')}
            </h1>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-xl)' }}>
              {t('empty_desc')}
            </p>
            <Link href={`/${locale}/pieces`} className="btn btn-primary">
              {t('browse_catalog')}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-50)' }}>
      <Header />
      <main className="container" style={{ padding: 'var(--space-2xl) 0', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-2xl)' }}>
        
        {/* Left side: Items & Form */}
        <div className="panier-content">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.25rem', marginBottom: 'var(--space-xl)' }}>
            {t('checkout_title')}
          </h1>

          {/* Items List */}
          <section className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '0.75rem' }}>
              {t('items_title')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--color-neutral-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--color-neutral-900)' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>{item.supplierName || t('certified_seller')}</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 12px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}>-</button>
                        <span style={{ padding: '0 12px', fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px 12px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} style={{ color: 'var(--color-accent-red)', background: 'none', border: 'none', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>
                      {(item.price * item.quantity).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} HTG
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>
                      {item.price.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} HTG / u
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Form */}
          <section className="card" style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '0.75rem' }}>
              {t('delivery_title')}
            </h2>
            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('address_label')}</label>
                <textarea 
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ex: 45 Rue Capois, Port-au-Prince"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-300)', minHeight: '100px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{t('phone_label')}</label>
                <input 
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-300)' }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right side: Summary */}
        <aside className="panier-summary">
          <div className="card" style={{ padding: 'var(--space-xl)', position: 'sticky', top: '100px', background: '#FFFFFF' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>{t('summary_title')}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-neutral-600)' }}>
                <span>{t('subtotal')}</span>
                <span>{getTotalPrice().toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} HTG</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-neutral-600)' }}>
                <span>{t('delivery')}</span>
                <span style={{ color: 'var(--color-accent-green)', fontWeight: 600 }}>{t('free')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-neutral-200)', paddingTop: 'var(--space-md)', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{t('total')}</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary-600)' }}>
                  {getTotalPrice().toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')} HTG
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('payment_method')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'MONCASH'} onChange={() => setPaymentMethod('MONCASH')} />
                  <span>{t('moncash')}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} />
                  <span>{t('stripe')}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === 'VIREMENT'} onChange={() => setPaymentMethod('VIREMENT')} />
                  <span>{t('virement')}</span>
                </label>
              </div>
            </div>

            {error && (
              <div style={{ color: 'var(--color-accent-red)', fontSize: '0.875rem', marginBottom: 'var(--space-md)', padding: '0.5rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)' }}>
                {error}
              </div>
            )}

            {!token ? (
              <Link href={`/${locale}/compte/login?redirect=panier`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {t('login_to_order')}
              </Link>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', minHeight: '48px' }}
              >
                {isLoading ? t('processing') : t('place_order')}
              </button>
            )}

            <div style={{ marginTop: 'var(--space-lg)', fontSize: '0.75rem', color: 'var(--color-neutral-400)', textAlign: 'center' }}>
              {t('secure_payment')}
            </div>
          </div>
        </aside>

        <style>{`
          @media (max-width: 992px) {
            main.container {
              grid-template-columns: 1fr !important;
              padding: var(--space-lg) !important;
            }
            .panier-summary {
              order: -1;
            }
            .panier-summary .card {
              position: static !important;
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  );
}
