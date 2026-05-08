export function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-3 h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-8 w-28 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
