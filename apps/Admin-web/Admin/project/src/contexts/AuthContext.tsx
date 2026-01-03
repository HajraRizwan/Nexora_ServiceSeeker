import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { email: string; role: string } | null;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Login function (calls backend only)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      
      // Backend returns { message: "...", role: "..." }
      if (res.data.role) {
        setIsAuthenticated(true);
        setUser({ email, role: res.data.role });
        setError(null);
        return true;
      } else {
        setError(res.data.message || "Invalid email or password");
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  // ✅ Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, error }}>
      {children}
    </AuthContext.Provider>
  );
};
