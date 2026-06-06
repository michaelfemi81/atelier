"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Minus, ShoppingBag, Truck } from "lucide-react";
import {
  cartStorageKey,
  priceNumber,
  readJsonStorage,
  StoreProduct,
  writeJsonStorage
} from "@/lib/shop";

export default function CheckoutPage() {
  const [cart, setCart] = useState<StoreProduct[]>([]);
  const [delivery, setDelivery] = useState("Standard delivery");
  const [payment, setPayment] = useState("Card");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    setCart(readJsonStorage<StoreProduct[]>(cartStorageKey, []));
  }, []);

  useEffect(() => {
    writeJsonStorage(cartStorageKey, cart);
  }, [cart]);

  const subtotal = cart.reduce((total, product) => total + priceNumber(product.price), 0);
  const shipping = cart.length === 0 ? 0 : delivery === "Express delivery" ? 18 : 8;
  const total = subtotal + shipping;

  function removeFromBag(index: number) {
    setCart((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCart([]);
    setOrderPlaced(true);
  }

  return (
    <main className="shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">A</span>
            Atelier Lane
          </a>
          <nav className="nav-links" aria-label="Checkout navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
            <a href="/search">Search</a>
          </nav>
        </div>
      </header>

      <section className="container checkout-layout">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order</h1>
          {orderPlaced ? (
            <div className="success-panel">
              <CheckCircle2 size={34} />
              <h2>Order placed</h2>
              <p>Your demo order is confirmed. Connect payments and a database when you are ready for real checkout.</p>
              <a className="primary-button" href="/shop">Continue shopping</a>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={placeOrder}>
              <div className="panel">
                <h2>Contact</h2>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="city">City</label>
                    <input id="city" required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
                  </div>
                  <div className="field full">
                    <label htmlFor="address">Delivery address</label>
                    <textarea id="address" rows={3} required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                  </div>
                </div>
              </div>

              <div className="panel">
                <h2>Delivery</h2>
                <div className="choice-grid">
                  {["Standard delivery", "Express delivery"].map((option) => (
                    <button
                      className={delivery === option ? "choice-button active" : "choice-button"}
                      key={option}
                      type="button"
                      onClick={() => setDelivery(option)}
                    >
                      <Truck size={18} />
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel">
                <h2>Payment</h2>
                <div className="choice-grid">
                  {["Card", "Pay on delivery"].map((option) => (
                    <button
                      className={payment === option ? "choice-button active" : "choice-button"}
                      key={option}
                      type="button"
                      onClick={() => setPayment(option)}
                    >
                      <CreditCard size={18} />
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button className="primary-button checkout-submit" disabled={cart.length === 0} type="submit">
                Place order
              </button>
            </form>
          )}
        </div>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
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
          {cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={24} />
              <p>Your bag is empty.</p>
              <a className="secondary-button" href="/shop">Browse products</a>
            </div>
          ) : null}
          <div className="summary-lines">
            <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></div>
            <div><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
