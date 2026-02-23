import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import AdminLayout from "./AdminLayout";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  balance: number;
  level: string;
  role: string;
  joinedAt: string;
}

const chartConfig = {
  users: { label: "Usuários", color: "#f02254" },
  total: { label: "Total", color: "#12e7b2" },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "checking">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/admin/users", true);
        if (!cancelled && res.data) {
          setUsers(res.data);
          setTotalUsers(res.total ?? res.data.length);
        }
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await api.get("/health", false);
        if (!cancelled) setApiStatus("ok");
      } catch {
        if (!cancelled) setApiStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBalance = users.reduce((s, u) => s + Number(u.balance || 0), 0);
  const recentUsers = [...users].slice(0, 8);
  const adminCount = users.filter((u) => u.role === "admin").length;


  const now = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    d.setHours(23, 59, 59, 999);
    const dayStr = d.toISOString().slice(0, 10);
    const count = users.filter(
      (u) => u.joinedAt && u.joinedAt.startsWith(dayStr),
    ).length;
    const totalUpToDay = users.filter((u) => {
      if (!u.joinedAt) return false;
      const ju = new Date(u.joinedAt);
      return ju <= d;
    }).length;
    return {
      day: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()],
      users: count,
      total: totalUpToDay,
    };
  });

  const kpis = [
    {
      label: "Total de usuários",
      value: loading ? "—" : totalUsers.toLocaleString("pt-BR"),
      sub: adminCount > 0 ? `${adminCount} admin(s)` : null,
      color: "from-[#f02254] to-[#ff6b8a]",
      bg: "bg-[#f02254]/10",
      trend: null,
    },
    {
      label: "Saldo na plataforma",
      value: loading
        ? "—"
        : `R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      sub: null,
      color: "from-emerald-500 to-teal-400",
      bg: "bg-emerald-500/10",
      trend: "up",
    },
    {
      label: "Novos (últimos 7 dias)",
      value: loading
        ? "—"
        : chartData.reduce((s, d) => s + d.users, 0).toString(),
      sub: null,
      color: "from-amber-500 to-orange-400",
      bg: "bg-amber-500/10",
      trend: null,
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Visão geral do sistema e métricas em tempo real."
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              variants={item}
              className={cn(
                "rounded-2xl border border-white/10 bg-[#0d2239]/80 p-5 backdrop-blur-sm transition hover:border-white/20 hover:shadow-lg hover:shadow-[#f02254]/5",
              )}
            >
              <p className="text-2xl font-black text-white">{kpi.value}</p>
              <p className="text-sm text-slate-400">{kpi.label}</p>
              {kpi.sub && (
                <p className="mt-1 text-xs text-slate-500">{kpi.sub}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            variants={item}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0d2239]/80 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#f02254]" /> Atividade
                (últimos 7 dias)
              </h3>
            </div>
            <div className="h-[260px]">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full aspect-auto"
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f02254" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f02254" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#f02254"
                    strokeWidth={2}
                    fill="url(#fillUsers)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <h3 className="font-bold text-white">Ações rápidas</h3>
            <Link to="/admin/users">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#f02254]/30 hover:bg-white/10">
                <div>
                  <p className="font-semibold text-white">Gerenciar usuários</p>
                  <p className="text-xs text-slate-400">Ver lista completa</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </div>
            </Link>
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 opacity-70">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-500/20 p-2">
                  <Activity className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Relatórios</p>
                  <p className="text-xs text-slate-500">Em breve</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="rounded-2xl border border-white/10 bg-[#0d2239]/80 overflow-hidden backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h3 className="font-bold text-white">Últimos usuários</h3>
            <Link to="/admin/users">
              <Button
                size="sm"
                variant="ghost"
                className="text-[#f02254] hover:bg-[#f02254]/10"
              >
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                Carregando...
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="px-6 py-3 font-semibold">Nome</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Nível</th>
                    <th className="px-6 py-3 font-semibold">Saldo</th>
                    <th className="px-6 py-3 font-semibold">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-3 font-medium text-white">
                        {u.name}
                      </td>
                      <td className="px-6 py-3 text-slate-300">{u.email}</td>
                      <td className="px-6 py-3 text-slate-300">{u.level}</td>
                      <td className="px-6 py-3 font-medium text-emerald-400">
                        R$ {Number(u.balance).toFixed(2)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-bold",
                            u.role === "admin"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-slate-500/20 text-slate-400",
                          )}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
