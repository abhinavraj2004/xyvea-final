
import type { Timestamp } from 'firebase/firestore';

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  reputation: number;
  searchHistory: HistoryItem[];
  subscriptionTier: 'free' | 'pro';
};

export type HistoryItem = {
  id: string;
  searchTerm: string;
  timestamp: Timestamp;
};

export type Concept = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: Timestamp;
};

export type CausalLink = {
  id:string;
  cause: string;
  effect: string;
  description: string;
  sourceURL: string;
  authorId: string;
  status: 'pending' | 'verified' | 'disputed' | 'rejected';
  upvotes: number;
  downvotes: number;
  createdAt: Timestamp;
};


export type Contribution = {
  id: string;
  type: 'link' | 'concept';
  description: string;
  createdAt: Timestamp;
};

export type ContributionStats = {
    totalContributions: number;
    verifiedLinks: number;
}
