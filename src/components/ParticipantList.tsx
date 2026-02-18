'use client';

import { collection, query } from 'firebase/firestore';
import type { Participant } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
}

export default function ParticipantList({ partyId }: { partyId: string }) {
  const firestore = useFirestore();
  const participantsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'parties', partyId, 'participants')) : null),
    [firestore, partyId]
  );
  const { data: participants, isLoading } = useCollection<Participant>(participantsQuery);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4">
        <h2 className="flex items-center text-lg font-semibold font-headline">
            <Users className="mr-2 h-5 w-5 text-muted-foreground" />
            Guests ({participants?.length || 0})
        </h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-4">
          {isLoading && <p className="text-muted-foreground text-sm">Loading guests...</p>}
          {participants?.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                  {getInitials(p.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{p.displayName}</span>
            </div>
          ))}
          {!isLoading && (!participants || participants.length === 0) && (
            <p className="text-muted-foreground text-sm text-center py-4">No guests have joined yet.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
