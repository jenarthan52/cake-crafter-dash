import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/store/useStore";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const { customers, orders } = useStore();

  const fmt = (t: number) => new Date(t).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-3xl text-primary">Customer Directory</h1>
          <p className="text-sm text-muted-foreground">All customers registered on the platform</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No registered customers yet. Sign up from the storefront to populate this list.</td></tr>
              )}
              {customers.map((c) => {
                const orderCount = orders.filter((o) => o.customerId === c.id).length;
                return (
                  <tr key={c.id} className="border-t border-border/60 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{orderCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(c.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}