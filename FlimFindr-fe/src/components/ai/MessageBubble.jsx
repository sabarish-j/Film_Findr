import React, { useContext } from 'react';
import { RotateCw } from 'lucide-react';
import { Markdown } from './Markdown';
import { TypingIndicator } from './TypingIndicator';
import { InlineMovieCard } from './InlineMovieCard';
import { ChatContext } from '../../context/ChatContext';

export function MessageBubble({ msg, isLast, streaming }) {
  const { retry, setOpen } = useContext(ChatContext);
  const isUser = msg.role === 'user';
  const showTyping = !isUser && !msg.content && streaming && isLast;
  const showRetry = !isUser && msg.error && isLast && !streaming;

  return (
    <div className={`bubble-row ${isUser ? 'user' : 'ai'}`}>
      <div className={`bubble ${msg.error ? 'bubble-error' : ''}`}>
        {showTyping ? (
          <TypingIndicator />
        ) : (
          <Markdown text={msg.content || ''} />
        )}

        {!isUser && msg.movies?.length > 0 && (
          <div className="bubble-movies">
            {msg.movies.slice(0, 6).map((m) => (
              <InlineMovieCard key={m.id} movie={m} onClick={() => setOpen(false)} />
            ))}
          </div>
        )}

        {showRetry && (
          <button className="bubble-retry" onClick={retry} type="button">
            <RotateCw size={13} /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
