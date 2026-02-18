'use server';
/**
 * @fileOverview A Genkit flow for generating party activity suggestions based on party details.
 *
 * - suggestPartyActivities - A function that handles the generation of party activity suggestions.
 * - AiActivitySuggestionInput - The input type for the suggestPartyActivities function.
 * - AiActivitySuggestionOutput - The return type for the suggestPartyActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiActivitySuggestionInputSchema = z.object({
  partyType: z
    .string()
    .describe('The type of party, e.g., "Birthday", "Graduation", "Casual Get-together".'),
  guestAgeGroup: z
    .string()
    .describe('The age group of the guests, e.g., "Kids (5-12)", "Teens (13-18)", "Adults (18+)", "Mixed Ages".'),
  preferences: z
    .string()
    .optional()
    .describe(
      'Any specific preferences or constraints for activities, e.g., "Outdoor activities only", "Needs to be low-cost", "Avoid loud music".'
    ),
});
export type AiActivitySuggestionInput = z.infer<typeof AiActivitySuggestionInputSchema>;

const AiActivitySuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      activityName: z.string().describe('The name of the suggested activity.'),
      description: z.string().describe('A brief description of the activity.'),
      materialsNeeded: z
        .array(z.string())
        .optional()
        .describe('List of materials or items required for the activity.'),
      estimatedDurationMinutes: z
        .number()
        .optional()
        .describe('Estimated duration of the activity in minutes.'),
    })
  ).describe('A list of party activity suggestions.'),
});
export type AiActivitySuggestionOutput = z.infer<typeof AiActivitySuggestionOutputSchema>;

export async function suggestPartyActivities(
  input: AiActivitySuggestionInput
): Promise<AiActivitySuggestionOutput> {
  return aiActivitySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiActivitySuggestionPrompt',
  input: {schema: AiActivitySuggestionInputSchema},
  output: {schema: AiActivitySuggestionOutputSchema},
  prompt: `You are an expert party planner AI. Your task is to generate creative and engaging party activity suggestions.

Generate a list of unique activities based on the following party details:

Party Type: {{{partyType}}}
Guest Age Group: {{{guestAgeGroup}}}
Host Preferences/Constraints: {{{preferences}}}

Ensure the suggestions are appropriate for the age group and consider any specified preferences or constraints.
Provide at least 3-5 distinct suggestions. For each activity, include its name, a brief description, an optional list of materials needed, and an optional estimated duration in minutes.`,
});

const aiActivitySuggestionFlow = ai.defineFlow(
  {
    name: 'aiActivitySuggestionFlow',
    inputSchema: AiActivitySuggestionInputSchema,
    outputSchema: AiActivitySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
