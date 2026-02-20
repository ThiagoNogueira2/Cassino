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
          "relative overflow-hidden rounded-xl border border-border h-48 flex flex-col justify-end cursor-pointer",
          "group-hover:border-primary/30 transition-all duration-300",
        )}>
          {/* Background Image */}
          {game.image ? (
            <img
              src={game.image}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br", game.color)} />
          )}

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Emoji watermark */}
          <div className="absolute top-4 right-4 text-3xl opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-300 drop-shadow-lg">
            {game.emoji}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {game.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
                NOVO
              </span>
            )}
            {game.isPopular && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-primary/80 text-white rounded-full">
                <Star className="w-2.5 h-2.5" fill="currentColor" /> HOT
              </span>
            )}
          </div>

          {/* Info */}
          <div className="relative z-10 p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 mb-0.5">{game.category}</p>
            <h3 className="text-lg font-black text-white drop-shadow-sm">{game.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/70 font-medium">
                <TrendingUp className="w-3 h-3" />
                RTP {game.rtp}%
              </span>
              <span className="text-xs text-white/50">
                Min R${game.minBet}
              </span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/5 rounded-xl" />
        </div>
      </Link>
    </motion.div>
  );
}
