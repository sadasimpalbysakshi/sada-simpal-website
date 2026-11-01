import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { imageUrl } from "@/lib/format";
import {
  Collection,
  Product,
  Variant,
  collections as staticCollections,
  products as staticProducts,
  summariseVariants,
} from "@/data/products";

export type Catalog = { collections: Collection[]; products: Product[] };

/** Largest quantity a customer may put in the bag for this option. */
export const maxQtyFor = (v: Pick<Variant, "madeToOrder" | "stock">) =>
  v.madeToOrder ? 10 : Math.max(0, Math.min(10, v.stock));

const toVariant = (v: any): Variant => ({
  id: v.id,
  size: v.size,
  color: v.color ?? "",
  colorHex: v.color_hex ?? "",
  price: Number(v.price),
  stock: v.stock ?? 0,
  madeToOrder: !!v.made_to_order,
  available: !!v.made_to_order || (v.stock ?? 0) > 0,
});

export const toProduct = (row: any): Product | null => {
  const variants = ((row.product_variants ?? []) as any[])
    .filter((v) => v.is_active !== false)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(toVariant);
  if (variants.length === 0) return null; // nothing to buy yet
  const s = summariseVariants(variants);
  return {
    id: row.slug,
    variants,
    name: row.name,
    price: s.price,
    originalPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    description: row.description ?? "",
    shortDescription: row.short_description ?? "",
    images: (row.images ?? []).map(imageUrl),
    category: row.category_slug,
    subcategory: row.category_slug,
    colors: s.colors,
    sizes: s.sizes,
    material: row.material ?? "",
    care: row.care ?? [],
    features: row.features ?? [],
    inStock: s.inStock,
    isBestseller: row.is_bestseller,
    isNewArrival: row.is_new,
    createdAt: row.created_at,
  };
};

export const fetchCatalog = async (): Promise<Catalog> => {
  const [cats, prods] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at", { ascending: false }),
  ]);
  if (cats.error) throw cats.error;
  if (prods.error) throw prods.error;
  return {
    collections: (cats.data ?? []).map((c: any) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      description: c.description ?? "",
      image: imageUrl(c.image ?? ""),
    })),
    products: (prods.data ?? []).map(toProduct).filter((p): p is Product => !!p),
  };
};

export const useCatalog = () =>
  useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog, staleTime: 60_000, retry: 1 });

/** Categories for menus. Shows the built-in list while loading or if offline. */
export const useCollections = (): Collection[] => {
  const { data } = useCatalog();
  return data?.collections ?? staticCollections;
};

/** Products for the shop. `loading` is true until the first answer;
 *  `offline` means the database couldn't be reached and the built-in copy is shown. */
export const useProducts = () => {
  const q = useCatalog();
  return {
    products: q.data?.products ?? (q.isError ? staticProducts : []),
    loading: q.isLoading,
    offline: q.isError,
  };
};

export const useProduct = (slug?: string) => {
  const { products, loading, offline } = useProducts();
  return { product: products.find((p) => p.id === slug), products, loading, offline };
};
