import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { api } from "@/lib/api";
import { formatCurrencyBRL, formatDateTimeBR } from "@/lib/format";
import { AdminTransactionsFilters } from "./components/AdminTransactionsFilters";
import {
  TransactionStatusBadge,
  TransactionTypeBadge,
} from "./components/AdminTransactionBadges";

interface AdminUserInfo {
  id: number;
  name: string;
  email: string;
}

interface AdminTransaction {
  id: string | number;
  type: "deposit" | "withdraw" | "win" | string;
  amount: number;
  date: string;
  status: "approved" | "pending" | "rejected" | string;
  description: string;
  user: AdminUserInfo;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get("/admin/transactions", true)
      .then(
        (
          res:
            | AdminTransaction[]
            | {
                data?: AdminTransaction[];
              },
        ) => {
          const list = Array.isArray(res) ? res : (res.data ?? []);
          setTransactions(list);
        },
      )
      .catch((e: { data?: { message?: string } }) => {
        setError(e?.data?.message || "Erro ao carregar transações.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((t) => {
    if (
      typeFilter !== "all" &&
      String(t.type).toLowerCase() !== typeFilter.toLowerCase()
    ) {
      return false;
    }
    if (
      statusFilter !== "all" &&
      String(t.status).toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      const haystack = [
        t.description,
        t.user?.name,
        t.user?.email,
        String(t.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    }
    return true;
  });

  const formatAmount = (t: AdminTransaction) => {
    const prefix = t.type === "withdraw" ? "-" : "+";
    const value = Math.abs(Number(t.amount) || 0);
    return `${prefix}${formatCurrencyBRL(value)}`;
  };

  return (
    <AdminLayout
      title="Transações"
      subtitle="Visão geral de depósitos, saques e ganhos dos usuários."
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <AdminTransactionsFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d2239]/80 backdrop-blur-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#f02254]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                    <th className="px-6 py-3 font-semibold">ID</th>
                    <th className="px-6 py-3 font-semibold">Usuário</th>
                    <th className="px-6 py-3 font-semibold hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-6 py-3 font-semibold">Tipo</th>
                    <th className="px-6 py-3 font-semibold">Valor</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold hidden md:table-cell">
                      Data
                    </th>
                    <th className="px-6 py-3 font-semibold hidden lg:table-cell">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-3 text-xs text-slate-300">
                        {t.id}
                      </td>
                      <td className="px-6 py-3 font-medium text-white">
                        {t.user?.name ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-300 hidden md:table-cell">
                        {t.user?.email ?? "—"}
                      </td>
                      <td className="px-6 py-3">
                        <TransactionTypeBadge type={t.type} />
                      </td>
                      <td className="px-6 py-3 font-semibold text-emerald-300">
                        {formatAmount(t)}
                      </td>
                      <td className="px-6 py-3">
                        <TransactionStatusBadge status={t.status} />
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-300 hidden md:table-cell">
                        {formatDateTimeBR(t.date)}
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-300 hidden lg:table-cell">
                        {t.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="py-14 text-center text-slate-500">
              Nenhuma transação encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}

