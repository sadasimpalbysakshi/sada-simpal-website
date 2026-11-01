import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { collections, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const ShopPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "all";
  const sort = params.get("sort") ?? "featured";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== "all" && value !== "featured") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!term ||
          `${p.name} ${p.category} ${p.shortDescription}`.toLowerCase().includes(term))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "newest")
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    else
      list = [...list].sort(
        (a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller)
      );
    return list;
  }, [q, cat, sort]);

  const count = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <Seo
        title="Shop All Handmade Crochet"
        description="Browse handmade crochet bouquets, cuddle toys, hair accessories, home decor, keychains and more."
      />
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl">Shop All</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every piece is handmade — made to order, made to be loved.
        </p>
      </div>

      {/* Collection chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => update("cat", "all")}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
            cat === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-muted"
          )}
        >
          All ({products.length})
        </button>
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => update("cat", c.slug)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
              cat === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            )}
          >
            {c.name} ({count(c.slug)})
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full rounded-sm border border-input bg-background py-2.5 pl-10 pr-9 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          {q && (
            <button
              onClick={() => update("q", "")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{visible.length} items</span>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            aria-label="Sort products"
            className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl mb-2">Nothing here yet</p>
          <p className="mb-6 text-sm text-muted-foreground">
            We couldn't find a match — but we can make it for you.
          </p>
          <Link
            to="/customize-order"
            className="inline-block rounded-sm bg-primary px-6 py-3 text-sm text-primary-foreground"
          >
            Request a custom piece
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
