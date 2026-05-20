import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, type OrderStatus } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/staff")({ component: StaffPOS });

const STATUSES: OrderStatus[] = ["Pending", "Baking", "Out for Delivery", "Delivered"];

function StaffPOS() {
  const { currentStaff, products, placeOrder, orders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentStaff || (currentStaff.role !== "staff" && currentStaff.role !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [currentStaff, navigate]);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ productId: string; name: string; price: number; image: string; qty: number }[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12);
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const add = (p: typeof products[number]) => {
    setCart((c) => {
      const ex = c.find((x) => x.productId === p.id);
      if (ex) return c.map((x) => x.productId === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { productId: p.id, name: p.name, price: p.salePrice ?? p.price, image: p.image, qty: 1 }];
    });
  };
  const setQty = (id: string, qty: number) => setCart((c) => qty <= 0 ? c.filter((x) => x.productId !== id) : c.map((x) => x.productId === id ? { ...x, qty } : x));

  const checkout = () => {
    if (cart.length === 0) return toast.error("Add items first");
    if (!customerName) return toast.error("Enter customer name");
    const order = placeOrder({
      customerName,
      phone: phone || "Walk-in",
      address: "Walk-in counter",
      items: cart.map((c, i) => ({ id: `wi${Date.now()}-${i}`, productId: c.productId, name: c.name, price: c.price, qty: c.qty, image: c.image })),
      total: subtotal,
      paymentStatus: "Paid",
    });
    toast.success(`Bill ${order.id} generated · ₹${subtotal}`);
    setCart([]); setCustomerName(""); setPhone("");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-gold)] text-gold-foreground"><Store className="h-6 w-6" /></div>
        <div>
          <h1 className="font-display text-3xl text-primary">Walk-in Billing</h1>
          <p className="text-sm text-muted-foreground">POS &amp; Order management for counter staff</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-[var(--shadow-soft)] hover:border-primary">
                <img src={p.image} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-primary">₹{p.salePrice ?? p.price}</div>
                </div>
                <Plus className="h-4 w-4 text-primary" />
              </button>
            ))}
          </div>

          <h2 className="mt-10 mb-3 font-display text-xl text-primary">Active orders</h2>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
                <tr><th className="px-3 py-2">Order</th><th className="px-3 py-2">Customer</th><th className="px-3 py-2">Status</th></tr>
              </thead>
              <tbody>
                {orders.filter((o) => o.status !== "Delivered").map((o) => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-2">{o.customerName}</td>
                    <td className="px-3 py-2">
                      <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                        <SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {orders.filter((o) => o.status !== "Delivered").length === 0 && (
                  <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">No active orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-20">
          <h2 className="mb-3 font-display text-xl text-primary">Current bill</h2>
          <div className="space-y-2">
            <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="my-4 space-y-2">
            {cart.length === 0 && <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">No items yet</div>}
            {cart.map((c) => (
              <div key={c.productId} className="flex items-center gap-2 rounded-xl bg-secondary/40 p-2 text-sm">
                <div className="flex-1 truncate">{c.name}</div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setQty(c.productId, c.qty - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-5 text-center">{c.qty}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setQty(c.productId, c.qty + 1)}><Plus className="h-3 w-3" /></Button>
                </div>
                <div className="w-16 text-right font-medium">₹{c.price * c.qty}</div>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setQty(c.productId, 0)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-2xl text-gold">₹{subtotal}</span>
          </div>
          <Button onClick={checkout} className="mt-4 w-full rounded-full bg-primary hover:bg-primary/90">Generate bill</Button>
          <Badge variant="secondary" className="mt-3 w-full justify-center">Staff view — system settings hidden</Badge>
        </aside>
      </div>
    </main>
  );
}