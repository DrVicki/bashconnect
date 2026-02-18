import type { Timestamp } from 'firebase/firestore';

export interface Party {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  ownerId: string;
  createdAt: Timestamp;
}

export interface Participant {
  id: string;
  partyId: string;
  displayName: string;
  joinTime: Timestamp;
}

export interface Message {
  id:string;
  partyId: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  senderDisplayName: string;
}
