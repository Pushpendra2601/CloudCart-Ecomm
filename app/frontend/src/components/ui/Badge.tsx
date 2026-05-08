import type { ReactNode } from "react";
import { classNames } from "../../lib/format";

type BadgeProps = {
  children: ReactNode;
  tone?: "emerald" | "cyan" | "violet" | "amber" | "rose" | "slate";
};

const tones = {
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800",
  cyan: "bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:ring-cyan-800",
  violet: "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-800",
  amber: "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800",
  rose: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800",
  slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span className={classNames("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1", tones[tone])}>
      {children}
    </span>
  );
}
