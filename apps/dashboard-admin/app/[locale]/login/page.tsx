'use client';

import { useState } from 'react';
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
      // Appel API simulé pour l'envoi de l'OTP (Backend auth/send-otp)
      const response = await fetch('http://localhost:3001/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      if (response.ok) {
        setStep('otp');
      } else {
        alert('Erreur lors de l&apos;envoi du code');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('admin_token', data.accessToken);
        router.push('/');
      } else {
        alert('Code incorrect');
      }
    } catch (error) {
      alert('Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour gérer AUTONORME</p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+509 XXXX XXXX"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Recevoir le code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Code de vérification (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] font-black outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Se connecter'}
            </button>
            <button 
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Modifier le numéro
            </button>
          </form>
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            &copy; 2026 AUTONORME Technologies
          </p>
        </div>
      </div>
    </div>
  );
}
