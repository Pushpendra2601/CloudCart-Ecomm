import { useCallback, useEffect, useState } from "react";
import { getReadiness } from "../lib/api";
import type { ApiHealth } from "../types/platform";

export function usePlatformHealth() {
  const [health, setHealth] = useState<ApiHealth>({
    status: "degraded",
    latencyMs: null,
    checkedAt: null
  });

  const refresh = useCallback(async () => {
    const started = performance.now();
    try {
      await getReadiness();
      setHealth({
        status: "healthy",
        latencyMs: Math.round(performance.now() - started),
        checkedAt: new Date().toLocaleTimeString()
      });
    } catch {
      setHealth({
        status: "offline",
        latencyMs: null,
        checkedAt: new Date().toLocaleTimeString()
      });
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { health, refresh };
}
