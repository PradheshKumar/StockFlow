import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sf_token'));
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('sf_user')); } catch { return null; }
  });

  function storeAuth(newToken, newUser) {
    localStorage.setItem('sf_token', newToken);
    localStorage.setItem('sf_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function clearAuth() {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, storeAuth, clearAuth, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
