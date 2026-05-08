import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-semibold text-slate-900 shadow-lift dark:border-emerald-900 dark:bg-slate-900 dark:text-white"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
