import React, { createContext, useContext, useState, useCallback } from "react";
import { mockBetHistory, mockTransactions, type BetHistory, type Transaction } from "@/mock/data";

interface BalanceContextType {
  balance: number;
  betHistory: BetHistory[];
  transactions: Transaction[];
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => boolean;
  addBet: (bet: Omit<BetHistory, "id" | "date">) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
}

const BalanceContext = createContext<BalanceContextType | null>(null);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(1250.75);
  const [betHistory, setBetHistory] = useState<BetHistory[]>(mockBetHistory);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addBalance = useCallback((amount: number) => {
    setBalance((b) => b + amount);
  }, []);

  const subtractBalance = useCallback((amount: number): boolean => {
    setBalance((b) => {
      if (b < amount) return b;
      return b - amount;
    });
    return balance >= amount;
  }, [balance]);

  const addBet = useCallback((bet: Omit<BetHistory, "id" | "date">) => {
    const newBet: BetHistory = {
      ...bet,
      id: `b-${Date.now()}`,
      date: new Date().toLocaleString("pt-BR"),
    };
    setBetHistory((prev) => [newBet, ...prev]);
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "date">) => {
    const newTx: Transaction = {
      ...tx,
      id: `t-${Date.now()}`,
      date: new Date().toLocaleString("pt-BR"),
    };
    setTransactions((prev) => [newTx, ...prev]);
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, betHistory, transactions, addBalance, subtractBalance, addBet, addTransaction }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error("useBalance must be used within BalanceProvider");
  return ctx;
};
