import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, cartItemKey } from "@/contexts/CartContext";
import { SITE } from "@/lib/site";
import { formatPrice, shippingFor } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";

const CartPage = () => {
  const { state, updateQuantity, removeItem, totalPrice } = useCart();
  const shipping = shippingFor(totalPrice);
  const remaining = SITE.shipping.freeAbove - totalPrice;
  const progress = Math.min(100, (totalPrice / SITE.shipping.freeAbove) * 100);

  if (state.items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <Seo title="Your Bag" noindex />
        <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
        <h1 className="font-display text-3xl mb-2">Your bag is empty</h1>
        <p className="mb-6 text-muted-foreground">Let's find something you'll love.</p>
        <Button asChild>
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <Seo title="Your Bag" noindex />
      <h1 className="font-display text-4xl mb-8">Your Bag</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="divide-y divide-border border-y border-border">
          {state.items.map((item) => {
            const key = cartItemKey(item);
            const variant = [item.color, item.size]
              .filter((v) => v && v !== "One Size")
              .join(" / ");
            return (
              <div key={key} className="flex gap-4 py-5">
                <Link to={`/product/${item.id}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-muted">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link to={`/product/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {variant && <p className="text-xs text-muted-foreground">{variant}</p>}
                      <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-border">
                      <button
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="p-2 hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-2 hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(key)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-2xl mb-4">Summary</h2>

          {remaining > 0 ? (
            <div className="mb-5">
              <p className="mb-2 text-xs text-muted-foreground">
                Add {formatPrice(remaining)} more for free shipping
              </p>
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <p className="mb-5 text-xs text-green-700">🎉 You've unlocked free shipping!</p>
          )}

          <dl className="space-y-2 text-sm">
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
              <dd>{formatPrice(totalPrice + shipping)}</dd>
            </div>
          </dl>

          <Button size="lg" className="mt-6 w-full" asChild>
            <Link to="/checkout">Checkout</Link>
          </Button>
          <Link to="/shop" className="mt-3 block text-center text-sm text-muted-foreground underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
