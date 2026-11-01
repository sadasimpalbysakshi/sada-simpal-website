import { withBase } from "@/lib/format";

/** One buyable option of a product: a size + colour with its own price and stock. */
export interface Variant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  stock: number;
  madeToOrder: boolean; // always available, stock count ignored
  available: boolean;
}

export interface Product {
  id: string; // the product's web address name, e.g. "rose-crochet-bouquet"
  variants: Variant[];
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  category: string; // matches Collection.slug
  subcategory: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  material: string;
  care: string[];
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const rawCollections: Collection[] = [
  { id: "1", name: "Plushies & Toys", description: "Soft crochet toys & cuddle companions", image: "Collections/Hug.webp", slug: "plushies-toys" },
  { id: "2", name: "Flowers & Bouquets", description: "Handcrafted crochet bouquets that never wilt", image: "Collections/Bouquet.webp", slug: "flowers-bouquets" },
  { id: "3", name: "Accessories", description: "Gajras, hair accessories & keychains", image: "Collections/gajra.webp", slug: "accessories" },
  { id: "4", name: "Baby & Kids", description: "Cute, soft crochet pieces for little ones", image: "Collections/kids.webp", slug: "baby-kids" },
  { id: "5", name: "Home Decor", description: "Handmade crochet coasters & decor", image: "Collections/HomeDecor.webp", slug: "home-decor" },
  { id: "6", name: "Gifting", description: "Thoughtful handmade gifts & gift sets", image: "Collections/keychains.webp", slug: "gifting" },
  { id: "7", name: "Apparel", description: "Stylish crochet tops, scarves & wearables", image: "Collections/womens.webp", slug: "apparel" },
];

export const collections: Collection[] = rawCollections.map((c) => ({
  ...c,
  image: withBase(c.image),
}));

const rawProducts: Omit<Product, "variants">[] = [


    {
  id: 'b1',
  name: 'Rose Crochet Bouquet',
  price: 1299,
  description: 'Handmade crochet rose bouquet',
  shortDescription: 'Crochet rose bouquet',
  images: [
    '/style-hub/products/bouquet/1.webp',
    
  ],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade', 'Everlasting'],
  inStock: true,
  isBestseller: true,
  isNewArrival: false,
  createdAt: "2026-01-27",
},
{
  id: 'b2',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/3.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isBestseller: false,
  isNewArrival: true,
  createdAt: "2026-01-27",
},
{
  id: 'b3',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/4.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},
{
  id: 'b4',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/3.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},
{
  id: 'b5',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/5.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},
{
  id: 'b6',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/6.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},
{
  id: 'b7',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/7.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},

{
  id: 'b8',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/8.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  createdAt: "2025-10-10",
},
{
  id: 'b9',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/9.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  isBestseller: true,
  createdAt: "2025-10-10",
},

{
  id: 'b10',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/10.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isNewArrival: true,
  isBestseller: true,
  createdAt: "2025-10-10",
},
{
  id: 'b11',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/11.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isBestseller: true,
},
{
  id: 'b12',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/12.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isBestseller: true,
},
{
  id: 'b13',
  name: 'Sunflower Crochet Bouquet',
  price: 999,
  description: 'Bright sunflower crochet bouquet',
  shortDescription: 'Sunflower bouquet',
  images: ['/style-hub/products/bouquet/13.webp'],
  category: 'flowers-bouquets',
  subcategory: 'flowers-bouquets',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isBestseller: true,
},


];

/** Work out the "headline" fields (from-price, sizes, colours, in stock?) from the variants. */
export const summariseVariants = (variants: Variant[]) => {
  const available = variants.filter((v) => v.available);
  const priced = available.length ? available : variants;
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colorMap = new Map<string, string>();
  variants.forEach((v) => v.color && !colorMap.has(v.color) && colorMap.set(v.color, v.colorHex));
  return {
    price: priced.length ? Math.min(...priced.map((v) => v.price)) : 0,
    sizes,
    colors: Array.from(colorMap, ([name, hex]) => ({ name, hex })),
    inStock: available.length > 0,
  };
};

/** Built-in copy of the catalogue. Only used if the database can't be reached. */
export const products: Product[] = rawProducts.map((p) => {
  const sizes = p.sizes.length ? p.sizes : ["One Size"];
  const colors = p.colors.length ? p.colors : [{ name: "", hex: "" }];
  const variants: Variant[] = [];
  sizes.forEach((size) =>
    colors.forEach((c) =>
      variants.push({
        id: `static-${p.id}-${variants.length}`,
        size,
        color: c.name,
        colorHex: c.hex,
        price: p.price,
        stock: 0,
        madeToOrder: true,
        available: p.inStock,
      })
    )
  );
  return { ...p, variants, images: p.images.map(withBase) };
});

export const getProduct = (id?: string) => products.find((p) => p.id === id);

export const getCollection = (slug?: string) =>
  collections.find((c) => c.slug.toLowerCase() === (slug ?? "").toLowerCase());

export const productsInCollection = (slug?: string) =>
  products.filter(
    (p) => p.category.toLowerCase() === (slug ?? "").toLowerCase()
  );
