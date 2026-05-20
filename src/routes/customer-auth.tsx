import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer-auth")({ component: CustomerAuth });

function CustomerAuth() {
  const { customerLogin, customerRegister } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const c = customerLogin(email.trim(), password);
      if (!c) return toast.error("Invalid email or password");
      toast.success(`Welcome back, ${c.name}!`);
      navigate({ to: "/" });
    } else {
      if (!name || !email || !phone || !password) return toast.error("Please fill all fields");
      const r = customerRegister({ name, email: email.trim(), phone, password });
      if ("error" in r) return toast.error(r.error);
      toast.success(`Account created. Welcome, ${r.name}!`);
      navigate({ to: "/" });
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-gold)] text-gold-foreground">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-primary">{mode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="text-xs text-muted-foreground">Order faster &amp; track your bakes</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1 text-sm">
          <button onClick={() => setMode("login")} className={`rounded-full py-2 ${mode === "login" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Sign in</button>
          <button onClick={() => setMode("register")} className={`rounded-full py-2 ${mode === "register" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Register</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (<>
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" /></div>
          </>)}
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Staff member? <Link to="/login" className="text-primary underline">Use staff login</Link>
        </div>
      </div>
    </main>
  );
}