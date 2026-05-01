import { useCallback, useRef, useState } from 'react';
import { API_BASE_URL } from '../constants';

export function useChatStream({ setMessages }) {
  const [streaming, setStreaming] = useState(false);
  const ctrlRef = useRef(null);

  const send = useCallback(
    async ({ message, history, aiMsgId }) => {
      setStreaming(true);
      const controller = new AbortController();
      ctrlRef.current = controller;

      try {
        const res = await fetch(`${API_BASE_URL}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ message, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let serverMsg = `Request failed (${res.status})`;
          try {
            const j = await res.json();
            if (j?.message) serverMsg = j.message;
          } catch {}
          setMessages((msgs) =>
            msgs.map((m) =>
              m.id === aiMsgId ? { ...m, content: serverMsg, error: true } : m
            )
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          const events = buf.split('\n\n');
          buf = events.pop() || '';

          for (const evt of events) {
            const lines = evt.split('\n');
            const eventLine = lines.find((l) => l.startsWith('event: '));
            const dataLine = lines.find((l) => l.startsWith('data: '));
            if (!eventLine || !dataLine) continue;

            const event = eventLine.slice(7).trim();
            let data;
            try {
              data = JSON.parse(dataLine.slice(6));
            } catch {
              continue;
            }

            setMessages((msgs) =>
              msgs.map((m) => {
                if (m.id !== aiMsgId) return m;
                if (event === 'chunk') {
                  return { ...m, content: (m.content || '') + (data.text || '') };
                }
                if (event === 'replace') {
                  return { ...m, content: data.text || '' };
                }
                if (event === 'movies') {
                  return { ...m, movies: data.movies || [] };
                }
                if (event === 'error') {
                  return { ...m, content: data.message || 'Something went wrong.', error: true };
                }
                if (event === 'done') {
                  return { ...m, source: data.source };
                }
                return m;
              })
            );
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          setMessages((msgs) =>
            msgs.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: 'Network error. Tap retry to try again.', error: true }
                : m
            )
          );
        } else {
          setMessages((msgs) =>
            msgs.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: (m.content || '') + ' _(stopped)_', stopped: true }
                : m
            )
          );
        }
      } finally {
        setStreaming(false);
        ctrlRef.current = null;
      }
    },
    [setMessages]
  );

  const abort = useCallback(() => {
    ctrlRef.current?.abort();
  }, []);

  return { send, streaming, abort };
}
