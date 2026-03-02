export interface Card {
  suit: string;
  value: string;
  hidden?: boolean;
}

export type GameState = "idle" | "playing" | "dealerTurn" | "finished";

