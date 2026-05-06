'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import { useLocale } from 'next-intl';

export default function SupplierLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  const handleSendOtp = async () => {
    setLoading(true);
    // Simulation d'envoi OTP
    await new Promise(r => setTimeout(r, 1000));
    setStep(2);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const mockUser = {
      id: 'supp-123',
      phone: phone,
      role: 'SUPPLIER',
      shopName: 'Haïti AutoParts Center'
    };
    login(mockUser, 'fake-jwt-token');
    router.push(`/${locale}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-800 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px] opacity-30"></div>

      <div className="w-full max-w-[440px] px-6 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-primary-900 text-3xl font-black shadow-xl shadow-gold/20 mb-6">
              S
            </div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Portail Fournisseur</h1>
            <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Autonorme Business</p>
          </div>
          
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone (+509)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+509</span>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="3765 4321"
                    className="w-full p-4 pl-16 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-lg" 
                  />
                </div>
              </div>
              
              <button 
                onClick={handleSendOtp}
                disabled={loading || phone.length < 8}
                className="w-full py-4 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-900/20 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Recevoir le code OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">Code de vérification</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-black text-2xl text-center tracking-[0.5em]" 
                />
              </div>

              <button 
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full py-4 bg-gold text-primary-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-gold/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
              >
                Modifier le numéro
              </button>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              &copy; 2026 AUTONORME &bull; Haiti Digital Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
