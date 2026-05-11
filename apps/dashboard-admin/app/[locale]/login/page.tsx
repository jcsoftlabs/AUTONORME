'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [phone, setPhone] = useState('+509');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (response.ok) {
        setStep('otp');
      } else {
        alert('Erreur lors de l\'envoi du code');
      }
    } catch {
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await response.json();
      if (response.ok) {
        const token = data.data?.accessToken || data.accessToken;
        localStorage.setItem('admin_token', token);
        router.push('/');
      } else {
        alert('Code incorrect');
      }
    } catch {
      alert('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #001F5C 0%, #003B8E 50%, #1565C0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'rgba(245,158,11,0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '420px', width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Image src="/log.png" alt="AUTONORME" width={220} height={60} style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', fontFamily: 'Poppins, sans-serif', margin: 0 }}>
            Administration
          </h1>
          <p style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Connectez-vous pour gérer AUTONORME
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#E5E7EB', marginBottom: '2rem' }} />

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+509 XXXX XXXX"
                style={{
                  width: '100%', padding: '0.875rem 1rem',
                  border: '2px solid #E5E7EB', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: 600, color: '#111827',
                  outline: 'none', fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #1565C0, #003B8E)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 15px rgba(21,101,192,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Envoi...' : '→ Recevoir le code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Code de vérification
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                style={{
                  width: '100%', padding: '1rem',
                  border: '2px solid #E5E7EB', borderRadius: '12px',
                  fontSize: '2rem', fontWeight: 800, color: '#111827',
                  textAlign: 'center', letterSpacing: '0.5em',
                  outline: 'none', fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#1565C0'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
              <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem', textAlign: 'center' }}>
                Code envoyé au {phone}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #F59E0B, #B45309)',
                color: '#111827', border: 'none', borderRadius: '12px',
                fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
              }}
            >
              {loading ? 'Vérification...' : '✓ Se connecter'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              style={{
                width: '100%', padding: '0.75rem',
                background: 'transparent', color: '#6B7280',
                border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
              }}
            >
              ← Modifier le numéro
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © 2026 AUTONORME Technologies
          </p>
        </div>
      </div>
    </div>
  );
}
