import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { type CrashHistory, type ChatMessage } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { useCrashWebSocket } from "@/hooks/useCrashWebSocket";
import { useCrashAPI } from "@/hooks/useCrashAPI";
import type { GamePhase } from "./types";
import { CrashCanvas } from "./components/CrashCanvas";

export default function CrashGame() {
  const [phase, setPhase] = useState<GamePhase>("waiting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [betAmount, setBetAmount] = useState("10");
  const [activeBet, setActiveBet] = useState<number | null>(null);
  const [activeBetId, setActiveBetId] = useState<string | null>(null);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState<CrashHistory[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const { balance, addBalance, subtractBalance, addBet, addTransaction } = useBalance();
  const { isLoggedIn, openAuth, user } = useAuth();
  const { toast } = useToast();
  const { placeBet: apiPlaceBet, cashout: apiCashout, getHistory, getCurrentState } = useCrashAPI();

  // Handle WebSocket events
  const handleRoundStart = useCallback(() => {
    console.log("[Crash] Round starting - betting phase");
    setPhase("betting");
    setCountdown(10); // Backend agora usa 10s
    setMultiplier(1.0);
    setCrashed(false);
    setCashedOut(false);
  }, []);

  const handleCountdown = useCallback((seconds: number) => {
    console.log(`[Crash] Countdown: ${seconds}s`);
    // Evitar atualizações muito rápidas
    setCountdown(seconds);
    setPhase("betting"); // Sempre atualiza para betting durante countdown
    if (seconds === 0) {
      setPhase("flying");
    }
  }, []);

  const handleMultiplierUpdate = useCallback((newMultiplier: number) => {
    // Evitar atualizações duplicadas
    setMultiplier((prev) => {
      if (newMultiplier <= prev) return prev; // Só atualiza se aumentou
      return newMultiplier;
    });
    setPhase("flying");
    setCrashed(false);
  }, []);

  const handleRoundCrash = useCallback((crashMultiplier: number) => {
    console.log(`[Crash] Crashed at ${crashMultiplier}x`);
    
    // Evitar crash duplicado
    setCrashed((prev) => {
      if (prev) return true; // Já está crashed
      setMultiplier(crashMultiplier);
      setPhase("crashed");
      return true;
    });

    // Handle loss if player didn't cash out
    if (activeBet !== null && !cashedOut) {
      toast({
        title: "Crash!",
        description: `A rodada crashou em ${crashMultiplier.toFixed(2)}x. Você perdeu R$ ${activeBet.toFixed(2)}`,
        variant: "destructive",
      });
      addBet({
        game: "Crash",
        betAmount: activeBet,
        result: 0,
        profit: -activeBet,
        outcome: "loss",
      });
    }

    // Clear bet state
    setActiveBet(null);
    setActiveBetId(null);
    setCashedOut(false);

    // Fetch new history after crash (delay para garantir que backend salvou)
    setTimeout(() => {
      getHistory(15).then((newHistory) => {
        setHistory(newHistory);
      });
    }, 500);
  }, [activeBet, cashedOut, toast, addBet, getHistory]);

  // Connect to WebSocket
  useCrashWebSocket({
    enabled: true,
    onRoundStart: handleRoundStart,
    onCountdown: handleCountdown,
    onMultiplierUpdate: handleMultiplierUpdate,
    onRoundCrash: handleRoundCrash,
  });

  // Persist active bet in localStorage to handle page reloads
  useEffect(() => {
    const savedBet = localStorage.getItem("crash_active_bet");
    const savedBetId = localStorage.getItem("crash_active_bet_id");
    if (savedBet && savedBetId && !activeBet) {
      setActiveBet(parseFloat(savedBet));
      setActiveBetId(savedBetId);
    }
  }, []);

  useEffect(() => {
    if (activeBet && activeBetId) {
      localStorage.setItem("crash_active_bet", activeBet.toString());
      localStorage.setItem("crash_active_bet_id", activeBetId);
    } else {
      localStorage.removeItem("crash_active_bet");
      localStorage.removeItem("crash_active_bet_id");
    }
  }, [activeBet, activeBetId]);

  useEffect(() => {
    let cancelled = false;
    getHistory(15).then((data) => {
      if (!cancelled && data.length > 0) setHistory(data);
    });
    getCurrentState().then((state) => {
      if (cancelled || !state) return;
      if (state.status === "betting") {
        setPhase("betting");
        setCountdown(state.countdown ?? 10);
        setMultiplier(1.0);
      } else if (state.status === "flying") {
        setPhase("flying");
        setMultiplier(state.multiplier);
        setCrashed(false);
      } else if (state.status === "crashed") {
        setPhase("crashed");
        setMultiplier(state.multiplier);
        setCrashed(true);
      } else {
        setPhase("waiting");
        setMultiplier(1.0);
        setCrashed(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleBet = async () => {
    if (!isLoggedIn) {
      openAuth("login");
      return;
    }
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    if (amount > balance) {
      toast({ title: "Saldo insuficiente", variant: "destructive" });
      return;
    }
    if (phase !== "betting" && phase !== "waiting") {
      toast({ title: "Aguarde a próxima rodada", description: `Fase atual: ${phase}`, variant: "destructive" });
      return;
    }

    console.log("[Crash] Placing bet:", { amount, phase, balance });
    
    // Place bet via API
    const result = await apiPlaceBet(amount);
    console.log("[Crash] Bet result:", result);
    if (result) {
      subtractBalance(amount);
      setActiveBet(amount);
      setActiveBetId(result.betId);
      toast({
        title: "✅ Aposta confirmada!",
        description: `R$ ${amount.toFixed(2)} apostado na rodada ${result.roundId || 'atual'}`,
      });
    }
  };

  const handleCashout = async () => {
    if (!activeBet || cashedOut || phase !== "flying") {
      console.log("[Crash] Cannot cashout:", { activeBet, cashedOut, phase });
      return;
    }

    console.log("[Crash] Cashing out:", { activeBet, activeBetId, multiplier });

    // Cashout via API
    if (activeBetId) {
      const result = await apiCashout(activeBetId);
      console.log("[Crash] Cashout result:", result);
      if (result) {
        const winAmount = result.winAmount;
        addBalance(winAmount);
        addTransaction({
          type: "win",
          amount: winAmount,
          status: "approved",
          description: `Cashout no Crash ${result.multiplier.toFixed(2)}x`,
        });
        addBet({
          game: "Crash",
          betAmount: activeBet,
          result: result.multiplier,
          profit: winAmount - activeBet,
          outcome: "win",
        });
        setCashedOut(true);
        setActiveBet(null);
        setActiveBetId(null);
        toast({
          title: `✅ Cashout! ${result.multiplier.toFixed(2)}x`,
          description: `Você ganhou R$ ${winAmount.toFixed(2)}!`,
        });
      }
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, name: "Você", message: chatInput, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), avatar: "V" }
    ]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />

      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
        
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          
            <div className="space-y-4">
             
              <div className="relative card-casino rounded-2xl border border-border overflow-hidden" style={{ minHeight: 340 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-casino-bg to-casino-card" />
                <div className="absolute inset-0 p-4">
                  <CrashCanvas multiplier={multiplier} crashed={crashed} phase={phase} />
                </div>

              
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {phase === "betting" ? (
                    <motion.div
                      key="betting"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <p className="text-muted-foreground text-lg mb-2">Próxima rodada em</p>
                      <p className="text-7xl font-black text-foreground">{countdown}s</p>
                    </motion.div>
                  ) : crashed ? (
                    <motion.div
                      key="crashed"
                      initial={{ scale: 0.5, opacity: 0 }}n
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <p className="text-2xl font-black text-destructive mb-2">💥 CRASH!</p>
                      <p className="text-6xl font-black text-destructive">{multiplier.toFixed(2)}x</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="flying"
                      className="text-center"
                    >
                      <p className="text-primary text-sm font-bold mb-2 uppercase tracking-wider">
                        🚀 Em voo
                      </p>
                      <p className={`text-7xl font-black text-primary`}>
                        {multiplier.toFixed(2)}x
                      </p>
                    </motion.div>
                  )}
                </div>

              
                <AnimatePresence>
                  {cashedOut && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-4 right-4 bg-primary text-white font-black px-4 py-2 rounded-xl text-sm"
                    >
                      Saiu em {multiplier.toFixed(2)}x!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

           
              <div className="card-casino rounded-2xl border border-border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Valor da Aposta (R$)</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="bg-secondary border-border font-bold"
                        placeholder="10.00"
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      {["5", "10", "25", "50", "100"].map((v) => (
                        <button key={v} onClick={() => setBetAmount(v)} className="px-2 py-1 text-xs bg-secondary rounded hover:bg-primary/20 hover:text-primary transition-colors border border-border">
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {(phase === "betting" || phase === "waiting") && !activeBet ? (
                      <Button
                        className="flex-1 gradient-primary border-0 text-white font-black"
                        onClick={handleBet}
                        disabled={phase !== "betting" && phase !== "waiting"}
                      >
                        Apostar R$ {parseFloat(betAmount || "0").toFixed(2)}
                      </Button>
                    ) : phase === "flying" && activeBet && !cashedOut ? (
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-white font-black border-0 text-lg"
                        onClick={handleCashout}
                      >
                        Retirar {multiplier.toFixed(2)}x
                        <br />
                        <span className="text-sm">≈ R$ {(activeBet * multiplier).toFixed(2)}</span>
                      </Button>
                    ) : (
                      <Button disabled className="flex-1 font-black">
                        {cashedOut ? "✅ Retirado!" : activeBet ? "⏳ Aguarde..." : "⏳ Aguardando..."}
                      </Button>
                    )}
                    <div className="text-right text-xs text-muted-foreground">
                      Saldo: <span className="text-primary font-bold">R$ {balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-casino rounded-2xl border border-border p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Histórico de rodadas</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((r, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold ${r.multiplier >= 10 ? "bg-primary/20 text-primary" : r.multiplier >= 2 ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}
                    >
                      {r.multiplier.toFixed(2)}x
                    </span>
                  ))}
                </div>
              </div>
            </div>

      
            <div className="card-casino rounded-2xl border border-border flex flex-col h-[500px] lg:h-auto">
              <div className="p-4 border-b border-border">
                <p className="font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Chat ao Vivo
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-primary">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-xs text-foreground break-words">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Enviar mensagem..."
                  className="bg-secondary border-border text-sm"
                />
                <Button size="icon" className="gradient-primary border-0 shrink-0" onClick={sendChat}>
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
