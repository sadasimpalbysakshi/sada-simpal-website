import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/data/products";
import { maxQtyFor } from "@/lib/catalog";
import { useCart } from "@/contexts/CartContext";
import { discountPercent, formatPrice } from "@/lib/format";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem, setCartOpen } = useCart();
  const off = discountPercent(product.price, product.originalPrice);
  const needsChoice = product.variants.length > 1;
  const onlyOption = product.variants[0];
  const hasRange = product.variants.some((v) => v.price !== product.price);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onlyOption?.available) return;
    addItem({
      variantId: onlyOption.id,
      id: product.id,
      name: product.name,
      price: onlyOption.price,
      image: product.images[0],
      size: onlyOption.size,
      color: onlyOption.color,
      maxQty: maxQtyFor(onlyOption),
    });
    toast.success(`${product.name} added to your bag`);
    setCartOpen(true);
  };

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {!product.inStock && (
              <span className="bg-foreground text-background text-[10px] tracking-wider uppercase px-2 py-1">
                Sold out
              </span>
            )}
            {off > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] tracking-wider uppercase px-2 py-1">
                {off}% off
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-background/90 text-foreground text-[10px] tracking-wider uppercase px-2 py-1">
                New
              </span>
            )}
          </div>
        </div>
        <h3 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm">
          {hasRange && <span className="mr-1 text-muted-foreground">From</span>}
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="ml-2 text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
      </Link>

      {product.inStock && !needsChoice && (
        <button
          onClick={quickAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute right-2 top-[calc(100%-5.5rem)] hidden h-10 w-10 items-center justify-center rounded-full bg-background/95 shadow-md opacity-0 transition-opacity group-hover:opacity-100 md:flex hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
