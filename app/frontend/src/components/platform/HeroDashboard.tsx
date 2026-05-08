import { motion } from "framer-motion";
import { Activity, Boxes, GitBranch, Gauge, ServerCog } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type HeroDashboardProps = {
  latencyMs: number | null;
};

const rows = [
  { label: "Jenkins pipeline", value: "Passed", icon: GitBranch },
  { label: "Kubernetes pods", value: "8 running", icon: Boxes },
  { label: "HPA policy", value: "2-8 replicas", icon: Gauge },
  { label: "Redis/Postgres", value: "Ready", icon: ServerCog }
];

export function HeroDashboard({ latencyMs }: HeroDashboardProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col justify-center">
        <Badge tone="cyan">Running on Kubernetes</Badge>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
          Cloud-native commerce, deployed like production.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          A portfolio-grade e-commerce platform with Docker, Jenkins, Helm, Ingress, HPA, Prometheus, Grafana, PostgreSQL, Redis, and secure Kubernetes delivery.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>Explore catalog</Button>
          <Button variant="secondary" onClick={() => document.getElementById("platform")?.scrollIntoView({ behavior: "smooth" })}>View platform health</Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lift dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Live platform preview</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Operations cockpit</h2>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-slate-950/80">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">API latency</span>
                <Activity className="h-5 w-5 text-cyan-300" />
              </div>
              <p className="mt-3 text-4xl font-black">{latencyMs ?? 42}ms</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" initial={{ width: "20%" }} animate={{ width: "74%" }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5 }} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {rows.map(row => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                    <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{row.label}</p>
                    <p className="mt-1 font-black text-slate-950 dark:text-white">{row.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
