import { CheckCircle2, Clock, ShieldCheck, UploadCloud } from "lucide-react";
import { Badge } from "../ui/Badge";

const stages = [
  { label: "Checkout", detail: "GitHub webhook", icon: Clock },
  { label: "Test", detail: "Node smoke tests", icon: CheckCircle2 },
  { label: "Scan", detail: "Trivy HIGH/CRITICAL gate", icon: ShieldCheck },
  { label: "Deploy", detail: "Helm atomic upgrade", icon: UploadCloud }
];

export function PipelineStatus() {
  return (
    <section id="pipeline" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Badge tone="emerald">Release automation</Badge>
            <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">CI/CD deployment timeline</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            This mirrors the Jenkinsfile: test, scan, push immutable images, deploy with Helm, and verify Kubernetes rollout.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stages.map(stage => {
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-950/60">
                <Icon className="h-6 w-6 text-emerald-500" />
                <p className="mt-4 font-black text-slate-950 dark:text-white">{stage.label}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stage.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
