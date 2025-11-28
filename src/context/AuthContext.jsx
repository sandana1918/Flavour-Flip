import React, { createContext, useContext, useState, useEffect } from 'react';
import { localApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('flavourflip_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await localApi.get(`/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        const userData = response.data[0];
        setUser(userData);
        localStorage.setItem('flavourflip_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      // Check if user exists
      const check = await localApi.get(`/users?email=${userData.email}`);
      if (check.data.length > 0) {
        return { success: false, message: 'User already exists' };
      }
      
      const response = await localApi.post('/users', {
        ...userData,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        createdAt: new Date().toISOString()
      });
      
      setUser(response.data);
      localStorage.setItem('flavourflip_user', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flavourflip_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
