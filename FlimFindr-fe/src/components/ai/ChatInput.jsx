import React, { useState, useContext, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { ChatContext } from '../../context/ChatContext';

const MAX_LEN = 500;

export function ChatInput() {
  const { submit, streaming, abort } = useContext(ChatContext);
  const [val, setVal] = useState('');
  const taRef = useRef(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [val]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const t = val.trim();
    if (!t || streaming) return;
    submit(t);
    setVal('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={taRef}
        value={val}
        onChange={(e) => setVal(e.target.value.slice(0, MAX_LEN))}
        placeholder="Ask about movies, actors, recommendations…"
        rows={1}
        maxLength={MAX_LEN}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
        }}
      />
      {streaming ? (
        <button type="button" onClick={abort} aria-label="Stop generating" className="send-btn stop">
          <Square size={16} fill="currentColor" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!val.trim()}
          aria-label="Send message"
          className="send-btn"
        >
          <Send size={16} />
        </button>
      )}
    </form>
  );
}
