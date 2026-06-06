"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Store, UploadCloud } from "lucide-react";
import {
  ownerFromShopName,
  readShopOwners,
  sampleShopOwners,
  ShopOwner,
  uniqueShopSlug,
  writeShopOwners
} from "@/lib/marketplace";

export default function OwnerEntryPage() {
  const [owners, setOwners] = useState<ShopOwner[]>(sampleShopOwners);
  const [form, setForm] = useState({
    name: "",
    shopName: "",
    email: "",
    description: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOwners(readShopOwners());
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function submitOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const shopName = form.shopName.trim();

    if (!form.name.trim() || !shopName || !form.email.trim()) {
      setMessage("Add your name, shop name, and email to request activation.");
      return;
    }

    const owner = {
      ...ownerFromShopName(shopName, owners),
      name: form.name.trim(),
      email: form.email.trim(),
      description: form.description.trim() || "A new Atelier Lane shop awaiting super-admin activation.",
      slug: uniqueShopSlug(shopName, owners)
    };
    const nextOwners = [owner, ...owners];

    setOwners(nextOwners);
    writeShopOwners(nextOwners);
    setForm({ name: "", shopName: "", email: "", description: "" });
    setMessage(`Shop request created. Super admin can activate ${owner.slug}.atelierlane.com.`);
  }

  return (
    <main className="shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">A</span>
            Atelier Lane
          </a>
          <a className="secondary-button" href="/admin">
            Owner workspace
          </a>
        </div>
      </header>

      <section className="container page-hero owner-entry-hero">
        <div>
          <p className="eyebrow">Hidden owner layer</p>
          <h1>Open a shop on Atelier Lane</h1>
          <p className="muted">Create a private owner request, then the super admin activates the shop before products go public.</p>
        </div>
        <a className="primary-button" href="/admin/owners">
          Super admin <ArrowRight size={18} />
        </a>
      </section>

      <section className="section">
        <div className="container owner-entry-grid">
          <section className="panel">
            <h2>Shop owner request</h2>
            <form className="form-grid" onSubmit={submitOwner}>
              <div className="field">
                <label htmlFor="owner-name">Owner name</label>
                <input id="owner-name" placeholder="Amina Cole" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="owner-email">Email</label>
                <input id="owner-email" placeholder="amina@example.com" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
              </div>
              <div className="field full">
                <label htmlFor="shop-name">Shop name</label>
                <input id="shop-name" placeholder="Amina Studio" value={form.shopName} onChange={(event) => updateField("shopName", event.target.value)} />
              </div>
              <div className="field full">
                <label htmlFor="shop-description">Shop description</label>
                <textarea id="shop-description" rows={4} placeholder="What will this shop sell?" value={form.description} onChange={(event) => updateField("description", event.target.value)} />
              </div>
              {message ? <p className="form-message field full">{message}</p> : null}
              <div className="field full">
                <button className="primary-button" type="submit">
                  <UploadCloud size={18} />
                  Request activation
                </button>
              </div>
            </form>
          </section>

          <section className="panel">
            <h2>Shop requests</h2>
            <div className="table-list">
              {owners.map((owner) => (
                <div className="table-row" key={owner.id}>
                  <Store size={24} />
                  <div>
                    <strong>{owner.shopName}</strong>
                    <div className="muted">{owner.slug}.atelierlane.com</div>
                  </div>
                  <span className={owner.status === "Active" ? "status-pill healthy" : "status-pill warning"}>{owner.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
