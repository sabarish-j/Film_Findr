import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ type = 'info', message, duration = 4000 }) => {
      const id = `toast-${toastCounter++}`;

      const newToast = {
        id,
        type,
        message,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
