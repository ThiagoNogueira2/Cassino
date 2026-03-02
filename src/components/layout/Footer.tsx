import { Link } from "react-router-dom";
import { Zap, Instagram, Twitter, Youtube, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider">
                NEON<span className="text-primary">BET</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A plataforma de jogos online mais emocionante do Brasil. Jogue com responsabilidade.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Games */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Jogos</h4>
            <ul className="space-y-2">
              {["Crash", "Slot Machine", "Roleta", "Blackjack", "Plinko", "Dice"].map((g) => (
                <li key={g}>
                  <Link to={`/games/${g.toLowerCase().replace(" ", "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Suporte</h4>
            <ul className="space-y-2">
              {["Central de Ajuda", "Chat ao Vivo", "FAQ", "Termos de Uso", "Privacidade", "Afiliados"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Pagamentos</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {["PIX", "Cartão", "Cripto", "TED"].map((pay) => (
                <span key={pay} className="px-3 py-1.5 text-xs font-bold bg-white/5 rounded-lg border border-border">
                  {pay}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-border">
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Site licenciado e regulamentado. Jogue com responsabilidade. Proibido para menores de 18 anos.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 NeonBet. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Licença regulamentada · +18 anos · Jogo Responsável
          </div>
        </div>
      </div>
    </footer>
  );
}
