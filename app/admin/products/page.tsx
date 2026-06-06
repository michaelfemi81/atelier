"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ImagePlus, Minus, Search, Upload } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { AdminProduct, adminCategories, initialAdminProducts } from "@/lib/admin";
import { currentOwnerId, readShopOwners, sampleShopOwners, ShopOwner } from "@/lib/marketplace";
import { productStorageKey } from "@/lib/shop";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);
  const [owners, setOwners] = useState<ShopOwner[]>(sampleShopOwners);
  const [isLoaded, setIsLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    sizes: "",
    colors: "",
    description: "",
    image: ""
  });
  const [message, setMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedProducts = window.localStorage.getItem(productStorageKey);

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        window.localStorage.removeItem(productStorageKey);
      }
    }

    setOwners(readShopOwners());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(productStorageKey, JSON.stringify(products));
  }, [isLoaded, products]);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.stock} ${product.price}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );
  const currentOwner = owners.find((owner) => owner.id === currentOwnerId) || sampleShopOwners[0];
  const ownerProducts = filteredProducts.filter(
    (product) => product.ownerId === currentOwner.id || (!product.ownerId && currentOwner.id === currentOwnerId)
  );

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = form.name.trim();
    const cleanPrice = form.price.trim();
    const cleanCategory = form.category.trim();
    const cleanStock = form.stock.trim();

    if (!cleanName || !cleanPrice || !cleanCategory || !cleanStock) {
      setMessage("Add a name, price, category, and stock quantity before saving.");
      return;
    }

    setProducts((current) => [
      {
        name: cleanName,
        price: cleanPrice.startsWith("$") ? cleanPrice : `$${cleanPrice}`,
        category: cleanCategory,
        ownerId: currentOwner.id,
        shopName: currentOwner.shopName,
        shopSlug: currentOwner.slug,
        stock: `${cleanStock} in stock`,
        description: form.description.trim(),
        sizes: form.sizes.trim(),
        colors: form.colors.trim(),
        meta: form.colors.trim() || form.sizes.trim() || cleanCategory,
        image:
          form.image.trim() ||
          "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80"
      },
      ...current
    ]);
    setForm({
      name: "",
      price: "",
      category: "",
      stock: "",
      sizes: "",
      colors: "",
      description: "",
      image: ""
    });
    setMessage(
      currentOwner.status === "Active"
        ? "Product saved. It now appears in your shop and storefront."
        : "Product saved. It will appear publicly after super-admin activation."
    );
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateField("image", String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  return (
    <AdminShell active="products" title="Products">
      <div className="admin-toolbar">
        <a className="secondary-button" href={`/shops/${currentOwner.slug}`}>
          View shop page
        </a>
        <button className="secondary-button" onClick={() => setSearchOpen((open) => !open)}>
          {searchOpen ? <Minus size={18} /> : <Search size={18} />}
          Search products
        </button>
      </div>
      {searchOpen ? (
        <div className="admin-search">
          <Search size={18} />
          <input
            aria-label="Search admin products"
            placeholder="Search products, category, stock..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
        </div>
      ) : null}

      <div className="admin-grid">
        <section className="panel">
          <h2>Upload clothing item</h2>
          <p className="muted">Products are saved under {currentOwner.shopName}. Public domain: {currentOwner.slug}.atelierlane.com</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Product name</label>
              <input id="name" placeholder="Oversized cotton shirt" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="price">Price</label>
              <input id="price" placeholder="$48" value={form.price} onChange={(event) => updateField("price", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                <option value="" disabled>Choose category</option>
                {adminCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="stock">Stock quantity</label>
              <input id="stock" placeholder="32" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="sizes">Sizes</label>
              <input id="sizes" placeholder="XS, S, M, L, XL" value={form.sizes} onChange={(event) => updateField("sizes", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="colors">Colors</label>
              <input id="colors" placeholder="Black, Cream, Olive" value={form.colors} onChange={(event) => updateField("colors", event.target.value)} />
            </div>
            <div className="field full">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows={4} placeholder="Fit, fabric, care, and styling notes." value={form.description} onChange={(event) => updateField("description", event.target.value)} />
            </div>
            <div className="field full">
              <label htmlFor="image">Image URL</label>
              <input id="image" placeholder="https://images.unsplash.com/..." value={form.image} onChange={(event) => updateField("image", event.target.value)} />
            </div>
            <div className="field full">
              <label>Product photos</label>
              <div className="upload-zone">
                <label className="upload-label">
                  <ImagePlus size={30} />
                  <span>Choose product image</span>
                  <small>JPG or PNG will be saved for this browser demo.</small>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              {form.image ? <div className="upload-preview" style={{ backgroundImage: `url(${form.image})` }} /> : null}
            </div>
            {message ? <p className="form-message field full">{message}</p> : null}
            <div className="field full">
              <button className="primary-button" type="submit">
                <Upload size={18} />
                Save product
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>Product catalog</h2>
          <div className="table-list">
            {ownerProducts.map((product) => (
              <div className="table-row" key={product.name}>
                <div className="thumb" style={{ backgroundImage: `url(${product.image})` }} />
                <div>
                  <strong>{product.name}</strong>
                  <div className="muted">{product.category} / {product.stock} / {product.shopName || currentOwner.shopName}</div>
                </div>
                <strong>{product.price}</strong>
              </div>
            ))}
            {ownerProducts.length === 0 ? <div className="empty-state">No products match that search.</div> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
