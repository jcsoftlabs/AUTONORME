'use client';

import styles from './autobot.module.css';

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
      className={`${styles.messageRow} ${isUser ? styles.messageRowUser : styles.messageRowAssistant}`}
    >
      {!isUser && <div className={styles.assistantAvatar}>AI</div>}

      <div
        className={`${styles.messageBubble} ${
          isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant
        }`}
      >
        <div>{message.content}</div>
        <div
          className={`${styles.timestamp} ${
            isUser ? styles.timestampUser : styles.timestampAssistant
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
