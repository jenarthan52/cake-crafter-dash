import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/store/useStore";
import { IndianRupee, ShoppingBag, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const { orders, products } = useStore();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => o.createdAt >= today.getTime());
  const revenue = orders.filter((o) => o.paymentStatus === "Paid").reduce((a, o) => a + o.total, 0);
  const active = orders.filter((o) => o.status !== "Delivered").length;
  const lowStock = products.filter((p) => p.stock < 10);

  const stats = [
    { label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, icon: IndianRupee, tint: "bg-gold/20 text-gold" },
    { label: "Today's Orders", value: todayOrders.length, icon: ShoppingBag, tint: "bg-primary/10 text-primary" },
    { label: "Active Orders", value: active, icon: Clock, tint: "bg-blue-100 text-blue-700" },
    { label: "Low Stock Alerts", value: lowStock.length, icon: AlertTriangle, tint: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-primary">Welcome back, Baker 👋</h1>
        <p className="text-muted-foreground">Here's what's happening at Sweet Treat today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-semibold text-primary">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-display text-xl text-primary">Recent orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{o.id} · {o.customerName}</div>
                  <div className="text-xs text-muted-foreground">{o.items.length} item(s)</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">₹{o.total}</div>
                  <div className="text-xs text-muted-foreground">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-display text-xl text-primary">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products well-stocked. 🎉</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-destructive/5 px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <span className="text-destructive">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
