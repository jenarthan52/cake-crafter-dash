import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ChefHat, LayoutDashboard, Store } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { staffLogin } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = staffLogin(username.trim(), password);
    if (!session) {
      toast.error("Invalid username or password");
      return;
    }
    toast.success(`Welcome, ${session.username}`);
    if (session.role === "admin") navigate({ to: "/admin" });
    else if (session.role === "baker") navigate({ to: "/baker" });
    else navigate({ to: "/staff" });
  };

  const quick = (u: string, p: string) => { setUsername(u); setPassword(p); };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-gold)] text-gold-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-primary">Staff sign in</h1>
            <p className="text-xs text-muted-foreground">Admin · Baker · Staff portal</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1.5" autoFocus /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90">Sign in</Button>
        </form>

        <div className="mt-6 space-y-2 rounded-2xl bg-secondary/50 p-4 text-xs">
          <div className="font-medium text-foreground">Demo credentials — click to autofill</div>
          <button type="button" onClick={() => quick("admin", "admin123")} className="flex w-full items-center gap-2 rounded-lg bg-background p-2 text-left hover:bg-accent">
            <LayoutDashboard className="h-4 w-4 text-primary" /> <span><b>admin</b> / admin123</span>
          </button>
          <button type="button" onClick={() => quick("baker", "baker123")} className="flex w-full items-center gap-2 rounded-lg bg-background p-2 text-left hover:bg-accent">
            <ChefHat className="h-4 w-4 text-primary" /> <span><b>baker</b> / baker123</span>
          </button>
          <button type="button" onClick={() => quick("staff", "staff123")} className="flex w-full items-center gap-2 rounded-lg bg-background p-2 text-left hover:bg-accent">
            <Store className="h-4 w-4 text-primary" /> <span><b>staff</b> / staff123</span>
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Customer? <Link to="/customer-auth" className="text-primary underline">Sign in here</Link>
        </div>
      </div>
    </main>
  );
}