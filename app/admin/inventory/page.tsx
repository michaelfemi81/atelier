"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { AdminProduct, initialAdminProducts, stockNumber } from "@/lib/admin";
import { productStorageKey } from "@/lib/shop";

export default function AdminInventoryPage() {
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

  const inventory = useMemo(
    () =>
      products.map((product) => {
        const quantity = stockNumber(product.stock);
        const state = quantity <= 0 ? "Out" : quantity <= 10 ? "Low" : "Healthy";

        return { ...product, quantity, state };
      }),
    [products]
  );

  return (
    <AdminShell active="inventory" title="Inventory" actionHref="/admin/products" actionLabel="Add product">
      <div className="stats-grid">
        <div className="stat"><span>Total SKUs</span><strong>{products.length}</strong></div>
        <div className="stat"><span>Low stock</span><strong>{inventory.filter((item) => item.state === "Low").length}</strong></div>
        <div className="stat"><span>Out of stock</span><strong>{inventory.filter((item) => item.state === "Out").length}</strong></div>
        <div className="stat"><span>Healthy</span><strong>{inventory.filter((item) => item.state === "Healthy").length}</strong></div>
      </div>

      <section className="panel">
        <h2>Stock status</h2>
        <div className="table-list">
          {inventory.map((product) => (
            <div className="admin-order-row" key={product.name}>
              <div className="thumb" style={{ backgroundImage: `url(${product.image})` }} />
              <div>
                <strong>{product.name}</strong>
                <div className="muted">{product.category}</div>
              </div>
              <div>
                <strong>{product.quantity} units</strong>
                <div className="muted">{product.stock}</div>
              </div>
              <span className={product.state === "Healthy" ? "status-pill healthy" : "status-pill warning"}>
                {product.state === "Healthy" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                {product.state}
              </span>
              <a className="secondary-button" href="/admin/products">Edit</a>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
