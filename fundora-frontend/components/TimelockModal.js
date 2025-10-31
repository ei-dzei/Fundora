import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TimelockModal({ onClose, onSave, defaultDays = 30 }) {
  const [days, setDays] = useState(Number(defaultDays) || 30);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clampedDays = useMemo(() => {
    const d = Number(days);
    if (!Number.isFinite(d)) return NaN;
    return Math.min(3650, Math.max(1, Math.floor(d))); 
  }, [days]);

  const unlockDate = useMemo(() => {
    if (!Number.isFinite(clampedDays)) return null;
    const ms = Date.now() + clampedDays * 24 * 60 * 60 * 1000;
    return new Date(ms);
  }, [clampedDays]);

  const hasError = useMemo(() => !Number.isFinite(clampedDays) || clampedDays < 1, [clampedDays]);

  const presets = [7, 14, 30, 90];

  const handlePreset = (v) => {
    setTouched(true);
    setDays(v);
  };

  const handleSave = () => {
    if (hasError || !unlockDate) {
      alert("Enter a valid number of days (1–3650).");
      return;
    }
    onSave(unlockDate.getTime(), clampedDays);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timelock-title"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6 text-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="timelock-title" className="text-lg font-semibold">
              Set your vault’s timelock
            </h3>
            <p className="mt-1 text-sm text-zinc-300">
              Choose how long your funds will be locked. You can only withdraw after it unlocks.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-white/10/50 bg-white/5 px-2 py-1 text-zinc-300 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4">
          <div className="text-xs text-zinc-400">Quick presets</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => {
              const active = Number(clampedDays) === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePreset(p)}
                  className={[
                    "rounded-xl px-3 py-1.5 text-sm",
                    active
                      ? "bg-pvteal text-pvdark"
                      : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                  ].join(" ")}
                >
                  {p}d
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom input */}
        <div className="mt-4">
          <label className="block text-sm text-zinc-300">Lock duration (days)</label>
          <input
            ref={inputRef}
            type="number"
            value={days}
            onChange={(e) => {
              setTouched(true);
              setDays(e.target.value);
            }}
            onBlur={() => setTouched(true)}
            className={[
              "mt-1 w-full rounded-xl border bg-white/5 px-3 py-2 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pvteal",
              hasError && touched ? "border-red-500/50" : "border-white/10",
            ].join(" ")}
            placeholder="e.g. 30"
            min={1}
            max={3650}
          />
          {hasError && touched && (
            <div className="mt-1 text-xs text-red-300">Enter a value between 1 and 3650.</div>
          )}
        </div>

        {/* Unlock preview */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-zinc-400">Unlocks on</div>
          <div className="mt-1 text-sm">
            {unlockDate ? (
              <>
                <span className="font-medium text-white">
                  {unlockDate.toLocaleString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>{" "}
                <span className="text-zinc-400">(your local time)</span>
              </>
            ) : (
              <span className="text-zinc-300">—</span>
            )}
          </div>
        </div>

        {/* Note */}
        <p className="mt-3 text-xs text-amber-300/90">
          During the lock, you can’t withdraw—but you can borrow against your balance.
        </p>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={hasError}
            className="rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save timelock
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
