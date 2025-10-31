import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

export default function LoanModal({ onClose, vault, onCreateLoan }) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [repayDays, setRepayDays] = useState("30");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const amountInputRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const vaultBalance = Number(vault?.balance || 0);
  const maxLoan = useMemo(() => Math.max(0, vaultBalance * 0.6), [vaultBalance]);

  const remainingDays = useMemo(() => {
    if (!vault?.timelockEndsAt) return 0;
    const ms = new Date(vault.timelockEndsAt).getTime() - Date.now();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }, [vault?.timelockEndsAt]);

  const formatUSDC = (v) => {
    if (v === "" || isNaN(Number(v))) return "";
    const parts = String(v).split(".");
    if (parts.length === 1) return parts[0];
    return parts[0] + "." + parts[1].slice(0, 6);
  };

  const validate = () => {
    setError("");
    const a = Number(amount);
    const d = Number(repayDays);

    if (!amount || !Number.isFinite(a) || a <= 0) {
      return "Enter a valid positive amount.";
    }
    if (a > maxLoan) {
      return `Loan too large. Max allowed is ${maxLoan.toLocaleString(undefined, { maximumFractionDigits: 6 })} USDC (60% of vault).`;
    }
    if (!vault?.timelockEndsAt) {
      return "You must have a timelocked vault to borrow.";
    }
    if (!Number.isFinite(d) || !Number.isInteger(d) || d < 1) {
      return "Repayment must be a whole number of days (min 1).";
    }
    if (d > remainingDays) {
      return `Loan repayment must be within your vault timelock (max ${remainingDays} day${remainingDays === 1 ? "" : "s"}).`;
    }
    if (a > 1_000_000_000) return "Amount too large.";
    return "";
  };

  const submit = async () => {
    if (submitting) return;
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    try {
      setSubmitting(true);
      const a = Number(amount);
      const d = Number(repayDays);
      const dueAt = Date.now() + d * 24 * 60 * 60 * 1000;

      if (address) {
        const balKey = "fundora_balance_" + address;
        const current = Number(localStorage.getItem(balKey) || "0");
        localStorage.setItem(balKey, String(current + a));
      }

      onCreateLoan?.({ amount: a, dueAt });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog" aria-modal="true" aria-labelledby="loan-title" aria-describedby="loan-desc"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ y: 16, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b2b2b] text-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 id="loan-title" className="text-xl font-semibold tracking-tight">Request a Loan</h3>
              <p id="loan-desc" className="mt-1 text-sm text-zinc-300">
                Borrow up to <span className="font-medium text-white">60%</span> of your vault and repay before it unlocks.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close loan modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b]"
            >
              ×
            </button>
          </div>

          {/* Vault summary */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-zinc-400">Vault balance</div>
              <div className="mt-1 text-base font-semibold text-white">
                {vaultBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} USDC
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-zinc-400">Max loan (60%)</div>
              <div className="mt-1 text-base font-semibold text-white">
                {maxLoan.toLocaleString(undefined, { maximumFractionDigits: 6 })} USDC
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 col-span-2">
              <div className="text-zinc-400">Days until unlock</div>
              <div className="mt-1 text-base font-semibold text-white">
                {remainingDays} day{remainingDays === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="text-zinc-200">Amount (USDC)</span>
              <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 focus-within:ring-2 focus-within:ring-pvteal">
                <input
                  ref={amountInputRef}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(formatUSDC(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-transparent py-2.5 text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <span className="select-none pl-2 text-sm text-zinc-400">USDC</span>
              </div>
            </label>

            <label className="block text-sm">
              <span className="text-zinc-200">Repayment (days)</span>
              <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 focus-within:ring-2 focus-within:ring-pvteal">
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={repayDays}
                  onChange={(e) => setRepayDays(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="30"
                  className="w-full bg-transparent py-2.5 text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <span className="select-none pl-2 text-sm text-zinc-400">days</span>
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b]"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Requesting…" : "Request Loan"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
