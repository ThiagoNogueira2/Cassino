import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { wallet } from "@/lib/api";
import type { PixKeyType, WithdrawStep } from "./types";
import { QUICK_WITHDRAW_VALUES, MIN_WITHDRAW_AMOUNT } from "./constants";

export default function WithdrawPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState<PixKeyType>("cpf");
  const [step, setStep] = useState<WithdrawStep>("form");

  const { balance, addTransaction } = useBalance();
  const { isLoggedIn, openAuth, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleWithdraw = async () => {
    if (!isLoggedIn) {
      openAuth("login");
      return;
    }
    if (!amount || Number(amount) < MIN_WITHDRAW_AMOUNT) {
      toast({
        title: `Mínimo R$${MIN_WITHDRAW_AMOUNT}`,
        variant: "destructive",
      });
      return;
    }
    if (Number(amount) > balance) {
      toast({ title: "Saldo insuficiente", variant: "destructive" });
      return;
    }
    if (!pixKey.trim()) {
      toast({ title: "Informe sua chave PIX", variant: "destructive" });
      return;
    }

    try {
      await wallet.withdraw({
        amount: Number(amount),
        pix_key_type: pixType,
        pix_key: pixKey.trim(),
      });
      addTransaction({
        type: "withdraw",
        amount: Number(amount),
        status: "pending",
        description: `Saque PIX para ${pixKey}`,
      });
      setStep("processing");
      setTimeout(() => {
        setStep("done");
        refreshUser();
      }, 2000);
    } catch {
      toast({ title: "Erro ao solicitar saque", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />
      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <h1 className="text-2xl font-black mb-2">💸 Sacar</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Saldo disponível:{" "}
            <span className="text-neon-gold font-bold">
              R$ {balance.toFixed(2)}
            </span>
          </p>

          <div className="card-casino rounded-2xl border border-border overflow-hidden">
            {step === "form" && (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-bold mb-2 block">
                    Valor do Saque
                  </label>
                  <Input
                    type="number"
                    placeholder={`Mínimo R$${MIN_WITHDRAW_AMOUNT}`}
                    className="bg-secondary border-border text-lg font-bold"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || "")}
                  />
                  <div className="flex gap-2 mt-2">
                    {QUICK_WITHDRAW_VALUES.map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(Math.min(v, balance))}
                        className="flex-1 py-1.5 text-xs font-bold bg-secondary border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        R${v}
                      </button>
                    ))}
                    <button
                      onClick={() => setAmount(Math.floor(balance))}
                      className="flex-1 py-1.5 text-xs font-bold bg-secondary border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      Tudo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold mb-2 block">
                    Tipo de Chave PIX
                  </label>
                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {(["cpf", "email", "phone", "random"] as PixKeyType[]).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setPixType(t)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-colors ${pixType === t ? "bg-primary border-primary text-white" : "bg-secondary border-border"}`}
                        >
                          {t === "cpf"
                            ? "CPF"
                            : t === "email"
                              ? "Email"
                              : t === "phone"
                                ? "Telefone"
                                : "Aleatória"}
                        </button>
                      ),
                    )}
                  </div>
                  <Input
                    placeholder={
                      pixType === "cpf"
                        ? "000.000.000-00"
                        : pixType === "email"
                          ? "seu@email.com"
                          : pixType === "phone"
                            ? "(11) 99999-9999"
                            : "Chave aleatória UUID"
                    }
                    className="bg-secondary border-border"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                </div>

                <div className="p-3 bg-secondary/50 rounded-xl border border-border text-xs text-muted-foreground">
                  Saques são processados em até 24 horas úteis. Valor mínimo R$
                  {MIN_WITHDRAW_AMOUNT}. Taxa: grátis via PIX.
                </div>

                <Button
                  className="w-full gradient-primary border-0 text-black font-black h-12"
                  onClick={handleWithdraw}
                >
                  Solicitar Saque
                </Button>
              </div>
            )}

            {step === "processing" && (
              <div className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="font-bold mb-1">Processando solicitação...</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Aguarde
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 glow-purple"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-xl font-black mb-1">Solicitação Enviada!</p>
                <p className="text-sm text-muted-foreground mb-1">
                  Seu saque de{" "}
                  <span className="text-neon-gold font-bold">
                    R$ {Number(amount).toFixed(2)}
                  </span>{" "}
                  está sendo processado.
                </p>
                <div className="flex items-center justify-center gap-1 mb-6">
                  <Clock className="w-3 h-3 text-neon-gold" />
                  <p className="text-xs text-muted-foreground">
                    Status:{" "}
                    <span className="text-neon-gold font-bold">Pendente</span> ·
                    até 24h
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link to="/dashboard" className="flex-1">
                    <Button className="w-full gradient-primary border-0 text-black font-bold">
                      Ver Histórico
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => {
                      setStep("form");
                      setAmount("");
                      setPixKey("");
                    }}
                  >
                    Novo Saque
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
