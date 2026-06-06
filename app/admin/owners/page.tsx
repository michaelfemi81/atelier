"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PauseCircle, Search, Store, UserCheck } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import {
  formatMoney,
  readShopOwners,
  readWithdrawals,
  sampleShopOwners,
  ShopOwner,
  ShopOwnerStatus,
  WithdrawalRequest,
  writeShopOwners,
  writeWithdrawals
} from "@/lib/marketplace";

export default function SuperAdminOwnersPage() {
  const [owners, setOwners] = useState<ShopOwner[]>(sampleShopOwners);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOwners(readShopOwners());
    setWithdrawals(readWithdrawals());
  }, []);

  const filteredOwners = owners.filter((owner) =>
    `${owner.name} ${owner.shopName} ${owner.email} ${owner.status}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  function setOwnerStatus(ownerId: string, status: ShopOwnerStatus) {
    const nextOwners = owners.map((owner) => (owner.id === ownerId ? { ...owner, status } : owner));

    setOwners(nextOwners);
    writeShopOwners(nextOwners);
  }

  function markWithdrawalPaid(withdrawalId: string) {
    const target = withdrawals.find((withdrawal) => withdrawal.id === withdrawalId);

    if (!target) {
      return;
    }

    const nextWithdrawals = withdrawals.map((withdrawal) =>
      withdrawal.id === withdrawalId ? { ...withdrawal, status: "Paid" as const } : withdrawal
    );
    const nextOwners = owners.map((owner) =>
      owner.id === target.ownerId
        ? { ...owner, pendingWithdrawals: Math.max(0, owner.pendingWithdrawals - target.amount) }
        : owner
    );

    setWithdrawals(nextWithdrawals);
    setOwners(nextOwners);
    writeWithdrawals(nextWithdrawals);
    writeShopOwners(nextOwners);
  }

  return (
    <AdminShell active="owners" title="Shop owner activation" eyebrow="Super admin">
      <div className="stats-grid">
        <div className="stat"><span>Total owners</span><strong>{owners.length}</strong></div>
        <div className="stat"><span>Pending</span><strong>{owners.filter((owner) => owner.status === "Pending").length}</strong></div>
        <div className="stat"><span>Active</span><strong>{owners.filter((owner) => owner.status === "Active").length}</strong></div>
        <div className="stat"><span>Withdrawals</span><strong>{withdrawals.filter((withdrawal) => withdrawal.status === "Pending").length}</strong></div>
      </div>

      <div className="admin-search">
        <Search size={18} />
        <input
          aria-label="Search shop owners"
          placeholder="Search owners, shops, email, status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="panel">
        <h2>Owner approvals</h2>
        <div className="table-list">
          {filteredOwners.map((owner) => (
            <div className="owner-row" key={owner.id}>
              <Store size={24} />
              <div>
                <strong>{owner.shopName}</strong>
                <div className="muted">{owner.slug}.atelierlane.com</div>
              </div>
              <div>
                <strong>{owner.name || "New owner"}</strong>
                <div className="muted">{owner.email || "Email pending"}</div>
              </div>
              <span className={owner.status === "Active" ? "status-pill healthy" : "status-pill warning"}>{owner.status}</span>
              <div className="row-actions">
                <button className="secondary-button" onClick={() => setOwnerStatus(owner.id, "Active")}>
                  <UserCheck size={17} />
                  Activate
                </button>
                <button className="secondary-button" onClick={() => setOwnerStatus(owner.id, "Paused")}>
                  <PauseCircle size={17} />
                  Pause
                </button>
              </div>
            </div>
          ))}
          {filteredOwners.length === 0 ? <div className="empty-state">No shop owners match that search.</div> : null}
        </div>
      </section>

      <section className="panel admin-spaced-panel">
        <h2>Withdrawal approvals</h2>
        <div className="table-list">
          {withdrawals.map((withdrawal) => {
            const owner = owners.find((item) => item.id === withdrawal.ownerId);

            return (
              <div className="owner-row" key={withdrawal.id}>
                <CheckCircle2 size={24} />
                <div>
                  <strong>{withdrawal.id}</strong>
                  <div className="muted">{withdrawal.requestedAt}</div>
                </div>
                <div>
                  <strong>{owner?.shopName || "Shop owner"}</strong>
                  <div className="muted">{owner?.email || "Email pending"}</div>
                </div>
                <strong>{formatMoney(withdrawal.amount)}</strong>
                {withdrawal.status === "Pending" ? (
                  <button className="primary-button" onClick={() => markWithdrawalPaid(withdrawal.id)}>
                    Mark paid
                  </button>
                ) : (
                  <span className="status-pill healthy">Paid</span>
                )}
              </div>
            );
          })}
          {withdrawals.length === 0 ? <div className="empty-state">No withdrawal requests yet.</div> : null}
        </div>
      </section>
    </AdminShell>
  );
}
