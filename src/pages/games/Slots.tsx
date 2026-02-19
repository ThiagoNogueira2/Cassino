import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "⭐", "🔔"];
const REELS = 5;
const ROWS = 3;

function getSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function getInitialReels() {
  return Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => getSymbol())
  );
}

function checkWin(reels: string[][]): { win: boolean; multiplier: number; message: string } {
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

export default function SlotsGame() {
  const [reels, setReels] = useState<string[][]>(getInitialReels());
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [result, setResult] = useState<{ win: boolean; multiplier: number; message: string } | null>(null);
  const [autoSpin, setAutoSpin] = useState(false);
  const [autoCount, setAutoCount] = useState(0);

  const { balance, addBalance, subtractBalance, addBet, addTransaction } = useBalance();
  const { isLoggedIn, openAuth } = useAuth();
  const { toast } = useToast();

  const spin = async () => {
    if (!isLoggedIn) { openAuth("login"); return; }
    if (betAmount > balance) { toast({ title: "Saldo insuficiente", variant: "destructive" }); setAutoSpin(false); return; }
    
    subtractBalance(betAmount);
    setSpinning(true);
    setResult(null);

    // Spin animation
    await new Promise((r) => setTimeout(r, 1200));

    const newReels = getInitialReels();
    setReels(newReels);
    setSpinning(false);

    const outcome = checkWin(newReels);
    setResult(outcome);

    if (outcome.win) {
      const prize = betAmount * outcome.multiplier;
      addBalance(prize);
      addTransaction({ type: "win", amount: prize, status: "approved", description: `Ganho no Slot ${outcome.multiplier}x` });
      addBet({ game: "Slot Machine", betAmount, result: outcome.multiplier, profit: prize - betAmount, outcome: "win" });
      toast({ title: `🎰 ${outcome.message}`, description: `Você ganhou R$ ${prize.toFixed(2)}!` });
    } else {
      addBet({ game: "Slot Machine", betAmount, result: 0, profit: -betAmount, outcome: "loss" });
    }
  };

  // Auto spin
  useEffect(() => {
    if (!autoSpin || spinning) return;
    if (autoCount <= 0) { setAutoSpin(false); return; }
    const timer = setTimeout(() => {
      setAutoCount((c) => c - 1);
      spin();
    }, 500);
    return () => clearTimeout(timer);
  }, [autoSpin, spinning, autoCount]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />

      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="card-casino rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-amber-900/30 to-casino-card">
              <div>
                <h1 className="text-xl font-black">🎰 Slot Machine</h1>
                <p className="text-xs text-muted-foreground">RTP: 96% · Min R$0.10</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-neon-gold font-black">R$ {balance.toFixed(2)}</p>
              </div>
            </div>

            {/* Reels */}
            <div className="p-6">
              <div className="bg-casino-bg rounded-xl p-4 border border-border mb-4">
                <div className="flex gap-2 justify-center">
                  {reels.map((reel, ri) => (
                    <div key={ri} className="flex-1 bg-secondary rounded-lg overflow-hidden border border-border">
                      {reel.map((symbol, si) => (
                        <motion.div
                          key={`${ri}-${si}`}
                          animate={spinning ? { y: [0, 30, -30, 0], opacity: [1, 0.3, 0.3, 1] } : {}}
                          transition={{ duration: 0.2, repeat: spinning ? Infinity : 0, delay: ri * 0.05 }}
                          className={`h-16 flex items-center justify-center text-3xl border-b border-border last:border-0 ${si === 1 ? "bg-primary/10" : ""}`}
                        >
                          {symbol}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Win line indicator */}
                <div className="mt-2 h-0.5 bg-primary/30 relative">
                  <div className="absolute inset-y-0 -top-px left-0 right-0 h-0.5 bg-primary/60" />
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-center py-3 rounded-xl mb-4 ${result.win ? "bg-neon-green/20 text-neon-green" : "bg-destructive/20 text-destructive"}`}
                  >
                    {result.win ? (
                      <p className="font-black text-lg">{result.message} · R$ {(betAmount * result.multiplier).toFixed(2)}</p>
                    ) : (
                      <p className="font-bold">Sem sorte desta vez. Tente novamente!</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bet controls */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Aposta (R$)</label>
                  <div className="flex gap-1">
                    {[0.1, 0.5, 1, 5, 10, 25].map((v) => (
                      <button
                        key={v}
                        onClick={() => setBetAmount(v)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${betAmount === v ? "bg-primary border-primary text-white" : "bg-secondary border-border hover:border-primary/50"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 gradient-primary border-0 text-white font-black h-12 text-base glow-purple"
                  onClick={spin}
                  disabled={spinning}
                >
                  {spinning ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    "🎰 Girar"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className={`border-border font-bold ${autoSpin ? "border-neon-gold text-neon-gold" : ""}`}
                  onClick={() => {
                    if (autoSpin) { setAutoSpin(false); } else { setAutoCount(10); setAutoSpin(true); }
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {autoSpin ? `Auto (${autoCount})` : "Auto x10"}
                </Button>
              </div>
            </div>

            {/* Paytable */}
            <div className="p-4 border-t border-border bg-secondary/30">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Tabela de Pagamentos</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { combo: "💎 x5", mult: "50x", color: "text-neon-gold" },
                  { combo: "7️⃣ x5", mult: "30x", color: "text-neon-gold" },
                  { combo: "💎 x4", mult: "15x", color: "text-neon-green" },
                  { combo: "Qualquer x5", mult: "10x", color: "text-neon-green" },
                  { combo: "Qualquer x4", mult: "5x", color: "text-primary" },
                  { combo: "Qualquer x3", mult: "2x", color: "text-foreground" },
                ].map((row) => (
                  <div key={row.combo} className="flex items-center justify-between px-3 py-1.5 bg-secondary rounded-lg">
                    <span className="text-xs">{row.combo}</span>
                    <span className={`text-xs font-black ${row.color}`}>{row.mult}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
