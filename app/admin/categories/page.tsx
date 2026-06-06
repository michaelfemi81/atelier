"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Tags } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { AdminProduct, adminCategories, initialAdminProducts } from "@/lib/admin";
import { productStorageKey } from "@/lib/shop";

export default function AdminCategoriesPage() {
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

  const categoryRows = useMemo(
    () =>
      adminCategories.map((category) => ({
        name: category,
        count: products.filter((product) => product.category === category).length,
        value: products
          .filter((product) => product.category === category)
          .reduce((total, product) => total + Number(product.price.replace(/[^0-9.]/g, "")), 0)
      })),
    [products]
  );

  return (
    <AdminShell active="categories" title="Categories" actionHref="/admin/products" actionLabel="Add product">
      <section className="panel">
        <h2>Category overview</h2>
        <div className="category-admin-grid">
          {categoryRows.map((category) => (
            <a className="category-admin-card" href={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name}>
              <Tags size={24} />
              <div>
                <h3>{category.name}</h3>
                <p>{category.count} product{category.count === 1 ? "" : "s"} / ${category.value.toFixed(2)} listed value</p>
              </div>
              <ArrowRight size={18} />
            </a>
          ))}
        </div>
      </section>

      <section className="panel admin-spaced-panel">
        <h2>Category management</h2>
        <p className="muted">
          Add products from the Products page and choose a category. These category pages update automatically
          from the saved catalog.
        </p>
      </section>
    </AdminShell>
  );
}
