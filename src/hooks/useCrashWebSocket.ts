import { useEffect, useRef, useCallback } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Declare Pusher globally for Laravel Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

// Initialize Pusher globally
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

interface UseCrashWebSocketOptions {
  onRoundStart?: () => void;
  onMultiplierUpdate?: (multiplier: number) => void;
  onRoundCrash?: (multiplier: number) => void;
  onCountdown?: (seconds: number) => void;
  onPlayerCashout?: (data: { playerId: string; multiplier: number }) => void;
  enabled?: boolean;
}

interface CrashGameState {
  status: "waiting" | "flying" | "crashed" | "betting";
  multiplier: number;
  countdown: number | null;
  roundId: string | null;
}

export function useCrashWebSocket(options: UseCrashWebSocketOptions = {}) {
  const {
    onRoundStart,
    onMultiplierUpdate,
    onRoundCrash,
    onCountdown,
    onPlayerCashout,
    enabled = true,
  } = options;

  const echoRef = useRef<Echo | null>(null);
  const stateRef = useRef<CrashGameState>({
    status: "waiting",
    multiplier: 1,
    countdown: null,
    roundId: null,
  });
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef<{ [key: string]: number }>({});
  const currentRoundIdRef = useRef<string | null>(null);

  // Refs to hold current callbacks to avoid reconnecting when they change
  const callbacksRef = useRef({
    onRoundStart,
    onMultiplierUpdate,
    onRoundCrash,
    onCountdown,
    onPlayerCashout,
  });

  useEffect(() => {
    callbacksRef.current = {
      onRoundStart,
      onMultiplierUpdate,
      onRoundCrash,
      onCountdown,
      onPlayerCashout,
    };
  }, [onRoundStart, onMultiplierUpdate, onRoundCrash, onCountdown, onPlayerCashout]);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Disconnect existing connection
    if (echoRef.current) {
      echoRef.current.disconnect();
      echoRef.current = null;
    }

    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Get token for private channels if needed
    const token = localStorage.getItem("token");

    console.log("[Crash WS] Initializing connection...", {
      host: import.meta.env.VITE_REVERB_HOST || "localhost",
      port: import.meta.env.VITE_REVERB_PORT || 6003,
      key: import.meta.env.VITE_PUSHER_APP_KEY || "crash-game-key",
    });

    // Initialize Laravel Echo with Pusher (compatible with Reverb)
    const pusherClient = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY || "crash-game-key", {
      wsHost: import.meta.env.VITE_REVERB_HOST || "localhost",
      wsPort: import.meta.env.VITE_REVERB_PORT || 6003,
      wssPort: import.meta.env.VITE_REVERB_PORT || 6003,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      enabledTransports: ["ws"],
      cluster: "mt1",
      pongTimeout: 5000,
      activityTimeout: 10000,
    });

    const echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_PUSHER_APP_KEY || "crash-game-key",
      wsHost: import.meta.env.VITE_REVERB_HOST || "localhost",
      wsPort: import.meta.env.VITE_REVERB_PORT || 6003,
      wssPort: import.meta.env.VITE_REVERB_PORT || 6003,
      forceTLS: false,
      encrypted: false,
      disableStats: true,
      enabledTransports: ["ws"],
      cluster: "mt1",
      client: pusherClient,
      authEndpoint: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
        },
      },
    });

    echoRef.current = echo;

    // Subscribe to crash-game channel (public channel)
    const channel = echo.channel("crash-game");

    // Connection event handlers
    pusherClient.connection.bind("connected", () => {
      console.log("[Crash WS] Connected successfully");
    });

    pusherClient.connection.bind("disconnected", () => {
      console.log("[Crash WS] Disconnected");
    });

    pusherClient.connection.bind("error", (error: any) => {
      console.error("[Crash WS] Connection error:", error);
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("[Crash WS] Attempting to reconnect...");
        connect();
      }, 3000);
    });

    const handleGameUpdate = (event: { type: string; data: unknown }) => {
      // Log do evento bruto para depuração
      console.log("[Crash WS] Raw event received:", event);

      // O evento do Laravel terá as propriedades públicas da classe do evento.
      // No nosso caso, `CrashUpdate` tem `type` e `data`.
      const type = event.type;
      const data = event.data;

      if (!type) {
        console.warn("[Crash WS] Event received, but 'type' property is missing.", event);
        return;
      }

      // Debounce: ignorar eventos muito rápidos (< 50ms)
      const now = Date.now();
      const lastTime = lastEventTimeRef.current[type] || 0;
      if (now - lastTime < 50) {
        console.log(`[Crash WS] Debouncing ${type} event (too fast)`);
        return;
      }
      lastEventTimeRef.current[type] = now;

      const callbacks = callbacksRef.current;

      switch (type) {
        case "status":
          {
            const payload = data as { status: CrashGameState["status"]; roundId?: string };
            console.log("[Crash WS] Status event:", payload);
            
            // Se mudou o roundId, resetar estado
            if (payload.roundId && payload.roundId !== currentRoundIdRef.current) {
              console.log("[Crash WS] New round started:", payload.roundId);
              currentRoundIdRef.current = payload.roundId;
              stateRef.current.multiplier = 1;
              stateRef.current.countdown = null;
              stateRef.current.status = payload.status;
              
              if (payload.status === "betting") {
                callbacks.onRoundStart?.();
              }
              return;
            }
            
            // Only process if status actually changed
            if (stateRef.current.status !== payload.status) {
              stateRef.current.status = payload.status;
              if (payload.roundId) {
                stateRef.current.roundId = payload.roundId;
              }
              if (payload.status === "betting") {
                callbacks.onRoundStart?.();
              } else if (payload.status === "waiting") {
                // Reset state when waiting
                stateRef.current.multiplier = 1;
                stateRef.current.countdown = null;
              }
            }
          }
          break;

        case "countdown":
          {
            const seconds = (data as { seconds: number }).seconds;
            console.log("[Crash WS] Countdown event:", seconds);
            stateRef.current.countdown = seconds;
            callbacks.onCountdown?.(seconds);
          }
          break;

        case "multiplier":
          {
            const newMultiplier = (data as { multiplier: number }).multiplier;
            // Only process if multiplier actually increased
            if (newMultiplier > stateRef.current.multiplier || stateRef.current.status !== "flying") {
              stateRef.current.multiplier = newMultiplier;
              stateRef.current.status = "flying";
              callbacks.onMultiplierUpdate?.(newMultiplier);
            }
          }
          break;

        case "crash":
          {
            const multiplier = (data as { multiplier: number }).multiplier;
            console.log("[Crash WS] Crash event:", multiplier);
            // Only process if not already crashed
            if (stateRef.current.status !== "crashed") {
              stateRef.current.multiplier = multiplier;
              stateRef.current.status = "crashed";
              stateRef.current.countdown = null;
              callbacks.onRoundCrash?.(multiplier);
            }
          }
          break;

        case "player_cashout":
          callbacks.onPlayerCashout?.(data as { playerId: string; multiplier: number });
          break;
      }
    };

    // Escuta pelo alias definido no evento do backend (App/Events/CrashUpdate.php)
    channel.listen('.game.update', handleGameUpdate);

    console.log("[Crash WS] Subscribed to crash-game channel");
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (echoRef.current) {
      echoRef.current.disconnect();
      echoRef.current = null;
      console.log("[Crash WS] Disconnected");
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const getState = useCallback((): CrashGameState => {
    return { ...stateRef.current };
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    connect,
    disconnect,
    getState,
  };
}
