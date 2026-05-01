import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const AuthContext = createContext();

// Set token immediately before any component renders
const savedToken = localStorage.getItem('token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(savedToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (name, email, password, preferredLanguages, favoriteGenres) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
        preferredLanguages,
        favoriteGenres,
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid server response: missing token or user data');
      }

      const { token: newToken, user: newUser } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateSignupStep = async (step, data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/validate-step`, {
        step,
        data,
      });
      return response.data;
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const validationError = new Error('Validation failed');
        validationError.fieldErrors = serverErrors;
        throw validationError;
      }
      throw new Error(
        err.response?.data?.message || 'Validation request failed'
      );
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid server response: missing token or user data');
      }

      const { token: newToken, user: newUser } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const getCurrentUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signup,
        login,
        logout,
        getCurrentUser,
        validateSignupStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
