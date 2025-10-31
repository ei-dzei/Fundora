import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import UsernameModal from "./UsernameModal";

function NavLink({ href, children, onClick }) {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "relative px-2 py-1 text-sm transition-colors",
        "text-zinc-300 hover:text-pvteal",
        isActive ? "text-white" : "",
      ].join(" ")}
    >
      <span>{children}</span>
      {isActive && (
        <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-pvteal to-transparent" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      setUsername(null);
      return;
    }
    const u = localStorage.getItem("fundora_username_" + address);
    if (!u) setShowUsernameModal(true);
    else setUsername(u);
  }, [address]);

  useEffect(() => {
    const handle = () => setMenuOpen(false);
    router.events.on("routeChangeComplete", handle);
    return () => router.events.off("routeChangeComplete", handle);
  }, [router.events]);

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }, [address]);

  function handleLogout() {
    if (address) {
      localStorage.removeItem("fundora_username_" + address);
      localStorage.removeItem("fundora_vault_" + address);
      localStorage.removeItem("fundora_loan_" + address);
      localStorage.removeItem("fundora_balance_" + address);
      try {
        disconnect();
      } catch {}
    }
    router.push("/");
    if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-40">
      {/* glass bar */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="backdrop-blur-md border-b border-white/10 bg-[#071a1b]/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Left: brand + desktop nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white"
            >
              Fundora
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/faucet">Faucet</NavLink>
            </div>
          </div>

          {/* Right: wallet + controls */}
          <div className="flex items-center gap-3">
            {/* User chip (desktop) */}
            {address && username && (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <div className="text-xs font-medium text-white">{username}</div>
                <div className="text-[11px] text-zinc-400">{shortAddress}</div>
              </div>
            )}

            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />

            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#071a1b]/90">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
              <NavLink href="/" onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink href="/faucet" onClick={() => setMenuOpen(false)}>
                Faucet
              </NavLink>

              {address && username && (
                <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
                  <div className="font-medium text-white">{username}</div>
                  <div className="text-xs text-zinc-400">{shortAddress}</div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Username modal */}
      {showUsernameModal && (
        <UsernameModal
          address={address}
          onClose={() => setShowUsernameModal(false)}
          onSave={(name) => {
            setUsername(name);
            setShowUsernameModal(false);
          }}
        />
      )}
    </nav>
  );
}
