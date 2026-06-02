import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { useChatStream } from '../hooks/useChatStream';
import { loadHistory, saveHistory, clearStoredHistory } from '../utils/chatStorage';

export const ChatContext = createContext(null);

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const ChatProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory());
  const { send, streaming, abort } = useChatStream({ setMessages });
  const lastUserMsgRef = useRef(null);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const submit = useCallback(
    (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || streaming) return;

      const userMsg = { id: newId(), role: 'user', content: trimmed };
      const aiMsg = { id: newId(), role: 'assistant', content: '', movies: [] };
      lastUserMsgRef.current = trimmed;

      setMessages((m) => [...m, userMsg, aiMsg]);

      const historyForApi = messages
        .filter((m) => !m.error)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      send({ message: trimmed, history: historyForApi, aiMsgId: aiMsg.id });
    },
    [messages, send, streaming]
  );

  const retry = useCallback(() => {
    if (!lastUserMsgRef.current || streaming) return;
    setMessages((m) => {
      const filtered = [...m];
      while (filtered.length && filtered[filtered.length - 1].role === 'assistant') {
        filtered.pop();
      }
      while (filtered.length && filtered[filtered.length - 1].role === 'user') {
        filtered.pop();
      }
      return filtered;
    });
    setTimeout(() => submit(lastUserMsgRef.current), 0);
  }, [submit, streaming]);

  const clear = useCallback(() => {
    setMessages([]);
    clearStoredHistory();
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <ChatContext.Provider
      value={{
        open,
        setOpen,
        toggle,
        messages,
        submit,
        retry,
        streaming,
        abort,
        clear,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
