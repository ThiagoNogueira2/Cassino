import { motion } from "framer-motion";
import type { Card } from "../types";

interface CardComponentProps {
  card: Card;
}

export function CardComponent({ card }: CardComponentProps) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <motion.div
      initial={{ scale: 0, rotateY: 90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={`w-16 h-24 rounded-xl border-2 flex flex-col items-center justify-center font-black text-lg shadow-lg ${card.hidden ? "bg-primary border-primary" : "bg-white border-border"}`}
    >
      {card.hidden ? (
        <span className="text-2xl">🂠</span>
      ) : (
        <div className={isRed ? "text-destructive" : "text-casino-bg"}>
          <div className="text-sm leading-none">{card.value}</div>
          <div className="text-xl leading-none">{card.suit}</div>
        </div>
      )}
    </motion.div>
  );
}

