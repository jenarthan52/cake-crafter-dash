import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesAdmin });

function CategoriesAdmin() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    addCategory(newName.trim()); setNewName(""); toast.success("Category added");
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-primary">Categories</h1>

      <div className="flex gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name" onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button onClick={add} className="bg-primary hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = products.filter((p) => p.categoryId === c.id).length;
          const isEditing = editId === c.id;
          return (
            <div key={c.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)]">
              {isEditing ? (
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mr-2" autoFocus />
              ) : (
                <div>
                  <div className="font-display text-lg text-primary">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{count} product(s)</div>
                </div>
              )}
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => { updateCategory(c.id, editName); setEditId(null); toast.success("Updated"); }}><Check className="h-4 w-4 text-green-600" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => { setEditId(c.id); setEditName(c.name); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { deleteCategory(c.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
