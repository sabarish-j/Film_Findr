import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clapperboard, Mail, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { AuthCard } from '../components/ui/AuthCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import './Auth.css';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      addToast({
        type: 'success',
        message: 'Login successful!',
      });
      navigate('/');
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-page">
      <AuthCard>
        <div className="auth-header">
          <Clapperboard size={40} className="auth-header__icon" />
          <h1 className="auth-header__title">FlimFindr</h1>
        </div>

        <h2 className="auth-subtitle">Welcome Back</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <Button
            variant="primary"
            size="lg"
            type="submit"
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-footer__link">
            Sign up
          </Link>
        </p>
      </AuthCard>
    </div>
  );
};
