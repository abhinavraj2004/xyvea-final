// This file defines the core data structures for the application.
// These types are used for both Firestore documents (User) and Neo4j nodes/relationships.

// --- Firebase Firestore Types ---
export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  reputation: number;
  searchHistory: HistoryItem[]; // This might live in Neo4j if it's considered part of the graph
  subscriptionTier: 'free' | 'pro';
};

// --- Neo4j Graph Types ---
export type HistoryItem = {
  id: string; // Could be a unique ID for the history event
  searchTerm: string;
  timestamp: Date;
};

export type Concept = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
};

export type CausalLink = {
  id: string;
  cause: string; // title of the cause concept
  effect: string; // title of the effect concept
  description: string;
  sourceURL: string;
  authorId: string;
  status: 'pending' | 'verified' | 'disputed' | 'rejected';
  upvotes: number;
  downvotes: number;
  createdAt: Date;
};


// --- General Application Types ---
export type Contribution = {
  id: string;
  type: 'link' | 'concept';
  description: string;
  createdAt: Date;
};

export type ContributionStats = {
    totalContributions: number;
    verifiedLinks: number;
};
