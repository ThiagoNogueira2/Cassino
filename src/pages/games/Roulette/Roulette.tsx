import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { BetType } from "./types";
import { NUMBERS } from "./constants";
import { getColor } from "./utils";

export default function RouletteGame() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [bets, setBets] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState(5);
  const [countdown, setCountdown] = useState(15);
  const [phase, setPhase] = useState<"betting" | "spinning" | "result">("betting");
  const [wheelRotation, setWheelRotation] = useState(0);

  const { balance, addBalance, subtractBalance, addBet, addTransaction } = useBalance();
  const { isLoggedIn, openAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (phase !== "betting") return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          startSpin();
          return 15;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const startSpin = async () => {
    setPhase("spinning");
    const num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    setWheelRotation((prev) => prev + 1440 + num * (360 / 37));

    await new Promise((r) => setTimeout(r, 3000));

    setResult(num);
    setHistory((prev) => [num, ...prev.slice(0, 19)]);
    setPhase("result");

    // Calculate wins
    let totalWin = 0;
    bets.forEach((bet) => {
      const color = getColor(num);
      if (bet.type === "number" && bet.value === num) totalWin += bet.amount * 35;
      else if (bet.type === "red" && color === "red") totalWin += bet.amount * 2;
      else if (bet.type === "black" && color === "black") totalWin += bet.amount * 2;
      else if (bet.type === "even" && num !== 0 && num % 2 === 0) totalWin += bet.amount * 2;
      else if (bet.type === "odd" && num % 2 !== 0) totalWin += bet.amount * 2;
      else if (bet.type === "low" && num >= 1 && num <= 18) totalWin += bet.amount * 2;
      else if (bet.type === "high" && num >= 19) totalWin += bet.amount * 2;
    });
    if (totalWin > 0) addBalance(totalWin);

    const totalBet = bets.reduce((s, b) => s + b.amount, 0);
    if (totalBet > 0) {
      if (totalWin > 0) {
        toast({ title: `🎡 ${num} (${getColor(num).toUpperCase()})`, description: `Você ganhou R$ ${totalWin.toFixed(2)}!` });
        addTransaction({ type: "win", amount: totalWin, status: "approved", description: `Ganho na Roleta - número ${num}` });
        addBet({ game: "Roleta", betAmount: totalBet, result: totalWin / totalBet, profit: totalWin - totalBet, outcome: "win" });
      } else {
        toast({ title: `🎡 ${num} (${getColor(num).toUpperCase()})`, description: `Perdeu R$ ${totalBet.toFixed(2)}`, variant: "destructive" });
        addBet({ game: "Roleta", betAmount: totalBet, result: 0, profit: -totalBet, outcome: "loss" });
      }
    }

    setBets([]);
    await new Promise((r) => setTimeout(r, 3000));
    setCountdown(15);
    setPhase("betting");
  };

  const addBetAction = (type: BetType["type"], value: number | string) => {
    if (!isLoggedIn) { openAuth("login"); return; }
    if (betAmount > balance) { toast({ title: "Saldo insuficiente", variant: "destructive" }); return; }
    if (phase !== "betting") return;
    subtractBalance(betAmount);
    setBets((prev) => [...prev, { type, value, amount: betAmount }]);
    toast({ title: "Aposta registrada!", description: `R$ ${betAmount} em ${value}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />

      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Main */}
            <div className="space-y-4">
              {/* Roulette wheel visualization */}
              <div className="card-casino rounded-2xl border border-border p-6 text-center">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-black">🎡 Roleta Europeia</h1>
                  {phase === "betting" && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-sm font-bold">Apostas: {countdown}s</span>
                    </div>
                  )}
                </div>

                {/* Wheel */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <motion.div
                      animate={{ rotate: wheelRotation }}
                      transition={{ duration: 3, ease: "easeOut" }}
                      className="w-full h-full rounded-full border-4 border-primary/50 overflow-hidden"
                      style={{ background: "conic-gradient(from 0deg, #dc2626 0deg, #1a1a1a 9.72deg, #dc2626 9.72deg, #1a1a1a 19.45deg, #dc2626 19.45deg, #1a1a1a 29.18deg, #dc2626 29.18deg, #1a1a1a 38.9deg, #dc2626 38.9deg, #1a1a1a 48.64deg, #dc2626 48.64deg, #1a1a1a 58.37deg, #dc2626 58.37deg, #1a1a1a 68.1deg, #dc2626 68.1deg, #1a1a1a 77.83deg, #dc2626 77.83deg, #1a1a1a 87.56deg, #dc2626 87.56deg, #1a1a1a 97.29deg, #dc2626 97.29deg, #1a1a1a 107.02deg, #dc2626 107.02deg, #1a1a1a 116.75deg, #dc2626 116.75deg, #1a1a1a 126.48deg, #dc2626 126.48deg, #1a1a1a 136.21deg, #dc2626 136.21deg, #1a1a1a 145.93deg, #dc2626 145.93deg, #1a1a1a 155.67deg, #dc2626 155.67deg, #1a1a1a 165.4deg, #dc2626 165.4deg, #1a1a1a 175.13deg, #16a34a 175.13deg, #16a34a 184.86deg, #dc2626 184.86deg, #1a1a1a 194.59deg, #dc2626 194.59deg, #1a1a1a 204.32deg, #dc2626 204.32deg, #1a1a1a 214.05deg, #dc2626 214.05deg, #1a1a1a 223.78deg, #dc2626 223.78deg, #1a1a1a 233.51deg, #dc2626 233.51deg, #1a1a1a 243.24deg, #dc2626 243.24deg, #1a1a1a 252.97deg, #dc2626 252.97deg, #1a1a1a 262.7deg, #dc2626 262.7deg, #1a1a1a 272.43deg, #dc2626 272.43deg, #1a1a1a 282.16deg, #dc2626 282.16deg, #1a1a1a 291.89deg, #dc2626 291.89deg, #1a1a1a 301.62deg, #dc2626 301.62deg, #1a1a1a 311.35deg, #dc2626 311.35deg, #1a1a1a 321.08deg, #dc2626 321.08deg, #1a1a1a 330.81deg, #dc2626 330.81deg, #1a1a1a 340.54deg, #dc2626 340.54deg, #1a1a1a 350.27deg, #dc2626 350.27deg, #1a1a1a 360deg)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full border-4 border-primary/50 flex items-center justify-center text-2xl font-black ${phase === "result" ? (getColor(result!) === "red" ? "bg-destructive" : getColor(result!) === "black" ? "bg-casino-bg" : "bg-primary") : "bg-casino-card"}`}>
                        {phase === "result" ? result : "?"}
                      </div>
                    </div>
                  </div>
                </div>

                {phase === "spinning" && (
                  <motion.p animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-primary font-bold mb-4">
                    🎡 Girando...
                  </motion.p>
                )}
              </div>

              {/* Betting table */}
              <div className="card-casino rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-sm">Mesa de Apostas</p>
                  <div className="flex gap-1">
                    {[1, 5, 10, 25, 50].map((v) => (
                      <button key={v} onClick={() => setBetAmount(v)} className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${betAmount === v ? "bg-primary border-primary text-white" : "bg-secondary border-border"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bet options */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Vermelho 🔴", type: "red" as const, value: "red", color: "bg-destructive/20 hover:bg-destructive/40 border-destructive/30" },
                    { label: "Preto ⚫", type: "black" as const, value: "black", color: "bg-secondary hover:bg-secondary/70 border-border" },
                    { label: "Verde 🟢 (0)", type: "number" as const, value: 0, color: "bg-neon-green/20 hover:bg-neon-green/30 border-neon-green/30" },
                    { label: "Par", type: "even" as const, value: "par", color: "bg-primary/20 hover:bg-primary/30 border-primary/30" },
                    { label: "Ímpar", type: "odd" as const, value: "ímpar", color: "bg-primary/20 hover:bg-primary/30 border-primary/30" },
                    { label: "1-18", type: "low" as const, value: "1-18", color: "bg-accent/20 hover:bg-accent/30 border-accent/30" },
                    { label: "19-36", type: "high" as const, value: "19-36", color: "bg-accent/20 hover:bg-accent/30 border-accent/30" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => addBetAction(opt.type, opt.value)}
                      disabled={phase !== "betting"}
                      className={`py-3 text-sm font-bold rounded-lg border transition-all disabled:opacity-50 ${opt.color}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Number grid */}
                <div className="grid grid-cols-12 gap-0.5">
                  {NUMBERS.slice(1).map((n) => (
                    <button
                      key={n}
                      onClick={() => addBetAction("number", n)}
                      disabled={phase !== "betting"}
                      className={`aspect-square text-xs font-bold rounded flex items-center justify-center transition-all disabled:opacity-40 hover:scale-110 ${getColor(n) === "red" ? "bg-destructive/70 hover:bg-destructive" : "bg-secondary hover:bg-secondary/70"} ${result === n && phase === "result" ? "ring-2 ring-neon-gold scale-110" : ""}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active bets */}
              {bets.length > 0 && (
                <div className="card-casino rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Apostas ativas: R$ {bets.reduce((s, b) => s + b.amount, 0).toFixed(2)}</p>
                  <div className="flex flex-wrap gap-1">
                    {bets.map((b, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-bold">
                        {b.value} · R${b.amount}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div className="card-casino rounded-2xl border border-border p-4">
              <p className="font-bold text-sm mb-4">Histórico</p>
              <div className="flex flex-wrap gap-2">
                {history.map((n, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white ${getColor(n) === "red" ? "bg-destructive" : getColor(n) === "green" ? "bg-neon-green" : "bg-casino-surface border border-border"}`}
                  >
                    {n}
                  </div>
                ))}
                {history.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma rodada ainda</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

