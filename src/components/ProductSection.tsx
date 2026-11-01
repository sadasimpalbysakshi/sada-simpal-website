import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import { useProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

type Props = {
  title: string;
  filter: (product: Product) => boolean;
  viewAllHref?: string;
};

const ProductSection = ({ title, filter, viewAllHref = "/shop" }: Props) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { products } = useProducts();

  const items = products
    .filter(filter)
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 10);

  const scroll = (dir: 1 | -1) =>
    sliderRef.current?.scrollBy({ left: dir * 520, behavior: "smooth" });

  if (items.length === 0) return null;

  return (
    <section className="bg-secondary/30 px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
          <div className="flex items-center gap-4">
            <Link to={viewAllHref} className="hidden text-sm underline underline-offset-4 sm:block">
              View all
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(-1)}
                aria-label="Scroll left"
                className="rounded-full border p-2 hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Scroll right"
                className="rounded-full border p-2 hover:bg-muted"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {items.map((p) => (
            <div key={p.id} className="w-[200px] shrink-0 snap-start md:w-[250px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
