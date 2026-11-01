export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
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

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  slug: string;
}

export const collections: Collection[] = [
  {
    id: '1',
    name: 'Bouquet',
    description: 'Handcrafted crochet flower bouquets',
    image: '/style-hub/Collections/Bouquet.jpeg',
    slug: 'bouquet',
  },
  {
    id: '2',
    name: 'Cuddle Corner',
    description: 'Soft crochet toys & cuddle companions',
    image: '/style-hub/Collections/Hug.jpeg',
    slug: 'cuddle-corner',
  },
  {
    id: '3',
    name: 'Hair Accessories',
    description: 'Crochet gajras & hair accessories',
    image: '/style-hub/Collections/gajra.jpeg',
    slug: 'hair-accessories',
  },
  {
    id: '4',
    name: 'Home Decor',
    description: 'Handmade crochet coasters',
    image: '/style-hub/Collections/HomeDecor.png',
    slug: 'Home-Decor',
  },
  {
    id: '5',
    name: 'Kids Wear',
    description: 'Cute crochet wear for kids',
    image: '/style-hub/Collections/kids.png',
    slug: 'kids-wear',
  },
  {
    id: '6',
    name: 'Womens Wear',
    description: 'Stylish crochet tops',
    image: '/style-hub/Collections/womens.png',
    slug: 'womens-wear',
  },
  {
    id: '7',
    name: 'Mens Wear',
    description: 'Crochet accessories for men',
    image: '/style-hub/Collections/mens.png',
    slug: 'mens-wear',
  },
  {
    id: '8',
    name: 'Key Chains',
    description: 'Cute crochet keychains',
    image: '/style-hub/Collections/keychains.png',
    slug: 'key-chains',
  },
  {
    id: '9',
    name: 'Chrochet Scarf',
    description: 'Crochet curtain tie-backs',
    image: '/style-hub/Collections/Scarf.png',
    slug: 'scarf',
  },
];


export const products: Product[] = [


    {
  id: 'b1',
  name: 'Rose Crochet Bouquet',
  price: 1299,
  description: 'Handmade crochet rose bouquet',
  shortDescription: 'Crochet rose bouquet',
  images: [
    '/style-hub/products/bouquet/1.jpg',
    
  ],
  category: 'bouquet',   // 👈 MATCH SLUG
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/3.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/4.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/3.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/5.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/6.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/7.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/8.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/9.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/10.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/11.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/12.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
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
  images: ['/style-hub/products/bouquet/13.jpg'],
  category: 'bouquet',
  subcategory: 'bouquet',
  colors: [],
  sizes: ['One Size'],
  material: 'Cotton Yarn',
  care: ['Keep dry'],
  features: ['Handmade'],
  inStock: true,
  isBestseller: true,
},


];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Caring for Linen: A Complete Guide',
    excerpt: 'Discover the secrets to keeping your linen garments looking beautiful for years to come.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    author: 'Priya Sharma',
    date: '2026-01-05',
    category: 'Care Tips',
    slug: 'caring-for-linen-guide',
  },
  {
    id: '2',
    title: 'Summer Styling: 5 Ways to Wear Linen',
    excerpt: 'From beach to boardroom, explore versatile ways to style your linen pieces this summer.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    author: 'Ananya Desai',
    date: '2025-12-28',
    category: 'Style Guide',
    slug: 'summer-linen-styling',
  },
  {
    id: '3',
    title: 'Why Choose Sustainable Linen?',
    excerpt: 'Learn about the environmental benefits of choosing linen and our commitment to sustainability.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    author: 'Sadasahi Team',
    date: '2025-12-15',
    category: 'Sustainability',
    slug: 'sustainable-linen',
  },
  {
    id: '4',
    title: 'Building a Capsule Wardrobe with Linen',
    excerpt: 'Create a timeless wardrobe with just a few essential linen pieces.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    author: 'Riya Patel',
    date: '2025-12-08',
    category: 'Style Guide',
    slug: 'linen-capsule-wardrobe',
  },
];

export const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Shirts', slug: 'shirts' },
  { name: 'Tops', slug: 'tops' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Bottoms', slug: 'bottoms' },
  { name: 'Outerwear', slug: 'outerwear' },
];

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const colors = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Natural', hex: '#E8E0D5' },
  { name: 'Beige', hex: '#D4C5B9' },
  { name: 'Navy', hex: '#2C3E50' },
  { name: 'Olive', hex: '#7D8471' },
  { name: 'Sage', hex: '#9CAF88' },
];

export const priceRanges = [
  { label: 'Under ₹4,000', min: 0, max: 4000 },
  { label: '₹4,000 - ₹6,000', min: 4000, max: 6000 },
  { label: '₹6,000 - ₹8,000', min: 6000, max: 8000 },
  { label: 'Above ₹8,000', min: 8000, max: Infinity },
];


