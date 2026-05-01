import React from 'react';
import { motion } from 'framer-motion';
import './PageWrapper.css';

export const PageWrapper = ({ children, maxWidth = 'content', noPadding = false, className = '' }) => {
  const maxWidthClass = {
    content: 'page-wrapper--max-content',
    narrow: 'page-wrapper--max-narrow',
    full: 'page-wrapper--max-full',
  }[maxWidth] || 'page-wrapper--max-content';

  const paddingClass = noPadding ? 'page-wrapper--no-padding' : '';

  return (
    <motion.div
      className={`page-wrapper ${maxWidthClass} ${paddingClass} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
