"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // In a real app, this would involve checking tokens, etc.
  // For this simulation, we just toggle the state.
  // When "logging in", we redirect to the sign-in page.
  // When "logging out", we just update the state.
  const toggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      router.push('/'); // Redirect to home on logout
    } else {
      // The concept of "logging in" is simulated by navigating to the sign-in page
      // A more complex implementation would handle the full auth flow.
      // Here we just set the state to true to simulate a successful login for now.
      // To make the login wall effective, we first redirect to the login page.
      // The actual state change will happen on the login/signup pages.
      router.push('/auth/signin');
    }
  };
  
  // This function would be called from the signin/signup pages upon success
  const setLoggedIn = () => {
    setIsLoggedIn(true);
  }

  // A more complete version would expose setLoggedIn and setLoggedOut functions
  // For now, toggleLogin serves a dual purpose.
  // We'll refine this as we build out real auth.

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin }}>
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
