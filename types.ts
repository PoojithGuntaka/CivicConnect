
export type UserRole = 'citizen' | 'official';

export type IssueStatus = 'submitted' | 'in-progress' | 'resolved';

export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: IssueStatus;
  date: string;
  location?: Location; // Simulated lat/lng
  upvotes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface SentimentReport {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  score: number; // 0 to 100
  keyThemes: string[];
  summary: string;
}
