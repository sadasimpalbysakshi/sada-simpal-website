import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Minus, Plus, Share2, Truck, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { getProduct, getCollection, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { SITE, whatsappLink } from "@/lib/site";
import { discountPercent, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const ProductPage = () => {
  const { id } = useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { addItem, setCartOpen } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);

  // reset selections when navigating between products
  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setSize(product?.sizes.length === 1 ? product.sizes[0] : "");
    setColor(product?.colors.length === 1 ? product.colors[0].name : "");
  }, [product?.id]);

  if (!product) return <NotFound />;

  const collection = getCollection(product.category);
  const off = discountPercent(product.price, product.originalPrice);
  const needSize = product.sizes.length > 1;
  const needColor = product.colors.length > 1;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const validate = () => {
    if (needSize && !size) {
      toast.error("Please choose a size");
      return false;
    }
    if (needColor && !color) {
      toast.error("Please choose a colour");
      return false;
    }
    return true;
  };

  const add = () =>
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: size || product.sizes[0] || "",
        color: color || "",
      },
      qty
    );

  const handleAdd = () => {
    if (!validate()) return;
    add();
    toast.success("Added to your bag");
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    add();
    navigate("/checkout");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* user cancelled */
    }
  };

  const waMessage = `Hi ${SITE.name}! I'd like to order:\n\n${product.name} × ${qty}\nPrice: ${formatPrice(
    product.price * qty
  )}\n${window.location.href}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <Seo
        title={product.name}
        description={product.shortDescription || product.description}
        image={product.images[0]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images,
          brand: { "@type": "Brand", name: SITE.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.price,
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }}
      />

      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
        {collection && (
          <>
            <Link to={`/collections/${collection.slug}`} className="hover:text-foreground">
              {collection.name}
            </Link>{" "}
            /{" "}
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-sm bg-muted">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    "h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2",
                    i === activeImage ? "border-primary" : "border-transparent"
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl md:text-4xl">{product.name}</h1>
            <button onClick={share} aria-label="Share" className="p-2 hover:text-primary">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-sm bg-primary px-2 py-1 text-xs text-primary-foreground">
                  {off}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclusive of all taxes ·{" "}
            {product.inStock ? (
              <span className="text-green-700">Available</span>
            ) : (
              <span className="text-destructive">Currently sold out</span>
            )}
          </p>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Variants */}
          {needSize && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 rounded-sm border px-3 py-2 text-sm",
                      size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {needColor && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Colour{color && `: ${color}`}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "h-9 w-9 rounded-full border-2",
                      color === c.name ? "border-primary ring-2 ring-primary/30" : "border-border"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTAs */}
          {product.inStock ? (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-sm border border-border">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-3 hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="p-3 hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total {formatPrice(product.price * qty)}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button size="lg" onClick={handleAdd}>
                  Add to Bag
                </Button>
                <Button size="lg" variant="outline" onClick={handleBuyNow}>
                  Buy Now
                </Button>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#25D366] py-3 text-sm text-[#1a8a45] hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="h-4 w-4" /> Order on WhatsApp
                </a>
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                This piece is sold out, but we can make another just for you.
              </p>
              <Button size="lg" asChild>
                <Link to="/customize-order">Request a custom piece</Link>
              </Button>
            </div>
          )}

          <p className="mt-4 text-sm">
            Want it in different colours or a personal touch?{" "}
            <Link to="/customize-order" className="underline underline-offset-4">
              Customise this
            </Link>
          </p>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-border py-5 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="h-5 w-5" /> 100% handmade
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="h-5 w-5" /> Ships across India
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Packed with care
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="details" className="mt-2">
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Material: {product.material}</li>
                  {product.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger>Care</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link to="/care-instructions" className="mt-2 inline-block text-sm underline">
                  Full care guide
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Made and dispatched in {SITE.shipping.dispatchDays}, delivered in about{" "}
                {SITE.shipping.deliveryDays}. Free shipping above{" "}
                {formatPrice(SITE.shipping.freeAbove)}.{" "}
                <Link to="/shipping-returns" className="underline">
                  Read the full policy
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-center font-display text-3xl">You may also love</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
