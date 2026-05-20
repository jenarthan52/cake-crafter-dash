import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Tags, Users, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

function AdminLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { currentStaff, staffLogout } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentStaff || currentStaff.role !== "admin") {
      navigate({ to: "/login" });
    }
  }, [currentStaff, navigate]);
  if (!currentStaff || currentStaff.role !== "admin") return null;
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-20 space-y-1 rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-soft)]">
          {items.map((i) => {
            const active = i.exact ? path === i.to : path.startsWith(i.to);
            return (
              <Link key={i.to} to={i.to} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <i.icon className="h-4 w-4" /> {i.label}
              </Link>
            );
          })}
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start gap-3 text-muted-foreground" onClick={() => { staffLogout(); navigate({ to: "/login" }); }}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex gap-2 overflow-auto md:hidden">
          {items.map((i) => {
            const active = i.exact ? path === i.to : path.startsWith(i.to);
            return (
              <Link key={i.to} to={i.to} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
                {i.label}
              </Link>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
