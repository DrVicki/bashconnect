'use server';

import { suggestPartyActivities, type AiActivitySuggestionInput } from '@/ai/flows/ai-activity-suggestion-flow';


export async function getAiSuggestionsAction(input: AiActivitySuggestionInput) {
    try {
        const result = await suggestPartyActivities(input);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}
