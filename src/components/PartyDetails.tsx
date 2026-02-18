'use client';

import { useState } from 'react';
import type { Party } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Share2, Wand2, PartyPopper } from 'lucide-react';
import AiActivitySuggester from './AiActivitySuggester';
import { Separator } from './ui/separator';
import { format } from 'date-fns';

export default function PartyDetails({ party }: { party: Party }) {
  const { toast } = useToast();
  const [isSuggesterOpen, setIsSuggesterOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'The party invitation link is now on your clipboard.',
    });
  };

  const partyDate = party.date ? new Date(party.date) : null;
  // Adjust for timezone offset for date input
  const displayDate = partyDate ? new Date(partyDate.valueOf() + partyDate.getTimezoneOffset() * 60 * 1000) : null;


  return (
    <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
             <PartyPopper className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline truncate">{party.name}</h1>
        </div>
      <p className="text-muted-foreground text-sm">{party.description}</p>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{displayDate ? format(displayDate, 'EEEE, MMMM do, yyyy') : 'Date not set'}</span>
        </div>
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{party.time || 'Time not set'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button onClick={handleShare} variant="outline" size="sm" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
        <Button onClick={() => setIsSuggesterOpen(true)} variant="outline" size="sm" className="flex-1 bg-accent/20 text-accent-foreground/80 border-accent/50 hover:bg-accent/30">
          <Wand2 className="mr-2 h-4 w-4 text-accent" />
          AI Ideas
        </Button>
      </div>

      <AiActivitySuggester open={isSuggesterOpen} onOpenChange={setIsSuggesterOpen} />
      <Separator className='mt-4' />
    </div>
  );
}
