'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message } from '@/lib/types';
import { sendMessageAction } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('');
}

export default function Chat({ partyId, participantName }: { partyId: string; participantName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'parties', partyId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [partyId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const messageToSend = newMessage;
    setNewMessage('');
    startTransition(async () => {
      await sendMessageAction(partyId, messageToSend, participantName);
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold font-headline text-center">Party Chat</h2>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {messages.map((message) => {
            const isCurrentUser = message.sender === participantName;
            return (
              <div key={message.id} className={cn('flex items-end gap-2', isCurrentUser && 'justify-end')}>
                {!isCurrentUser && (
                    <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-muted-foreground/20 text-muted-foreground text-xs'>
                            {getInitials(message.sender)}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg px-4 py-2 shadow-sm',
                    isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'
                  )}
                >
                  {!isCurrentUser && <p className="text-xs font-bold text-primary pb-1">{message.sender}</p>}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card/80">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isPending}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isPending || !newMessage.trim()} size="icon">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
