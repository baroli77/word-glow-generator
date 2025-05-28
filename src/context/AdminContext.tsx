
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type AdminContextType = {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    setLoading(true);
    
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check if the user is the hardcoded admin - this is the primary check
    const adminEmail = 'obarton77@gmail.com';
    if (user.email === adminEmail) {
      console.log('User is admin:', user.email);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    console.log('User is not admin:', user.email);
    // For non-admin users, they are not admin
    setIsAdmin(false);
    setLoading(false);
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const value = {
    isAdmin,
    loading,
    checkAdminStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
