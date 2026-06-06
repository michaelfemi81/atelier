import { catalogProducts, priceNumber, readJsonStorage, slugify, StoreProduct, writeJsonStorage } from "@/lib/shop";

export type ShopOwnerStatus = "Pending" | "Active" | "Paused";

export type ShopOwner = {
  id: string;
  name: string;
  shopName: string;
  slug: string;
  email: string;
  status: ShopOwnerStatus;
  walletBalance: number;
  pendingWithdrawals: number;
  joinedAt: string;
  heroImage: string;
  description: string;
};

export type WithdrawalRequest = {
  id: string;
  ownerId: string;
  amount: number;
  status: "Pending" | "Paid";
  requestedAt: string;
};

export const ownerStorageKey = "atelier-lane-shop-owners";
export const withdrawalStorageKey = "atelier-lane-withdrawals";
export const currentOwnerId = "owner-maya";

export const sampleShopOwners: ShopOwner[] = [
  {
    id: currentOwnerId,
    name: "Maya Johnson",
    shopName: "Maya Edit",
    slug: "maya-edit",
    email: "maya@atelierlane.com",
    status: "Active",
    walletBalance: 1240,
    pendingWithdrawals: 180,
    joinedAt: "2026-05-18",
    heroImage: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1500&q=80",
    description: "A concise edit of polished dresses, soft sets, and relaxed tailoring."
  },
  {
    id: "owner-noah",
    name: "Noah Cole",
    shopName: "Noah Atelier",
    slug: "noah-atelier",
    email: "noah@atelierlane.com",
    status: "Active",
    walletBalance: 680,
    pendingWithdrawals: 0,
    joinedAt: "2026-06-02",
    heroImage: "https://images.unsplash.com/photo-1506629905607-d9e297d6336c?auto=format&fit=crop&w=1500&q=80",
    description: "Accessories, clean footwear, and easy menswear with a precise finish."
  },
  {
    id: "owner-kemi",
    name: "Kemi Ade",
    shopName: "Kemi Studio",
    slug: "kemi-studio",
    email: "kemi@atelierlane.com",
    status: "Active",
    walletBalance: 920,
    pendingWithdrawals: 0,
    joinedAt: "2026-05-28",
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1500&q=80",
    description: "Accessories, sandals, and warm-weather pieces curated for polished daily wear."
  },
  {
    id: "owner-ella",
    name: "Ella Rowe",
    shopName: "Ella Row",
    slug: "ella-row",
    email: "ella@atelierlane.com",
    status: "Active",
    walletBalance: 540,
    pendingWithdrawals: 0,
    joinedAt: "2026-06-01",
    heroImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1500&q=80",
    description: "Modern womenswear with utility shapes, soft layers, and easy styling."
  }
];

export const seededOwnerProducts: StoreProduct[] = catalogProducts.map((product, index) => ({
  ...product,
  badge: product.badge || (index % 2 === 0 ? "Shop pick" : "Owner pick")
}));

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export function readShopOwners() {
  const savedOwners = readJsonStorage<ShopOwner[]>(ownerStorageKey, sampleShopOwners);
  const savedIds = new Set(savedOwners.map((owner) => owner.id));
  const missingOwners = sampleShopOwners.filter((owner) => !savedIds.has(owner.id));

  return [...savedOwners, ...missingOwners];
}

export function writeShopOwners(owners: ShopOwner[]) {
  writeJsonStorage(ownerStorageKey, owners);
}

export function readWithdrawals() {
  return readJsonStorage<WithdrawalRequest[]>(withdrawalStorageKey, []);
}

export function writeWithdrawals(withdrawals: WithdrawalRequest[]) {
  writeJsonStorage(withdrawalStorageKey, withdrawals);
}

export function ownerFromShopName(shopName: string, owners: ShopOwner[]) {
  const slug = uniqueShopSlug(shopName, owners);

  return {
    id: `owner-${Date.now()}`,
    name: "",
    shopName,
    slug,
    email: "",
    status: "Pending" as const,
    walletBalance: 0,
    pendingWithdrawals: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
    heroImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1500&q=80",
    description: "A new Atelier Lane shop awaiting super-admin activation."
  };
}

export function uniqueShopSlug(shopName: string, owners: ShopOwner[]) {
  const baseSlug = slugify(shopName) || "shop";
  const existingSlugs = new Set(owners.map((owner) => owner.slug));
  let slug = baseSlug;
  let count = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${count}`;
    count += 1;
  }

  return slug;
}

export function productsForOwner(products: StoreProduct[], ownerId: string) {
  return products.filter((product) => product.ownerId === ownerId || (!product.ownerId && ownerId === currentOwnerId));
}

export function productsForActiveOwners(products: StoreProduct[], owners: ShopOwner[]) {
  const activeOwnerIds = new Set(owners.filter((owner) => owner.status === "Active").map((owner) => owner.id));

  return products.filter((product) => !product.ownerId || activeOwnerIds.has(product.ownerId));
}

export function salesEstimate(products: StoreProduct[]) {
  return products.reduce((total, product) => total + priceNumber(product.price) * 4, 0);
}

export function recommendedAcrossShops(products: StoreProduct[], limit = 4) {
  const selectedProducts: StoreProduct[] = [];
  const selectedShopSlugs = new Set<string>();
  const productsWithShops = products.filter((product) => product.shopSlug);

  for (const product of productsWithShops) {
    if (!product.shopSlug || selectedShopSlugs.has(product.shopSlug)) {
      continue;
    }

    selectedProducts.push(product);
    selectedShopSlugs.add(product.shopSlug);

    if (selectedProducts.length === limit) {
      return selectedProducts;
    }
  }

  for (const product of products) {
    if (selectedProducts.some((selectedProduct) => selectedProduct.name === product.name)) {
      continue;
    }

    selectedProducts.push(product);

    if (selectedProducts.length === limit) {
      return selectedProducts;
    }
  }

  return selectedProducts;
}
