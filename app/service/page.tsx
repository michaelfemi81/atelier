import {
  Clock3,
  CreditCard,
  Headphones,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck
} from "lucide-react";

const services = [
  {
    title: "Tracked delivery",
    text: "Customers can follow an order from confirmation through packing, dispatch, and delivery.",
    icon: Truck
  },
  {
    title: "Secure checkout",
    text: "The flow is ready for card payments now and can connect to Paystack, Stripe, or Flutterwave.",
    icon: ShieldCheck
  },
  {
    title: "Simple returns",
    text: "A clear return window and condition rules keep post-purchase support easy to understand.",
    icon: RotateCcw
  },
  {
    title: "Owner control",
    text: "Admin tools support product uploads, image previews, stock counts, categories, and order views.",
    icon: PackageCheck
  }
];

const policyRows = [
  ["Standard delivery", "3-5 business days", "$8 flat rate"],
  ["Express delivery", "1-2 business days", "$18 flat rate"],
  ["Returns", "Within 14 days", "Unworn items with tags"],
  ["Support hours", "Mon-Sat", "9:00 AM - 6:00 PM"]
];

const serviceSteps = [
  {
    label: "Order received",
    text: "The shopper gets confirmation and the owner sees the order in the admin workflow."
  },
  {
    label: "Packed with care",
    text: "Items are checked for size, color, and condition before dispatch."
  },
  {
    label: "On the way",
    text: "Delivery updates keep the customer informed until the package arrives."
  },
  {
    label: "Aftercare",
    text: "Returns, exchanges, and questions are handled from the same service promise."
  }
];

const trustStats = [
  ["14 days", "Return window"],
  ["2 options", "Delivery speeds"],
  ["4 steps", "Order journey"],
  ["6 days", "Weekly support"]
];

const faqs = [
  {
    question: "Can customers pay on delivery?",
    answer: "Yes. The checkout already includes a pay-on-delivery option for demo use, and it can be connected to your real order workflow."
  },
  {
    question: "Can the owner upload product photos?",
    answer: "Yes. The admin page supports image file selection and image URLs for product previews."
  },
  {
    question: "Can delivery prices change later?",
    answer: "Yes. The delivery choices are currently simple demo values and can be moved into store settings."
  }
];

export default function ServicePage() {
  return (
    <main className="shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">A</span>
            Atelier Lane
          </a>
          <nav className="nav-links" aria-label="Service navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
          </nav>
        </div>
      </header>

      <section className="service-hero">
        <div className="container service-hero-inner">
          <div>
            <p className="eyebrow">Service</p>
            <h1>Support that makes shopping feel easy</h1>
            <p>
              Delivery, returns, payments, and customer help are organized in one place so shoppers
              know what to expect before they buy.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="/checkout">
                <CreditCard size={18} />
                Checkout demo
              </a>
              <a className="secondary-button" href="/shop">
                Shop products
              </a>
            </div>
            <div className="service-stats">
              {trustStats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="service-contact-panel">
            <h2>Need help?</h2>
            <p>Use these customer-care channels when the store is connected to real support.</p>
            <div className="contact-list">
              <span><MessageCircle size={18} /> Live chat</span>
              <span><Mail size={18} /> support@atelierlane.com</span>
              <span><Clock3 size={18} /> Mon-Sat, 9 AM - 6 PM</span>
              <span><MapPin size={18} /> Local and nationwide delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What shoppers can expect</h2>
            <p>Short, clear service promises reduce hesitation before checkout.</p>
          </div>
          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article className="service-card" key={service.title}>
                  <Icon size={28} />
                  <h2>{service.title}</h2>
                  <p>{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section service-journey-section">
        <div className="container">
          <div className="section-head">
            <h2>From bag to doorstep</h2>
            <p>A simple order journey that gives both the shopper and owner confidence.</p>
          </div>
          <div className="service-journey">
            {serviceSteps.map((step, index) => (
              <article className="journey-step" key={step.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.label}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section service-band">
        <div className="container service-policy-layout">
          <div>
            <p className="eyebrow">Policy overview</p>
            <h2>Clear promises for delivery and returns</h2>
            <p>
              These starter policies make the site feel credible today and can become editable store
              settings later.
            </p>
          </div>
          <div className="policy-table">
            {policyRows.map(([label, timing, detail]) => (
              <div className="policy-row" key={label}>
                <strong>{label}</strong>
                <span>{timing}</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-split">
          <div className="support-card">
            <Headphones size={30} />
            <h2>Customer-first operations</h2>
            <p>
              The next production step is connecting orders to email notifications, payment status,
              and admin fulfillment controls.
            </p>
            <div className="support-actions">
              <a className="primary-button" href="/checkout">Try checkout</a>
              <a className="secondary-button" href="/search">Find products</a>
            </div>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <article className="faq-item" key={item.question}>
                <LifeBuoy size={20} />
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
