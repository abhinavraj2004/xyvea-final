// This file uses server-side code, ensure appropriate 'use server' directive.
'use server';

import { verifySource, type VerifySourceInput, type VerifySourceOutput } from '@/ai/flows/verify-source';

export async function verifySourceAction(
  data: VerifySourceInput
): Promise<VerifySourceOutput & { error?: string }> {
  try {
    const result = await verifySource(data);
    return result;
  } catch (error) {
    console.error('Error verifying source:', error);
    // In a real app, you might want to log this error to a monitoring service.
    return {
      summary: '',
      confidence: 0,
      error: 'An unexpected error occurred while verifying the source. Please try again later.',
    };
  }
}
