import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Usuários", href: "/admin/users", icon: Users },
  { label: "Relatórios", href: "/admin/reports", icon: BarChart3 },
  { label: "Configurações", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050d18] text-white flex">
 
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#071423]/95 backdrop-blur-xl">
        <div className="flex h-full flex-col">
          <Link
            to="/admin"
            className="flex items-center gap-3 border-b border-white/10 px-6 py-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f02254] to-[#ff6b8a] shadow-lg shadow-[#f02254]/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight">
                NEON<span className="text-[#f02254]">BET</span>
              </span>
              <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Admin
              </span>
            </div>
          </Link>

          <nav className="flex-1 space-y-0.5 p-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              const disabled = item.href === "/admin/reports" || item.href === "/admin/settings";
              return (
                <Link
                  key={item.href}
                  to={disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    disabled && "pointer-events-none opacity-50",
                    isActive
                      ? "bg-[#f02254]/20 text-white shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 text-[#f02254]" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-600/20">
                <Shield className="h-4 w-4 text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </aside>

     
      <div className="flex-1 pl-64">
        {(title || subtitle) && (
          <div className="border-b border-white/10 bg-[#071423]/50 px-8 py-6">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black tracking-tight text-white"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="mt-1 text-sm text-slate-400"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
