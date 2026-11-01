import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { formatPrice, imageUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import ProductForm from "./ProductForm";

type Row = {
  id: string;
  slug: string;
  name: string;
  images: string[];
  category_slug: string;
  is_active: boolean;
  product_variants: { price: number; stock: number; made_to_order: boolean; is_active: boolean }[];
};

const ProductsAdmin = () => {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<string | null | undefined>(undefined); // undefined = list, null = new
  const [q, setQ] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id,slug,name,images,category_slug,is_active,product_variants(price,stock,made_to_order,is_active)")
      .order("created_at", { ascending: false });
    if (error) toast.error(`Could not load products: ${error.message}`);
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => {
    if (editing === undefined) load();
  }, [editing]);

  const toggle = async (r: Row) => {
    const { error } = await supabase.from("products").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) return toast.error(error.message);
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
    load();
  };

  if (editing !== undefined) return <ProductForm productId={editing} onDone={() => setEditing(undefined)} />;

  const shown = (rows ?? []).filter((r) => r.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-sm border border-input bg-background py-2.5 pl-10 pr-3 text-sm"
          />
        </div>
        <Button onClick={() => setEditing(null)}>
          <Plus className="mr-1 h-4 w-4" /> Add new product
        </Button>
      </div>

      {rows === null ? (
        <p className="py-10 text-center text-muted-foreground">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">No products yet. Click “Add new product”.</p>
      ) : (
        <ul className="divide-y divide-border rounded-sm border border-border bg-card">
          {shown.map((r) => {
            const vs = r.product_variants.filter((v) => v.is_active);
            const prices = vs.map((v) => Number(v.price));
            const tracked = vs.filter((v) => !v.made_to_order);
            const totalStock = tracked.reduce((s, v) => s + v.stock, 0);
            const soldOut = vs.length === 0 || vs.every((v) => !v.made_to_order && v.stock === 0);
            const low = !soldOut && tracked.some((v) => v.stock > 0 && v.stock <= 2);
            return (
              <li key={r.id} className="flex items-center gap-3 p-3">
                <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-muted">
                  {r.images[0] && <img src={imageUrl(r.images[0])} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {prices.length
                      ? Math.min(...prices) === Math.max(...prices)
                        ? formatPrice(prices[0])
                        : `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`
                      : "No options"}{" "}
                    · {vs.length} option{vs.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 text-xs">
                    {soldOut ? (
                      <span className="text-destructive">Sold out</span>
                    ) : low ? (
                      <span className="text-amber-700">Low stock</span>
                    ) : tracked.length === 0 ? (
                      <span className="text-muted-foreground">Made to order</span>
                    ) : (
                      <span className="text-muted-foreground">{totalStock} in stock</span>
                    )}
                    {!r.is_active && <span className="ml-2 rounded bg-muted px-1.5 py-0.5">Hidden</span>}
                  </p>
                </div>
                <button onClick={() => toggle(r)} className="hidden text-xs underline sm:block">
                  {r.is_active ? "Hide" : "Show"}
                </button>
                <Button size="sm" variant="outline" onClick={() => setEditing(r.id)}>
                  Edit
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProductsAdmin;
