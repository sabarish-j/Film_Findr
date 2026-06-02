import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Mail, Lock, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { GENRES, LANGUAGES, EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../constants';
import { AuthCard } from '../components/ui/AuthCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ProgressStepper } from '../components/ui/ProgressStepper';
import './Auth.css';
import './Signup.css';

export const Signup = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signup, validateSignupStep } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguages: [],
    favoriteGenres: [],
  });
  const [errors, setErrors] = useState({});
  const [validatingStep, setValidatingStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLanguageToggle = (code) => {
    setFormData((prev) => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(code)
        ? prev.preferredLanguages.filter((c) => c !== code)
        : [...prev.preferredLanguages, code],
    }));
    if (errors.preferredLanguages) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.preferredLanguages;
        return newErrors;
      });
    }
  };

  const handleGenreToggle = (genre) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };

  const validateStepLocally = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      else if (formData.name.trim().length < 2)
        newErrors.name = 'Name must be at least 2 characters';

      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!EMAIL_REGEX.test(formData.email.trim()))
        newErrors.email = 'Please enter a valid email';

      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < MIN_PASSWORD_LENGTH)
        newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
      else if (!/[a-zA-Z]/.test(formData.password))
        newErrors.password = 'Password must contain at least one letter';
      else if (!/[0-9]/.test(formData.password))
        newErrors.password = 'Password must contain at least one number';

      if (!formData.confirmPassword)
        newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    if (stepNum === 2) {
      if (formData.preferredLanguages.length < 3)
        newErrors.preferredLanguages = 'Please select at least 3 languages';
    }

    return newErrors;
  };

  const handleNext = async () => {
    const localErrors = validateStepLocally(step);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    if (step === 1) {
      setValidatingStep(true);
      try {
        await validateSignupStep(1, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        setErrors({});
        setStep(2);
      } catch (err) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        } else {
          addToast({
            type: 'error',
            message: err.message || 'Validation failed',
          });
        }
      } finally {
        setValidatingStep(false);
      }
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localErrors = validateStepLocally(2);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.preferredLanguages,
        formData.favoriteGenres
      );
      addToast({
        type: 'success',
        message: 'Account created successfully!',
      });
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      addToast({
        type: 'error',
        message: err.response?.data?.message || 'Signup failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthCard>
        <div className="auth-header">
          <Clapperboard size={40} className="auth-header__icon" />
          <h1 className="auth-header__title">FlimFindr</h1>
        </div>

        <h2 className="auth-subtitle">Create Your Account</h2>

        <ProgressStepper
          steps={[
            { label: 'Details' },
            { label: 'Preferences' },
            { label: 'Review' }
          ]}
          currentStep={step}
        />

        <form className="auth-form" onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {/* Step 1: User Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="signup-step"
              >
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={UserIcon}
                  error={errors.name}
                  required
                />

                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={Mail}
                  error={errors.email}
                  required
                />

                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={Lock}
                  error={errors.password}
                  required
                />

                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  leftIcon={Lock}
                  error={errors.confirmPassword}
                  required
                />

                <Button
                  variant="primary"
                  size="lg"
                  type="button"
                  onClick={handleNext}
                  loading={validatingStep}
                  disabled={validatingStep}
                  fullWidth
                >
                  {validatingStep ? 'Checking...' : 'Next →'}
                </Button>
              </motion.div>
            )}

            {/* Step 2: Languages & Genres */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="signup-step"
              >
                <div className="signup-section">
                  <div className="signup-section__header">
                    <h3 className="signup-section__title">Preferred Languages</h3>
                    <p className="signup-section__hint">
                      {formData.preferredLanguages.length} of {LANGUAGES.length} selected
                    </p>
                  </div>
                  {errors.preferredLanguages && (
                    <p className="signup-error">{errors.preferredLanguages}</p>
                  )}
                  <div className="signup-toggle-grid">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        className={`signup-toggle ${
                          formData.preferredLanguages.includes(lang.code) ? 'signup-toggle--active' : ''
                        }`}
                        onClick={() => handleLanguageToggle(lang.code)}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="signup-section">
                  <div className="signup-section__header">
                    <h3 className="signup-section__title">Favorite Genres</h3>
                    <p className="signup-section__hint">
                      {formData.favoriteGenres.length} selected (optional)
                    </p>
                  </div>
                  <div className="signup-toggle-grid">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        className={`signup-toggle signup-toggle--secondary ${
                          formData.favoriteGenres.includes(genre) ? 'signup-toggle--active' : ''
                        }`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="signup-actions">
                  <Button
                    variant="ghost"
                    size="lg"
                    type="button"
                    onClick={handleBack}
                    fullWidth
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    type="button"
                    onClick={handleNext}
                    fullWidth
                  >
                    Review →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="signup-step"
              >
                <div className="signup-review">
                  <div className="signup-review__item">
                    <span className="signup-review__label">Name:</span>
                    <span className="signup-review__value">{formData.name}</span>
                  </div>
                  <div className="signup-review__item">
                    <span className="signup-review__label">Email:</span>
                    <span className="signup-review__value">{formData.email}</span>
                  </div>
                  <div className="signup-review__item">
                    <span className="signup-review__label">Languages:</span>
                    <span className="signup-review__value">
                      {formData.preferredLanguages.length} selected
                    </span>
                  </div>
                  <div className="signup-review__item">
                    <span className="signup-review__label">Genres:</span>
                    <span className="signup-review__value">
                      {formData.favoriteGenres.length} selected
                    </span>
                  </div>
                </div>

                <div className="signup-actions">
                  <Button
                    variant="ghost"
                    size="lg"
                    type="button"
                    onClick={handleBack}
                    fullWidth
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-footer__link">
            Log in
          </Link>
        </p>
      </AuthCard>
    </div>
  );
};
