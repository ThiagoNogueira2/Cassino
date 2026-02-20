import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Card, GameState } from "./types";
import { getHandValue, drawCard } from "./utils";
import { CardComponent } from "./components/CardComponent";

export default function BlackjackGame() {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [betAmount, setBetAmount] = useState(10);
  const [currentBet, setCurrentBet] = useState(0);
  const [resultMsg, setResultMsg] = useState("");

  const { balance, addBalance, subtractBalance, addBet, addTransaction } = useBalance();
  const { isLoggedIn, openAuth } = useAuth();
  const { toast } = useToast();

  const startGame = () => {
    if (!isLoggedIn) { openAuth("login"); return; }
    if (betAmount > balance) { toast({ title: "Saldo insuficiente", variant: "destructive" }); return; }
    subtractBalance(betAmount);
    setCurrentBet(betAmount);
    setResultMsg("");

    const pCards = [drawCard(), drawCard()];
    const dCards = [drawCard(), drawCard(true)];

    setPlayerCards(pCards);
    setDealerCards(dCards);
    setGameState("playing");

    if (getHandValue(pCards) === 21) {
      endGame(pCards, dCards, betAmount, true);
    }
  };

  const hit = () => {
    const newCard = drawCard();
    const newCards = [...playerCards, newCard];
    setPlayerCards(newCards);

    if (getHandValue(newCards) > 21) {
      endGame(newCards, dealerCards, currentBet, false, "bust");
    }
  };

  const stand = async () => {
    setGameState("dealerTurn");

    let dCards = dealerCards.map((c, i) => i === 1 ? { ...c, hidden: false } : c);
    setDealerCards(dCards);

    // Dealer draws until >= 17
    while (getHandValue(dCards) < 17) {
      await new Promise((r) => setTimeout(r, 600));
      const newCard = drawCard();
      dCards = [...dCards, newCard];
      setDealerCards([...dCards]);
    }

    endGame(playerCards, dCards, currentBet);
  };

  const double = () => {
    if (currentBet > balance) { toast({ title: "Saldo insuficiente", variant: "destructive" }); return; }
    subtractBalance(currentBet);
    const doubled = currentBet * 2;
    setCurrentBet(doubled);
    const newCard = drawCard();
    const newCards = [...playerCards, newCard];
    setPlayerCards(newCards);
    if (getHandValue(newCards) <= 21) {
      stand();
    } else {
      endGame(newCards, dealerCards, doubled, false, "bust");
    }
  };

  const endGame = (pCards: Card[], dCards: Card[], bet: number, isBlackjack = false, reason?: string) => {
    const pVal = getHandValue(pCards);
    const dCards2 = dCards.map((c) => ({ ...c, hidden: false }));
    const dVal = getHandValue(dCards2);
    setDealerCards(dCards2);

    let msg = "";
    let win = false;
    let prize = 0;

    if (reason === "bust" || (pVal > 21)) {
      msg = `💥 Estourou! Você perdeu R$ ${bet.toFixed(2)}`;
    } else if (isBlackjack && pVal === 21) {
      prize = bet * 2.5;
      win = true;
      msg = `🎴 BLACKJACK! Você ganhou R$ ${prize.toFixed(2)}!`;
    } else if (dVal > 21 || pVal > dVal) {
      prize = bet * 2;
      win = true;
      msg = `✅ Você ganhou! R$ ${prize.toFixed(2)}`;
    } else if (pVal === dVal) {
      prize = bet;
      win = true;
      msg = `🤝 Empate! Devolução de R$ ${prize.toFixed(2)}`;
    } else {
      msg = `❌ Dealer venceu! Você perdeu R$ ${bet.toFixed(2)}`;
    }

    if (win && prize > 0) {
      addBalance(prize);
      addTransaction({ type: "win", amount: prize, status: "approved", description: "Ganho no Blackjack" });
      addBet({ game: "Blackjack", betAmount: bet, result: prize / bet, profit: prize - bet, outcome: "win" });
    } else if (!win) {
      addBet({ game: "Blackjack", betAmount: bet, result: 0, profit: -bet, outcome: "loss" });
    }

    setResultMsg(msg);
    setGameState("finished");
  };

  const pScore = getHandValue(playerCards);
  const dScore = getHandValue(dealerCards);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />

      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="card-casino rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-green-900/40 to-casino-card flex items-center justify-between">
              <h1 className="text-xl font-black">🎴 Blackjack</h1>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-primary font-black">R$ {balance.toFixed(2)}</p>
              </div>
            </div>

            {/* Table */}
            <div className="p-6 min-h-[400px] flex flex-col gap-8" style={{ background: "radial-gradient(ellipse at center, hsl(158 64% 8%), hsl(158 64% 4%))" }}>
              {/* Dealer */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase mb-3">
                  Dealer {gameState !== "idle" && gameState !== "playing" ? `— ${dScore} pts` : ""}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {dealerCards.map((card, i) => (
                    <CardComponent key={i} card={card} />
                  ))}
                  {dealerCards.length === 0 && (
                    <div className="w-16 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                      🂠
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {resultMsg && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-center p-4 rounded-xl mx-auto max-w-sm ${resultMsg.includes("ganhou") || resultMsg.includes("BLACKJACK") ? "bg-primary/15 text-primary" : resultMsg.includes("Empate") ? "bg-primary/10 text-foreground" : "bg-destructive/15 text-destructive"}`}
                  >
                    <p className="font-black text-lg">{resultMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Player */}
              <div className="text-center">
                <div className="flex justify-center gap-2 flex-wrap mb-3">
                  {playerCards.map((card, i) => (
                    <CardComponent key={i} card={card} />
                  ))}
                  {playerCards.length === 0 && (
                    <div className="w-16 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                      🂠
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground uppercase">
                  Você {gameState !== "idle" ? `— ${pScore} pts` : ""}
                  {pScore > 21 && <span className="text-destructive ml-2 font-bold">BUST!</span>}
                  {pScore === 21 && playerCards.length === 2 && <span className="text-primary ml-2 font-bold">BLACKJACK!</span>}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border">
              {gameState === "idle" || gameState === "finished" ? (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Aposta (R$)</label>
                    <div className="flex gap-1">
                      {[5, 10, 25, 50, 100, 200].map((v) => (
                        <button key={v} onClick={() => setBetAmount(v)} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${betAmount === v ? "bg-primary border-primary text-white" : "bg-secondary border-border"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button className="gradient-primary border-0 text-white font-black h-10 px-6" onClick={startGame}>
                    {gameState === "finished" ? "Nova Rodada" : "Iniciar Jogo"}
                  </Button>
                </div>
              ) : gameState === "playing" ? (
                <div className="flex gap-3">
                  <Button className="flex-1 gradient-primary border-0 text-white font-bold" onClick={hit}>
                    Pedir Carta
                  </Button>
                  <Button variant="outline" className="flex-1 border-primary/50 text-primary hover:bg-primary/10 font-bold" onClick={stand}>
                    Parar
                  </Button>
                  {playerCards.length === 2 && (
                    <Button variant="outline" className="flex-1 border-primary/40 text-primary hover:bg-primary/10 font-bold" onClick={double}>
                      Dobrar
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm animate-pulse">
                  Aguardando dealer...
                </div>
              )}
            </div>

            {/* Bet info */}
            {currentBet > 0 && (
              <div className="px-4 pb-4 text-center text-xs text-muted-foreground">
                Aposta atual: <span className="text-primary font-bold">R$ {currentBet.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

