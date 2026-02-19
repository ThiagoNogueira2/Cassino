import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { type Game } from "@/mock/data";
import { TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  index?: number;
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  const route = `/games/${game.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group"
    >
      <Link to={route}>
        <div className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-gradient-to-br h-44 flex flex-col justify-end p-4 cursor-pointer",
          "group-hover:border-primary/50 transition-all duration-300",
          game.color
        )}>
          {/* Glow overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Emoji */}
          <div className="absolute top-4 right-4 text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
            {game.emoji}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {game.isNew && (
              <span className="px-2 py-0.5 text-xs font-bold bg-neon-green text-casino-bg rounded-full">
                NOVO
              </span>
            )}
            {game.isPopular && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 text-xs font-bold bg-neon-gold text-casino-bg rounded-full">
                <Star className="w-2.5 h-2.5" fill="currentColor" /> HOT
              </span>
            )}
          </div>

          {/* Info */}
          <div className="relative z-10">
            <p className="text-xs text-white/60 mb-0.5">{game.category}</p>
            <h3 className="text-lg font-black text-white">{game.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-neon-gold">
                <TrendingUp className="w-3 h-3" />
                RTP {game.rtp}%
              </span>
              <span className="text-xs text-white/60">
                Min R${game.minBet}
              </span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10 border-2 border-primary/30 rounded-xl" />
        </div>
      </Link>
    </motion.div>
  );
}
