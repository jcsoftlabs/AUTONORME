'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { useLocale } from 'next-intl';

export default function SupplierLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const { login } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  const handleSendOtp = () => {
    // Simulation
    setStep(2);
  };

  const handleVerifyOtp = () => {
    // Simulation d'un utilisateur fournisseur
    const mockUser = {
      id: 'supp-123',
      phone: phone,
      role: 'SUPPLIER',
      shopName: 'Haïti AutoParts Center'
    };
    login(mockUser, 'fake-jwt-token');
    router.push(`/${locale}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Portail Fournisseur</h1>
        
        {step === 1 ? (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Téléphone (+509)</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="3765 4321"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }} 
            />
            <button 
              onClick={handleSendOtp}
              style={{ width: '100%', padding: '1rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Envoyer le code OTP
            </button>
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Code de vérification</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }} 
            />
            <button 
              onClick={handleVerifyOtp}
              style={{ width: '100%', padding: '1rem', background: '#d4af37', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Vérifier et se connecter
            </button>
            <button 
              onClick={() => setStep(1)}
              style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            >
              Modifier le numéro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
