'use client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 'var(--space-sm)',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
      }}
    >
      {/* Avatar (seulement pour le bot) */}
      {!isUser && (
        <div
          style={{
            width: '2.25rem',
            height: '2.25rem',
            background: 'var(--color-primary-100)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.125rem',
            flexShrink: 0,
          }}
        >
          🤖
        </div>
      )}

      {/* Bulle de message */}
      <div
        style={{
          background: isUser ? 'var(--color-primary-600)' : '#FFFFFF',
          color: isUser ? '#FFFFFF' : 'var(--color-neutral-900)',
          padding: '0.875rem 1.125rem',
          borderRadius: '1rem',
          borderBottomRightRadius: isUser ? '0.25rem' : '1rem',
          borderBottomLeftRadius: !isUser ? '0.25rem' : '1rem',
          boxShadow: 'var(--shadow-sm)',
          border: isUser ? 'none' : '1px solid var(--color-neutral-200)',
          fontSize: '0.9375rem',
          lineHeight: 1.5,
          position: 'relative',
        }}
      >
        {message.content}
        
        {/* Timestamp discret */}
        <div
          style={{
            fontSize: '0.625rem',
            color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--color-neutral-400)',
            marginTop: '0.25rem',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
