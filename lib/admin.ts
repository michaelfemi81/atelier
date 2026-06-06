import { catalogProducts, StoreProduct } from "@/lib/shop";
import { seededOwnerProducts } from "@/lib/marketplace";

export type AdminProduct = StoreProduct;

export const adminCategories = ["Women", "Men", "Shoes", "Accessories"];

export const initialAdminProducts: AdminProduct[] = seededOwnerProducts.map((product) => ({
  ...product,
  image: product.image.replace("w=900", "w=300")
}));

export const sampleOrders = [
  {
    id: "#AL-1048",
    customer: "Maya Johnson",
    items: "Tailored Midi Dress, Soft Knit Co-ord",
    total: "$178",
    status: "Needs packing",
    date: "Today"
  },
  {
    id: "#AL-1047",
    customer: "Daniel Cole",
    items: "Linen Resort Shirt",
    total: "$48",
    status: "Ready to ship",
    date: "Yesterday"
  },
  {
    id: "#AL-1046",
    customer: "Amara Smith",
    items: "Everyday Denim Jacket",
    total: "$74",
    status: "Delivered",
    date: "2 days ago"
  }
];

export function stockNumber(stock?: string) {
  return Number((stock || "").match(/\d+/)?.[0] || 0);
}
