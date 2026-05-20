import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChefHat, Clock, Package, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useStore, type OrderStatus } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/baker")({ component: BakerView });

const RECIPES = [
  { name: "Chocolate Truffle", time: "45 min", temp: "180°C", ingredients: "Dark choc, butter, eggs, sugar, flour, cocoa" },
  { name: "Vanilla Sponge", time: "35 min", temp: "175°C", ingredients: "Flour, sugar, eggs, vanilla, butter, milk" },
  { name: "Red Velvet", time: "40 min", temp: "175°C", ingredients: "Cocoa, buttermilk, food color, cream cheese" },
  { name: "Butterscotch", time: "40 min", temp: "180°C", ingredients: "Brown sugar, butter, caramel, praline" },
];

function BakerView() {
  const { orders, updateOrderStatus, currentStaff, staffLogout } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentStaff || (currentStaff.role !== "baker" && currentStaff.role !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [currentStaff, navigate]);
  if (!currentStaff) return null;
  const active = orders.filter((o) => o.status === "Pending" || o.status === "Baking");

  const next: Record<OrderStatus, OrderStatus | null> = {
    "Pending": "Baking",
    "Baking": "Out for Delivery",
    "Out for Delivery": "Delivered",
    "Delivered": null,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-gold)] text-gold-foreground"><ChefHat className="h-6 w-6" /></div>
        <div>
          <h1 className="font-display text-3xl text-primary">Kitchen Dashboard</h1>
          <p className="text-sm text-muted-foreground">Active bakes only. No pricing or revenue here.</p>
        </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => { staffLogout(); navigate({ to: "/login" }); }}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl text-primary flex items-center gap-2"><Clock className="h-5 w-5" /> Active orders ({active.length})</h2>
        {active.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No active bakes. Time for chai ☕</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map((o) => (
              <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                  <Badge className={o.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}>{o.status}</Badge>
                </div>
                <div className="mt-1 font-display text-lg text-primary">{o.customerName}</div>
                <div className="mt-3 space-y-2">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex gap-3 rounded-xl bg-secondary/40 p-2">
                      <img src={it.image} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="text-sm">
                        <div className="font-medium">{it.qty}× {it.name}</div>
                        {it.custom && (
                          <div className="text-xs text-cocoa">
                            {it.custom.text && <>✍️ "{it.custom.text}" · </>}
                            {it.custom.flavor} · {it.custom.weight}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full rounded-full bg-primary hover:bg-primary/90"
                  onClick={() => { const n = next[o.status]; if (n) { updateOrderStatus(o.id, n); toast.success(`Moved to ${n}`); } }}
                >
                  Mark as {next[o.status]}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl text-primary flex items-center gap-2"><Package className="h-5 w-5" /> Recipe book</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RECIPES.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="font-display text-lg text-primary">{r.name}</div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>⏱ {r.time}</span><span>🌡 {r.temp}</span>
              </div>
              <p className="mt-2 text-xs text-foreground/80">{r.ingredients}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
