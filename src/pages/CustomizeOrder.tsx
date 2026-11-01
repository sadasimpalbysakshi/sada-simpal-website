import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { collections } from "@/data/products";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const BUDGETS = ["Under ₹500", "₹500 – ₹1,000", "₹1,000 – ₹2,500", "₹2,500+", "Not sure yet"];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  item_type: z.string().min(1, "Please choose what you'd like"),
  budget: z.string().optional(),
  needed_by: z.string().optional(),
  details: z.string().trim().min(15, "Tell us a bit more (at least 15 characters)").max(2000),
});

const CustomizeOrder = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    item_type: "",
    budget: "",
    needed_by: "",
    details: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setBusy(true);
    const d = parsed.data;

    // Save to the database (best effort — WhatsApp below is the safety net)
    const { error } = await supabase.from("custom_requests").insert({
      name: d.name,
      phone: d.phone.replace(/\D/g, "").slice(-10),
      email: d.email || null,
      item_type: d.item_type,
      budget: d.budget || null,
      needed_by: d.needed_by || null,
      details: d.details,
    });
    if (error) console.error("custom request save failed", error);

    setBusy(false);

    const message =
      `🧶 *New Custom Order Request*\n\n` +
      `Name: ${d.name}\nPhone: ${d.phone}\n${d.email ? `Email: ${d.email}\n` : ""}` +
      `Item: ${d.item_type}\n${d.budget ? `Budget: ${d.budget}\n` : ""}` +
      `${d.needed_by ? `Needed by: ${d.needed_by}\n` : ""}\n` +
      `Details:\n${d.details}`;

    toast.success(
      error
        ? "Opening WhatsApp so you can send us your request."
        : "Request received! Send it on WhatsApp to get a faster reply 💛"
    );
    window.open(whatsappLink(message), "_blank", "noopener");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
      <Seo
        title="Custom Crochet Orders"
        description="Tell us your idea — a bouquet in your colours, a personalised toy, a gift set — and we'll crochet it just for you."
      />
      <h1 className="font-display text-4xl md:text-5xl mb-3 text-center">Custom Orders</h1>
      <p className="mb-10 text-center text-muted-foreground">
        Have something special in mind? Tell us about it and we'll craft it just for you. We'll
        reply with a quote and timeline — no obligation.
      </p>

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="co-name">Your name *</Label>
            <Input id="co-name" value={form.name} onChange={set("name")} autoComplete="name" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="co-phone">Mobile number *</Label>
            <Input id="co-phone" value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="co-email">Email (optional)</Label>
          <Input id="co-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="co-type">What would you like? *</Label>
            <select
              id="co-type"
              value={form.item_type}
              onChange={set("item_type")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose…</option>
              {collections.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
              <option>Gift set / hamper</option>
              <option>Something else</option>
            </select>
            {errors.item_type && <p className="text-xs text-destructive">{errors.item_type}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="co-budget">Budget (optional)</Label>
            <select
              id="co-budget"
              value={form.budget}
              onChange={set("budget")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose…</option>
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="co-date">Needed by (optional)</Label>
          <Input
            id="co-date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={form.needed_by}
            onChange={set("needed_by")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="co-details">Describe your idea *</Label>
          <Textarea
            id="co-details"
            rows={6}
            value={form.details}
            onChange={set("details")}
            placeholder="Colours, size, occasion, name to add, anything that makes it yours…"
          />
          {errors.details && <p className="text-xs text-destructive">{errors.details}</p>}
        </div>

        <p className="text-xs text-muted-foreground">
          Got reference photos? After submitting, you'll be taken to WhatsApp ({SITE.phoneDisplay}) —
          just attach them there.
        </p>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Submitting…" : "Submit request & continue on WhatsApp"}
        </Button>
      </form>
    </div>
  );
};

export default CustomizeOrder;
