export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  avatar: string;
  balance: number;
  level: string;
  joinedAt: string;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
  rtp: number;
  minBet: number;
  maxBet: number;
  emoji: string;
  color: string;
}

export interface BetHistory {
  id: string;
  game: string;
  betAmount: number;
  result: number;
  profit: number;
  date: string;
  outcome: "win" | "loss";
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "win" | "loss" | "bonus";
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  description: string;
}

export interface Winner {
  id: string;
  name: string;
  game: string;
  amount: number;
  multiplier?: number;
  avatar: string;
}

export interface CrashRound {
  multiplier: number;
  timestamp: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bonus: string;
  color: string;
  emoji: string;
  expiresIn: string;
}

export const mockUser: User = {
  id: "user-001",
  name: "João Silva",
  email: "joao@email.com",
  cpf: "123.456.789-00",
  avatar: "JS",
  balance: 1250.75,
  level: "VIP Silver",
  joinedAt: "2024-01-15",
};

export const mockGames: Game[] = [
  { id: "crash", name: "Crash", category: "Ao Vivo", image: "", isPopular: true, rtp: 97, minBet: 1, maxBet: 1000, emoji: "🚀", color: "from-purple-600 to-purple-900" },
  { id: "slots", name: "Slot Machine", category: "Slots", image: "", isPopular: true, rtp: 96, minBet: 0.1, maxBet: 100, emoji: "🎰", color: "from-amber-500 to-amber-900" },
  { id: "roulette", name: "Roleta", category: "Mesa", image: "", isNew: true, rtp: 97.3, minBet: 1, maxBet: 500, emoji: "🎡", color: "from-green-600 to-green-900" },
  { id: "blackjack", name: "Blackjack", category: "Mesa", image: "", isPopular: true, rtp: 99.5, minBet: 5, maxBet: 2000, emoji: "🎴", color: "from-red-600 to-red-900" },
  { id: "baccarat", name: "Bacará", category: "Mesa", image: "", isNew: true, rtp: 98.9, minBet: 10, maxBet: 5000, emoji: "🃏", color: "from-blue-600 to-blue-900" },
  { id: "mines", name: "Mines", category: "Casual", image: "", isNew: true, rtp: 97, minBet: 0.5, maxBet: 200, emoji: "💣", color: "from-slate-600 to-slate-900" },
  { id: "plinko", name: "Plinko", category: "Casual", image: "", isPopular: true, rtp: 97, minBet: 0.1, maxBet: 100, emoji: "🎯", color: "from-pink-600 to-pink-900" },
  { id: "dice", name: "Dice", category: "Casual", image: "", rtp: 98, minBet: 0.1, maxBet: 500, emoji: "🎲", color: "from-cyan-600 to-cyan-900" },
];

export const mockBetHistory: BetHistory[] = [
  { id: "b1", game: "Crash", betAmount: 50, result: 2.35, profit: 67.5, date: "2024-02-19 14:32", outcome: "win" },
  { id: "b2", game: "Slot Machine", betAmount: 10, result: 0, profit: -10, date: "2024-02-19 13:15", outcome: "loss" },
  { id: "b3", game: "Roleta", betAmount: 25, result: 1, profit: 25, date: "2024-02-19 12:08", outcome: "win" },
  { id: "b4", game: "Crash", betAmount: 100, result: 0, profit: -100, date: "2024-02-18 22:45", outcome: "loss" },
  { id: "b5", game: "Blackjack", betAmount: 50, result: 1.5, profit: 25, date: "2024-02-18 20:30", outcome: "win" },
  { id: "b6", game: "Crash", betAmount: 30, result: 5.12, profit: 123.6, date: "2024-02-18 19:12", outcome: "win" },
  { id: "b7", game: "Slot Machine", betAmount: 20, result: 3.5, profit: 50, date: "2024-02-18 18:05", outcome: "win" },
  { id: "b8", game: "Roleta", betAmount: 15, result: 0, profit: -15, date: "2024-02-17 21:20", outcome: "loss" },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "deposit", amount: 200, date: "2024-02-19 10:00", status: "approved", description: "Depósito PIX" },
  { id: "t2", type: "win", amount: 123.6, date: "2024-02-18 19:12", status: "approved", description: "Ganho no Crash" },
  { id: "t3", type: "withdraw", amount: 100, date: "2024-02-17 15:30", status: "pending", description: "Saque PIX" },
  { id: "t4", type: "bonus", amount: 50, date: "2024-02-16 09:00", status: "approved", description: "Bônus de Boas-vindas" },
  { id: "t5", type: "deposit", amount: 500, date: "2024-02-15 14:22", status: "approved", description: "Depósito PIX" },
  { id: "t6", type: "loss", amount: -100, date: "2024-02-14 20:10", status: "approved", description: "Perda no Crash" },
  { id: "t7", type: "withdraw", amount: 300, date: "2024-02-13 11:45", status: "rejected", description: "Saque PIX (recusado)" },
];

