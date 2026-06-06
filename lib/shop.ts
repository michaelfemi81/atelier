export type StoreProduct = {
  name: string;
  price: string;
  meta?: string;
  badge?: string;
  image: string;
  category: string;
  ownerId?: string;
  shopSlug?: string;
  shopName?: string;
  stock?: string;
  description?: string;
  sizes?: string;
  colors?: string;
};

export const categories = [
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1506629905607-d9e297d6336c?auto=format&fit=crop&w=900&q=80"
  }
];

export const productStorageKey = "atelier-lane-products";
export const cartStorageKey = "atelier-lane-cart";
export const wishlistStorageKey = "atelier-lane-wishlist";

export const catalogProducts: StoreProduct[] = [
  {
    name: "Linen Resort Shirt",
    price: "$48",
    category: "Men",
    ownerId: "owner-maya",
    shopName: "Maya Edit",
    shopSlug: "maya-edit",
    meta: "Sage, Cream, Black",
    badge: "New",
    stock: "32 in stock",
    sizes: "S, M, L, XL",
    colors: "Sage, Cream, Black",
    description: "A breathable linen shirt with a relaxed resort fit and soft drape.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Tailored Midi Dress",
    price: "$86",
    category: "Women",
    ownerId: "owner-maya",
    shopName: "Maya Edit",
    shopSlug: "maya-edit",
    meta: "XS - XL",
    badge: "Best seller",
    stock: "24 in stock",
    sizes: "XS, S, M, L, XL",
    colors: "Black, Cream",
    description: "A clean midi silhouette with structured seams and an easy day-to-night finish.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Everyday Denim Jacket",
    price: "$74",
    category: "Men",
    ownerId: "owner-maya",
    shopName: "Maya Edit",
    shopSlug: "maya-edit",
    meta: "Light wash",
    badge: "Low stock",
    stock: "8 in stock",
    sizes: "S, M, L, XL",
    colors: "Light wash",
    description: "A soft denim layer cut for repeat wear, finished with practical chest pockets.",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Soft Knit Co-ord",
    price: "$92",
    category: "Women",
    ownerId: "owner-maya",
    shopName: "Maya Edit",
    shopSlug: "maya-edit",
    meta: "Two-piece set",
    badge: "Trending",
    stock: "16 in stock",
    sizes: "XS, S, M, L",
    colors: "Stone, Cocoa",
    description: "A matching knit set with a soft handfeel, built for travel days and weekends.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
  }
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function productSlug(product: Pick<StoreProduct, "name">) {
  return slugify(product.name);
}

export function priceNumber(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export function savedProductMeta(product: StoreProduct): StoreProduct {
  return {
    ...product,
    badge: product.badge || "Owner pick",
    meta: product.meta || product.category || product.stock || "New item"
  };
}

export function readStoredProducts() {
  const savedProducts = window.localStorage.getItem(productStorageKey);

  if (!savedProducts) {
    return catalogProducts;
  }

  try {
    const parsedProducts = JSON.parse(savedProducts) as StoreProduct[];
    return parsedProducts.map(savedProductMeta);
  } catch {
    window.localStorage.removeItem(productStorageKey);
    return catalogProducts;
  }
}

export function readJsonStorage<T>(key: string, fallback: T) {
  const saved = window.localStorage.getItem(key);

  if (!saved) {
    return fallback;
  }

  try {
    return JSON.parse(saved) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function writeJsonStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function recommendationsFor(product: StoreProduct, products: StoreProduct[]) {
  const categoryMatches = products.filter(
    (candidate) => candidate.name !== product.name && candidate.category === product.category
  );
  const fallback = products.filter((candidate) => candidate.name !== product.name);

  return [...categoryMatches, ...fallback].slice(0, 4);
}
