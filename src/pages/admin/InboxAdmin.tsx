import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Section = "requests" | "messages" | "reviews" | "subscribers";
const when = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const InboxAdmin = () => {
  const [section, setSection] = useState<Section>("requests");
  const [rows, setRows] = useState<any[] | null>(null);

  const table = { requests: "custom_requests", messages: "contact_messages", reviews: "reviews", subscribers: "newsletter_subscribers" }[section];

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(300);
    if (error) toast.error(error.message);
    setRows(data ?? []);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const patch = async (id: string, values: Record<string, unknown>) => {
    const { error } = await supabase.from(table).update(values).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const tabs: [Section, string][] = [
    ["requests", "Custom & bulk requests"],
    ["messages", "Messages"],
    ["reviews", "Reviews"],
    ["subscribers", "Newsletter"],
  ];

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSection(k)}
            className={cn(
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm",
              section === k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {rows === null ? (
        <p className="py-10 text-center text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Nothing here yet.</p>
      ) : section === "subscribers" ? (
        <div className="rounded-sm border border-border bg-card p-4 text-sm">
          <p className="mb-3 font-medium">{rows.length} subscribers</p>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(rows.map((r) => r.email).join(", "));
              toast.success("Email addresses copied");
            }}
          >
            Copy all email addresses
          </Button>
          <ul className="mt-4 max-h-96 space-y-1 overflow-y-auto">
            {rows.map((r) => (
              <li key={r.id} className="flex justify-between gap-3">
                <span>{r.email}</span>
                <span className="text-muted-foreground">{when(r.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="space-y-2 rounded-sm border border-border bg-card p-4 text-sm">
              {section === "requests" && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {r.name} · {r.item_type}
                    </p>
                    <select
                      value={r.status}
                      onChange={(e) => patch(r.id, { status: e.target.value })}
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      {["new", "quoted", "accepted", "done", "declined"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <p className="whitespace-pre-wrap">{r.details}</p>
                  <p className="text-muted-foreground">
                    {r.budget && `Budget: ${r.budget} · `}
                    {r.needed_by && `Needed by: ${r.needed_by} · `}
                    <a className="underline" href={`https://wa.me/91${r.phone}`} target="_blank" rel="noopener noreferrer">
                      {r.phone}
                    </a>
                    {r.email && ` · ${r.email}`} · {when(r.created_at)}
                  </p>
                </>
              )}
              {section === "messages" && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{r.name}</p>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={r.handled} onChange={(e) => patch(r.id, { handled: e.target.checked })} />
                      Done
                    </label>
                  </div>
                  <p className="whitespace-pre-wrap">{r.message}</p>
                  <p className="text-muted-foreground">
                    <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && ` · ${r.phone}`} · {when(r.created_at)}
                  </p>
                </>
              )}
              {section === "reviews" && (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">
                      {r.name} · {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <span className={cn("rounded px-2 py-0.5 text-xs", r.approved ? "bg-muted" : "bg-primary text-primary-foreground")}>
                      {r.approved ? "Showing" : "Waiting for approval"}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{r.text}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant={r.approved ? "outline" : "default"} onClick={() => patch(r.id, { approved: !r.approved })}>
                      {r.approved ? "Hide from website" : "Approve & show"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => del(r.id)}>
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxAdmin;
