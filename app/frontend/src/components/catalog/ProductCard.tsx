import { motion } from "framer-motion";
import { PackageCheck, ShoppingCart } from "lucide-react";
import { currency } from "../../lib/format";
import type { Product } from "../../types/product";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const lowStock = product.inventory < 20;

  return (
    <motion.article
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900/85"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white dark:bg-cyan-950 dark:text-cyan-300">
          <PackageCheck className="h-6 w-6" />
        </div>
        <Badge tone={lowStock ? "amber" : "emerald"}>{lowStock ? "Low stock" : "In stock"}</Badge>
      </div>

      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{product.category}</p>
      <h3 className="mt-2 min-h-14 text-xl font-black text-slate-950 dark:text-white">{product.name}</h3>
      <p className="mt-1 text-xs font-semibold text-slate-400">{product.id}</p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-black text-slate-950 dark:text-white">{currency(product.price)}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.inventory} available</p>
        </div>
        <Button onClick={() => onAddToCart(product)} className="shrink-0">
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </div>
    </motion.article>
  );
}
