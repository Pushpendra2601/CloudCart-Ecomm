import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../../lib/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950",
        variant === "primary" && "bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 hover:bg-cyan-700 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-cyan-500",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
