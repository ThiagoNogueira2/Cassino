import { Link } from "react-router-dom";
import { Menu, Search, Clock3, Bomb, Rocket, Dice4, Sailboat, Building2, ChartNoAxesColumn, Goal, CircleDot, Wallet, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBalance } from "@/context/BalanceContext";
import AuthModal from "@/components/auth/AuthModal";

const sideGames = [
  { label: "Jogado Recentemente", icon: Clock3, href: "/dashboard" },
  { label: "Crash", icon: Bomb, href: "/games/crash" },
  { label: "Double", icon: CircleDot, href: "/games/roulette" },
  { label: "Mines", icon: Rocket, href: "/games/slots" },
  { label: "Dice", icon: Dice4, href: "/games/blackjack" },
  { label: "Limbo", icon: Sailboat, href: "/games/crash" },
  { label: "Tower", icon: Building2, href: "/games/slots" },
  { label: "Slide", icon: ChartNoAxesColumn, href: "/games/crash" },
  { label: "Plinko", icon: Goal, href: "/games/roulette" },
];

const casinoLinks = [
  { label: "Todos os Jogos", href: "/cassino" },
  { label: "Slots", href: "/games/slots" },
  { label: "Cassino Ao Vivo", href: "/games/roulette" },
  { label: "NeonBet Exclusivo", href: "/games/blackjack" },
];

const sponsorCards = [
  {
    title: "AS Monaco",
    subtitle: "Patrocinador Máster",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&h=600&fit=crop&q=80",
  },
  {
    title: "Parceiro Oficial",
    subtitle: "Junte-se à maior plataforma da América Latina",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&h=600&fit=crop&q=80",
  },
  {
    title: "Neymar Jr.",
    subtitle: "Parceiro Oficial",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=600&fit=crop&q=80",
  },
  {
    title: "Atlético Goianiense",
    subtitle: "Patrocinador Máster",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&h=600&fit=crop&q=80",
  },
];

