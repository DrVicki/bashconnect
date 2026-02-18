'use server';

import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { suggestPartyActivities, type AiActivitySuggestionInput } from '@/ai/flows/ai-activity-suggestion-flow';
import { db } from './firebase';

export async function createPartyAction(data: {
  name: string;
  date: string;
  time: string;
  description?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, 'parties'), {
      name: data.name,
      date: data.date,
      time: data.time,
      description: data.description || '',
      createdAt: serverTimestamp(),
      participants: [],
    });
    
    return { success: true, partyId: docRef.id };
  } catch (error) {
    console.error('Error creating party:', error);
    return { success: false, error: 'Failed to create party.' };
  }
}

export async function addParticipantAction(partyId: string, name: string) {
  try {
    const partyRef = doc(db, 'parties', partyId);
    await updateDoc(partyRef, {
      participants: arrayUnion({
        name,
        joinedAt: serverTimestamp(),
      }),
    });
    revalidatePath(`/party/${partyId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding participant:', error);
    return { success: false, error: 'Failed to join party.' };
  }
}

export async function sendMessageAction(partyId: string, text: string, sender: string) {
  if (!text.trim()) return;

  try {
    const messagesRef = collection(db, 'parties', partyId, 'messages');
    await addDoc(messagesRef, {
      text,
      sender,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message.' };
  }
}

export async function getAiSuggestionsAction(input: AiActivitySuggestionInput) {
    try {
        const result = await suggestPartyActivities(input);
        return { success: true, suggestions: result.suggestions };
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        return { success: false, error: 'Failed to get AI suggestions.' };
    }
}
