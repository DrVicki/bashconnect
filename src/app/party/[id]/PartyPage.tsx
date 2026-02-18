'use client';

import { useEffect, useState } from 'react';
import type { Party } from '@/lib/types';
import JoinPartyDialog from '@/components/JoinPartyDialog';
import PartyDetails from '@/components/PartyDetails';
import ParticipantList from '@/components/ParticipantList';
import Chat from '@/components/Chat';

export default function PartyPage({ initialParty }: { initialParty: Party }) {
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem(`participantName-${initialParty.id}`);
    if (name) {
      setParticipantName(name);
    }
    setIsJoining(false);
  }, [initialParty.id]);

  const handleJoin = (name: string) => {
    localStorage.setItem(`participantName-${initialParty.id}`, name);
    setParticipantName(name);
  };

  if (isJoining) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary font-headline text-2xl">Loading Party...</div>
      </div>
    );
  }

  if (!participantName) {
    return <JoinPartyDialog partyId={initialParty.id} onJoin={handleJoin} />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r bg-card/50">
        <PartyDetails party={initialParty} />
        <ParticipantList partyId={initialParty.id} />
      </div>
      <div className="hidden md:flex flex-col flex-1">
        <Chat partyId={initialParty.id} participantName={participantName} />
      </div>
    </div>
  );
}
