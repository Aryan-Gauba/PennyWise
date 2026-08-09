import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status when the app first loads
  useEffect(() => {
    const initAuth = async () => {
        try {
        const res = await authService.checkAuth();
        if (res.data.isAuthenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        } catch (err) {
        setIsAuthenticated(false);
        } finally {
        setLoading(false);
        }
    };
    initAuth();
    }, []);

  // Helper functions for clean logins/logouts
  const login = async (formData) => {
    await authService.login(formData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily grab auth state from any component!
export const useAuth = () => useContext(AuthContext);