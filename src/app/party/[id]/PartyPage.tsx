'use client';

import { useEffect, useState } from 'react';
import type { Party } from '@/lib/types';
import JoinPartyDialog from '@/components/JoinPartyDialog';
import PartyDetails from '@/components/PartyDetails';
import ParticipantList from '@/components/ParticipantList';
import Chat from '@/components/Chat';
import { useDoc, useFirestore, useMemoFirebase, useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound } from 'next/navigation';

export default function PartyPage({ partyId }: { partyId: string }) {
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const partyRef = useMemoFirebase(() => firestore ? doc(firestore, 'parties', partyId) : null, [firestore, partyId]);
  const { data: party, isLoading: isPartyLoading, error: partyError } = useDoc<Party>(partyRef);

  useEffect(() => {
    const name = localStorage.getItem(`participantName-${partyId}`);
    if (name) {
      setParticipantName(name);
      if (!user && auth && !isUserLoading) {
        initiateAnonymousSignIn(auth);
      }
    }
    setIsJoining(false);
  }, [partyId, user, auth, isUserLoading]);

  const handleJoin = (name: string) => {
    localStorage.setItem(`participantName-${partyId}`, name);
    setParticipantName(name);
  };
  
  if (partyError) {
      // This could be a permissions error or the document doesn't exist.
      // notFound() is a server-side function, we can redirect or show a message.
      return <div className="flex items-center justify-center min-h-screen text-destructive">Error loading party. It may not exist or you may not have access.</div>
  }

  if (isPartyLoading || isJoining) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary font-headline text-2xl">Loading Party...</div>
      </div>
    );
  }

  if (!party) {
    notFound();
    return null;
  }

  if (!participantName) {
    return <JoinPartyDialog partyId={party.id} onJoin={handleJoin} />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r bg-card/50">
        <PartyDetails party={party} />
        <ParticipantList partyId={party.id} />
      </div>
      <div className="hidden md:flex flex-col flex-1">
        <Chat partyId={party.id} participantName={participantName} />
      </div>
    </div>
  );
}
