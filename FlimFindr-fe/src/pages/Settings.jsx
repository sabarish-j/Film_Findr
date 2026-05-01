import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { PageWrapper } from '../components/layout/PageWrapper';
import './Settings.css';

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    description: 'Bright background, dark text',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Dim background, light text',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Match your device setting',
    icon: Monitor,
  },
];

export const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <PageWrapper maxWidth="content">
      <div className="settings">
        <header className="settings__header">
          <h1 className="settings__title">Settings</h1>
          <p className="settings__subtitle">Customize how FlimFindr looks and feels</p>
        </header>

        <section className="settings__section">
          <div className="settings__section-header">
            <h2 className="settings__section-title">Theme</h2>
            <p className="settings__section-hint">
              Choose how the app appears. System will follow your OS preference.
            </p>
          </div>

          <div className="settings__theme-grid">
            {themeOptions.map(({ value, label, description, icon: Icon }) => {
              const isActive = theme === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  className={`settings__theme-card ${
                    isActive ? 'settings__theme-card--active' : ''
                  }`}
                  onClick={() => setTheme(value)}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <div className="settings__theme-check">
                      <Check size={14} />
                    </div>
                  )}
                  <Icon size={28} className="settings__theme-icon" />
                  <div className="settings__theme-info">
                    <div className="settings__theme-label">{label}</div>
                    <div className="settings__theme-description">{description}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};
