import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useStore, type Product } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({ component: ProductsAdmin });

type Form = Omit<Product, "id">;
const empty: Form = { name: "", description: "", categoryId: "", price: 0, salePrice: undefined, stock: 0, veg: true, eggless: false, bestSeller: false, image: "" };

function ProductsAdmin() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const openNew = () => { setEditing(null); setForm({ ...empty, categoryId: categories[0]?.id ?? "" }); setOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm(p); setOpen(true); };

  const onFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setForm((f) => ({ ...f, image: r.result as string }));
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!form.name || !form.categoryId || !form.image) { toast.error("Name, category and image required"); return; }
    if (editing) { updateProduct(editing.id, form); toast.success("Product updated"); }
    else { addProduct(form); toast.success("Product added"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-primary">Products</h1>
        <Button onClick={openNew} className="rounded-full bg-primary hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add product</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const cat = categories.find((c) => c.id === p.categoryId);
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)]">
              <img src={p.image} alt={p.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-primary">{p.name}</h3>
                    <div className="text-xs text-muted-foreground">{cat?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">₹{p.salePrice ?? p.price}</div>
                    <div className="text-xs text-muted-foreground">{p.stock} in stock</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.bestSeller && <Badge className="bg-gold text-gold-foreground">Best</Badge>}
                  {p.eggless && <Badge variant="secondary">Eggless</Badge>}
                  {p.veg && <Badge variant="secondary" className="bg-green-100 text-green-800">Veg</Badge>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => { deleteProduct(p.id); toast.success("Deleted"); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} product</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              <div className="mt-2 flex gap-3">
                {form.image && <img src={form.image} className="h-20 w-20 rounded-lg object-cover" />}
                <div className="flex-1 space-y-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card px-3 py-3 text-sm text-muted-foreground hover:border-gold">
                    <Upload className="h-4 w-4" /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                  </label>
                  <Input placeholder="…or paste image URL" value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
              </div>
            </div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Price ₹</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="mt-1.5" /></div>
              <div><Label>Sale ₹</Label><Input type="number" value={form.salePrice ?? ""} onChange={(e) => setForm({ ...form, salePrice: e.target.value ? +e.target.value : undefined })} className="mt-1.5" /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} className="mt-1.5" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-secondary/40 p-3">
              <Toggle label="Veg" v={form.veg} onChange={(v) => setForm({ ...form, veg: v })} />
              <Toggle label="Eggless" v={form.eggless} onChange={(v) => setForm({ ...form, eggless: v })} />
              <Toggle label="Best seller" v={form.bestSeller} onChange={(v) => setForm({ ...form, bestSeller: v })} />
            </div>
            <Button onClick={save} className="w-full bg-primary hover:bg-primary/90">{editing ? "Save changes" : "Add product"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Toggle({ label, v, onChange }: { label: string; v: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span>{label}</span><Switch checked={v} onCheckedChange={onChange} />
    </label>
  );
}
