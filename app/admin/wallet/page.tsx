"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Banknote, Clock3, CreditCard, Wallet } from "lucide-react";
import { AdminShell } from "@/app/admin/admin-shell";
import { AdminProduct, initialAdminProducts } from "@/lib/admin";
import {
  currentOwnerId,
  formatMoney,
  productsForOwner,
  readShopOwners,
  readWithdrawals,
  salesEstimate,
  ShopOwner,
  WithdrawalRequest,
  writeShopOwners,
  writeWithdrawals
} from "@/lib/marketplace";
import { productStorageKey } from "@/lib/shop";

export default function AdminWalletPage() {
  const [products, setProducts] = useState<AdminProduct[]>(initialAdminProducts);
  const [owners, setOwners] = useState<ShopOwner[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProducts = window.localStorage.getItem(productStorageKey);

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        window.localStorage.removeItem(productStorageKey);
      }
    }

    setOwners(readShopOwners());
    setWithdrawals(readWithdrawals());
  }, []);

  const owner = owners.find((item) => item.id === currentOwnerId);
  const ownerProducts = useMemo(() => productsForOwner(products, currentOwnerId), [products]);
  const estimatedSales = salesEstimate(ownerProducts);
  const availableBalance = owner?.walletBalance || 0;
  const ownerWithdrawals = withdrawals.filter((withdrawal) => withdrawal.ownerId === currentOwnerId);

  function requestWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!owner) {
      return;
    }

    const withdrawalAmount = Number(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      setMessage("Enter a valid withdrawal amount.");
      return;
    }

    if (withdrawalAmount > owner.walletBalance) {
      setMessage("That amount is higher than the available balance.");
      return;
    }

    const nextOwners = owners.map((item) =>
      item.id === owner.id
        ? {
            ...item,
            walletBalance: item.walletBalance - withdrawalAmount,
            pendingWithdrawals: item.pendingWithdrawals + withdrawalAmount
          }
        : item
    );
    const nextWithdrawals: WithdrawalRequest[] = [
      {
        id: `WD-${Date.now()}`,
        ownerId: owner.id,
        amount: withdrawalAmount,
        status: "Pending",
        requestedAt: new Date().toISOString().slice(0, 10)
      },
      ...withdrawals
    ];

    setOwners(nextOwners);
    setWithdrawals(nextWithdrawals);
    writeShopOwners(nextOwners);
    writeWithdrawals(nextWithdrawals);
    setAmount("");
    setMessage("Withdrawal request sent to super admin.");
  }

  return (
    <AdminShell active="wallet" title="Wallet" eyebrow="Owner payouts">
      <div className="stats-grid">
        <div className="stat"><span>Available</span><strong>{formatMoney(availableBalance)}</strong></div>
        <div className="stat"><span>Pending withdrawal</span><strong>{formatMoney(owner?.pendingWithdrawals || 0)}</strong></div>
        <div className="stat"><span>Product sales estimate</span><strong>{formatMoney(estimatedSales)}</strong></div>
        <div className="stat"><span>Listed products</span><strong>{ownerProducts.length}</strong></div>
      </div>

      <div className="admin-grid">
        <section className="panel">
          <h2>Withdraw funds</h2>
          <form className="form-grid" onSubmit={requestWithdrawal}>
            <div className="field full">
              <label htmlFor="amount">Amount</label>
              <input id="amount" inputMode="numeric" placeholder="250" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            {message ? <p className="form-message field full">{message}</p> : null}
            <div className="field full">
              <button className="primary-button" type="submit">
                <Banknote size={18} />
                Request withdrawal
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <h2>Payout activity</h2>
          <div className="table-list">
            {ownerWithdrawals.map((withdrawal) => (
              <div className="table-row" key={withdrawal.id}>
                {withdrawal.status === "Pending" ? <Clock3 size={24} /> : <CreditCard size={24} />}
                <div>
                  <strong>{withdrawal.id}</strong>
                  <div className="muted">{withdrawal.requestedAt} / {withdrawal.status}</div>
                </div>
                <strong>{formatMoney(withdrawal.amount)}</strong>
              </div>
            ))}
            {ownerWithdrawals.length === 0 ? (
              <div className="empty-state">
                <Wallet size={22} />
                No withdrawal requests yet.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
