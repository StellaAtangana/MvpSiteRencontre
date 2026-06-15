import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMyProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync('token');
        if (saved) {
          const profile = await getMyProfile(saved);
          if (profile.id) {
            setToken(saved);
            setUser(profile);
          }
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const login = async (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    await SecureStore.setItemAsync('token', userToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('token');
  };

  const refreshUser = async () => {
    if (!token) return;
    const profile = await getMyProfile(token);
    if (profile.id) setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
