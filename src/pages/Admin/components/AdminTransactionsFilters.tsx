import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminTransactionsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function AdminTransactionsFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: AdminTransactionsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Buscar por usuário, email, descrição ou ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-[#f02254]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Filtros
          </span>
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-9 w-32 border-white/10 bg-white/5 text-xs text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0d2239] text-xs text-white">
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="deposit">Depósitos</SelectItem>
              <SelectItem value="withdraw">Saques</SelectItem>
              <SelectItem value="win">Ganhos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9 w-32 border-white/10 bg-white/5 text-xs text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0d2239] text-xs text-white">
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="rejected">Recusado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

