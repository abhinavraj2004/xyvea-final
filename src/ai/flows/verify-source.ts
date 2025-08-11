// This file uses server-side code, ensure appropriate 'use server' directive.
'use server';

/**
 * @fileOverview AI-powered tool that analyzes content from a given URL to verify whether it supports a claim of causality between two concepts, providing a confidence score and summary.
 *
 * - verifySource - A function that handles the source verification process.
 * - VerifySourceInput - The input type for the verifySource function.
 * - VerifySourceOutput - The return type for the verifySource function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifySourceInputSchema = z.object({
  sourceURL: z.string().url().describe('The URL of the source to verify.'),
  cause: z.string().describe('The cause concept.'),
  effect: z.string().describe('The effect concept.'),
});
export type VerifySourceInput = z.infer<typeof VerifySourceInputSchema>;

const VerifySourceOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the evidence supporting the claim.'),
  confidence: z.number().min(1).max(10).describe('A confidence score from 1-10 indicating the strength of the evidence.'),
});
export type VerifySourceOutput = z.infer<typeof VerifySourceOutputSchema>;

export async function verifySource(input: VerifySourceInput): Promise<VerifySourceOutput> {
  return verifySourceFlow(input);
}

const verifySourcePrompt = ai.definePrompt({
  name: 'verifySourcePrompt',
  input: {schema: VerifySourceInputSchema},
  output: {schema: VerifySourceOutputSchema},
  prompt: `Act as a research analyst.\nBased ONLY on the provided text from the following URL, does it support the claim that \`{{{cause}}}\` leads to \`{{{effect}}}\`?\n\nURL: {{{sourceURL}}}\n\nProvide a brief summary of the evidence and a confidence score from 1-10.`,
  config: {
    // Adjust safety settings as needed
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const verifySourceFlow = ai.defineFlow(
  {
    name: 'verifySourceFlow',
    inputSchema: VerifySourceInputSchema,
    outputSchema: VerifySourceOutputSchema,
  },
  async input => {
    const {output} = await verifySourcePrompt(input);
    return output!;
  }
);
