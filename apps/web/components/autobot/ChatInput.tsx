'use client';

import { useState, KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';

import styles from './autobot.module.css';

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

  const isActive = text.trim() && !disabled;

  return (
    <div className={styles.chatInputWrap}>
      <div className={styles.chatInputInner}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          disabled={disabled}
          rows={1}
          className={styles.chatTextarea}
        />
        <button
          onClick={handleSend}
          disabled={!isActive}
          className={`${styles.sendButton} ${isActive ? styles.sendButtonActive : styles.sendButtonDisabled}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div className={styles.chatDisclaimer}>{t('disclaimer')}</div>
    </div>
  );
}
