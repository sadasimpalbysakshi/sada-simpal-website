import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SITE, whatsappLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(15).optional(),
  message: z.string().trim().min(10, "Please write a little more (10+ characters)").max(2000),
});

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send your message. Please WhatsApp or email us instead.");
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      <Seo title="Contact Us" description={`Get in touch with ${SITE.name} — WhatsApp, email or send us a message.`} />
      <h1 className="font-display text-4xl md:text-5xl mb-3 text-center">Contact Us</h1>
      <p className="mb-12 text-center text-muted-foreground">
        Questions, custom ideas or order help — we usually reply within a few hours. Planning a
        corporate or bulk order?{" "}
        <Link to="/bulk-orders" className="underline">
          Send a bulk enquiry
        </Link>
        .
      </p>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <a
            href={whatsappLink(`Hi ${SITE.name}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-sm border border-border p-4 hover:bg-muted/50"
          >
            <MessageCircle className="h-6 w-6 text-[#1a8a45]" />
            <span>
              <span className="block font-medium">WhatsApp (fastest)</span>
              <span className="text-sm text-muted-foreground">{SITE.phoneDisplay}</span>
            </span>
          </a>
          <a href={`tel:+${SITE.whatsapp}`} className="flex items-center gap-4 rounded-sm border border-border p-4 hover:bg-muted/50">
            <Phone className="h-6 w-6" />
            <span>
              <span className="block font-medium">Call</span>
              <span className="text-sm text-muted-foreground">{SITE.phoneDisplay}</span>
            </span>
          </a>
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-sm border border-border p-4 hover:bg-muted/50">
            <Mail className="h-6 w-6" />
            <span className="min-w-0">
              <span className="block font-medium">Email</span>
              <span className="break-all text-sm text-muted-foreground">{SITE.email}</span>
            </span>
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-sm border border-border p-4 hover:bg-muted/50">
            <Instagram className="h-6 w-6" />
            <span>
              <span className="block font-medium">Instagram</span>
              <span className="text-sm text-muted-foreground">{SITE.instagramHandle}</span>
            </span>
          </a>
          <div className="flex items-start gap-4 p-4">
            <MapPin className="h-6 w-6 shrink-0" />
            <span>
              <span className="block font-medium">Studio</span>
              <span className="text-sm text-muted-foreground">
                {SITE.address[0]}, {SITE.address[1]}
              </span>
            </span>
          </div>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-sm bg-secondary/60 p-8 text-center">
            <h2 className="font-display text-3xl mb-2">Message sent 💛</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Thank you! We'll get back to you very soon.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Name *</Label>
              <Input id="c-name" value={form.name} onChange={set("name")} autoComplete="name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email *</Label>
              <Input id="c-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Phone (optional)</Label>
              <Input id="c-phone" value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-msg">Message *</Label>
              <Textarea id="c-msg" rows={5} value={form.message} onChange={set("message")} />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
