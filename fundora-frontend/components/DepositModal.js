import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

export default function DepositModal({ onClose, onDeposit, timelockEndsAt }) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const balKey = useMemo(
    () => (address ? "fundora_balance_" + address : null),
    [address]
  );
  const walletBal = useMemo(() => {
    if (!balKey) return 0;
    const raw = localStorage.getItem(balKey);
    return Number(raw || 0);
  }, [balKey]);

  function submit() {
    const a = Number(amount);
    if (!a || a <= 0) return alert("Enter a valid amount");
    if (a > walletBal)
      return alert(
        `Insufficient mock USDC in your wallet (${walletBal} USDC). Visit Faucet to mint.`
      );

    localStorage.setItem(balKey, String(walletBal - a));
    onDeposit(a); 
  }

  const timelockText = useMemo(() => {
    if (!timelockEndsAt) return "No timelock set";
    try {
      const d = new Date(timelockEndsAt);
      return `Inherits existing timelock (ends ${d.toLocaleString()})`;
    } catch {
      return "Inherits existing timelock";
    }
  }, [timelockEndsAt]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6 text-white shadow-lg z-50"
      >
        <h3 className="text-lg font-semibold">Deposit to Vault</h3>
        <p className="mt-1 text-sm text-zinc-300">
          Funds will <span className="text-emerald-200">inherit your existing timelock</span>. You
          cannot withdraw until it ends.
        </p>

        <div className="mt-4">
          <label className="block text-sm text-zinc-300">Amount (USDC)</label>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pvteal"
            placeholder="0.00"
          />

          <div className="mt-3 grid gap-2 text-xs text-zinc-400">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              Wallet balance: <span className="text-zinc-200">{walletBal}</span> USDC
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              {timelockText}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark hover:opacity-90"
          >
            Deposit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
