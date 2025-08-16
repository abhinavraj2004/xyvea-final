// This file handles all user-related data interactions with Cloud Firestore.

import { doc, getDoc, setDoc, serverTimestamp, getDocs, collection, query, where, orderBy, limit, increment } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Contribution, ContributionStats } from '@/types';


// User Management
export const createUserProfileDocument = async (userAuth: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }, additionalData: any) => {
  const userRef = doc(db, `users/${userAuth.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = serverTimestamp();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        reputation: 0,
        subscriptionTier: 'free',
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile', error);
    }
  }
  return userRef;
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, `users/${userId}`);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      displayName: data.displayName,
      email: data.email,
      photoURL: data.photoURL,
      reputation: data.reputation || 0,
      subscriptionTier: data.subscriptionTier || 'free',
      // The search history will now be managed by the Neo4j service.
      // We will return an empty array here for now.
      searchHistory: [], 
    } as User;
  } else {
    return null;
  }
};


// User Contributions (as metadata, actual graph data is in Neo4j)
export const getUserContributions = async (userId: string): Promise<{ contributions: Contribution[], stats: ContributionStats }> => {
  console.log('Fetching user contribution metadata from Firestore for user:', userId);

  // In a real application, you might store contribution metadata in Firestore
  // for quick lookups on the profile page, while the actual graph data lives in Neo4j.
  
  // For now, returning mock data as before.
  const contributions: Contribution[] = [
    { id: '1', type: 'link', description: 'Proposed link: Greenhouse Gas Emissions -> Global Warming', createdAt: new Date(Date.now() - 86400000) },
    { id: '2', type: 'concept', description: 'Added concept: Climate Change', createdAt: new Date(Date.now() - 172800000) },
  ];
  
  const stats: ContributionStats = {
    totalContributions: 2,
    verifiedLinks: 1,
  };

  return Promise.resolve({ contributions, stats });
};

/**
 * Updates a user's reputation score.
 * @param userId - The ID of the user to update.
 * @param amount - The amount to increment the reputation by (can be negative).
 * @returns {Promise<void>}
 */
export const updateUserReputation = async (userId: string, amount: number): Promise<void> => {
  if (!userId) return;
  console.log(`FIRESTORE_SERVICE: Updating reputation for user ${userId} by ${amount}`);
  const userRef = doc(db, 'users', userId);
  try {
    await setDoc(userRef, { reputation: increment(amount) }, { merge: true });
  } catch (error) {
    console.error(`Failed to update reputation for user ${userId}:`, error);
    // Optionally re-throw or handle the error as needed
  }
};
