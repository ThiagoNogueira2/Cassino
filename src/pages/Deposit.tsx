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

const QUICK_VALUES = [20, 50, 100, 200, 500];
const FAKE_PIX_CODE = "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913NeonBet LTDA6009Sao Paulo62070503***63044F7C";

export default function DepositPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [step, setStep] = useState<"select" | "pix" | "confirming" | "done">("select");
  const [copied, setCopied] = useState(false);

  const { addBalance, addTransaction, balance } = useBalance();
  const { isLoggedIn, openAuth } = useAuth();
  const { toast } = useToast();

  const handleDeposit = () => {
    if (!isLoggedIn) { openAuth("login"); return; }
    if (!amount || Number(amount) < 10) { toast({ title: "Mínimo R$10", variant: "destructive" }); return; }
    setStep("pix");
  };

  const simulatePayment = () => {
    setStep("confirming");
    setTimeout(() => {
      addBalance(Number(amount));
      addTransaction({ type: "deposit", amount: Number(amount), status: "approved", description: "Depósito PIX" });
      setStep("done");
      toast({ title: "✅ Depósito confirmado!", description: `R$ ${Number(amount).toFixed(2)} adicionado ao seu saldo` });
    }, 3000);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(FAKE_PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Código copiado!" });
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

          <h1 className="text-2xl font-black mb-2">💳 Depositar</h1>
          <p className="text-sm text-muted-foreground mb-6">Saldo atual: <span className="text-neon-gold font-bold">R$ {balance.toFixed(2)}</span></p>

          <div className="card-casino rounded-2xl border border-border overflow-hidden">
            {step === "select" && (
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm font-bold mb-3">Escolha o valor</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {QUICK_VALUES.map((v) => (
                      <button key={v} onClick={() => setAmount(v)} className={`py-3 text-sm font-black rounded-xl border transition-all ${amount === v ? "bg-primary border-primary text-white glow-purple" : "bg-secondary border-border hover:border-primary/50"}`}>
                        R${v}
                      </button>
                    ))}
                  </div>
                  <Input type="number" placeholder="Outro valor (mín. R$10)" className="bg-secondary border-border" value={amount} onChange={(e) => setAmount(Number(e.target.value) || "")} />
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

                <Button className="w-full gradient-primary border-0 text-white font-black h-12 glow-purple" onClick={handleDeposit}>
                  Gerar QR Code PIX
                </Button>
              </div>
            )}

            {step === "pix" && (
              <div className="p-6 text-center space-y-4">
                <p className="font-bold">Escaneie o QR Code</p>
                <div className="inline-block p-4 bg-white rounded-xl">
                  <div className="w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2MCIgeT0iMTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2NSIgeT0iMTUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSI3MCIgeT0iMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxMCIgeT0iNjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxNSIgeT0iNjUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyMCIgeT0iNzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI0NSIgeT0iMTAiIHdpZHRoPSI1IiBoZWlnaHQ9IjUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iNDUiIHk9IjIwIiB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjQ1IiB5PSIzNSIgd2lkdGg9IjUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iNjAiIHk9IjUwIiB3aWR0aD0iMTUiIGhlaWdodD0iNSIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI4MCIgeT0iNTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjUwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjMwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjY1IiB5PSI2NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjgwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjY1IiB5PSI4MCIgd2lkdGg9IjI1IiBoZWlnaHQ9IjEwIiBmaWxsPSJibGFjayIvPjwvc3ZnPg==')] bg-cover" />
                </div>
                <p className="text-sm text-muted-foreground">Valor: <span className="text-neon-gold font-black">R$ {Number(amount).toFixed(2)}</span></p>

                <div className="relative">
                  <div className="p-3 bg-secondary rounded-xl border border-border text-xs font-mono text-muted-foreground break-all">
                    {FAKE_PIX_CODE.substring(0, 60)}...
                  </div>
                  <button onClick={copyPix} className="absolute right-2 top-2 p-1.5 hover:bg-primary/20 rounded transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>

                <Button className="w-full bg-neon-green hover:bg-neon-green/90 text-casino-bg font-black border-0" onClick={simulatePayment}>
                  Simular Pagamento ✅
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
                  <Link to="/games/crash" className="flex-1"><Button className="w-full gradient-primary border-0 text-white font-bold">Jogar Agora 🚀</Button></Link>
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
