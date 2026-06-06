"use client";

import { useState } from "react";
import { Check, PackageCheck, Search, Truck } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { sampleOrders } from "@/lib/admin";

const statuses = ["All", "Needs packing", "Ready to ship", "Delivered"];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const orders = sampleOrders.filter((order) => {
    const statusMatch = status === "All" || order.status === status;
    const searchMatch = `${order.id} ${order.customer} ${order.items} ${order.status}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <AdminShell active="orders" title="Orders">
      <div className="admin-search">
        <Search size={18} />
        <input
          aria-label="Search orders"
          placeholder="Search orders, customers, status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="filter-row">
        {statuses.map((item) => (
          <button className={status === item ? "filter-chip active" : "filter-chip"} key={item} onClick={() => setStatus(item)}>
            {status === item ? <Check size={15} /> : null}
            {item}
          </button>
        ))}
      </div>
      <section className="panel">
        <h2>Order queue</h2>
        <div className="table-list">
          {orders.map((order) => (
            <div className="admin-order-row" key={order.id}>
              <div>
                {order.status === "Delivered" ? <PackageCheck size={24} /> : <Truck size={24} />}
              </div>
              <div>
                <strong>{order.id}</strong>
                <div className="muted">{order.customer}</div>
              </div>
              <div>
                <strong>{order.items}</strong>
                <div className="muted">{order.date}</div>
              </div>
              <strong>{order.total}</strong>
              <span className="status-pill">{order.status}</span>
            </div>
          ))}
          {orders.length === 0 ? <div className="empty-state">No orders match that filter.</div> : null}
        </div>
      </section>
    </AdminShell>
  );
}
