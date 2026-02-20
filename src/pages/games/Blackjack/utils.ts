import type { Card } from "./types";
import { SUITS, VALUES } from "./constants";

export function getCardValue(card: Card): number {
  if (card.hidden) return 0;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

export function getHandValue(cards: Card[]): number {
  let sum = cards.filter((c) => !c.hidden).reduce((s, c) => s + getCardValue(c), 0);
  let aces = cards.filter((c) => c.value === "A" && !c.hidden).length;
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
}

export function drawCard(hidden = false): Card {
  return {
    suit: SUITS[Math.floor(Math.random() * SUITS.length)],
    value: VALUES[Math.floor(Math.random() * VALUES.length)],
    hidden,
  };
}

