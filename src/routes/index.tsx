import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { ProductCard } from "@/components/bakery/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Cake } from "lucide-react";

export const Route = createFileRoute("/")({ component: Storefront });

function Storefront() {
  const { categories, products } = useStore();
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCat = active === "all" || p.categoryId === active;
      const inQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
      return inCat && inQ;
    });
  }, [products, active, q]);

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[var(--gradient-warm)]" />
        <div className="absolute -right-20 top-10 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card px-3 py-1 text-xs uppercase tracking-widest text-cocoa">
              <Sparkles className="h-3 w-3 text-gold" /> Freshly baked daily
            </div>
            <h1 className="font-display text-5xl leading-tight text-primary md:text-6xl">
              Handcrafted cakes <br />for life's <span className="italic text-gold">sweetest</span> moments
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              From dreamy wedding tiers to your kid's first birthday cake — every bake leaves our oven with love.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90" asChild>
                <a href="#shop">Shop the bakery</a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-gold/40" asChild>
                <Link to="/custom-order"><Cake className="mr-2 h-4 w-4" /> Order custom cake</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gold/15 blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=1000&q=80"
              alt="Decorated cake with berries"
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[var(--shadow-warm)]"
            />
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Loved by everyone</p>
            <h2 className="font-display text-3xl text-primary">Best sellers</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Explore</p>
            <h2 className="font-display text-3xl text-primary">The full bakery</h2>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treats…" className="rounded-full pl-9" />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <CatChip active={active === "all"} onClick={() => setActive("all")}>All</CatChip>
          {categories.map((c) => (
            <CatChip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>{c.name}</CatChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No treats found. Try another search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <footer className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Sweet Treat Bakery — Baked with love.
        </div>
      </footer>
    </main>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-gold/50"
      }`}
    >
      {children}
    </button>
  );
}