export default function HomePage() {
  const { user, isLoggedIn, openAuth, logout } = useAuth();
  const { balance } = useBalance();

  return (
    <div className="min-h-screen bg-[#071423] text-white">
      <AuthModal />

      <header className="sticky top-0 z-50 h-16 border-b border-[#1e3149] bg-[#08192b]">
        <div className="flex h-full w-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button className="rounded-md p-2 text-slate-300 hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-4xl font-black leading-none text-white">
              NeonBet
            </Link>
            <nav className="ml-8 hidden items-center gap-8 text-xs font-bold uppercase tracking-wide text-slate-300 md:flex">
              <Link className="hover:text-white" to="/cassino">Cassino</Link>
              <a className="hover:text-white" href="#esportes">Esportes</a>
              <a className="flex items-center gap-2 hover:text-white" href="#pesquisa">
                <Search className="h-3.5 w-3.5" /> Pesquisa
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/deposit" className="hidden items-center gap-2 rounded-md border border-[#2a3e58] bg-[#0d2239] px-3 py-2 text-sm font-bold text-slate-100 md:flex">
                  <Wallet className="h-4 w-4 text-[#f02254]" />
                  R$ {Number(balance ?? 0).toFixed(2)}
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 rounded-md border border-[#2a3e58] bg-[#0d2239] px-3 py-2 text-sm font-bold text-slate-100">
                  <User className="h-4 w-4 text-[#f02254]" />
                  {user?.name?.split(" ")[0] || "Conta"}
                </Link>
                <Button variant="ghost" className="text-sm font-bold text-white hover:bg-white/10" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-bold text-white hover:bg-white/10" onClick={() => openAuth("login")}>
                  Entrar
                </Button>
                <Button className="border-0 bg-[#f02254] text-sm font-black text-white hover:bg-[#ff2a60]" onClick={() => openAuth("register")}>
                  Cadastre-se
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex w-full">
        <aside className="hidden w-[230px] shrink-0 border-r border-[#1e3149] bg-[#07172a] lg:block">
          <div className="p-5">
            <p className="mb-5 text-xs font-black uppercase text-slate-300">Originais da NeonBet</p>
            <div className="space-y-1">
              {sideGames.map((item) => (
                <Link key={item.label} to={item.href} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[22px] font-semibold text-slate-300 transition hover:bg-[#0d2239] hover:text-white">
                  <item.icon className="h-4 w-4 text-slate-400" />
                  <span className="text-base">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-7 border-t border-[#1e3149] pt-6">
              <p className="mb-4 text-xs font-black uppercase text-slate-300">Cassino</p>
              <div className="space-y-1">
                {casinoLinks.map((item) => (
                  <Link key={item.label} to={item.href} className="block w-full rounded-md px-2 py-2 text-left text-base font-semibold text-slate-300 transition hover:bg-[#0d2239] hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <section className="relative overflow-hidden rounded-sm border border-[#27384d] bg-[#2e3a48]">
            <img
              src="https://images.unsplash.com/photo-1530751460007-546dc34fc7bf?w=1400&h=700&fit=crop&q=80"
              alt="Banner principal"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#445260]/95 via-[#445260]/90 to-[#0e2239]/80" />
            <div className="relative z-10 grid gap-4 p-6 md:grid-cols-2 md:p-8">
              <div>
                <h1 className="text-4xl font-black">Bem-vindo ao NeonBet!</h1>
                <p className="mt-4 text-2xl font-semibold text-slate-100">Cadastre-se e desbloqueie sua experiência exclusiva</p>
                <Button className="mt-8 border-0 bg-[#f02254] px-8 font-black uppercase hover:bg-[#ff2a60]" onClick={() => openAuth("register")}>
                  Cadastre-se
                </Button>
                <div className="mt-12 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-200">
                  <span>Cadastre-se</span>
                  <span className="text-[#f02254]">›</span>
                  <span>Deposite</span>
                  <span className="text-[#f02254]">›</span>
                  <span>Jogue</span>
                  <span className="text-[#f02254]">›</span>
                  <span>Desbloqueie sua Recompensa</span>
                </div>
              </div>
              <div className="flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1616805765352-beedbad46b2a?w=700&h=500&fit=crop&q=80"
                  alt="Imagem promocional"
                  className="hidden h-[300px] w-[460px] object-cover md:block"
                />
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="relative overflow-hidden rounded-sm border border-[#233750] bg-[#1b2b3d] p-6">
              <img src="https://images.unsplash.com/photo-1596838132731-3301c3ef77e4?w=900&h=450&fit=crop&q=80" alt="Cassino" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b2b3d] via-[#1b2b3d]/95 to-[#1b2b3d]/50" />
              <div className="relative z-10 max-w-xs">
                <h2 className="text-5xl font-black">Cassino</h2>
                <p className="mt-3 text-sm text-slate-200">Aproveite nossa seleção exclusiva de slots, dealers ao vivo e jogos originais.</p>
                <Link to="/cassino">
                  <Button className="mt-8 border-0 bg-[#f02254] px-8 font-black uppercase hover:bg-[#ff2a60]">Ir ao Cassino</Button>
                </Link>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-sm border border-[#233750] bg-[#1b2b3d] p-6">
              <img src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=900&h=450&fit=crop&q=80" alt="Esportes" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b2b3d] via-[#1b2b3d]/95 to-[#1b2b3d]/50" />
              <div className="relative z-10 max-w-xs">
                <h2 className="text-5xl font-black">Esportes</h2>
                <p className="mt-3 text-sm text-slate-200">Nossas apostas esportivas intuitivas sao feitas para jogadores novos e experientes.</p>
                <Button className="mt-8 border-0 bg-[#f02254] px-8 font-black uppercase hover:bg-[#ff2a60]">Ir para Esportes</Button>
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-sm border border-[#1d3047] bg-[#071a2f] py-5 text-center">
            <p className="text-xs font-black uppercase text-slate-300">Metodo de pagamento preferido</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <span className="text-5xl font-black tracking-widest text-slate-100">pix</span>
              <Button className="border-0 bg-[#f02254] px-8 font-black uppercase hover:bg-[#ff2a60]">
                <Wallet className="h-4 w-4" />
                Faca o Deposito
              </Button>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {sponsorCards.map((card) => (
              <article key={card.title} className="relative h-56 overflow-hidden rounded-sm border border-[#26384d]">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3f4b59]/90 via-[#3f4b59]/70 to-transparent" />
                <div className="absolute left-0 top-0 p-6">
                  <span className="rounded bg-white px-2 py-1 text-[10px] font-black uppercase text-[#0f2238]">Patrocinio</span>
                  <h3 className="mt-4 text-4xl font-black">{card.title}</h3>
                  <p className="mt-2 max-w-xs text-sm font-semibold text-slate-100">{card.subtitle}</p>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
