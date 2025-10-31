import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import TimelockModal from "../components/TimelockModal";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useMemo, useEffect, useState } from "react";

export default function IndexPage() {
  const { address } = useAccount();

  const [vault, setVault] = useState({ balance: 0, timelockEndsAt: null });
  const [showTimelock, setShowTimelock] = useState(false);

  useEffect(() => {
    if (!address) return;

    const key = "fundora_vault_" + address;
    const raw = localStorage.getItem(key);

    if (!raw) {
      const init = { balance: 0, timelockEndsAt: null };
      localStorage.setItem(key, JSON.stringify(init));
      setVault(init);
      setShowTimelock(true);
    } else {
      const v = JSON.parse(raw);
      setVault(v);
      if (!v.timelockEndsAt) setShowTimelock(true);
    }
  }, [address]);

  const handleSaveTimelock = (endsAt /* ms */, daysChosen) => {
    const key = "fundora_vault_" + address;
    const updated = { ...vault, timelockEndsAt: endsAt };
    setVault(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setShowTimelock(false);
  };

  const short = useMemo(
    () => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : null),
    [address]
  );
  const unlockLabel = vault?.timelockEndsAt
    ? new Date(vault.timelockEndsAt).toLocaleString()
    : "Not set";

  const Stat = ({ label, value, sub }) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-5"
    >
      <div className="text-[13px] text-zinc-300">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-400">{sub}</div>}
    </motion.div>
  );

  const Feature = ({ title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5"
    >
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-zinc-300">{children}</div>
    </motion.div>
  );

  const Step = ({ n, title, body }) => (
    <div className="flex gap-4">
      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pvteal font-semibold text-pvdark">
        {n}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-zinc-300">{body}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Fundora — On-chain Pension Vaults</title>
      </Head>

      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white">
        {/* HERO */}
        <section className="relative px-6 pt-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                  Save, lock, and borrow — on a{" "}
                  <span className="text-pvteal">clean, transparent</span> vault.
                </h1>
                <p className="mt-4 text-zinc-300">
                  Fundora lets you deposit stablecoins into a timelocked vault,
                  earn yield, and access instant loans against your savings.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/faucet"
                    className="inline-flex items-center justify-center rounded-xl bg-pvteal px-5 py-3 text-sm font-semibold text-pvdark shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
                  >
                    Get test USDC
                  </Link>
                  <Link
                    href="/home"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
                  >
                    Open dashboard
                  </Link>
                  {/* Edit timelock quick action when connected */}
                  {address && (
                    <button
                      onClick={() => setShowTimelock(true)}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
                    >
                      Edit timelock
                    </button>
                  )}
                </div>

                {address && (
                  <>
                    <div className="mt-3 text-xs text-zinc-400">
                      Connected as <span className="text-zinc-200">{short}</span>
                    </div>

                    {/* Vault status strip */}
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="font-medium text-white">Vault ready</span>{" "}
                          • Timelock:{" "}
                          <span className="text-zinc-200">{unlockLabel}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href="/home"
                            className="rounded-lg bg-pvteal px-3 py-1.5 font-medium text-pvdark"
                          >
                            Go to dashboard
                          </Link>
                          <button
                            onClick={() => setShowTimelock(true)}
                            className="rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-zinc-200 hover:bg-white/10"
                          >
                            Edit timelock
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right visual card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6"
              >
                <div className="text-sm text-zinc-300">Preview</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-zinc-400">Vault Balance</div>
                    <div className="mt-1 text-2xl font-bold text-white">4,000 USDC</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-zinc-400">Active Loan</div>
                    <div className="mt-1 text-2xl font-bold text-white">994 USDC</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-zinc-400">Pool Contribution</div>
                    <div className="mt-1 text-2xl font-bold text-white">51,050 USDC</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-zinc-400">Saver Score</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-300">70</div>
                    <div className="text-[11px] text-zinc-400">/100</div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">Timelock progress</div>
                  <div className="mt-2 relative h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                    <div className="h-full bg-pvteal/80" style={{ width: "56%" }} />
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">~17 days remaining</div>
                </div>
              </motion.div>
            </div>

            {/* KPI STRIP */}
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              <Stat label="Seconds to borrow" value="~10s" />
              <Stat label="Collateral factor" value="60%" />
              <Stat label="Supported" value="Sepolia (test)" sub="ETH / USDC (mock)" />
              <Stat label="Security" value="Timelock vault" sub="Transparent rules" />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold">Why Fundora</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <Feature title="Timelocked Savings">
                Commit to your future self. Lock your savings for a fixed window and
                watch the progress bar move toward unlock day.
              </Feature>
              <Feature title="Borrow Against Your Vault">
                Need liquidity? Take a loan up to 60% of your vault balance—no paperwork,
                instant settlement, predictable rules.
              </Feature>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">How it works</h3>
              <Link href="/home" className="text-sm text-pvteal hover:underline">
                View dashboard →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Step
                n="1"
                title="Get test USDC"
                body="Open the Faucet to mint mock USDC to your wallet (Sepolia)."
              />
              <Step
                n="2"
                title="Deposit & Lock"
                body="Choose an amount and set a timelock. Your vault balance updates instantly."
              />
              <Step
                n="3"
                title="Borrow when needed"
                body="Request a loan up to 60% LTV with a clear due date before your vault unlocks."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/faucet"
                className="inline-flex items-center justify-center rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
              >
                Go to Faucet
              </Link>
              <Link
                href="/home"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-2xl font-semibold">FAQ</h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-white">
                  What network do I use?
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-zinc-300">
                  Sepolia test network. Your wallet will be prompted to switch automatically.
                </p>
              </details>

              <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-white">
                  Is the USDC real?
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-zinc-300">
                  No—this demo uses a mock USDC token for testing only.
                </p>
              </details>

              <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-white">
                  How much can I borrow?
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-zinc-300">
                  Up to 60% of your vault balance (LTV). The loan must be repaid before your
                  vault unlocks.
                </p>
              </details>

              <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-white">
                  Can I withdraw while timelocked?
                  <span className="transition group-open:rotate-180">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-zinc-300">
                  Withdrawals are only available once the timelock ends. You can still borrow
                  against your balance during the lock.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Timelock modal */}
      {showTimelock && (
        <TimelockModal
          onClose={() => setShowTimelock(false)}
          onSave={handleSaveTimelock}
          defaultDays={30}
        />
      )}
    </div>
  );
}
