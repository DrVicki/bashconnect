import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import type { Party } from '@/lib/types';
import PartyPage from './PartyPage';

async function getParty(id: string): Promise<Party | null> {
  const partyRef = doc(db, 'parties', id);
  const partySnap = await getDoc(partyRef);

  if (!partySnap.exists()) {
    return null;
  }
  
  const data = partySnap.data();

  // Basic serialization to handle Timestamps
  return JSON.parse(JSON.stringify({
    id: partySnap.id,
    ...data,
  })) as Party;
}

export default async function PartyDetailsPage({ params }: { params: { id: string } }) {
  const party = await getParty(params.id);

  if (!party) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <PartyPage initialParty={party} />
    </main>
  );
}
