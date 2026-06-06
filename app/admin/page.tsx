"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, Package, ShoppingCart } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { AdminProduct, initialAdminProducts, sampleOrders, stockNumber } from "@/lib/admin";
import { productStorageKey } from "@/lib/shop";

const baseStats = [
  { label: "Revenue", value: "$12.8k" },
  { label: "Orders", value: "184" },
  { label: "Products", value: "0" },
  { label: "Low stock", value: "0" }
];

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);

  useEffect(() => {
    const savedProducts = window.localStorage.getItem(productStorageKey);

    if (!savedProducts) {
      return;
    }

    try {
      setProducts(JSON.parse(savedProducts));
    } catch {
      window.localStorage.removeItem(productStorageKey);
    }
  }, []);

  const stats = useMemo(
    () =>
      baseStats.map((stat) => {
        if (stat.label === "Products") {
          return { ...stat, value: String(products.length) };
        }

        if (stat.label === "Low stock") {
          return { ...stat, value: String(products.filter((product) => stockNumber(product.stock) <= 10).length) };
        }

        return stat;
      }),
    [products]
  );

  return (
    <AdminShell active="dashboard" title="Store admin" actionHref="/admin/products" actionLabel="Add product">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <section className="panel">
          <h2>Today’s operations</h2>
          <div className="table-list">
            <div className="table-row">
              <ShoppingCart size={24} />
              <div>
                <strong>{sampleOrders.filter((order) => order.status !== "Delivered").length} active orders</strong>
                <div className="muted">Review packing and shipping status.</div>
              </div>
              <a className="secondary-button" href="/admin/orders">Open</a>
            </div>
            <div className="table-row">
              <Boxes size={24} />
              <div>
                <strong>{products.filter((product) => stockNumber(product.stock) <= 10).length} low-stock items</strong>
                <div className="muted">Reorder or update availability.</div>
              </div>
              <a className="secondary-button" href="/admin/inventory">Open</a>
            </div>
            <div className="table-row">
              <Package size={24} />
              <div>
                <strong>{products.length} product records</strong>
                <div className="muted">Add, review, and organize catalog items.</div>
              </div>
              <a className="secondary-button" href="/admin/products">Open</a>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Recent orders</h2>
          <div className="table-list">
            {sampleOrders.map((order) => (
              <div className="table-row" key={order.id}>
                <BarChart3 size={24} />
                <div>
                  <strong>{order.id} / {order.customer}</strong>
                  <div className="muted">{order.status}</div>
                </div>
                <strong>{order.total}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
