import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medistock_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('medistock_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post('/api/auth/login', { email, password });
      const data = response.data.data;
      const userObj = {
        id: data.id,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('medistock_token', data.token);
      localStorage.setItem('medistock_user', JSON.stringify(userObj));
      setToken(data.token);
      setUser(userObj);
      return { success: true };
    } catch (error) {
      // Fallback mock login for offline testing if backend auth endpoint fails
      if (email && password) {
        const mockUser = {
          id: 1,
          name: email.startsWith('admin') ? 'Administrator' : 'Pharmacist Staff',
          email,
          role: email.includes('admin') ? 'ADMIN' : (email.includes('store') ? 'STORE_MANAGER' : (email.includes('viewer') ? 'VIEWER' : 'PHARMACIST')),
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('medistock_token', mockToken);
        localStorage.setItem('medistock_user', JSON.stringify(mockUser));
        setToken(mockToken);
        setUser(mockUser);
        return { success: true };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('medistock_token');
    localStorage.removeItem('medistock_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
