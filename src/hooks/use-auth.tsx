"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from '@/types';
import { Loader2 } from 'lucide-react';

// A more robust error handling function
const getFirebaseAuthErrorMessage = (error: any): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email address is already in use by another account.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use a stronger password.';
      case 'auth/configuration-not-found':
         return 'Authentication method not enabled. Please contact support or enable it in the Firebase console.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in process was cancelled.';
      default:
        return 'An unknown authentication error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again later.';
}

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

const createUserProfileDocument = async (user: FirebaseUser, additionalData: any) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        reputation: 0,
        searchHistory: [],
        subscriptionTier: 'free',
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
    }
  }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, `users/${firebaseUser.uid}`);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setUser({ uid: firebaseUser.uid, ...snapshot.data() } as User);
        } else {
          // If user exists in Auth but not Firestore, create the doc
          await createUserProfileDocument(firebaseUser, {});
          const newSnapshot = await getDoc(userRef);
          setUser({ uid: firebaseUser.uid, ...newSnapshot.data() } as User);
        }
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
      const result = await signInWithPopup(auth, provider);
      await createUserProfileDocument(result.user, {});
      router.push('/');
    } catch (error) {
      console.error("Google sign-in error", error);
      return getFirebaseAuthErrorMessage(error);
    } finally {
        setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, displayName: string) => {
     try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfileDocument(firebaseUser, { displayName });
      router.push('/');
    } catch (error) {
      console.error("Email sign-up error", error);
      return getFirebaseAuthErrorMessage(error);
    } finally {
        setLoading(false);
    }
  };
  
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error("Email login error", error);
      return getFirebaseAuthErrorMessage(error);
    } finally {
        setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout error", error);
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
