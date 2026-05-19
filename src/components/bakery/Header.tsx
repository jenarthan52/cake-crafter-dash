import { Link, useRouterState } from "@tanstack/react-router";
import { Cake, ShoppingBag, LayoutDashboard, ChefHat, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Shop" },
  { to: "/custom-order", label: "Custom Cake" },
  { to: "/cart", label: "Cart" },
];

export function Header() {
  const { role, setRole, cart } = useStore();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-gold)] text-gold-foreground shadow-[var(--shadow-soft)]">
            <Cake className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold text-primary">Sweet Treat</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Artisan Bakery</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                path === n.to ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative md:hidden">
            <Button variant="ghost" size="icon"><ShoppingBag className="h-5 w-5" /></Button>
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-[10px]">{cartCount}</Badge>
            )}
          </Link>
          <Link to="/cart" className="relative hidden md:inline-flex">
            <Button variant="outline" size="sm" className="gap-2">
              <ShoppingBag className="h-4 w-4" /> Cart
              {cartCount > 0 && <Badge className="ml-1 h-5 px-1.5 text-[10px]">{cartCount}</Badge>}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                {role === "admin" ? <LayoutDashboard className="h-4 w-4" /> : role === "baker" ? <ChefHat className="h-4 w-4" /> : <User className="h-4 w-4" />}
                <span className="capitalize">{role}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Switch role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={() => setRole("customer")}>
                <Link to="/"><User className="mr-2 h-4 w-4" /> Customer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => setRole("admin")}>
                <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild onClick={() => setRole("baker")}>
                <Link to="/baker"><ChefHat className="mr-2 h-4 w-4" /> Baker Kitchen</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}