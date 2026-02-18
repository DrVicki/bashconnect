'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { addParticipantAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PartyPopper } from 'lucide-react';

export default function JoinPartyDialog({ partyId, onJoin }: { partyId: string; onJoin: (name: string) => void }) {
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleJoin = () => {
    if (name.trim().length < 2) {
      toast({ title: 'Name is too short', description: 'Please enter a name with at least 2 characters.', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      const result = await addParticipantAction(partyId, name.trim());
      if (result.success) {
        toast({ title: `Welcome, ${name.trim()}!`, description: 'You have successfully joined the party.' });
        onJoin(name.trim());
      } else {
        toast({ title: 'Error joining party', description: result.error, variant: 'destructive' });
      }
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
            <div className='flex justify-center mb-4'>
                <PartyPopper className='w-12 h-12 text-primary' />
            </div>
          <DialogTitle className="text-center font-headline text-2xl">You're Invited!</DialogTitle>
          <DialogDescription className="text-center">
            Enter your name to join the party and start chatting with other guests.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            id="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className="text-center"
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleJoin} className="w-full font-bold" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Join the Party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
