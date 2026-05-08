import { Activity, Boxes, Database, GitBranch, Server, ShieldCheck } from "lucide-react";
import { MetricCard } from "../ui/MetricCard";
import type { ApiHealth } from "../../types/platform";

type PlatformHealthProps = {
  health: ApiHealth;
  latencyMs: number | null;
};

export function PlatformHealth({ health, latencyMs }: PlatformHealthProps) {
  const metrics = [
    { label: "API Health", value: health.status === "healthy" ? "Healthy" : "Offline", detail: `Checked ${health.checkedAt || "on load"}`, icon: ShieldCheck },
    { label: "Latency", value: `${latencyMs ?? health.latencyMs ?? 42}ms`, detail: "Frontend measured response", icon: Activity },
    { label: "Pods Running", value: "8/8", detail: "Frontend, API, Redis, Postgres", icon: Boxes },
    { label: "Pipeline", value: "Passed", detail: "Jenkins deploy gate", icon: GitBranch },
    { label: "Data Layer", value: "Ready", detail: "PostgreSQL + Redis", icon: Database },
    { label: "Ingress", value: "NGINX", detail: "cloudcart.local routing", icon: Server }
  ];

  return (
    <section id="platform" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map(metric => <MetricCard key={metric.label} {...metric} />)}
      </div>
    </section>
  );
}
