'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api-client';

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
};

export default function OrdersPage() {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        // Simulation d'appel API
        // En prod: GET /orders/supplier
        // const data = await fetchApi<Order[]>('/orders');
        
        // Données simulées pour la démo
        const mockOrders: Order[] = [
          {
            id: 'ord-1',
            orderNumber: 'CMD-2026-001',
            createdAt: '2026-05-04T10:30:00Z',
            totalAmount: 12500,
            status: 'PREPARED',
            items: [{ name: 'Plaquettes de frein Bosch', qty: 2, price: 6250 }]
          },
          {
            id: 'ord-2',
            orderNumber: 'CMD-2026-002',
            createdAt: '2026-05-05T14:15:00Z',
            totalAmount: 4500,
            status: 'CONFIRMED',
            items: [{ name: 'Filtre à huile Toyota', qty: 1, price: 4500 }]
          }
        ];
        setOrders(mockOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    // Simulation mise à jour API
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>{t('orders')}</h1>

      {loading ? (
        <p>{common('loading')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1a1a1a' }}>{order.orderNumber}</h3>
                  <p style={{ margin: '0.3rem 0', color: '#666', fontSize: '0.9rem' }}>
                    Passée le : {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: order.status === 'DELIVERED' ? '#d4edda' : '#fff3cd',
                    color: order.status === 'DELIVERED' ? '#155724' : '#856404'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5', padding: '1rem 0', margin: '1rem 0' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{item.qty}x {item.name}</span>
                    <span style={{ fontWeight: 600 }}>{item.price.toLocaleString()} HTG</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Total : {order.totalAmount.toLocaleString()} HTG
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'CONFIRMED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'PREPARED')}
                      style={{ padding: '0.6rem 1rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Marquer comme Prêt
                    </button>
                  )}
                  {order.status === 'PREPARED' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'SHIPPED')}
                      style={{ padding: '0.6rem 1rem', background: '#d4af37', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Expédier la commande
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
