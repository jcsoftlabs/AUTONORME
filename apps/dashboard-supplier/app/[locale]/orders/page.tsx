'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import SupplierLayout from '@/components/layout/SupplierLayout';

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadOrders() {
      setLoading(true);
      try {
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
            items: [{ name: 'Filtre à huile Toyota Hilux', qty: 1, price: 4500 }]
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

  const formatDate = (dateStr: string) => {
    if (!mounted) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'PREPARED': return 'bg-primary-100 text-primary-700';
      case 'CONFIRMED': return 'bg-gold-light text-gold-dark';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Reçues</h1>
          <p className="text-gray-500 text-sm">Gérez le traitement de vos commandes clients.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="text-gray-500 font-medium">{common('loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="card-premium group hover:border-primary-200 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-50 transition-colors">
                      🛒
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{order.orderNumber}</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Reçue le {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <button className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 transition-all">
                      📄
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-6 mb-6 border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <th className="pb-4 text-left">Article</th>
                        <th className="pb-4 text-center">Qté</th>
                        <th className="pb-4 text-right">Prix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-bold text-gray-700">{item.name}</td>
                          <td className="py-3 text-center font-medium text-gray-500">{item.qty}</td>
                          <td className="py-3 text-right font-black text-gray-900">{item.price.toLocaleString()} <span className="text-[10px]">HTG</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                  <div className="text-xl font-black text-primary-900">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Commande</span>
                    {order.totalAmount.toLocaleString()} <span className="text-sm">HTG</span>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    {order.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'PREPARED')}
                        className="flex-1 md:flex-none px-6 py-3 bg-primary-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-primary-900/10"
                      >
                        Marquer comme Prêt
                      </button>
                    )}
                    {order.status === 'PREPARED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'SHIPPED')}
                        className="flex-1 md:flex-none px-6 py-3 bg-gold text-primary-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-gold/20"
                      >
                        Expédier la commande
                      </button>
                    )}
                    <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
