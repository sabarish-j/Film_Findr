'use strict';

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

function validateName(name) {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return null;
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return null;
}

function validateConfirmPassword(password, confirmPassword) {
  if (confirmPassword === undefined || confirmPassword === null) return null;
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}

function validatePreferredLanguages(langs) {
  if (!Array.isArray(langs) || langs.length < 3)
    return 'Please select at least 3 preferred languages';
  return null;
}

function validateStep1Fields({ name, email, password, confirmPassword }) {
  const errors = {};

  const nameErr = validateName(name);
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;

  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;

  return { errors, isValid: Object.keys(errors).length === 0 };
}

function validateStep2Fields({ preferredLanguages }) {
  const errors = {};

  const langErr = validatePreferredLanguages(preferredLanguages);
  if (langErr) errors.preferredLanguages = langErr;

  return { errors, isValid: Object.keys(errors).length === 0 };
}

function validateStep3Fields() {
  return { errors: {}, isValid: true };
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePreferredLanguages,
  validateStep1Fields,
  validateStep2Fields,
  validateStep3Fields,
};
