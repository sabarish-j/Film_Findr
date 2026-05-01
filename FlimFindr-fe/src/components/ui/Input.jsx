import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

export const Input = ({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  rightAction,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}

      <div className="input__container">
        {LeftIcon && <LeftIcon className="input__icon input__icon--left" size={18} />}

        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${error ? 'input--error' : ''}`}
          {...props}
        />

        {isPasswordField ? (
          <button
            type="button"
            className="input__action"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : rightAction ? (
          <div className="input__action">{rightAction}</div>
        ) : RightIcon ? (
          <RightIcon className="input__icon input__icon--right" size={18} />
        ) : null}
      </div>

      {error && <p className="input__error">{error}</p>}
      {hint && !error && <p className="input__hint">{hint}</p>}
    </div>
  );
};
