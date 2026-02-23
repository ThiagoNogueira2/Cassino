import { Link, useLocation } from "react-router-dom";
import { Home, Gamepad2, Wallet, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Carteira", href: "/deposit", icon: Wallet },
  { label: "Perfil", href: "/dashboard", icon: User },
];

const adminItems = [
  { label: "Admin", href: "/admin", icon: Shield },
  { label: "Usuários", href: "/admin/users", icon: User },
  { label: "Carteira", href: "/deposit", icon: Wallet },
];

export default function BottomNav() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const navItems = isAdmin ? adminItems : items;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 transition-all" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
