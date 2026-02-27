export const formatCurrencyBRL = (value: number): string => {
  const n = Number(value || 0);
  return `R$ ${n.toFixed(2)}`;
};

export const formatDateTimeBR = (iso: string): string => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR");
  } catch {
    return iso;
  }
};

