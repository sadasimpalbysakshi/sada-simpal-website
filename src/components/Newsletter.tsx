import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });
    setBusy(false);
    // 23505 = already subscribed; treat as success
    if (error && error.code !== "23505") {
      toast.error("Couldn't subscribe right now. Please try again later.");
      return;
    }
    toast.success("You're on the list! 💛");
    setEmail("");
  };

  return (
    <section className="bg-secondary/50 py-16 px-4">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-3">
          Join our little circle
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          New creations, festive collections and special offers — straight to your inbox. No spam, ever.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            className="bg-background"
          />
          <Button type="submit" disabled={busy}>
            {busy ? "Joining…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
