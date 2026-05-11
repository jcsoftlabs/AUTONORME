'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function GarageLoginPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi de code
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation de vérification
    setTimeout(() => {
      localStorage.setItem('garage_token', 'mock_token');
      router.push(`/${locale}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image src="/log.png" alt="AUTONORME" width={220} height={60} unoptimized style={{ objectFit: 'contain' }} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Portail Garage</h2>
        <p className="mt-2 text-sm text-gray-500">Connectez-vous pour gérer vos interventions</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-blue-900/5 rounded-3xl border border-gray-100">
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendCode}>
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold">🇭🇹</span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+509 0000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary-300 focus:bg-white transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-black uppercase tracking-widest text-white bg-primary-700 hover:bg-primary-800 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Envoi en cours...' : 'Recevoir le code'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="code" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary-300 focus:bg-white transition-all text-center text-2xl font-black tracking-[0.5em]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-black uppercase tracking-widest text-primary-900 bg-gold hover:bg-gold/90 focus:outline-none transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-bold text-gray-400 hover:text-primary-600 uppercase tracking-widest"
              >
                Changer de numéro
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
