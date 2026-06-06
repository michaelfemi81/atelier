import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/shop";

const collectionStories = [
  {
    title: "Spring edit",
    text: "Light layers, soft tailoring, and everyday pieces for warmer days.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1300&q=80"
  },
  {
    title: "Work-to-weekend",
    text: "Clean silhouettes that move easily from errands to dinner.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1300&q=80"
  }
];

export default function CollectionsPage() {
  return (
    <main className="shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">A</span>
            Atelier Lane
          </a>
          <nav className="nav-links" aria-label="Collections navigation">
            <a href="/shop">Shop</a>
            <a href="/collections">Collections</a>
            <a href="/service">Service</a>
          </nav>
        </div>
      </header>

      <section className="container page-hero">
        <p className="eyebrow">Collections</p>
        <h1>Shop by mood, category, and occasion</h1>
      </section>

      <section className="section">
        <div className="container">
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

      <section className="section">
        <div className="container collection-story-grid">
          {collectionStories.map((story) => (
            <a className="collection-story" href="/shop" key={story.title}>
              <div className="collection-story-image" style={{ backgroundImage: `url(${story.image})` }} />
              <div>
                <h2>{story.title}</h2>
                <p>{story.text}</p>
                <span>Explore <ArrowRight size={16} /></span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
