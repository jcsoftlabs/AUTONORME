'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../lib/store/useAuthStore';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type Mode = 'login' | 'register';
type Step = 1 | 2 | 3; // 1: phone, 2: OTP, 3: profile (register only)

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const login = useAuthStore((state) => state.login);

  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetFlow = (newMode: Mode) => {
    setMode(newMode);
    setStep(1);
    setPhone('');
    setOtp('');
    setFirstName('');
    setLastName('');
    setError('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (phone.length < 8) throw new Error('Numéro de téléphone invalide.');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp !== '123456') throw new Error('Code incorrect. Indice : utilisez 123456 pour la démo.');
      if (mode === 'register') {
        setStep(3);
      } else {
        login({ id: 'user-1', phone, role: 'CLIENT', firstName: 'Client' }, 'mock-jwt-token');
        router.push(`/${locale}/compte`);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!firstName.trim()) throw new Error('Le prénom est requis.');
      login({ id: 'user-new', phone, role: 'CLIENT', firstName, lastName }, 'mock-jwt-token');
      router.push(`/${locale}/compte`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    login: {
      1: 'Connexion à votre compte',
      2: 'Vérification du numéro',
      3: '',
    },
    register: {
      1: 'Créer votre compte gratuit',
      2: 'Vérification du numéro',
      3: 'Finalisez votre profil',
    },
  };

  const stepDescs = {
    login: {
      1: 'Entrez votre numéro pour recevoir un code de vérification.',
      2: `Code envoyé au +509 ${phone}.`,
      3: '',
    },
    register: {
      1: 'Rejoignez AUTONORME — la plateforme automobile nationale.',
      2: `Code de vérification envoyé au +509 ${phone}.`,
      3: 'Dernière étape ! Dites-nous comment vous appeler.',
    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-neutral-50)' }}>
      <style>{`
        @media (min-width: 1024px) { .auth-left { display: block !important; } .auth-mobile-logo { display: none !important; } }
      `}</style>

      {/* Left panel */}
      <div className="auth-left" style={{ flex: 1, display: 'none', position: 'relative', background: 'var(--color-primary-900)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-4xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: '#FFFFFF' }}>
          <Image src="/log.png" alt="AUTONORME" width={240} height={60} style={{ objectFit: 'contain', marginBottom: 'var(--space-2xl)' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>
            {mode === 'login' ? 'Content de vous revoir !' : 'Bienvenue dans AUTONORME !'}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-primary-200)', maxWidth: '400px', lineHeight: 1.6 }}>
            {mode === 'login'
              ? 'Accédez à votre tableau de bord, gérez vos rendez-vous et commandes de pièces.'
              : 'Créez votre compte gratuitement et accédez à 200+ garages certifiés, 5 000+ pièces et AutoBot 24/7.'}
          </p>

          {mode === 'register' && (
            <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {['✅ 100% gratuit, sans engagement', '🔒 Données sécurisées', '🇭🇹 Service en Français, Créole et Anglais'].map(item => (
                <div key={item} style={{ color: 'var(--color-primary-100)', fontSize: '0.9375rem' }}>{item}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>

          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
            <Image src="/log.png" alt="AUTONORME" width={180} height={45} style={{ objectFit: 'contain', margin: '0 auto' }} />
          </div>

          {/* Mode Toggle */}
          {step === 1 && (
            <div style={{ display: 'flex', background: 'var(--color-neutral-200)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: 'var(--space-xl)', gap: '4px' }}>
              {(['login', 'register'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => resetFlow(m)}
                  style={{
                    flex: 1,
                    padding: '0.625rem',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    minHeight: '44px',
                    transition: 'all var(--transition-fast)',
                    background: mode === m ? '#FFFFFF' : 'transparent',
                    color: mode === m ? 'var(--color-primary-700)' : 'var(--color-neutral-500)',
                    boxShadow: mode === m ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  {m === 'login' ? 'Connexion' : 'Créer un compte'}
                </button>
              ))}
            </div>
          )}

          <div style={{ background: '#FFFFFF', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>

            {/* Step indicator for register */}
            {mode === 'register' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: 'var(--space-lg)' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: s <= step ? 'var(--color-primary-500)' : 'var(--color-neutral-200)',
                    transition: 'background var(--transition-base)',
                  }} />
                ))}
              </div>
            )}

            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.375rem', marginBottom: 'var(--space-xs)', color: 'var(--color-neutral-900)' }}>
              {stepTitles[mode][step]}
            </h2>
            <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.9375rem', marginBottom: 'var(--space-xl)', lineHeight: 1.5 }}>
              {stepDescs[mode][step]}
            </p>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                {error}
              </div>
            )}

            {/* Step 1: Phone */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '0.5rem' }}>
                    Numéro de téléphone
                  </label>
                  <div style={{ display: 'flex' }}>
                    <span style={{ background: 'var(--color-neutral-100)', padding: '0.75rem 1rem', border: '1px solid var(--color-neutral-300)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', color: 'var(--color-neutral-600)', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}>
                      🇭🇹 +509
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="3456 7890"
                      required
                      style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid var(--color-neutral-300)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: '1rem', outline: 'none', minHeight: '48px' }}
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !phone} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', minHeight: '48px' }}>
                  {isLoading ? 'Envoi...' : mode === 'login' ? 'Recevoir le code' : 'Continuer →'}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '0.5rem' }}>
                    Code de vérification <span style={{ color: 'var(--color-neutral-400)', fontWeight: 400 }}>(démo: 123456)</span>
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • • • •"
                    maxLength={6}
                    required
                    autoFocus
                    style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius-md)', fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center', outline: 'none', minHeight: '56px', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" disabled={isLoading || otp.length !== 6} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-md)', minHeight: '48px' }}>
                  {isLoading ? 'Vérification...' : 'Confirmer le code'}
                </button>
                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary-600)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline', minHeight: '44px' }}>
                    ← Modifier le numéro
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Profile (register only) */}
            {step === 3 && (
              <form onSubmit={handleCompleteProfile}>
                <div style={{ display: 'grid', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '0.5rem' }}>Prénom *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Jean"
                      required
                      autoFocus
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', minHeight: '48px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '0.5rem' }}>Nom <span style={{ color: 'var(--color-neutral-400)', fontWeight: 400 }}>(optionnel)</span></label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Pierre"
                      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius-md)', fontSize: '1rem', outline: 'none', minHeight: '48px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading || !firstName.trim()} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', minHeight: '48px' }}>
                  {isLoading ? 'Création...' : '🎉 Créer mon compte'}
                </button>
              </form>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <Link href={`/${locale}`} style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem', textDecoration: 'none' }}>
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
