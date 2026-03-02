import { cn } from "@/lib/utils";

type TransactionType = "deposit" | "withdraw" | "win" | string;
type TransactionStatus = "approved" | "pending" | "rejected" | string;

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize",
        type === "deposit"
          ? "bg-emerald-500/15 text-emerald-300"
          : type === "withdraw"
            ? "bg-red-500/15 text-red-300"
            : "bg-indigo-500/15 text-indigo-300",
      )}
    >
      {type}
    </span>
  );
}

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const label =
    status === "approved"
      ? "Aprovado"
      : status === "pending"
        ? "Pendente"
        : status === "rejected"
          ? "Recusado"
          : status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        status === "approved"
          ? "bg-emerald-500/15 text-emerald-300"
          : status === "pending"
            ? "bg-amber-500/15 text-amber-300"
            : "bg-red-500/15 text-red-300",
      )}
    >
      {label}
    </span>
  );
}

