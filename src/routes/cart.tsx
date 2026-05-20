import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { cart, updateCartQty, removeFromCart, placeOrder, currentCustomer } = useStore();
  const [name, setName] = useState(currentCustomer?.name ?? "");
  const [phone, setPhone] = useState(currentCustomer?.phone ?? "");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (currentCustomer) { setName(currentCustomer.name); setPhone(currentCustomer.phone); }
  }, [currentCustomer]);

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const delivery = subtotal > 0 ? (subtotal > 999 ? 0 : 49) : 0;
  const total = subtotal + delivery;

  const checkout = () => {
    if (!name || !phone || !address) {
      toast.error("Please fill all delivery details");
      return;
    }
    const order = placeOrder({
      customerName: name,
      phone,
      address,
      items: cart,
      total,
      paymentStatus: "Paid",
    });
    toast.success(`Order ${order.id} placed!`);
    navigate({ to: "/" });
  };

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-primary">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Treat yourself to something sweet today.</p>
        <Button asChild className="mt-6 rounded-full bg-primary hover:bg-primary/90">
          <Link to="/">Browse bakery</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl text-primary">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-primary">{item.name}</h3>
                    {item.custom && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.custom.text && <>Text: "<span className="text-foreground">{item.custom.text}</span>" · </>}
                        {item.custom.flavor} · {item.custom.weight}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => updateCartQty(item.id, item.qty - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => updateCartQty(item.id, item.qty + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-lg font-semibold text-primary">₹{item.price * item.qty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] h-fit sticky top-20">
          <h2 className="font-display text-xl text-primary">Delivery details</h2>
          <div className="space-y-3">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Address</Label><Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5" /></div>
          </div>

          <div className="border-t border-border pt-4">
            <Row label="Subtotal" value={`₹${subtotal}`} />
            <Row label="Delivery" value={delivery === 0 ? "FREE" : `₹${delivery}`} />
            <div className="mt-3 flex justify-between border-t border-border pt-3">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl text-gold">₹{total}</span>
            </div>
          </div>

          <Button size="lg" className="w-full rounded-full bg-primary hover:bg-primary/90" onClick={checkout}>
            Place order
          </Button>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
