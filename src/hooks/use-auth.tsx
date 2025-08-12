"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfileDocument, getUserProfile } from '@/lib/firestore';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';
import { useToast } from './use-toast';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userProfile = await getUserProfile(userAuth.uid);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      await createUserProfileDocument(firebaseUser, {});
      router.push('/');
      return undefined;
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        title: 'Google Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName });
      await createUserProfileDocument(firebaseUser, { displayName });
      router.push('/');
      return undefined;
    } catch (error: any) {
      console.error("Email Signup Error:", error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
      return undefined;
    } catch (error: any) {
      console.error("Email Login Error:", error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return errorMessage;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.push('/');
    } catch(error: any) {
       console.error("Logout Error:", error);
       toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
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
