import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (will be used when backend is integrated)
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // When backend is implemented, this will be an API call to check auth status
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to check authentication status');
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login for now - will be replaced with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      if (email === 'user@example.com' && password === 'password') {
        const userData = {
          id: 'user123',
          name: 'Cosmic User',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
        };
        setCurrentUser(userData);
        setLoading(false);
        return { success: true };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock signup - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful signup
      const userData = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      };
      
      setCurrentUser(userData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Mock logout - will be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentUser(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};