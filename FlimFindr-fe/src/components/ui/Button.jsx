import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from './Spinner';
import './Button.css';

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const fullWidthClass = fullWidth ? 'button--full-width' : '';
  const disabledClass = disabled || loading ? 'button--disabled' : '';

  return (
    <motion.button
      className={`button ${variantClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm'} color="currentColor" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="button__icon button__icon--left">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="button__icon button__icon--right">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
};
