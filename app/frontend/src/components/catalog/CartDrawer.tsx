import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { currency } from "../../lib/format";
import type { CartItem } from "../../types/product";
import { Button } from "../ui/Button";

type CartDrawerProps = {
  open: boolean;
  items: CartItem[];
  subtotal: number;
  checkoutPending: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
};

export function CartDrawer({ open, items, subtotal, checkoutPending, onClose, onRemove, onClear, onCheckout }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white p-5 shadow-lift dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Demo cart</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Checkout simulation</h2>
              </div>
              <Button variant="ghost" onClick={onClose} aria-label="Close cart">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
                  <p className="font-black text-slate-950 dark:text-white">Your cart is empty</p>
                  <p className="mt-2 text-sm text-slate-500">Add products to test the frontend interaction flow.</p>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">Qty {item.quantity} · {item.category}</p>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-sm font-bold text-rose-500">Remove</button>
                  </div>
                  <p className="mt-3 font-black">{currency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Subtotal</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white">{currency(subtotal)}</span>
              </div>
              <Button className="mt-4 w-full" onClick={onCheckout} disabled={items.length === 0 || checkoutPending}>
                {checkoutPending ? "Submitting order..." : "Submit order to API"}
              </Button>
              <Button variant="ghost" className="mt-2 w-full" onClick={onClear}>Clear cart</Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
