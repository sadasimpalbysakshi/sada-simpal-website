import { SITE } from "@/lib/site";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export const discountPercent = (price: number, original?: number) =>
  original && original > price
    ? Math.round(((original - price) / original) * 100)
    : 0;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= SITE.shipping.freeAbove
    ? 0
    : SITE.shipping.flatFee;

/** Human-friendly order number, e.g. SS-241101-K7QF */
export const makeOrderNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(
    d.getMonth() + 1
  ).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 4; i++)
    rand += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `SS-${ymd}-${rand}`;
};

/** Resolve "/style-hub/..." style public paths against Vite's base URL. */
export const withBase = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\/?style-hub\//, "").replace(/^\//, "");
  return `${base}${clean}`;
};

/** Product photos are either full web addresses (uploaded by the admin) or
 *  files that ship with the site (e.g. "products/bouquet/1.webp"). */
export const imageUrl = (src: string) =>
  /^https?:\/\//i.test(src) ? src : withBase(src);
