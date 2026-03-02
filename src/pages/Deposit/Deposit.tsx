import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { useBalance } from "@/context/BalanceContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { wallet } from "@/lib/api";
import type { DepositStep } from "./types";
import { QUICK_VALUES, MIN_DEPOSIT_AMOUNT } from "./constants";

export default function DepositPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [step, setStep] = useState<DepositStep>("select");
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<{ id: string; pixCode: string; qrCodeBase64: string } | null>(null);

  const { balance, addBalance, addTransaction } = useBalance();
  const { isLoggedIn, openAuth, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!isLoggedIn) { openAuth("login"); return; }
    if (!amount || Number(amount) < MIN_DEPOSIT_AMOUNT) { toast({ title: `Mínimo R$${MIN_DEPOSIT_AMOUNT}`, variant: "destructive" }); return; }
    try {
      const res = await wallet.deposit(Number(amount));
      setPixData({ id: res.id, pixCode: res.pixCode, qrCodeBase64: res.qrCodeBase64 });
      setStep("pix");
    } catch {
      toast({ title: "Erro ao gerar PIX", variant: "destructive" });
    }
  };

  const simulatePayment = async () => {
    if (!pixData) return;
    setStep("confirming");
    const poll = async () => {
      const res = await wallet.depositStatus(pixData.id);
      if (res.status === "approved") {
        addBalance(Number(amount));
        addTransaction({ type: "deposit", amount: Number(amount), status: "approved", description: "Depósito PIX" });
        setStep("done");
        toast({ title: "Depósito confirmado!", description: `R$ ${Number(amount).toFixed(2)} adicionado ao seu saldo` });
        refreshUser();
        return;
      }
      setTimeout(poll, 2000);
    };
    setTimeout(poll, 2000);
  };

  const copyPix = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Código copiado!" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />
      <div className="pt-16 pb-20 md:pb-4">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <h1 className="text-2xl font-black mb-2">Depositar</h1>
          <p className="text-sm text-muted-foreground mb-6">Saldo atual: <span className="text-neon-gold font-bold">R$ {balance.toFixed(2)}</span></p>

          <div className="card-casino rounded-2xl border border-border overflow-hidden">
            {step === "select" && (
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm font-bold mb-3">Escolha o valor</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {QUICK_VALUES.map((v) => (
                      <button key={v} onClick={() => setAmount(v)} className={`py-3 text-sm font-black rounded-xl border transition-all ${amount === v ? "bg-primary border-primary text-black" : "bg-secondary border-border hover:border-primary/50"}`}>
                        R${v}
                      </button>
                    ))}
                  </div>
                  <Input type="number" placeholder={`Outro valor (mín. R$${MIN_DEPOSIT_AMOUNT})`} className="bg-secondary border-border" value={amount} onChange={(e) => setAmount(Number(e.target.value) || "")} />
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-neon-green/20 rounded-xl flex items-center justify-center text-xl">⚡</div>
                    <div>
                      <p className="font-bold text-sm">PIX</p>
                      <p className="text-xs text-muted-foreground">Instantâneo · Sem taxas</p>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                <Button className="w-full gradient-primary border-0 text-black font-black h-12" onClick={handleDeposit}>
                  Gerar QR Code PIX
                </Button>
              </div>
            )}

            {step === "pix" && pixData && (
              <div className="p-6 text-center space-y-4">
                <p className="font-bold">Escaneie o QR Code</p>
                <div className="inline-block p-4 bg-white rounded-xl">
                  <img src={pixData.qrCodeBase64} alt="QR PIX" className="w-48 h-48" />
                </div>
                <p className="text-sm text-muted-foreground">Valor: <span className="text-neon-gold font-black">R$ {Number(amount).toFixed(2)}</span></p>

                <div className="relative">
                  <div className="p-3 bg-secondary rounded-xl border border-border text-xs font-mono text-muted-foreground break-all">
                    {pixData.pixCode}
                  </div>
                  <button onClick={copyPix} className="absolute right-2 top-2 p-1.5 hover:bg-primary/20 rounded transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>

                <Button className="w-full bg-neon-green hover:bg-neon-green/90 text-casino-bg font-black border-0" onClick={simulatePayment}>
                  Simular Pagamento
                </Button>
                <button onClick={() => setStep("select")} className="text-sm text-muted-foreground hover:text-foreground">Voltar</button>
              </div>
            )}

            {step === "confirming" && (
              <div className="p-12 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="font-bold mb-1">Confirmando pagamento...</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Aguarde alguns segundos</p>
              </div>
            )}

            {step === "done" && (
              <div className="p-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 glow-green">
                  <CheckCircle2 className="w-8 h-8 text-neon-green" />
                </motion.div>
                <p className="text-xl font-black text-neon-green mb-1">Depósito Confirmado!</p>
                <p className="text-sm text-muted-foreground mb-2">R$ {Number(amount).toFixed(2)} adicionado ao seu saldo</p>
                <p className="text-sm font-bold text-neon-gold mb-6">Novo saldo: R$ {balance.toFixed(2)}</p>
                <div className="flex gap-3">
                  <Link to="/games/crash" className="flex-1"><Button className="w-full gradient-primary border-0 text-black font-bold">Jogar Agora 🚀</Button></Link>
                  <Button variant="outline" className="border-border" onClick={() => { setStep("select"); setAmount(""); }}>Novo Depósito</Button>
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
