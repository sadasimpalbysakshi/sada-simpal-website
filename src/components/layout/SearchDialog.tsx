import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

const SearchDialog = ({ open, onOpenChange }: Props) => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { products } = useProducts();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        `${p.name} ${p.category} ${p.shortDescription}`.toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [q, products]);

  const close = () => {
    onOpenChange(false);
    setQ("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="top-[20%] translate-y-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bouquets, keychains, scarves…"
            className="w-full rounded-sm border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </form>

        {q.trim() && (
          <div className="max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing found for “{q}”. Can't find it? We take{" "}
                <Link to="/customize-order" onClick={close} className="underline">
                  custom orders
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      onClick={close}
                      className="flex items-center gap-3 py-3 hover:bg-muted/60"
                    >
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-14 w-12 rounded-sm object-cover"
                      />
                      <span className="flex-1 text-sm">{p.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
