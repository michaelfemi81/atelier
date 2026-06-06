"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Heart, Search, ShoppingBag } from "lucide-react";
import {
  cartStorageKey,
  categories,
  productSlug,
  readJsonStorage,
  readStoredProducts,
  StoreProduct,
  wishlistStorageKey,
  writeJsonStorage
} from "@/lib/shop";

export default function SearchPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setProducts(readStoredProducts());
    setCart(readJsonStorage<StoreProduct[]>(cartStorageKey, []));
    setWishlist(readJsonStorage<string[]>(wishlistStorageKey, []));
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, []);

  useEffect(() => {
    writeJsonStorage(cartStorageKey, cart);
  }, [cart]);

  useEffect(() => {
    writeJsonStorage(wishlistStorageKey, wishlist);
  }, [wishlist]);

  const results = products.filter((product) => {
    const queryMatch = `${product.name} ${product.category} ${product.meta || ""} ${product.description || ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const categoryMatch = category === "All" || product.category === category;

    return queryMatch && categoryMatch;
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.history.replaceState(null, "", query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  function addToBag(product: StoreProduct) {
    setCart((current) => [...current, product]);
    setNotice(`${product.name} added to bag.`);
    window.setTimeout(() => setNotice(""), 1800);
  }

  function toggleWishlist(product: StoreProduct) {
    setWishlist((current) =>
      current.includes(product.name)
        ? current.filter((name) => name !== product.name)
        : [...current, product.name]
    );
  }

  return (
    <main className="shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">A</span>
            Atelier Lane
          </a>
          <nav className="nav-links" aria-label="Search navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
            <a href="/checkout">Checkout</a>
          </nav>
        </div>
      </header>

      <section className="container page-hero">
        <p className="eyebrow">Search</p>
        <h1>Find your next piece</h1>
        <form className="search-page-form" onSubmit={handleSearch}>
          <Search size={20} />
          <input
            aria-label="Search products"
            placeholder="Search by product, color, category..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="primary-button" type="submit">Search</button>
        </form>
        <div className="filter-row">
          {["All", ...categories.map((item) => item.name)].map((item) => (
            <button
              className={category === item ? "filter-chip active" : "filter-chip"}
              key={item}
              onClick={() => setCategory(item)}
            >
              {category === item ? <Check size={15} /> : null}
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{results.length} result{results.length === 1 ? "" : "s"}</h2>
            <p>{query ? `Matching "${query}"` : "Browse the full catalog."}</p>
          </div>
          <div className="product-grid">
            {results.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
                  <a className="image-hit" href={`/product/${productSlug(product)}`} aria-label={`View ${product.name}`} />
                  <span className="badge">{product.category}</span>
                  <button
                    className="floating-heart"
                    aria-label={`Save ${product.name}`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <Heart size={17} fill={wishlist.includes(product.name) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-row">
                    <a href={`/product/${productSlug(product)}`}>{product.name}</a>
                    <span>{product.price}</span>
                  </div>
                  <span className="product-meta">{product.meta || product.stock}</span>
                  <button className="secondary-button" onClick={() => addToBag(product)}>
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
          {results.length === 0 ? <div className="empty-state">No products match that search.</div> : null}
        </div>
      </section>
      {notice ? <div className="toast">{notice}</div> : null}
    </main>
  );
}
