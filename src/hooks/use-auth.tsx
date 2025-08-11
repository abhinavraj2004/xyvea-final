"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  toggleLogin: () => void;
  // This is a simulated login for the demo
  setLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      router.push('/'); // Redirect to home on logout
    } else {
      // If trying to "log in" from a page that needs auth, store the path
      if (pathname !== '/auth/signin' && pathname !== '/auth/signup') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push('/auth/signin');
    }
  };
  
  const setLoggedIn = () => {
    setIsLoggedIn(true);
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin');
    router.push(redirectPath);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
