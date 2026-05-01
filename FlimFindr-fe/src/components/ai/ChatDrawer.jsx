import React, { useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Sparkles } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SuggestedPrompts } from './SuggestedPrompts';
import './ChatDrawer.css';

export function ChatDrawer() {
  const { open, setOpen, messages, clear, streaming } = useContext(ChatContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            className="chat-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
            aria-label="AI movie assistant"
          >
            <header className="chat-header">
              <div className="chat-title">
                <Sparkles size={18} />
                <div>
                  <h3>FlimFindr AI</h3>
                  <span className="chat-sub">Movies only · Powered by Gemini</span>
                </div>
              </div>
              <div className="chat-actions">
                {messages.length > 0 && (
                  <button
                    onClick={clear}
                    aria-label="Clear chat history"
                    title="Clear"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  title="Close"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="chat-body" ref={scrollRef}>
              {messages.length === 0 ? <SuggestedPrompts /> : <MessageList />}
            </div>

            <ChatInput />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
