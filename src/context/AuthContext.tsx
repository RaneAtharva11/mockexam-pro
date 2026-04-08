import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  loginUser: (data: { token: string; name: string; email: string; role?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem('token'),
    userName: localStorage.getItem('userName'),
    userEmail: localStorage.getItem('userEmail'),
    userRole: localStorage.getItem('userRole'),
  }));

  const loginUser = useCallback((data: { token: string; name: string; email: string; role?: string }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role || 'STUDENT');
    setAuth({
      token: data.token,
      userName: data.name,
      userEmail: data.email,
      userRole: data.role || 'STUDENT',
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setAuth({ token: null, userName: null, userEmail: null, userRole: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated: !!auth.token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
