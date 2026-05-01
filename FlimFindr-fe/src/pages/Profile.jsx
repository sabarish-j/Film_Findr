import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Lock, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import axios from 'axios';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { GENRES, LANGUAGES, API_BASE_URL, EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../constants';
import './Profile.css';

const tabs = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'security', label: 'Security', icon: Lock },
];

export const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredLanguages: [],
    favoriteGenres: [],
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/user/profile`);
        const userData = response.data.user;
        setFormData({
          name: userData.name,
          email: userData.email,
          preferredLanguages: userData.preferredLanguages || [],
          favoriteGenres: userData.favoriteGenres || [],
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to load profile',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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

  const validateAccountForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePreferencesForm = () => {
    const newErrors = {};

    if (formData.preferredLanguages.length < 3) {
      newErrors.preferredLanguages = 'Please select at least 3 languages';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurityForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = false;

    if (activeTab === 'account') {
      isValid = validateAccountForm();
    } else if (activeTab === 'preferences') {
      isValid = validatePreferencesForm();
    } else if (activeTab === 'security') {
      isValid = validateSecurityForm();
    }

    if (!isValid) return;

    try {
      setIsSaving(true);

      if (activeTab === 'account') {
        await axios.put(`${API_BASE_URL}/user/profile`, {
          name: formData.name,
          email: formData.email,
        });
        addToast({
          type: 'success',
          message: 'Account information updated successfully',
        });
      } else if (activeTab === 'preferences') {
        await axios.put(`${API_BASE_URL}/user/profile`, {
          preferredLanguages: formData.preferredLanguages,
          favoriteGenres: formData.favoriteGenres,
        });
        addToast({
          type: 'success',
          message: 'Preferences updated successfully',
        });
      } else if (activeTab === 'security') {
        await axios.post(`${API_BASE_URL}/user/change-password`, {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        });
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        addToast({
          type: 'success',
          message: 'Password changed successfully',
        });
      }

      setErrors({});
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.response?.data?.errors?.message || 'Failed to save changes';
      addToast({
        type: 'error',
        message: errorMsg,
      });

      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="profile__loading">
          <Spinner size="lg" />
          <p>Loading profile...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="content">
      <div className="profile">
        {/* Header */}
        <div className="profile__header">
          <div className="profile__avatar">{authUser?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className="profile__title">Account Settings</h1>
            <p className="profile__subtitle">{authUser?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile__tabs">
          {tabs.map(({ id, label, icon: IconComponent }) => (
            <button
              key={id}
              className={`profile__tab ${activeTab === id ? 'profile__tab--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <IconComponent size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="profile__form">
          <AnimatePresence mode="wait">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="profile__tab-content"
              >
                <div className="profile__section">
                  <h2 className="profile__section-title">Basic Information</h2>

                  <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />

                  <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={isSaving}
                  disabled={isSaving}
                  fullWidth
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="profile__tab-content"
              >
                {/* Languages */}
                <div className="profile__section">
                  <h2 className="profile__section-title">Preferred Languages</h2>
                  <p className="profile__section-hint">
                    {formData.preferredLanguages.length} of {LANGUAGES.length} selected (minimum 3 required)
                  </p>

                  {errors.preferredLanguages && (
                    <p className="profile__error">{errors.preferredLanguages}</p>
                  )}

                  <div className="profile__toggle-grid">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        className={`profile__toggle ${
                          formData.preferredLanguages.includes(lang.code) ? 'profile__toggle--active' : ''
                        }`}
                        onClick={() => handleLanguageToggle(lang.code)}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div className="profile__section">
                  <h2 className="profile__section-title">Favorite Genres</h2>
                  <p className="profile__section-hint">
                    {formData.favoriteGenres.length} selected (optional)
                  </p>

                  <div className="profile__toggle-grid">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        className={`profile__toggle profile__toggle--secondary ${
                          formData.favoriteGenres.includes(genre) ? 'profile__toggle--active' : ''
                        }`}
                        onClick={() => handleGenreToggle(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={isSaving}
                  disabled={isSaving}
                  fullWidth
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="profile__tab-content"
              >
                <div className="profile__section">
                  <h2 className="profile__section-title">Change Password</h2>
                  <p className="profile__section-hint">
                    Enter your current password and choose a new password
                  </p>

                  <Input
                    type="password"
                    name="oldPassword"
                    label="Current Password"
                    placeholder="••••••••"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    error={errors.oldPassword}
                  />

                  <Input
                    type="password"
                    name="newPassword"
                    label="New Password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                  />

                  <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={isSaving}
                  disabled={isSaving}
                  fullWidth
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </PageWrapper>
  );
};
