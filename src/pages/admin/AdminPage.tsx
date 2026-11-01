import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import { cn } from "@/lib/utils";
import ProductsAdmin from "./ProductsAdmin";
import OrdersAdmin from "./OrdersAdmin";
import InboxAdmin from "./InboxAdmin";

type Tab = "products" | "orders" | "inbox";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) toast.error("That email or password isn't right");
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-4xl text-center mb-1">{SITE.name}</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">Shop manager — sign in</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button className="w-full" size="lg" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

const AdminPage = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("products");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsAdmin(null);
    if (!session) return;
    // the database only returns a row to people who are real admins
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session?.user.id]);

  const signOut = () => supabase.auth.signOut();

  let body: React.ReactNode;
  if (session === undefined || (session && isAdmin === null)) {
    body = <p className="py-24 text-center text-muted-foreground">Loading…</p>;
  } else if (!session) {
    body = <Login />;
  } else if (!isAdmin) {
    body = (
      <div className="mx-auto max-w-sm px-4 py-24 text-center">
        <p className="mb-2 font-display text-2xl">No access</p>
        <p className="mb-6 text-sm text-muted-foreground">
          {session.user.email} isn't a shop manager. Please sign in with the right account.
        </p>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  } else {
    const tabs: [Tab, string][] = [
      ["products", "Products"],
      ["orders", "Orders"],
      ["inbox", "Inbox"],
    ];
    body = (
      <div className="mx-auto max-w-5xl px-4 pb-24">
        <header className="flex items-center justify-between gap-3 py-5">
          <div>
            <p className="font-display text-2xl">{SITE.name} · Shop manager</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="underline" target="_blank">
              View website
            </Link>
            <button onClick={signOut} className="underline">
              Sign out
            </button>
          </div>
        </header>
        <nav className="mb-6 flex gap-1 border-b border-border">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium",
                tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </nav>
        {tab === "products" && <ProductsAdmin />}
        {tab === "orders" && <OrdersAdmin />}
        {tab === "inbox" && <InboxAdmin />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Shop manager" noindex />
      {body}
    </div>
  );
};

export default AdminPage;
