import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { LAST_ORDER_KEY, PlacedOrder, orderWhatsappMessage } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";

const loadOrder = (orderNumber?: string, fromState?: PlacedOrder): PlacedOrder | null => {
  if (fromState && fromState.orderNumber === orderNumber) return fromState;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (raw) {
      const o = JSON.parse(raw) as PlacedOrder;
      if (o.orderNumber === orderNumber) return o;
    }
  } catch {
    /* ignore */
  }
  return null;
};

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = loadOrder(orderNumber, location.state as PlacedOrder | undefined);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <Seo title="Order placed" noindex />
      <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />
      <h1 className="font-display text-4xl mb-2">Thank you!</h1>
      <p className="text-muted-foreground">
        Your order <span className="font-medium text-foreground">{orderNumber}</span> has been received.
      </p>

      {order ? (
        <>
          <div className="mt-8 rounded-sm border border-border bg-card p-6 text-left text-sm">
            <ul className="space-y-2">
              {order.items.map((i) => (
                <li key={`${i.id}-${i.size}-${i.color}`} className="flex justify-between gap-4">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              Delivering to {order.form.name}, {order.form.address1}, {order.form.city},{" "}
              {order.form.state} – {order.form.pincode}
            </p>
          </div>

          <div className="mt-8 rounded-sm bg-secondary/60 p-6 text-sm">
            <h2 className="font-display text-2xl mb-2">What happens next</h2>
            <ol className="mx-auto max-w-md list-decimal space-y-2 pl-5 text-left text-muted-foreground">
              <li>Tap the button below to send us your order number on WhatsApp.</li>
              <li>
                {order.form.payment === "upi"
                  ? SITE.payments.upiId
                    ? `Pay ${formatPrice(order.total)} to UPI ID ${SITE.payments.upiId} and share the screenshot.`
                    : "We'll share payment details on WhatsApp to confirm your order."
                  : "We confirm your order and start crafting. You pay in cash on delivery."}
              </li>
              <li>
                Your piece is made and dispatched in {SITE.shipping.dispatchDays}, then delivered
                in about {SITE.shipping.deliveryDays}.
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href={orderWhatsappMessage(order)} target="_blank" rel="noopener noreferrer">
                Confirm on WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            Keep your order number handy — message us on WhatsApp or at {SITE.email} if you need
            anything.
          </p>
          <Button asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessPage;
