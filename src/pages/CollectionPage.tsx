import { Link, Navigate, useParams } from "react-router-dom";
import { useCollections, useProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";

// old category links -> new categories
const LEGACY: Record<string, string> = {
  bouquet: "flowers-bouquets",
  "cuddle-corner": "plushies-toys",
  "hair-accessories": "accessories",
  "key-chains": "accessories",
  "kids-wear": "baby-kids",
  "womens-wear": "apparel",
  "mens-wear": "apparel",
  scarf: "apparel",
};

const CollectionPage = () => {
  const { slug } = useParams();
  const collections = useCollections();
  const { products, loading } = useProducts();
  const legacy = LEGACY[(slug ?? "").toLowerCase()];
  if (legacy) return <Navigate to={`/collections/${legacy}`} replace />;
  const collection = collections.find((c) => c.slug.toLowerCase() === (slug ?? "").toLowerCase());
  if (!collection) return <NotFound />;

  const items = products.filter((p) => p.category === collection.slug);

  return (
    <div>
      <Seo
        title={collection.name}
        description={`${collection.description}. Handmade crochet by Sada Simpal, Jhansi.`}
        image={collection.image}
      />

      <section className="relative flex h-56 items-center justify-center overflow-hidden md:h-72">
        <img
          src={collection.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="relative px-4 text-center text-background">
          <h1 className="font-display text-4xl md:text-6xl">{collection.name}</h1>
          <p className="mt-2 text-sm md:text-base">{collection.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-foreground">Shop</Link> /{" "}
          <span className="text-foreground">{collection.name}</span>
        </nav>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-3 aspect-[3/4] rounded-sm bg-muted" />
                <div className="mb-2 h-3 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md py-12 text-center">
            <p className="font-display text-3xl mb-3">New pieces coming soon</p>
            <p className="mb-6 text-sm text-muted-foreground">
              We're crocheting the {collection.name.toLowerCase()} collection right now.
              Want something specific? We'd love to make it just for you.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/customize-order"
                className="rounded-sm bg-primary px-6 py-3 text-sm text-primary-foreground"
              >
                Request a custom piece
              </Link>
              <Link to="/shop" className="rounded-sm border border-border px-6 py-3 text-sm">
                Browse everything
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
