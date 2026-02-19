import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { mockCrashHistory } from "@/mock/data";
import GameCard from "@/components/home/GameCard";
import WinnersTicker from "@/components/home/WinnersTicker";
import { mockGames, mockPromotions, mockRanking } from "@/mock/data";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import AuthModal from "@/components/auth/AuthModal";
import { ApiHealthTest } from "@/components/ApiHealthTest";

// Live crash multiplier preview
function LiveCrashPreview() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [phase, setPhase] = useState<"waiting" | "flying" | "crashed">("waiting");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    if (phase === "waiting") {
      setCountdown(5);
      setMultiplier(1.0);
      setCrashed(false);
      interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            setPhase("flying");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else if (phase === "flying") {
      const crashAt = 1.5 + Math.random() * 18;
      interval = setInterval(() => {
        setMultiplier((m) => {
          const next = m + m * 0.04;
          if (next >= crashAt) {
            clearInterval(interval);
            setCrashed(true);
            setPhase("crashed");
            timer = setTimeout(() => setPhase("waiting"), 3000);
            return next;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]);

  return (
    <div className="rounded-2xl p-6 flex flex-col items-center gap-4 bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all">
      <div className="flex items-center gap-2 self-start">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-xs font-bold text-primary uppercase">AO VIVO</span>
        <span className="text-xs text-muted-foreground">Crash</span>
      </div>

      <div className={`text-6xl font-black transition-colors duration-300 ${crashed ? "text-destructive" : "text-primary"}`}>
        {phase === "waiting" ? (
          <span className="text-muted-foreground text-4xl">Próxima em {countdown}s</span>
        ) : (
          <span>{multiplier.toFixed(2)}x</span>
        )}
      </div>

      {crashed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-black text-destructive"
        >
          💥 CRASH!
        </motion.div>
      )}

      {phase === "flying" && !crashed && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-4xl"
        >
          🚀
        </motion.div>
      )}

      <Link to="/games/crash" className="w-full">
        <Button className="w-full gradient-primary border-0 text-white font-bold">
          Jogar Agora <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>

      {/* Recent rounds */}
      <div className="w-full">
        <p className="text-xs text-muted-foreground mb-2">Últimas rodadas:</p>
        <div className="flex flex-wrap gap-1.5">
          {mockCrashHistory.slice(0, 10).map((r, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded text-xs font-bold ${r.multiplier >= 2 ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}
            >
              {r.multiplier.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { openAuth, isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthModal />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596838132731-3301c3ef77e4?w=1920&h=1080&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  🔥 1.247 jogadores online
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                Sinta a{" "}
                <span className="text-primary">emoção</span>
                <br />
                de <span className="text-primary">ganhar</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                O cassino online mais completo do Brasil. Crash, Slots, Roleta e muito mais.
                Bônus de até <strong className="text-primary">R$ 500</strong> no primeiro depósito!
              </p>

              <div className="flex flex-wrap gap-3">
                {!isLoggedIn ? (
                  <>
                    <Button
                      size="lg"
                      className="gradient-primary border-0 text-white font-black text-base px-8"
                      onClick={() => openAuth("register")}
                    >
                      <Zap className="w-5 h-5" />
                      Criar Conta Grátis
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-border hover:border-primary/50 text-foreground font-bold bg-white/5 hover:bg-white/10"
                      onClick={() => openAuth("login")}
                    >
                      Entrar
                    </Button>
                  </>
                ) : (
                  <Link to="/games/crash">
                    <Button size="lg" className="gradient-primary border-0 text-white font-black text-base px-8">
                      <Zap className="w-5 h-5" />
                      Jogar Agora
                    </Button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { label: "Jogadores", value: "50K+" },
                  { label: "Pagamentos/dia", value: "R$2M+" },
                  { label: "Jogos", value: "200+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LiveCrashPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Winners Ticker */}
      <WinnersTicker />

      {/* Popular Games */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black">🔥 Mais Jogados</h2>
            <p className="text-sm text-muted-foreground mt-1">Os favoritos da comunidade</p>
          </div>
          <Link to="/games/crash" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockGames.filter(g => g.isPopular).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* Promotions */}
      <section id="promotions" className="bg-secondary/30 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black">🎁 Promoções</h2>
              <p className="text-sm text-muted-foreground mt-1">Ofertas exclusivas para você</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockPromotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-xl h-56 cursor-pointer group"
              >
                {/* Background Image */}
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

                <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                  <div className="text-3xl mb-2">{promo.emoji}</div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded-full text-sm font-black text-white backdrop-blur-sm">
                    {promo.bonus}
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{promo.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{promo.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    ⏱ Expira em {promo.expiresIn}
                  </div>
                  <Button className="w-full mt-3 bg-white/10 hover:bg-white/20 border-0 text-foreground text-xs font-bold backdrop-blur-sm" size="sm">
                    Resgatar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Games */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black">✨ Novos Jogos</h2>
            <p className="text-sm text-muted-foreground mt-1">Acabaram de chegar</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockGames.filter(g => g.isNew).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* Ranking */}
      <section className="bg-secondary/30 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-black">🏆 Ranking Semanal</h2>
            <p className="text-sm text-muted-foreground mt-1">Os maiores vencedores desta semana</p>
          </div>
          <div className="max-w-lg">
            {mockRanking.map((player, i) => (
              <motion.div
                key={player.position}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl mb-2 bg-card border border-border hover:border-primary/20 transition-all"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${i === 0 ? "bg-primary text-white" : i === 1 ? "bg-primary/60 text-white" : i === 2 ? "bg-primary/40 text-white" : "bg-secondary text-muted-foreground"}`}>
                  {player.position}
                </div>
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.games} jogos</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary text-sm">+R$ {player.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-muted-foreground">lucro</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Bonus Banner */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl text-center"
        >
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=1200&h=500&fit=crop&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/90" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-3xl font-black mb-2">Bônus Diário</h2>
            <p className="text-muted-foreground mb-6">Entre todo dia e ganhe recompensas exclusivas!</p>
            <div className="flex justify-center gap-4 mb-6">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day, i) => (
                <div key={day} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-primary text-white" : "bg-white/5 border border-border text-muted-foreground"}`}>
                  {day}
                </div>
              ))}
            </div>
            <Button className="gradient-primary border-0 text-white font-black px-8 py-3">
              Resgatar Bônus de Hoje
            </Button>
          </div>
        </motion.div>
      </section>
      {/* API Health Test */}
      <section className="bg-slate-900 border-b border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <ApiHealthTest />
        </div>
      </section>
      <Footer />
      <BottomNav />
    </div>
  );
}
