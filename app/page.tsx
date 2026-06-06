"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck
} from "lucide-react";
import {
  cartStorageKey,
  catalogProducts,
  categories,
  priceNumber,
  productSlug,
  readJsonStorage,
  readStoredProducts,
  StoreProduct,
  wishlistStorageKey,
  writeJsonStorage
} from "@/lib/shop";
import { productsForActiveOwners, readShopOwners, recommendedAcrossShops } from "@/lib/marketplace";

export default function StorefrontPage() {
  const [displayProducts, setDisplayProducts] = useState<StoreProduct[]>(catalogProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<"cart" | "wishlist" | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setDisplayProducts(productsForActiveOwners(readStoredProducts(), readShopOwners()));
    setCart(readJsonStorage<StoreProduct[]>(cartStorageKey, []));
    setWishlist(readJsonStorage<string[]>(wishlistStorageKey, []));
  }, []);

  useEffect(() => {
    writeJsonStorage(cartStorageKey, cart);
  }, [cart]);

  useEffect(() => {
    writeJsonStorage(wishlistStorageKey, wishlist);
  }, [wishlist]);

  const filteredProducts = displayProducts.filter((product) => {
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const searchMatch = `${product.name} ${product.meta || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return categoryMatch && searchMatch;
  });

  const recommendedProducts = recommendedAcrossShops(displayProducts);
  const cartTotal = cart.reduce((total, product) => total + priceNumber(product.price), 0);

  function submitSearch() {
    const query = searchTerm.trim();

    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    } else {
      window.location.href = "/search";
    }
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  function chooseCategory(category: string) {
    setSelectedCategory(category);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function addToBag(product: StoreProduct) {
    setCart((current) => [...current, product]);
    showNotice(`${product.name} added to bag.`);
  }

  function removeFromBag(index: number) {
    setCart((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function toggleWishlist(productName: string) {
    setWishlist((current) =>
      current.includes(productName)
        ? current.filter((name) => name !== productName)
        : [...current, productName]
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
          <nav className="nav-links" aria-label="Main navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
          </nav>
          <div className="nav-links">
            <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen((open) => !open)}>
              <Search size={18} />
            </button>
            <button className="icon-button count-button" aria-label="Wishlist" onClick={() => setDrawer("wishlist")}>
              <Heart size={18} />
              {wishlist.length ? <span>{wishlist.length}</span> : null}
            </button>
            <button className="icon-button count-button" aria-label="Shopping bag" onClick={() => setDrawer("cart")}>
              <ShoppingBag size={18} />
              {cart.length ? <span>{cart.length}</span> : null}
            </button>
          </div>
        </div>
        {searchOpen ? (
          <form className="container nav-search" onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}>
            <Search size={18} />
            <input
              aria-label="Search products"
              placeholder="Search dresses, denim, shoes..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              autoFocus
            />
            <button className="secondary-button" type="submit">Search</button>
          </form>
        ) : null}
      </header>

      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">Modern fashion storefront</p>
          <h1>Atelier Lane</h1>
          <p>
            A polished shopping experience for clothes, built with room for product uploads,
            inventory, orders, and beautiful product discovery.
          </p>
          <div className="hero-actions">
            <a href="/shop" className="primary-button">
              Shop arrivals <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <div className="hero-media" aria-label="Fashion campaign image">
          <div className="hero-tag">
            <div>
              <strong>Spring edit</strong>
              <span>Light layers, statement basics, easy checkout.</span>
            </div>
            <Sparkles size={26} />
          </div>
        </div>
      </section>

      <section className="section" id="collections">
        <div className="container">
          <div className="section-head">
            <h2>Shop by category</h2>
            <p>Fast paths into the collection so shoppers can move from browsing to buying without friction.</p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <a className="category-tile" href={`/shop?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <div className="category-image" style={{ backgroundImage: `url(${category.image})` }} />
                <div className="category-label">
                  {category.name}
                  <ArrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="shop">
        <div className="container">
          <div className="section-head">
            <h2>New arrivals</h2>
            <p>{selectedCategory === "All" ? "Browse the full edit." : `Showing ${selectedCategory}.`}</p>
          </div>
          <div className="filter-row">
            {["All", ...categories.map((category) => category.name)].map((category) => (
              <button
                className={selectedCategory === category ? "filter-chip active" : "filter-chip"}
                key={category}
                onClick={() => chooseCategory(category)}
              >
                {selectedCategory === category ? <Check size={15} /> : null}
                {category}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div
                  className="product-image"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  <a className="image-hit" href={`/product/${productSlug(product)}`} aria-label={`View ${product.name}`} />
                  <span className="badge">{product.badge}</span>
                  <button
                    className="floating-heart"
                    aria-label={`Save ${product.name}`}
                    onClick={() => toggleWishlist(product.name)}
                  >
                    <Heart size={17} fill={wishlist.includes(product.name) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-row">
                    <a href={`/product/${productSlug(product)}`}>{product.name}</a>
                    <span>{product.price}</span>
                  </div>
                  <span className="product-meta">{product.meta || product.category || "New item"}</span>
                  <button className="secondary-button" onClick={() => addToBag(product)}>
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filteredProducts.length === 0 ? (
            <div className="empty-state">No products match that search yet.</div>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>AI recommended for you</h2>
            <p>Product picks from different active shops, with a quick path into each owner’s full storefront.</p>
          </div>
          <div className="product-grid">
            {recommendedProducts.map((product) => (
              <article className="product-card" key={`recommended-${product.name}`}>
                <div
                  className="product-image"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
                  <a className="image-hit" href={`/product/${productSlug(product)}`} aria-label={`View ${product.name}`} />
                  <span className="badge">{product.category}</span>
                </div>
                <div className="product-info">
                  <div className="product-row">
                    <a href={`/product/${productSlug(product)}`}>{product.name}</a>
                    <span>{product.price}</span>
                  </div>
                  {product.shopSlug ? (
                    <a className="shop-source-link" href={`/shops/${product.shopSlug}`}>
                      From {product.shopName || "owner shop"} <ArrowRight size={15} />
                    </a>
                  ) : null}
                  <button className="secondary-button" onClick={() => addToBag(product)}>
                    <ShoppingBag size={17} />
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section feature-band" id="service">
        <div className="container">
          <div className="section-head">
            <h2>Built for trust</h2>
            <p>Simple service promises make the store feel credible from the first visit.</p>
          </div>
          <div className="feature-grid">
            <div className="feature">
              <Truck size={26} />
              <h3>Delivery tracking</h3>
              <p>Keep shoppers updated from order confirmation to doorstep delivery.</p>
            </div>
            <div className="feature">
              <ShieldCheck size={26} />
              <h3>Secure checkout</h3>
              <p>Ready for Stripe, Paystack, or another payment provider when you pick your market.</p>
            </div>
            <div className="feature">
              <PackageCheck size={26} />
              <h3>Owner control</h3>
              <p>Admin screens support product uploads, stock tracking, and order management.</p>
            </div>
          </div>
        </div>
      </section>
      {notice ? <div className="toast">{notice}</div> : null}
      {drawer ? (
        <div className="drawer-backdrop" onClick={() => setDrawer(null)}>
          <aside className="drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <h2>{drawer === "cart" ? "Shopping bag" : "Wishlist"}</h2>
              <button className="icon-button" aria-label="Close panel" onClick={() => setDrawer(null)}>
                <Minus size={18} />
              </button>
            </div>
            {drawer === "cart" ? (
              <>
                <div className="drawer-list">
                  {cart.map((product, index) => (
                    <div className="drawer-item" key={`${product.name}-${index}`}>
                      <div className="thumb" style={{ backgroundImage: `url(${product.image})` }} />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.price}</span>
                      </div>
                      <button className="icon-button" aria-label={`Remove ${product.name}`} onClick={() => removeFromBag(index)}>
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {cart.length ? (
                  <div className="drawer-total">
                    <strong>Total</strong>
                    <strong>${cartTotal.toFixed(2)}</strong>
                  </div>
                ) : (
                  <p className="muted">Your bag is empty.</p>
                )}
                <a className="primary-button drawer-action" href="/checkout">
                  Checkout
                </a>
              </>
            ) : (
              <div className="drawer-list">
                {wishlist.length ? (
                  displayProducts
                    .filter((product) => wishlist.includes(product.name))
                    .map((product) => (
                      <div className="drawer-item" key={product.name}>
                        <div className="thumb" style={{ backgroundImage: `url(${product.image})` }} />
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.price}</span>
                        </div>
                        <button className="icon-button" aria-label={`Add ${product.name} to bag`} onClick={() => addToBag(product)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="muted">Save products with the heart button.</p>
                )}
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </main>
  );
}
