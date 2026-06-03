'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { fetchApi } from '../../lib/api-client';
import styles from './autobot.module.css';

type WidgetMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatReply = {
  reply: string;
};

export default function AutoBotFloatingWidget() {
  const t = useTranslations('AutoBot');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('widget_welcome'),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  if (pathname?.includes('/autobot')) {
    return null;
  }

  const sendMessage = async (message: string) => {
    const content = message.trim();
    if (!content || isLoading) return;

    const userMessage: WidgetMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = nextMessages
        .filter((entry) => entry.id !== 'welcome')
        .slice(-8)
        .map((entry) => ({
          role: entry.role,
          content: entry.content,
        }));

      const response = await fetchApi<ChatReply>('/autobot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: content,
          history,
        }),
      });

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: response.reply,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content: t('network_error'),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className={styles.widgetRoot}>
      {isOpen && (
        <section className={styles.widgetPanel} aria-label={t('widget_title')}>
          <div className={styles.widgetHeader}>
            <div className={styles.widgetHeaderInfo}>
              <div className={styles.widgetAvatar}>C</div>
              <div>
                <div className={styles.widgetTitle}>{t('widget_title')}</div>
                <div className={styles.widgetMeta}>
                  <span className={styles.onlineDot}></span>
                  {t('online')}
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.widgetClose}
              onClick={() => setIsOpen(false)}
              aria-label={t('widget_close')}
            >
              ×
            </button>
          </div>

          <div className={styles.widgetBody}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.widgetMessage} ${
                  message.role === 'user' ? styles.widgetMessageUser : styles.widgetMessageAssistant
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.widgetMessage} ${styles.widgetMessageAssistant}`}>
                {t('widget_typing')}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.widgetForm} onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('widget_placeholder')}
              className={styles.widgetInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.widgetSend}
              disabled={!input.trim() || isLoading}
              aria-label={t('widget_send')}
            >
              →
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.widgetTrigger}
        onClick={() => setIsOpen((value) => !value)}
        aria-label={t('widget_trigger')}
      >
        {t('widget_bubble')}
      </button>
    </div>
  );
}
