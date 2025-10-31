import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function UsernameModal({ address, onClose, onSave }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }, [address]);

  const validate = (value) => {
    const v = value.trim();
    if (v.length < 2) return "Username must be at least 2 characters.";
    if (v.length > 24) return "Username must be at most 24 characters.";
    if (!/^[a-zA-Z0-9._-]+$/.test(v)) {
      return "Use letters, numbers, dot, underscore, or hyphen only.";
    }
    return "";
  };

  const handleSave = async () => {
    if (submitting) return;
    const v = name.trim();
    const msg = validate(v);
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSubmitting(true);
      if (address) localStorage.setItem("fundora_username_" + address, v);
      onSave?.(v);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog" aria-modal="true" aria-labelledby="username-title" aria-describedby="username-desc"
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
              <h3 id="username-title" className="text-xl font-semibold tracking-tight">
                Create your Fundora username
              </h3>
              <p id="username-desc" className="mt-1 text-sm text-zinc-300">
                This display name will be linked to your wallet{address ? ` (${shortAddress})` : ""}.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close username modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b]"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <div className="mt-5 space-y-3">
            <label htmlFor="fundora-username" className="block text-sm text-zinc-200">
              Username
            </label>
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 focus-within:ring-2 focus-within:ring-pvteal">
              <input
                id="fundora-username"
                ref={inputRef}
                type="text"
                maxLength={24}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. ocean_builder"
                className="w-full bg-transparent py-2.5 text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-400">
              2–24 chars. Allowed: letters, numbers, <code className="text-zinc-300">._-</code>
            </p>

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
              onClick={handleSave}
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#0b2b2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
