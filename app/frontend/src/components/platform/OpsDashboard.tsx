import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Container, Database, Gauge, GitPullRequestArrow, RadioTower, Shield } from "lucide-react";
import { Badge } from "../ui/Badge";

const widgets = [
  { title: "Kubernetes Deployment", value: "2 desired / 2 available", detail: "RollingUpdate + PDB", icon: Gauge, tone: "cyan" as const },
  { title: "Jenkins CI/CD", value: "Build passed", detail: "Tests, Trivy scan, Helm deploy", icon: GitPullRequestArrow, tone: "violet" as const },
  { title: "Docker Images", value: "Immutable tags", detail: "BUILD-SHORT_SHA strategy", icon: Container, tone: "slate" as const },
  { title: "Prometheus", value: "Scraping /metrics", detail: "Request rate and uptime", icon: BarChart3, tone: "emerald" as const },
  { title: "Grafana", value: "Dashboard ready", detail: "CloudCart overview panels", icon: RadioTower, tone: "amber" as const },
  { title: "Data Services", value: "Postgres + Redis", detail: "PVC and internal services", icon: Database, tone: "cyan" as const },
  { title: "Security", value: "Least privilege", detail: "RBAC + NetworkPolicy", icon: Shield, tone: "emerald" as const },
  { title: "Release Safety", value: "Atomic rollback", detail: "Helm upgrade --atomic", icon: CheckCircle2, tone: "violet" as const }
];

export function OpsDashboard() {
  return (
    <section id="metrics" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge tone="violet">DevOps control plane</Badge>
          <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Platform operations view</h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Recruiter-friendly widgets that connect the product UI to Kubernetes, Jenkins, Prometheus, Grafana, Docker, Redis, and PostgreSQL.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <motion.article
              key={widget.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-slate-100 p-2 text-cyan-700 dark:bg-slate-800 dark:text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge tone={widget.tone}>Live</Badge>
              </div>
              <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">{widget.title}</p>
              <p className="mt-2 text-xl font-black text-slate-950 dark:text-white">{widget.value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{widget.detail}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
