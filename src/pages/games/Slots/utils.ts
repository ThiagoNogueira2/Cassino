import type { WinResult } from "./types";
import { SYMBOLS, REELS, ROWS } from "./constants";

export function getSymbol(): string {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function getInitialReels(): string[][] {
  return Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => getSymbol())
  );
}

export function checkWin(reels: string[][]): WinResult {
  const middleRow = reels.map((reel) => reel[1]);
  const counts: Record<string, number> = {};
  middleRow.forEach((s) => (counts[s] = (counts[s] || 0) + 1));

  const maxCount = Math.max(...Object.values(counts));
  const winSymbol = Object.entries(counts).find(([_, c]) => c === maxCount)?.[0] || "";

  if (maxCount >= 5) return { win: true, multiplier: winSymbol === "💎" ? 50 : winSymbol === "7️⃣" ? 30 : 10, message: `${winSymbol} x5 JACKPOT!` };
  if (maxCount >= 4) return { win: true, multiplier: winSymbol === "💎" ? 15 : 5, message: `${winSymbol} x4 Grande ganho!` };
  if (maxCount >= 3) return { win: true, multiplier: 2, message: `${winSymbol} x3 Você ganhou!` };
  return { win: false, multiplier: 0, message: "" };
}

