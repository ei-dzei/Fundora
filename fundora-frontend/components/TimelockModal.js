import { useState } from "react";
import { motion } from "framer-motion";

export default function TimelockModal({ onClose, onSave, defaultDays = 30 }) {
  const [days, setDays] = useState(defaultDays);

  const save = () => {
    const d = Number(days);
    if (!Number.isFinite(d) || d <= 0) return alert("Enter a valid number of days");
    const now = Date.now();
    const endsAt = now + d * 24 * 60 * 60 * 1000;
    onSave(endsAt, d);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6 text-white shadow-xl"
      >
        <h3 className="text-lg font-semibold">Set your vault’s timelock</h3>
        <p className="mt-1 text-sm text-zinc-300">
          Choose how long your funds will be locked. You can only withdraw after it unlocks.
        </p>

        <div className="mt-4">
          <label className="block text-sm text-zinc-300">Lock duration (days)</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pvteal"
            placeholder="e.g. 30"
            min={1}
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark hover:opacity-90"
          >
            Save timelock
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
