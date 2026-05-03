'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher({ isSolid = false }: { isSolid?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ht', label: 'Kreyòl', flag: '🇭🇹' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const handleSwitch = (newLocale: string) => {
    setIsOpen(false);
    if (newLocale === locale) return;
    
    // Remplacer le locale actuel dans l'URL par le nouveau
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isSolid ? 'var(--color-neutral-100)' : 'rgba(255, 255, 255, 0.1)',
          border: isSolid ? '1px solid var(--color-neutral-200)' : '1px solid rgba(255, 255, 255, 0.2)',
          color: isSolid ? 'var(--color-neutral-800)' : '#FFFFFF',
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span style={{ fontSize: '1.125rem' }}>{currentLang.flag}</span>
        <span style={{ fontWeight: 500 }}>{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          minWidth: '140px',
          zIndex: 50,
        }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSwitch(lang.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: lang.code === locale ? 'var(--color-neutral-100)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                color: 'var(--color-neutral-800)',
                fontFamily: 'var(--font-body)',
                fontWeight: lang.code === locale ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (lang.code !== locale) e.currentTarget.style.background = 'var(--color-neutral-50)';
              }}
              onMouseLeave={(e) => {
                if (lang.code !== locale) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '1.125rem' }}>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
