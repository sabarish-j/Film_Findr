import React from 'react';
import { motion } from 'framer-motion';
import './AuthCard.css';

export const AuthCard = ({ children, maxWidth = '440px' }) => {
  return (
    <motion.div
      className="auth-card"
      style={{ maxWidth }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
