import { Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { ApiHealth } from "../../types/platform";

type NavbarProps = {
  cartCount: number;
  health: ApiHealth;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenCart: () => void;
};

export function Navbar({ cartCount, health, theme, onToggleTheme, onOpenCart }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3" aria-label="CloudCart home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 font-black text-slate-950 shadow-glow">C</span>
          <div>
            <p className="text-lg font-black leading-none text-slate-950 dark:text-white">CloudCart</p>
            <p className="hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">Kubernetes commerce platform</p>
          </div>
        </a>

        <div className="hidden items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-300 lg:flex">
          <a className="transition hover:text-cyan-600" href="#catalog">Catalog</a>
          <a className="transition hover:text-cyan-600" href="#platform">Platform</a>
          <a className="transition hover:text-cyan-600" href="#metrics">Metrics</a>
          <a className="transition hover:text-cyan-600" href="#pipeline">Pipeline</a>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone={health.status === "healthy" ? "emerald" : "rose"}>
            {health.status === "healthy" ? "API healthy" : "API offline"}
          </Badge>
          <Button variant="ghost" className="hidden px-3 md:inline-flex" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="px-3" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="secondary" onClick={onOpenCart} aria-label="Open cart">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">{cartCount}</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
