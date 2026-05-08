import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../lib/api";
import type { Product } from "../types/product";

type SortMode = "featured" | "price-asc" | "price-desc" | "inventory" | "name";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortMode>("featured");

  const refresh = useCallback(async () => {
    const started = performance.now();
    try {
      setRefreshing(true);
      setError(null);
      const result = await getProducts();
      setProducts(result);
      setLatencyMs(Math.round(performance.now() - started));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(product => product.category)))], [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter(product => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery = !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "inventory") return b.inventory - a.inventory;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [category, products, query, sort]);

  return {
    products,
    filteredProducts,
    categories,
    loading,
    refreshing,
    error,
    latencyMs,
    query,
    category,
    sort,
    setQuery,
    setCategory,
    setSort,
    refresh
  };
}
