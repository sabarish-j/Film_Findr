import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../constants';
import { ChatContext } from '../../context/ChatContext';

const FALLBACK = [
  'Suggest emotional sci-fi movies like Interstellar',
  'Top 5 Tamil thrillers',
  'What should I watch from my watchlist tonight?',
  'Movies similar to my last watched film',
];

export function SuggestedPrompts() {
  const { submit } = useContext(ChatContext);
  const [prompts, setPrompts] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE_URL}/ai/suggestions`)
      .then((r) => {
        if (!cancelled && Array.isArray(r.data?.data) && r.data.data.length) {
          setPrompts(r.data.data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Sparkles size={28} />
      </div>
      <h4>Hi, I'm your movie sidekick</h4>
      <p>Ask me about films, actors, or what to watch tonight.</p>
      <div className="prompt-chips">
        {prompts.map((p) => (
          <button
            key={p}
            className="prompt-chip"
            onClick={() => submit(p)}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
