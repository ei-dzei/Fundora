import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

export default function DepositModal({ onClose, onDeposit }) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");      
  const [unlockDays, setUnlockDays] = useState("30");
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

  const balance = useMemo(() => {
    if (!address) return 0;
    const balKey = "fundora_balance_" + address;
    const raw = Number(localStorage.getItem(balKey) || "0");
    return Number.isFinite(raw) ? raw : 0;
  }, [address]);

  const formatUSDC = (v) => {
    if (v === "" || isNaN(Number(v))) return "";
    const parts = String(v).split(".");
    if (parts.length === 1) return parts[0];
    return parts[0] + "." + parts[1].slice(0, 6);
  };

  const validate = () => {
    setError("");
    const a = Number(amount);
    const d = Number(unlockDays);

    if (!amount || !Number.isFinite(a) || a <= 0) {
      return "Enter a valid positive amount.";
    }
    if (!Number.isFinite(d) || !Number.isInteger(d) || d < 1) {
      return "Timelock must be a whole number of days (min 1).";
    }
    if (a > balance) {
      return "Insufficient mock USDC. Visit Faucet to mint.";
    }
    if (a > 1_000_000_000) return "Amount too large.";
    if (d > 3650) return "Timelock too long (max 10 years).";

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
      const d = Number(unlockDays);
      const now = Date.now();
      const due = now + d * 24 * 60 * 60 * 1000;

      const balKey = "fundora_balance_" + address;
      const current = Number(localStorage.getItem(balKey) || "0");
      localStorage.setItem(balKey, String(Math.max(0, current - a)));

      onDeposit?.(a, due);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="deposit-title"
      aria-describedby="deposit-desc"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

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
              <h3 id="deposit-title" className="text-xl font-semibold tracking-tight">
                Deposit to Vault
              </h3>
              <p id="deposit-desc" className="mt-1 text-sm text-zinc-300">
                Enter the amount of mock USDC to deposit and the lock duration.
              </p>
            </div>

            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b]"
              aria-label="Close deposit modal"
            >
              ×
            </button>
          </div>

          {/* Balance pill */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="opacity-80">Wallet balance:</span>
            <span className="font-medium text-white">{balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} USDC</span>
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
              <span className="text-zinc-200">Timelock (days)</span>
              <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 focus-within:ring-2 focus-within:ring-pvteal">
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={unlockDays}
                  onChange={(e) => setUnlockDays(e.target.value.replace(/[^\d]/g, ""))}
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
              {submitting ? "Depositing…" : "Deposit"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
