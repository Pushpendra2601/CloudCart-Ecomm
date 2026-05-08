export type ApiHealth = {
  status: "healthy" | "degraded" | "offline";
  latencyMs: number | null;
  checkedAt: string | null;
};
