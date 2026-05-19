import { Leaf, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export function ProductCard({ product, hidePrice }: { product: Product; hidePrice?: boolean }) {
  const addToCart = useStore((s) => s.addToCart);
  const price = product.salePrice ?? product.price;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.bestSeller && (
            <Badge className="bg-gold text-gold-foreground"><Star className="mr-1 h-3 w-3 fill-current" /> Best</Badge>
          )}
          {product.eggless && (
            <Badge variant="secondary" className="bg-green-100 text-green-800"><Leaf className="mr-1 h-3 w-3" /> Eggless</Badge>
          )}
        </div>
        {product.salePrice && !hidePrice && (
          <div className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground">
            Save ₹{product.price - product.salePrice}
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg font-semibold text-primary">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="flex items-end justify-between pt-2">
          {!hidePrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-primary">₹{price}</span>
              {product.salePrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
          )}
          {!hidePrice && (
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={() => {
                addToCart({ productId: product.id, name: product.name, price, qty: 1, image: product.image });
                toast.success(`${product.name} added to cart`);
              }}
              disabled={product.stock === 0}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}