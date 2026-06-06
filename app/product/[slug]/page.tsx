"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import {
  cartStorageKey,
  productSlug,
  readJsonStorage,
  readStoredProducts,
  recommendationsFor,
  StoreProduct,
  wishlistStorageKey,
  writeJsonStorage
} from "@/lib/shop";
import { productsForActiveOwners, readShopOwners } from "@/lib/marketplace";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setProducts(productsForActiveOwners(readStoredProducts(), readShopOwners()));
    setCart(readJsonStorage<StoreProduct[]>(cartStorageKey, []));
    setWishlist(readJsonStorage<string[]>(wishlistStorageKey, []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    writeJsonStorage(cartStorageKey, cart);
  }, [cart]);

  useEffect(() => {
    writeJsonStorage(wishlistStorageKey, wishlist);
  }, [wishlist]);

  const product = products.find((item) => productSlug(item) === params.slug);
  const recommendations = product ? recommendationsFor(product, products) : [];
  const sizes = (product?.sizes || "XS, S, M, L, XL").split(",").map((size) => size.trim());

  function addToBag(item: StoreProduct) {
    setCart((current) => [...current, item]);
    setNotice(`${item.name} added to bag.`);
    window.setTimeout(() => setNotice(""), 1800);
  }

  function toggleWishlist(item: StoreProduct) {
    setWishlist((current) =>
      current.includes(item.name)
        ? current.filter((name) => name !== item.name)
        : [...current, item.name]
    );
  }

  if (!loaded) {
    return (
      <main className="shell">
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand">
              <span className="brand-mark">A</span>
              Atelier Lane
            </a>
          </div>
        </header>
        <section className="container page-hero">
          <p className="eyebrow">Product</p>
          <h1>Loading item</h1>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="shell">
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand">
              <span className="brand-mark">A</span>
              Atelier Lane
            </a>
            <a className="secondary-button" href="/search">Search</a>
          </div>
        </header>
        <section className="container page-hero">
          <p className="eyebrow">Product</p>
          <h1>Product not found</h1>
          <p className="muted">That item may have been removed or renamed.</p>
          <a className="primary-button" href="/search">Browse products</a>
        </section>
      </main>
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
          <nav className="nav-links" aria-label="Product navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
            <a href="/search">Search</a>
            <a href="/checkout">Checkout</a>
          </nav>
        </div>
      </header>

      <section className="container product-detail">
        <a href="/" className="back-link">
          <ArrowLeft size={17} />
          Back to home
        </a>
        <div className="detail-image" style={{ backgroundImage: `url(${product.image})` }} />
        <div className="detail-panel">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="detail-price">{product.price}</div>
          <p>{product.description || "A polished wardrobe piece selected for everyday styling."}</p>
          <div className="detail-meta">
            {product.shopSlug ? <a href={`/shops/${product.shopSlug}`}>{product.shopName || "Owner shop"}</a> : null}
            <span>{product.colors || product.meta}</span>
            <span>{product.stock || "In stock"}</span>
          </div>
          <div>
            <strong>Size</strong>
            <div className="size-row">
              {sizes.map((size) => (
                <button
                  className={selectedSize === size ? "size-button active" : "size-button"}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="detail-actions">
            <button className="primary-button" onClick={() => addToBag(product)}>
              <ShoppingBag size={18} />
              Add to bag
            </button>
            <button className="secondary-button" onClick={() => toggleWishlist(product)}>
              <Heart size={18} fill={wishlist.includes(product.name) ? "currentColor" : "none"} />
              Save
            </button>
          </div>
          <div className="promise-row">
            <span><Truck size={17} /> Delivery tracking</span>
            <span><ShieldCheck size={17} /> Secure checkout</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>You may also like</h2>
            <p>Recommendations based on category and current catalog.</p>
          </div>
          <div className="product-grid">
            {recommendations.map((item) => (
              <article className="product-card" key={item.name}>
                <a className="product-image" href={`/product/${productSlug(item)}`} style={{ backgroundImage: `url(${item.image})` }}>
                  <span className="badge">{item.category}</span>
                </a>
                <div className="product-info">
                  <div className="product-row">
                    <a href={`/product/${productSlug(item)}`}>{item.name}</a>
                    <span>{item.price}</span>
                  </div>
                  <button className="secondary-button" onClick={() => addToBag(item)}>
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {notice ? <div className="toast">{notice}</div> : null}
    </main>
  );
}
