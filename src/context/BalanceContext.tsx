import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { type BetHistory, type Transaction } from "@/mock/data";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (user == null) {
      setBalance(0);
      lastUserId.current = null;
      return;
    }
    if (lastUserId.current !== user.id) {
      lastUserId.current = user.id;
      setBalance(Number(user.balance ?? 0));
    }
  }, [user?.id]);

  const addBalance = useCallback((amount: number) => {
    setBalance((b) => b + amount);
  }, []);

  const subtractBalance = useCallback((amount: number): boolean => {
    let hasEnoughBalance = true;
    setBalance((b) => {
      if (b < amount) {
        hasEnoughBalance = false;
        return b;
      }
      return b - amount;
    });
    return hasEnoughBalance;
  }, []);

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
