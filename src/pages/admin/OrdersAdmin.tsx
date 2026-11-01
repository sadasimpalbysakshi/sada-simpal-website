import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "making", "shipped", "delivered", "cancelled"] as const;
const LABEL: Record<string, string> = {
  pending: "New",
  confirmed: "Confirmed",
  making: "Being made",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  payment_method: string;
  items: { name: string; size: string; color: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  tracking_info: string | null;
  created_at: string;
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) toast.error(`Could not load orders: ${error.message}`);
    setOrders((data as Order[]) ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const update = async (o: Order, patch: Partial<Pick<Order, "status" | "tracking_info">>) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", o.id);
    if (error) return toast.error(`Could not update: ${error.message}`);
    toast.success("Order updated");
    if (patch.status === "cancelled") queryClient.invalidateQueries({ queryKey: ["catalog"] }); // stock returned
    load();
  };

  if (orders === null) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  const counts = (s: string) => orders.filter((o) => o.status === s).length;
  const term = q.trim().toLowerCase();
  const shown = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (!term || `${o.order_number} ${o.customer_name} ${o.phone}`.toLowerCase().includes(term))
  );

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm",
              filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
            )}
          >
            {s === "all" ? `All (${orders.length})` : `${LABEL[s]} (${counts(s)})`}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by order number, name or phone"
        className="mb-4 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm sm:w-80"
      />

      {shown.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">No orders here.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((o) => {
            const isOpen = open === o.id;
            const wa = `https://wa.me/91${o.phone}?text=${encodeURIComponent(
              `Hi ${o.customer_name}, this is Sada Simpal about your order ${o.order_number}.`
            )}`;
            return (
              <li key={o.id} className="rounded-sm border border-border bg-card">
                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div>
                    <p className="font-medium">
                      {o.order_number} · {o.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                      {o.payment_method === "cod" ? "Cash on delivery" : "UPI / bank"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(Number(o.total))}</p>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs",
                        o.status === "pending" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {LABEL[o.status]}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-border p-4 text-sm">
                    <ul className="space-y-1">
                      {o.items.map((i, k) => (
                        <li key={k} className="flex justify-between gap-3">
                          <span>
                            {i.name}
                            {[i.color, i.size].filter((v) => v && v !== "One Size").length > 0 &&
                              ` (${[i.color, i.size].filter((v) => v && v !== "One Size").join(" / ")})`}{" "}
                            × {i.quantity}
                          </span>
                          <span>{formatPrice(Number(i.price) * i.quantity)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{Number(o.shipping) === 0 ? "Free" : formatPrice(Number(o.shipping))}</span>
                      </li>
                      <li className="flex justify-between border-t border-border pt-1 font-medium">
                        <span>Total</span>
                        <span>{formatPrice(Number(o.total))}</span>
                      </li>
                    </ul>

                    <div>
                      <p className="font-medium">{o.customer_name}</p>
                      <p className="text-muted-foreground">
                        {o.address_line1}
                        {o.address_line2 ? `, ${o.address_line2}` : ""}, {o.city}, {o.state} – {o.pincode}
                      </p>
                      {o.notes && <p className="mt-1 rounded bg-muted p-2">Note: {o.notes}</p>}
                      <div className="mt-2 flex flex-wrap gap-3">
                        <a href={`tel:+91${o.phone}`} className="inline-flex items-center gap-1 underline">
                          <Phone className="h-3 w-3" /> {o.phone}
                        </a>
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline">
                          <MessageCircle className="h-3 w-3" /> WhatsApp
                        </a>
                        {o.email && <a href={`mailto:${o.email}`} className="underline">{o.email}</a>}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Status</label>
                        <select
                          value={o.status}
                          onChange={(e) => update(o, { status: e.target.value })}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {LABEL[s]}
                            </option>
                          ))}
                        </select>
                        {o.status !== "cancelled" && (
                          <p className="text-xs text-muted-foreground">Choosing “Cancelled” puts the items back in stock.</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Courier / tracking details</label>
                        <div className="flex gap-2">
                          <Input
                            value={tracking[o.id] ?? o.tracking_info ?? ""}
                            onChange={(e) => setTracking((t) => ({ ...t, [o.id]: e.target.value }))}
                            placeholder="e.g. India Post EE123456789IN"
                          />
                          <Button variant="outline" onClick={() => update(o, { tracking_info: tracking[o.id] ?? "" })}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrdersAdmin;
