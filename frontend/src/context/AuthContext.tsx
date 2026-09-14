import React, { createContext, useContext, useState, useEffect } from 'react';
import { FarmerProfile, AdminUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  farmer: FarmerProfile | null;
  admin: AdminUser | null;
  role: 'farmer' | 'admin' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginFarmer: (mobile: string, pass: string) => Promise<void>;
  registerFarmer: (data: any) => Promise<void>;
  loginAdmin: (user: string, pass: string) => Promise<void>;
  loginDemoFarmer: () => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
  logout: () => void;
  updateFarmerLocal: (data: Partial<FarmerProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => {
    const saved = localStorage.getItem('rythu_farmer');
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('rythu_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState<'farmer' | 'admin' | null>(() => {
    return (localStorage.getItem('rythu_role') as any) || (farmer ? 'farmer' : admin ? 'admin' : null);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginFarmer = async (mobile: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.loginFarmer(mobile, pass);
      localStorage.setItem('rythu_token', res.access_token);
      localStorage.setItem('rythu_role', 'farmer');
      localStorage.setItem('rythu_farmer', JSON.stringify(res.user));
      setFarmer(res.user);
      setAdmin(null);
      setRole('farmer');
    } finally {
      setIsLoading(false);
    }
  };

  const registerFarmer = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.registerFarmer(data);
      localStorage.setItem('rythu_token', res.access_token);
      localStorage.setItem('rythu_role', 'farmer');
      localStorage.setItem('rythu_farmer', JSON.stringify(res.user));
      setFarmer(res.user);
      setAdmin(null);
      setRole('farmer');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (user: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.loginAdmin(user, pass);
      localStorage.setItem('rythu_token', res.access_token);
      localStorage.setItem('rythu_role', 'admin');
      localStorage.setItem('rythu_admin', JSON.stringify(res.user));
      setAdmin(res.user);
      setFarmer(null);
      setRole('admin');
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoFarmer = async () => {
    await loginFarmer('9876543210', 'farmer123');
  };

  const loginDemoAdmin = async () => {
    await loginAdmin('admin', 'admin123');
  };

  const logout = () => {
    localStorage.removeItem('rythu_token');
    localStorage.removeItem('rythu_role');
    localStorage.removeItem('rythu_farmer');
    localStorage.removeItem('rythu_admin');
    setFarmer(null);
    setAdmin(null);
    setRole(null);
  };

  const updateFarmerLocal = (data: Partial<FarmerProfile>) => {
    if (farmer) {
      const updated = { ...farmer, ...data };
      setFarmer(updated);
      localStorage.setItem('rythu_farmer', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        admin,
        role,
        isAuthenticated: !!(farmer || admin),
        isLoading,
        loginFarmer,
        registerFarmer,
        loginAdmin,
        loginDemoFarmer,
        loginDemoAdmin,
        logout,
        updateFarmerLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
