import React, { useContext } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';

export function ChatFab() {
  const { open, setOpen } = useContext(ChatContext);
  if (open) return null;
  return (
    <button
      className="chat-fab"
      onClick={() => setOpen(true)}
      aria-label="Open AI movie assistant"
      type="button"
    >
      <Sparkles size={18} />
      <span>Ask AI</span>
    </button>
  );
}
