import { useState, useEffect, createContext, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved && token) setUser(JSON.parse(saved));
  }, []);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    const tok = data.token || data.key || data.access;
    const userData = data.user || { username: credentials.username, email: credentials.username };
    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
    return data;
  };

  const register = async (payload) => {
    const data = await apiRegister(payload);
    const tok = data.token || data.key || data.access;
    const userData = data.user || { username: payload.username, email: payload.email };
    if (tok) {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(tok);
      setUser(userData);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
