import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  // ✅ Set up response interceptor to handle 401 errors
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // If 401 Unauthorized, logout user
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } catch (e) {
      console.error('Failed to parse stored user data:', e);
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // LOGIN
  const login = async (email, password) => {
    setAuthLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          'Login failed',
        status: err.response?.status,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // REGISTER
  const register = async (name, email, password, role = 'employee') => {
    setAuthLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Register failed',
      };
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};