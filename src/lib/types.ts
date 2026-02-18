import type { Timestamp } from 'firebase/firestore';

export interface Party {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  createdAt: Timestamp;
  participants: Participant[];
}

export interface Participant {
  name: string;
  joinedAt: Timestamp;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}
