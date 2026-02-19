import { motion } from "framer-motion";
import { mockWinners } from "@/mock/data";
import { TrendingUp } from "lucide-react";

export default function WinnersTicker() {
  const items = [...mockWinners, ...mockWinners]; // duplicate for infinite scroll

  return (
    <div className="relative overflow-hidden bg-secondary/50 border-y border-border py-3">
      <div className="flex items-center gap-3 animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {items.map((winner, i) => (
          <div key={i} className="flex items-center gap-2 px-4">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
              {winner.avatar}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{winner.name}</span>
              <span className="text-xs text-muted-foreground">ganhou</span>
              <span className="text-sm font-bold text-neon-green">
                R$ {winner.amount.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">em</span>
              <span className="text-xs font-medium text-primary">{winner.game}</span>
              {winner.multiplier && (
                <span className="flex items-center gap-0.5 text-xs font-bold text-neon-gold">
                  <TrendingUp className="w-3 h-3" />
                  {winner.multiplier}x
                </span>
              )}
            </div>
            <span className="text-muted-foreground/40 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
