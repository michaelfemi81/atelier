"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingBag, Store } from "lucide-react";
import {
  cartStorageKey,
  productSlug,
  readJsonStorage,
  readStoredProducts,
  StoreProduct,
  wishlistStorageKey,
  writeJsonStorage
} from "@/lib/shop";
import { readShopOwners, ShopOwner } from "@/lib/marketplace";

export default function CustomShopPage() {
  const params = useParams<{ slug: string }>();
  const [owners, setOwners] = useState<ShopOwner[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setOwners(readShopOwners());
    setProducts(readStoredProducts());
    setCart(readJsonStorage<StoreProduct[]>(cartStorageKey, []));
    setWishlist(readJsonStorage<string[]>(wishlistStorageKey, []));
  }, []);

  useEffect(() => {
    writeJsonStorage(cartStorageKey, cart);
  }, [cart]);

  useEffect(() => {
    writeJsonStorage(wishlistStorageKey, wishlist);
  }, [wishlist]);

  const owner = owners.find((item) => item.slug === params.slug);
  const shopProducts = owner
    ? products.filter((product) => product.shopSlug === owner.slug || product.ownerId === owner.id)
    : [];

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

  if (!owner) {
    return (
      <main className="shell">
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand"><span className="brand-mark">A</span>Atelier Lane</a>
          </div>
        </header>
        <section className="container page-hero">
          <p className="eyebrow">Shop</p>
          <h1>Shop not found</h1>
          <p className="muted">This custom shop has not been created yet.</p>
          <a className="primary-button" href="/shop">Browse marketplace</a>
        </section>
      </main>
    );
  }

  if (owner.status !== "Active") {
    return (
      <main className="shell">
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand"><span className="brand-mark">A</span>Atelier Lane</a>
          </div>
        </header>
        <section className="container page-hero">
          <p className="eyebrow">{owner.slug}.atelierlane.com</p>
          <h1>{owner.shopName} is awaiting activation</h1>
          <p className="muted">A super admin needs to activate this shop before it appears publicly.</p>
          <a className="primary-button" href="/admin/owners">Open super admin</a>
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
          <nav className="nav-links" aria-label="Shop navigation">
            <a href="/shop">Marketplace</a>
            <a href="/checkout">Checkout</a>
          </nav>
        </div>
      </header>

      <section className="shop-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(24, 23, 22, 0.78), rgba(24, 23, 22, 0.18)), url(${owner.heroImage})` }}>
        <div className="container shop-hero-inner">
          <a href="/shop" className="back-link">
            <ArrowLeft size={17} />
            Marketplace
          </a>
          <p className="eyebrow">{owner.slug}.atelierlane.com</p>
          <h1>{owner.shopName}</h1>
          <p>{owner.description}</p>
          <span className="shop-domain"><Store size={17} /> {shopProducts.length} products by {owner.name}</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{owner.shopName} products</h2>
            <p>Products uploaded by this shop owner.</p>
          </div>
          <div className="product-grid">
            {shopProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
                  <a className="image-hit" href={`/product/${productSlug(product)}`} aria-label={`View ${product.name}`} />
                  <span className="badge">{product.badge || product.category}</span>
                  <button className="floating-heart" aria-label={`Save ${product.name}`} onClick={() => toggleWishlist(product)}>
                    <Heart size={17} fill={wishlist.includes(product.name) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-row">
                    <a href={`/product/${productSlug(product)}`}>{product.name}</a>
                    <span>{product.price}</span>
                  </div>
                  <span className="product-meta">{product.meta || product.category}</span>
                  <button className="secondary-button" onClick={() => addToBag(product)}>
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
          {shopProducts.length === 0 ? <div className="empty-state">This shop has not uploaded products yet.</div> : null}
        </div>
      </section>
      {notice ? <div className="toast">{notice}</div> : null}
    </main>
  );
}
