"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';

// This is a mock authentication hook.
// It simulates user login state without a real backend.
// Replace this with your actual authentication logic (e.g., using Neo4j, Passport.js, etc.)

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<string | undefined>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<string | undefined>;
  loginWithEmail: (email: string, pass: string) => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  uid: 'mock-user-123',
  displayName: 'Alex Researcher',
  email: 'alex.r@example.com',
  photoURL: 'https://placehold.co/100x100.png',
  reputation: 42,
  subscriptionTier: 'pro',
  searchHistory: [
    { id: '1', searchTerm: 'Climate Change', timestamp: new Date() },
    { id: '2', searchTerm: 'Economic Inflation', timestamp: new Date() },
  ],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user
    // In a real app, you might check a token in localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const login = () => {
    setLoading(true);
    // Simulate a successful login
    localStorage.setItem('isLoggedIn', 'true');
    setUser(mockUser);
    setLoading(false);
    router.push('/');
    return Promise.resolve(undefined);
  }

  const loginWithGoogle = async () => {
    console.log("Simulating Google Login...");
    return login();
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
     console.log("Simulating Email Signup for:", email, displayName);
     return login();
  };
  
  const loginWithEmail = async (email: string, password: string) => {
    console.log("Simulating Email Login for:", email);
    return login();
  }

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setLoading(false);
    router.push('/');
  };

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, logout, loginWithGoogle, signupWithEmail, loginWithEmail }}>
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
