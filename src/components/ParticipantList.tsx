'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Party, Participant } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
}

export default function ParticipantList({ partyId }: { partyId: string }) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const partyRef = doc(db, 'parties', partyId);
    const unsubscribe = onSnapshot(partyRef, (doc) => {
      if (doc.exists()) {
        const partyData = doc.data() as Party;
        setParticipants(partyData.participants || []);
      }
    });

    return () => unsubscribe();
  }, [partyId]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4">
        <h2 className="flex items-center text-lg font-semibold font-headline">
            <Users className="mr-2 h-5 w-5 text-muted-foreground" />
            Guests ({participants.length})
        </h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-4">
          {participants.map((p, index) => (
            <div key={`${p.name}-${index}`} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {getInitials(p.name)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{p.name}</span>
            </div>
          ))}
          {participants.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">No guests have joined yet.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
