import Link from "next/link";
import {
  Boxes,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
  Store,
  Tags,
  UserCheck
} from "lucide-react";

type AdminShellProps = {
  active: "dashboard" | "products" | "orders" | "inventory" | "categories" | "wallet" | "owners";
  title: string;
  eyebrow?: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
};

const adminLinks = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "products", label: "Products", href: "/admin/products", icon: Package },
  { id: "wallet", label: "Wallet", href: "/admin/wallet", icon: CircleDollarSign },
  { id: "orders", label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { id: "categories", label: "Categories", href: "/admin/categories", icon: Tags },
  { id: "owners", label: "Super admin", href: "/admin/owners", icon: UserCheck }
] as const;

export function AdminShell({
  active,
  title,
  eyebrow = "Owner workspace",
  actionHref,
  actionLabel,
  children
}: AdminShellProps) {
  return (
    <main className="admin-layout">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">A</span>
          Atelier Lane
        </Link>
        <nav aria-label="Admin navigation">
          {adminLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className={active === item.id ? "side-link active" : "side-link"}
                href={item.href}
                key={item.id}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <Link className="side-link" href="/">
            <Store size={18} />
            Storefront
          </Link>
          <Link className="side-link" href="/owner">
            <LogOut size={18} />
            Owner entry
          </Link>
        </nav>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          {actionHref && actionLabel ? (
            <Link className="primary-button" href={actionHref}>
              <Plus size={18} />
              {actionLabel}
            </Link>
          ) : null}
        </div>
        {children}
      </section>
    </main>
  );
}
