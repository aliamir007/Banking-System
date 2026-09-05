import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, registerRequest, getMeRequest } from '../services/auth.service.js';
import {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearSession,
} from '../utils/storage.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true); // true while we verify any existing token

  // On first load, if a token exists, confirm it's still valid and refresh
  // the user record (in case role/status changed) rather than trusting
  // whatever was cached in localStorage.
  useEffect(() => {
    const bootstrap = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const freshUser = await getMeRequest();
        setUser(freshUser);
        setStoredUser(freshUser);
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { token, user: loggedInUser } = await loginRequest({ email, password });
    setToken(token);
    setStoredUser(loggedInUser);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const { token, user: newUser } = await registerRequest({ name, email, password, phone });
    setToken(token);
    setStoredUser(newUser);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
