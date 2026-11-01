import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SITE } from "@/lib/site";
import { formatPrice, makeOrderNumber, shippingFor } from "@/lib/format";
import {
  INDIAN_STATES,
  LAST_ORDER_KEY,
  PlacedOrder,
  checkoutSchema,
  orderWhatsappMessage,
  placeOrder,
} from "@/lib/orders";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

type Errors = Partial<Record<string, string>>;

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const { state, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failedOrder, setFailedOrder] = useState<PlacedOrder | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "Uttar Pradesh",
    pincode: "",
    notes: "",
    payment: SITE.payments.codEnabled ? "cod" : "upi",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = shippingFor(totalPrice);
  const total = totalPrice + shipping;

  if (state.items.length === 0 && !busy) return <Navigate to="/cart" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setBusy(true);

    const result = await placeOrder(parsed.data, state.items);

    if ("failure" in result) {
      setBusy(false);
      const f = result.failure;
      if (f.kind === "stock" || f.kind === "unavailable") {
        // stock changed since the item was added — refresh the bag and tell the customer
        toast.error(f.message);
        queryClient.invalidateQueries({ queryKey: ["catalog"] });
        return;
      }
      // Couldn't reach the server: don't lose the sale — offer WhatsApp instead.
      setFailedOrder({
        orderNumber: makeOrderNumber(),
        form: parsed.data,
        items: state.items,
        subtotal: totalPrice,
        shipping,
        total,
        savedToDatabase: false,
      });
      toast.error("We couldn't save your order online. You can send it to us on WhatsApp instead.");
      return;
    }

    const placed: PlacedOrder = result.order;
    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(placed));
    } catch {
      /* private mode – fine */
    }
    queryClient.invalidateQueries({ queryKey: ["catalog"] }); // stock just changed
    clearCart();
    navigate(`/order-success/${placed.orderNumber}`, { state: placed, replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <Seo title="Checkout" noindex />
      <h1 className="font-display text-4xl mb-8">Checkout</h1>

      {failedOrder && (
        <div className="mb-8 rounded-sm border border-destructive/40 bg-destructive/5 p-5 text-sm">
          <p className="font-medium mb-1">We couldn't save your order online.</p>
          <p className="mb-3 text-muted-foreground">
            Please send it to us on WhatsApp and we'll confirm it right away.
          </p>
          <Button asChild>
            <a href={orderWhatsappMessage(failedOrder)} target="_blank" rel="noopener noreferrer">
              Send order on WhatsApp
            </a>
          </Button>
        </div>
      )}

      <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="font-display text-2xl">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" error={errors.name}>
                <Input value={form.name} onChange={set("name")} autoComplete="name" />
              </Field>
              <Field label="Mobile number *" error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={set("phone")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit number"
                />
              </Field>
            </div>
            <Field label="Email (optional – for order updates)" error={errors.email}>
              <Input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl">Delivery address</h2>
            <Field label="Address *" error={errors.address1}>
              <Input
                value={form.address1}
                onChange={set("address1")}
                autoComplete="address-line1"
                placeholder="House no., building, street"
              />
            </Field>
            <Field label="Area / landmark (optional)" error={errors.address2}>
              <Input value={form.address2} onChange={set("address2")} autoComplete="address-line2" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City *" error={errors.city}>
                <Input value={form.city} onChange={set("city")} autoComplete="address-level2" />
              </Field>
              <Field label="State *" error={errors.state}>
                <select
                  value={form.state}
                  onChange={set("state")}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pincode *" error={errors.pincode}>
                <Input
                  value={form.pincode}
                  onChange={set("pincode")}
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                />
              </Field>
            </div>
            <Field label="Order notes (optional)" error={errors.notes}>
              <Textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Gift message, preferred colours, delivery instructions…"
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl">Payment</h2>
            <div className="space-y-3">
              {SITE.payments.codEnabled && (
                <label className="flex cursor-pointer gap-3 rounded-sm border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-muted/50">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.payment === "cod"}
                    onChange={() => setForm((f) => ({ ...f, payment: "cod" }))}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">Cash on Delivery</span>
                    <span className="text-xs text-muted-foreground">{SITE.payments.codNote}</span>
                  </span>
                </label>
              )}
              {SITE.payments.upiEnabled && (
                <label className="flex cursor-pointer gap-3 rounded-sm border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-muted/50">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.payment === "upi"}
                    onChange={() => setForm((f) => ({ ...f, payment: "upi" }))}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">UPI / Bank transfer</span>
                    <span className="text-xs text-muted-foreground">{SITE.payments.upiNote}</span>
                  </span>
                </label>
              )}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-sm border border-border bg-card p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-2xl mb-4">Order summary</h2>
          <ul className="mb-4 space-y-3">
            {state.items.map((i) => (
              <li key={`${i.id}-${i.size}-${i.color}`} className="flex gap-3 text-sm">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-muted">
                  <img src={i.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-0 -top-0 bg-foreground px-1.5 text-[10px] text-background">
                    {i.quantity}
                  </span>
                </div>
                <span className="flex-1">{i.name}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>
            {busy ? "Placing order…" : "Place order"}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By placing your order you agree to our{" "}
            <Link to="/terms-of-service" className="underline">Terms</Link> and{" "}
            <Link to="/shipping-returns" className="underline">Return policy</Link>.
          </p>
        </aside>
      </form>
    </div>
  );
};

export default CheckoutPage;
