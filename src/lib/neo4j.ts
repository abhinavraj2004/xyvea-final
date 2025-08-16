// This file is the dedicated service layer for all interactions with Neo4j.
// It uses placeholder functions and mock data for now.
// Replace the mock logic with your actual Neo4j driver and Cypher queries.

import type { Concept, CausalLink } from '@/types';
import { updateUserReputation } from './firestore';

// --- MOCK DATA ---
// This data simulates what you would fetch from your Neo4j AuraDB.
let mockConcepts: Concept[] = [
  { id: '1', title: 'climate change', description: 'A long-term change in the average weather patterns that have come to define Earth\'s local, regional and global climates.', authorId: 'mock-user-123', createdAt: new Date() },
  { id: '2', title: 'greenhouse gas emissions', description: 'Gases in Earth\'s atmosphere that trap heat.', authorId: 'mock-user-123', createdAt: new Date() },
  { id: '3', title: 'global warming', description: 'The long-term heating of Earth\'s climate system observed since the pre-industrial period.', authorId: 'mock-user-456', createdAt: new Date() },
  { id: '4', title: 'impact of ai on jobs', description: 'The effect of artificial intelligence on the labor market.', authorId: 'mock-user-123', createdAt: new Date() },
  { id: '5', title: 'economic effects of remote work', description: 'The financial consequences of working from home policies.', authorId: 'mock-user-123', createdAt: new Date() },
  { id: '6', title: 'factors influencing vaccination rates', description: 'Various elements that determine the uptake of vaccines in a population.', authorId: 'mock-user-123', createdAt: new Date() },
];

let mockLinks: CausalLink[] = [
  { id: 'L1', cause: 'greenhouse gas emissions', effect: 'global warming', description: 'Increased greenhouse gases from human activities are the primary driver of global warming.', sourceURL: 'https://www.nasa.gov/climatechange/what-is-climate-change/', authorId: 'mock-user-123', status: 'verified', upvotes: 150, downvotes: 10, createdAt: new Date() },
  { id: 'L2', cause: 'global warming', effect: 'climate change', description: 'Global warming is a major aspect of climate change, contributing to wider-ranging changes in weather patterns.', sourceURL: 'https://www.nrdc.org/stories/global-warming-101', authorId: 'mock-user-456', status: 'verified', upvotes: 120, downvotes: 5, createdAt: new Date() },
];

// In a real implementation, you'd use a Map to track votes to prevent double-voting.
// For this mock, we'll keep it simple. Example: `let userVotes = new Map<string, 'up' | 'down'>();` where key is `userId:linkId`.

// --- NEO4J SERVICE FUNCTIONS ---

/**
 * Adds a new concept node to the graph.
 * @param concept - The concept data to add.
 * @returns {Promise<void>}
 */
export const addConcept = async (concept: Omit<Concept, 'id' | 'createdAt'>): Promise<void> => {
  console.log('NEO4J_SERVICE: Adding concept to the graph:', concept);
  const newConcept: Concept = {
    ...concept,
    id: `C${mockConcepts.length + 1}`,
    createdAt: new Date(),
  };
  mockConcepts.push(newConcept);
  return Promise.resolve();
};

/**
 * Retrieves a concept node by its title.
 * @param title - The title of the concept to find.
 * @returns {Promise<Concept | null>} The found concept or null.
 */
export const getConceptByTitle = async (title: string): Promise<Concept | null> => {
  console.log('NEO4J_SERVICE: Fetching concept by title:', title);
  const concept = mockConcepts.find(c => c.title.toLowerCase() === title.toLowerCase());
  return Promise.resolve(concept || null);
};

/**
 * Creates a new causal link (relationship) between two concepts.
 * @param link - The link data.
 * @returns {Promise<void>}
 */
export const addCausalLink = async (link: Omit<CausalLink, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'status'>): Promise<void> => {
  console.log('NEO4J_SERVICE: Adding causal link to the graph:', link);
  const newLink: CausalLink = {
    ...link,
    id: `L${mockLinks.length + 1}`,
    status: 'pending',
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
  };
  mockLinks.push(newLink);
  return Promise.resolve();
};

/**
 * Fetches all incoming (causes) and outgoing (effects) links for a given concept.
 * @param conceptTitle - The title of the central concept.
 * @returns {Promise<{ causes: CausalLink[], effects: CausalLink[] }>}
 */
export const getLinksForConcept = async (conceptTitle: string): Promise<{ causes: CausalLink[], effects: CausalLink[] }> => {
  console.log('NEO4J_SERVICE: Fetching links for concept:', conceptTitle);
  const lowercasedTitle = conceptTitle.toLowerCase();
  
  const causes = mockLinks.filter(link => link.effect.toLowerCase() === lowercasedTitle);
  const effects = mockLinks.filter(link => link.cause.toLowerCase() === lowercasedTitle);
  
  return Promise.resolve({ causes, effects });
}

/**
 * Records a user's vote on a causal link and updates reputation.
 * @param linkId - The ID of the link being voted on.
 * @param userId - The ID of the user voting.
 * @param voteType - 'up' or 'down'.
 * @returns {Promise<void>}
 */
export const voteOnLink = async (linkId: string, userId: string, voteType: 'up' | 'down'): Promise<void> => {
  console.log(`NEO4J_SERVICE: User ${userId} attempting to ${voteType}vote on link ${linkId}`);
  
  const linkIndex = mockLinks.findIndex(l => l.id === linkId);
  if (linkIndex === -1) {
    throw new Error("Link not found.");
  }

  const link = mockLinks[linkIndex];

  // Prevent user from voting on their own link
  if (link.authorId === userId) {
    throw new Error("You cannot vote on your own contribution.");
  }
  
  // In a real app, you would check if the user has already voted and handle that case.
  // For this mock, we will just update the counts and reputation.

  if (voteType === 'up') {
    mockLinks[linkIndex].upvotes += 1;
    // Award reputation to the author of the link
    await updateUserReputation(link.authorId, 1);
  } else {
    mockLinks[linkIndex].downvotes += 1;
    // Optionally, you could decrease reputation on a downvote
    // await updateUserReputation(link.authorId, -1);
  }

  return Promise.resolve();
};
