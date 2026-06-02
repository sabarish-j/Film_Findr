import React, { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';
import './Toast.css';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastVariants = {
  initial: { opacity: 0, y: -20, x: 20 },
  animate: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, x: 60, transition: { duration: 0.15 } },
};

export const Toast = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || Info;

          return (
            <motion.div
              key={toast.id}
              className={`toast toast--${toast.type}`}
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Icon className="toast__icon" size={20} />
              <div className="toast__content">
                <p className="toast__message">{toast.message}</p>
              </div>
              <button
                className="toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
