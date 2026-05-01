const KEY = 'flimfindr_chat_v1';
const MAX = 50;

export const loadHistory = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveHistory = (msgs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(msgs.slice(-MAX)));
  } catch {
    // quota exceeded — ignore
  }
};

export const clearStoredHistory = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};
