import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import { slugify, uploadProductImage } from "@/lib/uploads";
import { imageUrl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Row = {
  key: string;
  id?: string;
  size: string;
  color: string;
  color_hex: string;
  price: string;
  stock: string;
  made_to_order: boolean;
};

const newRow = (over: Partial<Row> = {}): Row => ({
  key: Math.random().toString(36).slice(2),
  size: "One Size",
  color: "",
  color_hex: "#d9a7a0",
  price: "",
  stock: "1",
  made_to_order: false,
  ...over,
});

const lines = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean);

type Props = { productId: string | null; onDone: () => void };

const ProductForm = ({ productId, onDone }: Props) => {
  const isNew = productId === null;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [compareAt, setCompareAt] = useState("");
  const [material, setMaterial] = useState("");
  const [features, setFeatures] = useState("");
  const [care, setCare] = useState("");
  const [active, setActive] = useState(true);
  const [bestseller, setBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("slug,name")
      .order("sort_order")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("id", productId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Could not load this product");
          onDone();
          return;
        }
        setName(data.name);
        setCategory(data.category_slug);
        setShortDesc(data.short_description ?? "");
        setDesc(data.description ?? "");
        setImages(data.images ?? []);
        setCompareAt(data.compare_at_price ? String(data.compare_at_price) : "");
        setMaterial(data.material ?? "");
        setFeatures((data.features ?? []).join("\n"));
        setCare((data.care ?? []).join("\n"));
        setActive(data.is_active);
        setBestseller(data.is_bestseller);
        setIsNewArrival(data.is_new);
        const vs = [...(data.product_variants ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
        setRows(
          vs.length
            ? vs.map((v: any) =>
                newRow({
                  id: v.id,
                  size: v.size,
                  color: v.color,
                  color_hex: v.color_hex || "#d9a7a0",
                  price: String(v.price),
                  stock: String(v.stock),
                  made_to_order: v.made_to_order,
                })
              )
            : [newRow()]
        );
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadProductImage(f));
      setImages((cur) => [...cur, ...urls]);
    } catch (e: any) {
      const m = String(e?.message ?? "");
      toast.error(
        /decode|image/i.test(m)
          ? "That photo couldn't be read. Please use a JPG, PNG or WebP photo."
          : `Photo upload failed: ${m || "unknown error"}`
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const moveImage = (i: number, dir: -1 | 1) =>
    setImages((cur) => {
      const j = i + dir;
      if (j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const setRow = (key: string, patch: Partial<Row>) =>
    setRows((cur) => cur.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const removeRow = (r: Row) => {
    if (rows.length === 1) return toast.error("A product needs at least one option");
    if (r.id) setRemovedIds((cur) => [...cur, r.id!]);
    setRows((cur) => cur.filter((x) => x.key !== r.key));
  };

  const validate = (): string | null => {
    if (name.trim().length < 2) return "Please enter the product name";
    if (!category) return "Please choose a category";
    if (images.length === 0) return "Please add at least one photo";
    if (compareAt && !(Number(compareAt) > 0)) return "Old price must be a number";
    const seen = new Set<string>();
    for (const r of rows) {
      if (!r.size.trim()) return "Every option needs a size (use “One Size” if there is only one)";
      if (!(Number(r.price) > 0)) return "Every option needs a price";
      if (!r.made_to_order && !(Number.isInteger(Number(r.stock)) && Number(r.stock) >= 0))
        return "Stock must be a whole number (0 or more)";
      const k = `${r.size.trim().toLowerCase()}|${r.color.trim().toLowerCase()}`;
      if (seen.has(k)) return "Two options have the same size and colour";
      seen.add(k);
    }
    return null;
  };

  const save = async () => {
    const problem = validate();
    if (problem) return toast.error(problem);
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category_slug: category,
        short_description: shortDesc.trim(),
        description: desc.trim(),
        images,
        compare_at_price: compareAt ? Number(compareAt) : null,
        material: material.trim(),
        features: lines(features),
        care: lines(care),
        is_active: active,
        is_bestseller: bestseller,
        is_new: isNewArrival,
      };

      let id = productId;
      if (isNew) {
        let slug = slugify(name);
        let res = await supabase.from("products").insert({ ...payload, slug }).select("id").single();
        if (res.error?.code === "23505") {
          slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
          res = await supabase.from("products").insert({ ...payload, slug }).select("id").single();
        }
        if (res.error || !res.data) throw res.error ?? new Error("Could not save");
        id = res.data.id;
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id!);
        if (error) throw error;
      }

      if (removedIds.length) {
        const { error } = await supabase.from("product_variants").delete().in("id", removedIds);
        if (error) throw error;
      }
      for (const [i, r] of rows.entries()) {
        const v = {
          product_id: id,
          size: r.size.trim(),
          color: r.color.trim(),
          color_hex: r.color.trim() ? r.color_hex : "",
          price: Number(r.price),
          stock: r.made_to_order ? 0 : Number(r.stock),
          made_to_order: r.made_to_order,
          sort_order: i,
        };
        const { error } = r.id
          ? await supabase.from("product_variants").update(v).eq("id", r.id)
          : await supabase.from("product_variants").insert(v);
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      toast.success(isNew ? "Product added — it's live on the website" : "Changes saved");
      onDone();
    } catch (e: any) {
      toast.error(`Could not save: ${e?.message ?? "unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const { error } = await supabase.from("products").delete().eq("id", productId!);
    if (error) return toast.error(`Could not delete: ${error.message}`);
    await queryClient.invalidateQueries({ queryKey: ["catalog"] });
    toast.success("Product deleted");
    onDone();
  };

  if (loading) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  const box = "rounded-sm border border-border bg-card p-5 space-y-4";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">{isNew ? "Add a new product" : "Edit product"}</h2>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>

      <section className={box}>
        <h3 className="font-medium">1. About the product</h3>
        <div className="space-y-1.5">
          <Label>Product name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pink Rose Bouquet" />
        </div>
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>One-line summary</Label>
          <Input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Shown under the photo in lists" />
        </div>
        <div className="space-y-1.5">
          <Label>Full description</Label>
          <Textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Tell customers about this piece" />
        </div>
      </section>

      <section className={box}>
        <h3 className="font-medium">2. Photos *</h3>
        <p className="text-sm text-muted-foreground">The first photo is the main one. Use the arrows to reorder.</p>
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative h-28 w-24 overflow-hidden rounded-sm border border-border bg-muted">
              <img src={imageUrl(src)} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-0 top-0 bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">Main</span>
              )}
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setImages((cur) => cur.filter((x) => x !== src))}
                className="absolute right-0 top-0 bg-background/90 p-1"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 flex w-full justify-between bg-background/80">
                <button type="button" aria-label="Move left" onClick={() => moveImage(i, -1)} className="p-1">
                  <ArrowLeft className="h-3 w-3" />
                </button>
                <button type="button" aria-label="Move right" onClick={() => moveImage(i, 1)} className="p-1">
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-28 w-24 flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-border text-xs text-muted-foreground hover:bg-muted"
          >
            <ImagePlus className="h-5 w-5" />
            {uploading ? "Uploading…" : "Add photos"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addPhotos(e.target.files)}
          />
        </div>
      </section>

      <section className={box}>
        <h3 className="font-medium">3. Sizes, colours, prices &amp; stock *</h3>
        <p className="text-sm text-muted-foreground">
          One row for each version you sell. If there is only one version, keep size “One Size” and leave colour empty.
          Tick “Made to order” if you make it fresh each time (no stock count).
        </p>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.key} className="rounded-sm border border-border p-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="space-y-1">
                  <Label className="text-xs">Size</Label>
                  <Input value={r.size} onChange={(e) => setRow(r.key, { size: e.target.value })} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Colour (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={r.color}
                      onChange={(e) => setRow(r.key, { color: e.target.value })}
                      placeholder="e.g. Baby pink"
                    />
                    <input
                      type="color"
                      value={r.color_hex}
                      onChange={(e) => setRow(r.key, { color_hex: e.target.value })}
                      aria-label="Pick colour"
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price (₹) *</Label>
                  <Input inputMode="decimal" value={r.price} onChange={(e) => setRow(r.key, { price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">In stock</Label>
                  <Input
                    inputMode="numeric"
                    value={r.made_to_order ? "" : r.stock}
                    disabled={r.made_to_order}
                    placeholder={r.made_to_order ? "—" : ""}
                    onChange={(e) => setRow(r.key, { stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={r.made_to_order}
                    onChange={(e) => setRow(r.key, { made_to_order: e.target.checked })}
                  />
                  Made to order (always available)
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(r)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const last = rows[rows.length - 1];
            setRows((cur) => [...cur, newRow({ price: last?.price ?? "", made_to_order: last?.made_to_order ?? false })]);
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> Add another size / colour
        </Button>
      </section>

      <section className={box}>
        <h3 className="font-medium">4. More details (optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Old price (₹) — shows a discount</Label>
            <Input inputMode="decimal" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="e.g. 1599" />
          </div>
          <div className="space-y-1.5">
            <Label>Material</Label>
            <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Cotton yarn" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Highlights (one per line)</Label>
          <Textarea rows={3} value={features} onChange={(e) => setFeatures(e.target.value)} placeholder={"Handmade\nEverlasting"} />
        </div>
        <div className="space-y-1.5">
          <Label>Care tips (one per line)</Label>
          <Textarea rows={3} value={care} onChange={(e) => setCare(e.target.value)} placeholder={"Keep dry\nDo not iron"} />
        </div>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Show on website
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} /> Bestseller
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} /> New arrival
          </label>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur">
        {!isNew ? (
          confirmDelete ? (
            <span className="flex items-center gap-2 text-sm">
              Delete for good?
              <Button size="sm" variant="destructive" onClick={remove}>
                Yes, delete
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-muted-foreground underline">
              Delete product
            </button>
          )
        ) : (
          <span />
        )}
        <Button size="lg" onClick={save} disabled={saving || uploading}>
          {saving ? "Saving…" : isNew ? "Add to website" : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
