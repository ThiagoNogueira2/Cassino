import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, User, LogOut, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBalance } from "@/context/BalanceContext";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Jogos", href: "/cassino" },
  { label: "Promoções", href: "/#promotions" },
  { label: "Depositar", href: "/deposit" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, openAuth, logout } = useAuth();
  const { balance } = useBalance();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-foreground tracking-wider">
            NEON<span className="text-primary">BET</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Balance */}
              <Link to="/deposit" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-border hover:border-primary/30 transition-all">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">
                  R$ {balance.toFixed(2)}
                </span>
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                    {user?.avatar}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-foreground">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl overflow-hidden border border-border"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-semibold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.level}</p>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { navigate("/dashboard"); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                          <User className="w-4 h-4" /> Meu Perfil
                        </button>
                        <button onClick={() => { navigate("/deposit"); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors">
                          <Wallet className="w-4 h-4" /> Carteira
                        </button>
                        <hr className="border-border my-1" />
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-white/5 rounded-lg transition-colors">
                          <LogOut className="w-4 h-4" /> Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => openAuth("login")}>
                Entrar
              </Button>
              <Button size="sm" className="gradient-primary border-0 text-white font-bold" onClick={() => openAuth("register")}>
                Cadastrar
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <div className="flex items-center gap-2 px-4 py-3 mt-2 bg-white/5 rounded-lg">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">R$ {balance.toFixed(2)}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
