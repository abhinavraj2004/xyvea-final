
import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  runTransaction,
} from 'firebase/firestore';
import type { User, Contribution, ContributionStats, CausalLink, Concept } from '@/types';


// Concepts
export const addConcept = async (concept: Omit<Concept, 'id' | 'createdAt'>) => {
  await addDoc(collection(db, 'concepts'), {
    ...concept,
    createdAt: serverTimestamp(),
  });
};

// Causal Links
export const addCausalLink = async (link: Omit<CausalLink, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'status'>) => {
  await addDoc(collection(db, 'causalLinks'), {
    ...link,
    upvotes: 0,
    downvotes: 0,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const getLinksForConcept = async (conceptTitle: string) => {
  const lowercasedTitle = conceptTitle.toLowerCase();
  
  const causesQuery = query(collection(db, 'causalLinks'), where('effect', '==', lowercasedTitle));
  const effectsQuery = query(collection(db, 'causalLinks'), where('cause', '==', lowercasedTitle));

  const [causesSnapshot, effectsSnapshot] = await Promise.all([
    getDocs(causesQuery),
    getDocs(effectsQuery)
  ]);

  const causes = causesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CausalLink));
  const effects = effectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CausalLink));

  return { causes, effects };
}

export const voteOnLink = async (linkId: string, userId: string, voteType: 'up' | 'down') => {
  const linkRef = doc(db, 'causalLinks', linkId);
  const userVoteRef = doc(db, `causalLinks/${linkId}/votes/${userId}`);

  await runTransaction(db, async (transaction) => {
    const userVoteDoc = await transaction.get(userVoteRef);
    const linkDoc = await transaction.get(linkRef);

    if (!linkDoc.exists()) {
      throw new Error("Link does not exist!");
    }

    const currentVote = userVoteDoc.exists() ? userVoteDoc.data().vote : null;

    if (currentVote === voteType) {
      // User is undoing their vote
      transaction.update(linkRef, { [`${voteType}votes`]: increment(-1) });
      transaction.delete(userVoteRef);
    } else {
      const updates: { [key: string]: any } = {};
      if (currentVote) {
        // User is changing their vote
        const oppositeVote = voteType === 'up' ? 'down' : 'up';
        updates[`${oppositeVote}votes`] = increment(-1);
      }
      updates[`${voteType}votes`] = increment(1);
      
      transaction.update(linkRef, updates);
      transaction.set(userVoteRef, { vote: voteType });
    }
  });
};


// User Data
export const getUserContributions = async (userId: string) => {
    const linksQuery = query(collection(db, 'causalLinks'), where('authorId', '==', userId));
    const conceptsQuery = query(collection(db, 'concepts'), where('authorId', '==', userId));

    const [linksSnapshot, conceptsSnapshot] = await Promise.all([
        getDocs(linksQuery),
        getDocs(conceptsQuery)
    ]);

    const contributions: Contribution[] = [];
    let verifiedLinks = 0;

    linksSnapshot.forEach(doc => {
        const data = doc.data() as CausalLink;
        if (data.status === 'verified') {
            verifiedLinks++;
        }
        contributions.push({
            id: doc.id,
            type: 'link',
            description: `Proposed link: ${data.cause} -> ${data.effect}`,
            createdAt: data.createdAt,
        });
    });

    conceptsSnapshot.forEach(doc => {
        const data = doc.data() as Concept;
        contributions.push({
            id: doc.id,
            type: 'concept',
            description: `Added concept: ${data.title}`,
            createdAt: data.createdAt,
        });
    });

    contributions.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    const stats: ContributionStats = {
        totalContributions: contributions.length,
        verifiedLinks,
    };

    return { contributions, stats };
}
