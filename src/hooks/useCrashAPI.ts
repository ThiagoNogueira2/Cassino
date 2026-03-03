import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface CrashHistory {
  id: string;
  multiplier: number;
  timestamp: string;
  hash?: string;
}

interface CrashCurrentState {
  status: "waiting" | "flying" | "crashed" | "betting";
  multiplier: number;
  countdown: number | null;
  roundId?: string;
}

interface PlaceBetResponse {
  message: string;
  betId: string;
  newBalance: number;
}

interface CashoutResponse {
  message: string;
  winAmount: number;
  multiplier: number;
  newBalance: number;
}

export function useCrashAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentState = useCallback(async (): Promise<CrashCurrentState | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/games/crash/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch current state");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    }
  }, []);

  const getHistory = useCallback(async (limit = 15): Promise<CrashHistory[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/games/crash/history?limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return [];
    }
  }, []);

  const placeBet = useCallback(
    async (amount: number): Promise<PlaceBetResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/games/crash/bet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to place bet");
        }

        toast({
          title: "Aposta registrada!",
          description: `R$ ${amount.toFixed(2)} apostado`,
        });

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to place bet";
        setError(errorMessage);
        toast({
          title: "Erro ao apostar",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const cashout = useCallback(
    async (betId: string): Promise<CashoutResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/games/crash/cashout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ betId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to cashout");
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to cashout";
        setError(errorMessage);
        toast({
          title: "Erro ao retirar",
          description: errorMessage,
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    loading,
    error,
    getCurrentState,
    getHistory,
    placeBet,
    cashout,
  };
}
