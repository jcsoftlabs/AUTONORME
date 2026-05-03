'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import ChatInput from './ChatInput';


import { useTranslations } from 'next-intl';

export default function AutoBotInterface() {
  const t = useTranslations('AutoBot');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis AutoBot, votre assistant intelligent AUTONORME. Je peux vous aider à trouver des pièces compatibles avec votre véhicule ou un garage certifié. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // 1. Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Appel API vers le backend (MOCK pour l'instant)
      // Normalement : await fetchApi('/autobot/message', { method: 'POST', body: JSON.stringify({ message: content }) });
      
      // Simulation temps de réponse réseau/IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Réponse MOCKÉE basée sur le texte
      let botResponse = "Je comprends. Cependant, je suis actuellement en phase de test de mon interface. Ma connexion au système central (Anthropic) sera activée dans la prochaine mise à jour !";
      
      if (content.toLowerCase().includes('frein') || content.toLowerCase().includes('plaquette')) {
        botResponse = "Nous avons plusieurs plaquettes de frein en stock. Pour vous recommander les bonnes pièces, pourriez-vous me donner le numéro de châssis (VIN) de votre véhicule ?";
      } else if (content.toLowerCase().includes('garage') || content.toLowerCase().includes('rendez-vous')) {
        botResponse = "Je peux vous aider à prendre rendez-vous. Dans quelle ville cherchez-vous un garage partenaire AUTONORME ?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, j'ai rencontré un problème réseau. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', width: '100%', margin: '0 auto', background: '#FFFFFF', boxShadow: 'var(--shadow-xl)', borderLeft: '1px solid var(--color-neutral-200)', borderRight: '1px solid var(--color-neutral-200)' }}>
      {/* Header Info */}
      <div style={{ padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid var(--color-neutral-200)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', background: '#FFFFFF' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', background: 'var(--color-primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
          🤖
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-neutral-900)', margin: 0 }}>{t('title')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-neutral-500)' }}>
            <span style={{ width: '8px', height: '8px', background: '#16A34A', borderRadius: '50%', display: 'inline-block' }}></span>
            {t('online')}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', background: 'var(--color-neutral-50)' }}>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-neutral-400)', marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Début de la conversation
        </div>
        
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', alignSelf: 'flex-start', maxWidth: '80%', gap: 'var(--space-sm)' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', background: 'var(--color-primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>
              🤖
            </div>
            <div style={{ background: '#FFFFFF', padding: '1rem 1.25rem', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', border: '1px solid var(--color-neutral-200)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-neutral-400)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }}></span>
              <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-neutral-400)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
              <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--color-neutral-400)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
