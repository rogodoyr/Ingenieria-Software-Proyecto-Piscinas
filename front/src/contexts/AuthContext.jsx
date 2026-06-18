import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, validateToken } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('vp_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vp_token', token);
    } else {
      localStorage.removeItem('vp_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('vp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vp_user');
    }
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(username, password);
      setToken(data.token);
      setUser({ username: data.username, nombre: data.nombre, rol: data.rol });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, nombre, email) => {
    setLoading(true);
    try {
      const data = await apiRegister(username, password, nombre, email);
      setToken(data.token);
      setUser({ username: data.username, nombre: data.nombre, rol: data.rol });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vp_token');
    localStorage.removeItem('vp_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
