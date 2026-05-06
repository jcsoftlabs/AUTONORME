'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { useState } from 'react';

export default function SupplierProfilePage() {
  const t = useTranslations('Supplier');
  const common = useTranslations('Common');
  const { user, login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    phone: user?.phone || '',
    city: user?.city || 'Port-au-Prince',
    address: 'Delmas 48, #12',
  });

  const handleSave = () => {
    if (user) {
      login({ ...user, ...formData }, 'current-token');
      alert('Profil mis à jour !');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>{t('profile')}</h1>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🏪
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{formData.shopName}</h2>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>Identifiant : {user?.id}</p>
            <span style={{ padding: '0.3rem 0.6rem', background: '#e3f2fd', color: '#1976d2', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              FOURNISSEUR VÉRIFIÉ
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom de la boutique</label>
            <input 
              type="text" 
              value={formData.shopName} 
              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Téléphone de contact</label>
            <input 
              type="text" 
              value={formData.phone} 
              disabled
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', background: '#f9f9f9' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Ville</label>
            <input 
              type="text" 
              value={formData.city} 
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Adresse physique</label>
            <input 
              type="text" 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px' }} 
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSave}
            style={{ padding: '1rem 3rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {common('save')}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ffebee', borderRadius: '8px', background: '#fff' }}>
        <h3 style={{ color: '#c62828', marginTop: 0 }}>Sécurité</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>Votre compte est protégé par authentification OTP WhatsApp.</p>
        <button style={{ color: '#c62828', background: 'none', border: '1px solid #c62828', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
          Réinitialiser les accès
        </button>
      </div>
    </div>
  );
}
