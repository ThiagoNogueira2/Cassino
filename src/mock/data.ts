export interface BetHistory {
  id: string;
  date: string;
  game: string;
  betAmount: number;
  result: number;
  profit: number;
  outcome: "win" | "loss";
}

export interface Transaction {
  id: string;
  date: string;
  type: "deposit" | "withdraw" | "win";
  amount: number;
  status: "approved" | "pending" | "rejected";
  description: string;
}

export interface CrashHistory {
  multiplier: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  emoji: string;
  image?: string;
  color?: string;
  rtp: number;
  minBet: number;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Winner {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  game: string;
  multiplier?: number;
}

