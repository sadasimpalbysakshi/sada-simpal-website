import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Gift, PartyPopper, Palette } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const OCCASIONS = [
  "Corporate gifting",
  "Wedding / event return gifts",
  "Festival hampers",
  "Retail / resale",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  company: z.string().trim().max(120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91|91|0)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  occasion: z.string().min(1, "Please choose an occasion"),
  quantity: z.string().trim().min(1, "Roughly how many pieces?"),
  needed_by: z.string().optional(),
  details: z.string().trim().min(15, "Tell us a bit more (at least 15 characters)").max(2000),
});

const PERKS = [
  { icon: Briefcase, title: "Corporate gifting", text: "Festive hampers and thank-you gifts for teams and clients." },
  { icon: PartyPopper, title: "Weddings & events", text: "Return favours and décor made in your theme." },
  { icon: Palette, title: "Your colours", text: "Colours, sizes and packaging tailored to you." },
  { icon: Gift, title: "Handmade, ethically", text: "Crafted by the women of our village." },
];

const BulkOrders = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    occasion: "",
    quantity: "",
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

    const summary =
      `${d.company ? `Company: ${d.company}\n` : ""}Quantity: ${d.quantity}\n\n${d.details}`;

    // Saved in the same table as custom requests (item_type tells them apart)
    const { error } = await supabase.from("custom_requests").insert({
      name: d.name,
      phone: d.phone.replace(/\D/g, "").slice(-10),
      email: d.email || null,
      item_type: `Bulk / Corporate – ${d.occasion}`,
      needed_by: d.needed_by || null,
      details: summary,
    });
    if (error) console.error("bulk enquiry save failed", error);
    setBusy(false);

    const message =
      `🏢 *Bulk / Corporate Enquiry*\n\n` +
      `Name: ${d.name}\n${d.company ? `Company: ${d.company}\n` : ""}Phone: ${d.phone}\n` +
      `${d.email ? `Email: ${d.email}\n` : ""}Occasion: ${d.occasion}\nQuantity: ${d.quantity}\n` +
      `${d.needed_by ? `Needed by: ${d.needed_by}\n` : ""}\nDetails:\n${d.details}`;

    toast.success(
      error
        ? "Opening WhatsApp so you can send us your enquiry."
        : "Enquiry received! Send it on WhatsApp for the fastest reply 💛"
    );
    window.open(whatsappLink(message), "_blank", "noopener");
  };

  return (
    <div>
      <Seo
        title="Bulk & Corporate Orders"
        description="Handmade crochet gifts in bulk for corporates, weddings, festivals and events — made by the women of our village near Jhansi. Get a quote."
      />

      <section className="bg-secondary/50 px-4 py-16 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          For businesses &amp; events
        </p>
        <h1 className="font-display text-4xl md:text-5xl">Bulk &amp; Corporate Orders</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Meaningful, handmade gifts in quantity — each one crocheted by the women of our
          village. Tell us what you need and we'll send a quote.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="text-center">
            <Icon className="mx-auto mb-3 h-7 w-7" />
            <h2 className="font-display text-xl mb-1">{title}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <div className="mx-auto max-w-2xl px-4 pb-20 lg:px-8">
        <form onSubmit={submit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-name">Your name *</Label>
              <Input id="b-name" value={form.name} onChange={set("name")} autoComplete="name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-company">Company / organisation</Label>
              <Input id="b-company" value={form.company} onChange={set("company")} autoComplete="organization" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-phone">Mobile number *</Label>
              <Input id="b-phone" value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-email">Email</Label>
              <Input id="b-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="b-occ">Occasion *</Label>
              <select
                id="b-occ"
                value={form.occasion}
                onChange={set("occasion")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Choose…</option>
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              {errors.occasion && <p className="text-xs text-destructive">{errors.occasion}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-qty">Approx. quantity *</Label>
              <Input id="b-qty" value={form.quantity} onChange={set("quantity")} placeholder="e.g. 50 pieces" />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="b-date">Needed by</Label>
            <Input
              id="b-date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={form.needed_by}
              onChange={set("needed_by")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="b-details">What do you have in mind? *</Label>
            <Textarea
              id="b-details"
              rows={6}
              value={form.details}
              onChange={set("details")}
              placeholder="Items you like, colours, branding or packaging needs, budget per piece, delivery city…"
            />
            {errors.details && <p className="text-xs text-destructive">{errors.details}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "Send enquiry & continue on WhatsApp"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Prefer to talk? Call or WhatsApp {SITE.phoneDisplay}, or email {SITE.email}. Looking for
            a single personalised piece instead?{" "}
            <Link to="/customize-order" className="underline">
              Custom orders
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default BulkOrders;
