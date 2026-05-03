'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { fetchApi } from '../../lib/api-client';
import ChatInput from './ChatInput';
import ChatMessage, { Message } from './ChatMessage';
import styles from './autobot.module.css';

type ChatReply = {
  reply: string;
};

const promptKeys = ['prompt_1', 'prompt_2', 'prompt_3'] as const;

export default function AutoBotInterface() {
  const t = useTranslations('AutoBot');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('welcome'),
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = useMemo(() => promptKeys.map((key) => t(key)), [t]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const history = nextMessages
        .filter((message) => message.id !== 'welcome')
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await fetchApi<ChatReply>('/autobot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: content,
          history,
        }),
      });

      const botMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: t('network_error'),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>{t('assist_title')}</h2>
          <p className={styles.panelText}>{t('assist_desc')}</p>

          <div className={styles.guideList}>
            <div className={styles.guideItem}>
              <div className={styles.guideItemTitle}>{t('guide_1_title')}</div>
              <div className={styles.guideItemText}>{t('guide_1_desc')}</div>
            </div>
            <div className={styles.guideItem}>
              <div className={styles.guideItemTitle}>{t('guide_2_title')}</div>
              <div className={styles.guideItemText}>{t('guide_2_desc')}</div>
            </div>
            <div className={styles.guideItem}>
              <div className={styles.guideItemTitle}>{t('guide_3_title')}</div>
              <div className={styles.guideItemText}>{t('guide_3_desc')}</div>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>{t('prompt_title')}</h3>
          <p className={styles.panelText}>{t('prompt_desc')}</p>
          <div className={styles.promptGrid}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className={styles.promptButton}
                onClick={() => {
                  if (!isLoading) {
                    void handleSendMessage(prompt);
                  }
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className={styles.chatShell}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <div className={styles.chatAvatar}>AI</div>
            <div>
              <div className={styles.chatHeaderTitle}>{t('title')}</div>
              <div className={styles.chatHeaderMeta}>
                <span className={styles.onlineDot}></span>
                {t('online')}
              </div>
            </div>
          </div>
          <div className={styles.chatHeaderMeta}>{t('public_access')}</div>
        </div>

        <div className={styles.chatBody}>
          <div className={styles.conversationStart}>{t('conversation_start')}</div>

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className={styles.loadingWrap}>
              <div className={styles.assistantAvatar}>AI</div>
              <div className={styles.typingBubble}>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </section>
    </div>
  );
}