export const mockWinners: Winner[] = [
  { id: "w1", name: "Carlos M.", game: "Crash", amount: 1523.50, multiplier: 15.23, avatar: "CM" },
  { id: "w2", name: "Ana L.", game: "Slot Machine", amount: 892.00, multiplier: 89.2, avatar: "AL" },
  { id: "w3", name: "Pedro R.", game: "Roleta", amount: 720.00, avatar: "PR" },
  { id: "w4", name: "Maria S.", game: "Crash", amount: 2100.00, multiplier: 21.0, avatar: "MS" },
  { id: "w5", name: "Lucas T.", game: "Blackjack", amount: 450.00, avatar: "LT" },
  { id: "w6", name: "Julia F.", game: "Crash", amount: 3500.00, multiplier: 35.0, avatar: "JF" },
  { id: "w7", name: "Rafael G.", game: "Slot Machine", amount: 600.00, multiplier: 60.0, avatar: "RG" },
  { id: "w8", name: "Camila B.", game: "Roleta", amount: 350.00, avatar: "CB" },
  { id: "w9", name: "Diego P.", game: "Crash", amount: 987.50, multiplier: 9.875, avatar: "DP" },
  { id: "w10", name: "Fernanda O.", game: "Blackjack", amount: 1200.00, avatar: "FO" },
];

export const mockCrashHistory: CrashRound[] = [
  { multiplier: 1.23, timestamp: "14:32" },
  { multiplier: 5.67, timestamp: "14:30" },
  { multiplier: 1.02, timestamp: "14:28" },
  { multiplier: 12.45, timestamp: "14:26" },
  { multiplier: 2.31, timestamp: "14:24" },
  { multiplier: 1.54, timestamp: "14:22" },
  { multiplier: 87.23, timestamp: "14:20" },
  { multiplier: 3.12, timestamp: "14:18" },
  { multiplier: 1.01, timestamp: "14:16" },
  { multiplier: 6.78, timestamp: "14:14" },
  { multiplier: 1.89, timestamp: "14:12" },
  { multiplier: 4.56, timestamp: "14:10" },
  { multiplier: 1.11, timestamp: "14:08" },
  { multiplier: 22.0, timestamp: "14:06" },
  { multiplier: 2.45, timestamp: "14:04" },
];

export const mockRanking = [
  { position: 1, name: "Julia F.", profit: 45230.50, games: 324, avatar: "JF" },
  { position: 2, name: "Rafael G.", profit: 38100.00, games: 512, avatar: "RG" },
  { position: 3, name: "Maria S.", profit: 29450.75, games: 287, avatar: "MS" },
  { position: 4, name: "Carlos M.", profit: 21890.25, games: 198, avatar: "CM" },
  { position: 5, name: "Diego P.", profit: 18750.00, games: 445, avatar: "DP" },
];

export const mockPromotions: Promotion[] = [
  { id: "p1", title: "Bônus de Boas-vindas", description: "Primeiro depósito com 100% de bônus até R$500", bonus: "+100%", color: "from-purple-600 to-purple-900", emoji: "🎁", expiresIn: "2d 14h" },
  { id: "p2", title: "Cashback Semanal", description: "Receba 10% de volta em todas suas perdas semanais", bonus: "10%", color: "from-amber-500 to-amber-900", emoji: "💰", expiresIn: "5d 08h" },
  { id: "p3", title: "Rodadas Grátis", description: "50 giros grátis toda sexta no Slot Machine", bonus: "50 FREE", color: "from-green-600 to-green-900", emoji: "🎰", expiresIn: "1d 22h" },
  { id: "p4", title: "Torneio Crash", description: "Maior multiplicador da semana ganha R$5.000", bonus: "R$5K", color: "from-red-600 to-red-900", emoji: "🚀", expiresIn: "3d 06h" },
];

export const mockChatMessages = [
  { id: "c1", name: "Felipe", message: "sacanagem esse crash 😤", time: "14:32", avatar: "F" },
  { id: "c2", name: "Ana", message: "Apostei 50 e ganhei 180!! 🔥", time: "14:33", avatar: "A" },
  { id: "c3", name: "Lucas", message: "quando vem o x100 😭", time: "14:33", avatar: "L" },
  { id: "c4", name: "Maria", message: "x12 agora!! sai ANTES de crashar 💎", time: "14:34", avatar: "M" },
  { id: "c5", name: "Pedro", message: "alguém apostou no último?", time: "14:34", avatar: "P" },
  { id: "c6", name: "Carlos", message: "sempre caindo na hora errada 😅", time: "14:35", avatar: "C" },
  { id: "c7", name: "Julia", message: "estratégia: sair sempre no 1.5 🧠", time: "14:35", avatar: "J" },
];
