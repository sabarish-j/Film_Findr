import React, { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { MessageBubble } from './MessageBubble';

export function MessageList() {
  const { messages, streaming } = useContext(ChatContext);
  return (
    <div className="message-list">
      {messages.map((msg, i) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          isLast={i === messages.length - 1}
          streaming={streaming}
        />
      ))}
    </div>
  );
}
