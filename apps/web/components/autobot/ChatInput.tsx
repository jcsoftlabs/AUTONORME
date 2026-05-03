'use client';

import { useState, KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const t = useTranslations('AutoBot');
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ padding: 'var(--space-md) var(--space-xl)', background: '#FFFFFF', borderTop: '1px solid var(--color-neutral-200)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 'var(--space-sm)',
          background: 'var(--color-neutral-100)',
          borderRadius: '1.25rem',
          padding: '0.5rem',
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: '0.5rem 0.5rem 0.5rem 1rem',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-neutral-900)',
            maxHeight: '120px',
            minHeight: '44px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: text.trim() && !disabled ? 'var(--color-primary-600)' : 'var(--color-neutral-300)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: text.trim() && !disabled ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--color-neutral-400)', marginTop: '0.5rem' }}>
        AutoBot peut faire des erreurs. Pensez à vérifier les informations importantes.
      </div>
    </div>
  );
}
