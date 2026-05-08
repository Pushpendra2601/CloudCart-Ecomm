import { Search, SlidersHorizontal } from "lucide-react";

type ProductFiltersProps = {
  query: string;
  category: string;
  sort: string;
  categories: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "featured" | "price-asc" | "price-desc" | "inventory" | "name") => void;
};

export function ProductFilters({ query, category, sort, categories, onQueryChange, onCategoryChange, onSortChange }: ProductFiltersProps) {
  return (
    <div className="sticky top-[73px] z-30 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder="Search by product, SKU, or category"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900 dark:focus:ring-cyan-950"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map(item => (
            <button
              key={item}
              onClick={() => onCategoryChange(item)}
              className={`h-12 rounded-xl px-4 text-sm font-bold transition ${category === item ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative">
          <span className="sr-only">Sort products</span>
          <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={sort}
            onChange={event => onSortChange(event.target.value as "featured" | "price-asc" | "price-desc" | "inventory" | "name")}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-bold outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-cyan-950 lg:w-52"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="inventory">Inventory</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
    </div>
  );
}
