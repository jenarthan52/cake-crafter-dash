import { createFileRoute } from "@tanstack/react-router";
import { useStore, type OrderStatus } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

const STATUSES: OrderStatus[] = ["Pending", "Baking", "Out for Delivery", "Delivered"];

const statusColor = (s: OrderStatus) =>
  s === "Pending" ? "bg-amber-100 text-amber-800"
  : s === "Baking" ? "bg-blue-100 text-blue-800"
  : s === "Out for Delivery" ? "bg-purple-100 text-purple-800"
  : "bg-green-100 text-green-800";

function OrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-primary">Orders</h1>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items.length} item(s)</td>
                  <td className="px-4 py-3 font-semibold text-primary">₹{o.total}</td>
                  <td className="px-4 py-3">
                    <Badge variant={o.paymentStatus === "Paid" ? "default" : "secondary"} className={o.paymentStatus === "Paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                      <SelectTrigger className={`h-8 w-40 border-0 ${statusColor(o.status)}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>{o.id} — {o.customerName}</DialogTitle></DialogHeader>
                        <div className="space-y-3 text-sm">
                          <div className="rounded-lg bg-secondary/40 p-3"><strong>Address:</strong> {o.address}</div>
                          {o.items.map((it) => (
                            <div key={it.id} className="flex gap-3 rounded-lg border border-border p-3">
                              <img src={it.image} className="h-16 w-16 rounded-lg object-cover" />
                              <div className="flex-1">
                                <div className="font-medium">{it.name}</div>
                                <div className="text-xs text-muted-foreground">Qty: {it.qty} × ₹{it.price}</div>
                                {it.custom && (
                                  <div className="mt-1 rounded bg-gold/10 px-2 py-1 text-xs text-cocoa">
                                    {it.custom.text && <div>✍️ "{it.custom.text}"</div>}
                                    <div>{it.custom.flavor} · {it.custom.weight}</div>
                                    {it.custom.photo && <img src={it.custom.photo} className="mt-1 h-20 rounded object-cover" />}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between border-t pt-3 font-display text-lg">
                            <span>Total</span><span className="text-gold">₹{o.total}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
