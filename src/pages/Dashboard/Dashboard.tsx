import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  History,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useBalance } from "@/context/BalanceContext";
import { cn } from "@/lib/utils";
import { transactions as transactionsApi } from "@/lib/api";
import type { Transaction } from "@/mock/data";
import type { Tab } from "./types";
import { GAME_CARDS } from "./constants";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { user, isLoggedIn, openAuth, logout, updateProfile } = useAuth();
  const { balance, betHistory } = useBalance();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [apostas, setApostas] = useState<Transaction[]>([]);
  const [loadingApostas, setLoadingApostas] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await transactionsApi.list();
        const data = Array.isArray(res) ? res : (res?.data ?? []);
        setTransactions(Array.isArray(data) ? data : []);
      } catch {
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchApostas = async () => {
      setLoadingApostas(true);
      try {
        const [resWin, resLoss] = await Promise.all([
          transactionsApi.list({ type: "win", limit: 50 }),
          transactionsApi.list({ type: "loss", limit: 50 }),
        ]);
        const winData = Array.isArray(resWin) ? resWin : (resWin?.data ?? []);
        const lossData = Array.isArray(resLoss) ? resLoss : (resLoss?.data ?? []);
        const winList = Array.isArray(winData) ? winData : [];
        const lossList = Array.isArray(lossData) ? lossData : [];
        const todas = [...winList, ...lossList].sort((a, b) => {
          const da = typeof a.date === "string" ? new Date(a.date).getTime() : 0;
          const db = typeof b.date === "string" ? new Date(b.date).getTime() : 0;
          return db - da;
        });
        setApostas(todas);
      } catch {
        setApostas([]);
      } finally {
        setLoadingApostas(false);
      }
    };

    fetchApostas();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <AuthModal />
        <div className="text-center">
          <p className="text-xl font-bold mb-4">
            Faça login para acessar o dashboard
          </p>
          <Button
            className="gradient-primary border-0 text-black font-bold"
            onClick={() => openAuth("login")}
          >
            Entrar
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const totalWins = betHistory
    .filter((b) => b.outcome === "win")
    .reduce((s, b) => s + b.profit, 0);
  const totalLosses = betHistory
    .filter((b) => b.outcome === "loss")
    .reduce((s, b) => s + Math.abs(b.profit), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />
      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="card-casino rounded-2xl border border-border p-6 mb-6 bg-gradient-to-r from-primary/10 to-casino-card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-black text-black">
                {user?.avatar}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-black">{user?.name}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                  {user?.level}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-2xl font-black text-neon-gold">
                  R$ {balance.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Link to="/deposit">
                    <Button
                      size="sm"
                      className="gradient-primary border-0 text-black font-bold text-xs"
                    >
                      Depositar
                    </Button>
                  </Link>
                  <Link to="/withdraw">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-xs font-bold"
                    >
                      Sacar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Ganhos",
                value: `R$ ${totalWins.toFixed(2)}`,
                icon: TrendingUp,
                color: "text-neon-green",
              },
              {
                label: "Total Perdas",
                value: `R$ ${totalLosses.toFixed(2)}`,
                icon: TrendingDown,
                color: "text-destructive",
              },
              {
                label: "Apostas",
                value: apostas.length,
                icon: History,
                color: "text-primary",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="card-casino rounded-xl border border-border p-4"
              >
                <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 p-1 bg-secondary rounded-xl">
            {(["overview", "bets", "transactions", "profile"] as Tab[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all",
                    tab === t
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "overview"
                    ? "Visão Geral"
                    : t === "bets"
                      ? "Apostas"
                      : t === "transactions"
                        ? "Transações"
                        : "Perfil"}
                </button>
              ),
            )}
          </div>

          {tab === "overview" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {GAME_CARDS.map((g) => (
                <Link key={g.id} to={`/games/${g.id}`}>
                  <div className="card-casino rounded-xl border border-border p-4 hover:border-primary/50 transition-all flex items-center gap-3">
                    <div className="text-3xl">{g.emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold">{g.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Jogar agora
                      </p>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "bets" && (
            <div className="space-y-2">
              {loadingApostas ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Carregando apostas...
                </div>
              ) : apostas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma aposta encontrada. Jogue Crash, Slots, Roleta ou Blackjack para ver seu histórico aqui.
                </div>
              ) : (
                apostas.map((aposta) => {
                  const isWin = aposta.type === "win";
                  const dateFormatted =
                    typeof aposta.date === "string" && aposta.date.includes("T")
                      ? new Date(aposta.date).toLocaleString("pt-BR")
                      : aposta.date;
                  return (
                    <div
                      key={aposta.id}
                      className="card-casino rounded-xl border border-border p-4 flex items-center gap-4"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          isWin ? "bg-neon-green" : "bg-destructive",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{aposta.description}</p>
                        <p className="text-xs text-muted-foreground">{dateFormatted}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={cn(
                            "font-black text-sm",
                            isWin ? "text-neon-green" : "text-destructive",
                          )}
                        >
                          {isWin ? "+" : "-"}R$ {Math.abs(aposta.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isWin ? "Ganhou" : "Aposta"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "transactions" && (
            <div className="space-y-2">
              {loadingTransactions ? (
                <div className="text-center text-sm text-muted-foreground">
                  Carregando transações...
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground">
                  Nenhuma transação encontrada.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-casino rounded-xl border border-border p-4 flex items-center gap-4"
                  >
                    <div className="text-xl">
                      {tx.type === "deposit"
                        ? "💳"
                        : tx.type === "withdraw"
                          ? "💸"
                          : "✅"}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-black text-sm",
                          tx.type === "withdraw"
                            ? "text-destructive"
                            : "text-neon-green",
                        )}
                      >
                        {tx.type === "withdraw" ? "-" : "+"}R${" "}
                        {Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          tx.status === "approved"
                            ? "bg-neon-green/20 text-neon-green"
                            : tx.status === "pending"
                              ? "bg-neon-gold/20 text-neon-gold"
                              : "bg-destructive/20 text-destructive",
                        )}
                      >
                        {tx.status === "approved"
                          ? "Aprovado"
                          : tx.status === "pending"
                            ? "Pendente"
                            : "Recusado"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="card-casino rounded-2xl border border-border p-6 space-y-4">
              <div className="grid gap-4">
                {[
                  { label: "Nome", value: user?.name },
                  { label: "Email", value: user?.email },
                  { label: "CPF", value: user?.cpf },
                  { label: "Nível", value: user?.level },
                  { label: "Membro desde", value: user?.joinedAt },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border"
                  >
                    <span className="text-sm text-muted-foreground">
                      {f.label}
                    </span>
                    <span className="text-sm font-bold">{f.value}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full gradient-primary border-0 text-black font-bold"
                onClick={() => {
                  setName(user?.name || "");
                  setEmail(user?.email || "");
                  setEditOpen(true);
                }}
              >
                Editar Perfil
              </Button>
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 font-bold"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
              </Button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />

      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md card-casino rounded-2xl border border-border p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">Editar Perfil</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-bold mb-1 block">Nome</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => setEditOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 gradient-primary border-0 text-black font-bold"
                  onClick={async () => {
                    await updateProfile({ name, email });
                    setEditOpen(false);
                  }}
                >
                  Salvar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
