import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export const Route = createFileRoute("/custom-order")({ component: CustomOrder });

const FLAVORS = ["Chocolate", "Vanilla", "Red Velvet", "Butterscotch"];
const WEIGHTS = [
  { label: "0.5 kg", value: "0.5kg", price: 800 },
  { label: "1 kg", value: "1kg", price: 1500 },
  { label: "2 kg", value: "2kg", price: 2800 },
  { label: "5 kg", value: "5kg", price: 6500 },
];

function CustomOrder() {
  const addToCart = useStore((s) => s.addToCart);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string>("");
  const [text, setText] = useState("Happy Birthday");
  const [flavor, setFlavor] = useState("Chocolate");
  const [weight, setWeight] = useState("1kg");
  const [notes, setNotes] = useState("");

  const selected = WEIGHTS.find((w) => w.value === weight)!;

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    addToCart({
      name: `Custom Photo Cake — ${flavor} ${selected.label}`,
      price: selected.price,
      qty: 1,
      image: photo || "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
      custom: { photo, text, flavor, weight: selected.label },
    });
    toast.success("Custom cake added to cart!");
    navigate({ to: "/cart" });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Make it personal</p>
        <h1 className="font-display text-4xl text-primary">Design your custom cake</h1>
        <p className="mt-2 text-muted-foreground">Upload a photo, choose your flavor and weight — we'll bake the rest.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Preview */}
        <div className="rounded-3xl bg-[var(--gradient-warm)] p-6">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
            {photo ? (
              <img src={photo} alt="Custom" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Cake className="h-16 w-16 text-gold" />
                <p className="text-sm">Your photo preview appears here</p>
              </div>
            )}
            {text && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center">
                <p className="font-display text-2xl text-white drop-shadow">{text}</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Flavor" value={flavor} />
            <Info label="Weight" value={selected.label} />
            <Info label="Estimated price" value={`₹${selected.price}`} highlight />
            <Info label="Delivery" value="2-3 days" />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <Label>Upload your design / photo</Label>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-gold hover:bg-secondary/40">
              <Upload className="h-4 w-4" />
              {photo ? "Change photo" : "Click to upload (JPG / PNG)"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          </div>

          <div>
            <Label htmlFor="text">Text on the cake</Label>
            <Input id="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={60} placeholder="e.g. Happy Birthday Papa" className="mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Flavor</Label>
              <Select value={flavor} onValueChange={setFlavor}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>{FLAVORS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Weight</Label>
              <Select value={weight} onValueChange={setWeight}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WEIGHTS.map((w) => <SelectItem key={w.value} value={w.value}>{w.label} — ₹{w.price}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Special instructions (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, color preferences…" className="mt-2" />
          </div>

          <Button size="lg" className="w-full rounded-full bg-primary hover:bg-primary/90" onClick={submit}>
            Add custom cake — ₹{selected.price}
          </Button>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-card/80 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-medium ${highlight ? "text-gold" : "text-primary"}`}>{value}</div>
    </div>
  );
}
