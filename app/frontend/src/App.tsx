import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Navbar } from "./components/layout/Navbar";
import { HeroDashboard } from "./components/platform/HeroDashboard";
import { PlatformHealth } from "./components/platform/PlatformHealth";
import { ProductFilters } from "./components/catalog/ProductFilters";
import { ProductCard } from "./components/catalog/ProductCard";
import { ProductSkeleton } from "./components/ui/Skeleton";
import { Button } from "./components/ui/Button";
import { CartDrawer } from "./components/catalog/CartDrawer";
import { Toast } from "./components/ui/Toast";
import { OpsDashboard } from "./components/platform/OpsDashboard";
import { PipelineStatus } from "./components/platform/PipelineStatus";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useTheme } from "./hooks/useTheme";
import { usePlatformHealth } from "./hooks/usePlatformHealth";
import type { Product } from "./types/product";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { health } = usePlatformHealth();
  const products = useProducts();
  const cart = useCart();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = (product: Product) => {
    cart.add(product);
    setToast(`${product.name} added to cart`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-platform-grid bg-[size:42px_42px] opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" />

      <Navbar
        cartCount={cart.count}
        health={health}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCart={() => cart.setOpen(true)}
      />

      <main>
        <HeroDashboard latencyMs={products.latencyMs} />
        <PlatformHealth health={health} latencyMs={products.latencyMs} />

        <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">API-driven catalog</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">Product catalog</h2>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                Search, filter, sort, refresh, and add products to a frontend-only demo cart. Data is loaded from the backend API.
              </p>
            </div>
            <Button onClick={products.refresh} disabled={products.refreshing} variant="secondary">
              <RefreshCw className={`h-4 w-4 ${products.refreshing ? "animate-spin" : ""}`} />
              Refresh catalog
            </Button>
          </div>

          <ProductFilters
            query={products.query}
            category={products.category}
            sort={products.sort}
            categories={products.categories}
            onQueryChange={products.setQuery}
            onCategoryChange={products.setCategory}
            onSortChange={products.setSort}
          />

          {products.error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              <p className="font-black">Catalog API unavailable</p>
              <p className="mt-1 text-sm">{products.error}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.loading ? (
              Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
            ) : (
              <AnimatePresence>
                {products.filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </AnimatePresence>
            )}
          </div>

          {!products.loading && products.filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800">
              <p className="text-xl font-black text-slate-950 dark:text-white">No products found</p>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Try a different search term, category, or sort option.</p>
            </motion.div>
          )}
        </section>

        <OpsDashboard />
        <PipelineStatus />
      </main>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
        CloudCart · Docker · Kubernetes · Jenkins · Helm · Prometheus · Grafana · PostgreSQL · Redis
      </footer>

      <CartDrawer
        open={cart.open}
        items={cart.items}
        subtotal={cart.subtotal}
        onClose={() => cart.setOpen(false)}
        onRemove={cart.remove}
        onClear={cart.clear}
      />
      <Toast message={toast} />
    </div>
  );
}
