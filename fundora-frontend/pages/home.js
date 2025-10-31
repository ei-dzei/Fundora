import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DepositModal from "../components/DepositModal";
import LoanModal from "../components/LoanModal";
import TimelockModal from "../components/TimelockModal"; 

export default function HomePage() {
  const { address } = useAccount();

  const [username, setUsername] = useState(null);
  const [vault, setVault] = useState({ balance: 0, timelockEndsAt: null });
  const [loan, setLoan] = useState(null);
  const [walletUSDC, setWalletUSDC] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [showTimelock, setShowTimelock] = useState(false); 

  useEffect(() => {
    if (!address) return;

    setUsername(localStorage.getItem("fundora_username_" + address) || null);

    const vKey = "fundora_vault_" + address;
    const rawVault = localStorage.getItem(vKey);

    if (!rawVault) {
      const init = { balance: 0, timelockEndsAt: null };
      localStorage.setItem(vKey, JSON.stringify(init));
      setVault(init);
      setShowTimelock(true); 
    } else {
      const v = JSON.parse(rawVault);
      setVault(v);
      if (!v.timelockEndsAt) setShowTimelock(true);
    }

    const l = localStorage.getItem("fundora_loan_" + address);
    if (l) setLoan(JSON.parse(l));

    const b = localStorage.getItem("fundora_balance_" + address);
    setWalletUSDC(Number(b || 0));
  }, [address]);

  useEffect(() => {
    if (!address) return;
    localStorage.setItem("fundora_vault_" + address, JSON.stringify(vault));
  }, [vault, address]);

  useEffect(() => {
    if (!address) return;
    if (loan) localStorage.setItem("fundora_loan_" + address, JSON.stringify(loan));
    else localStorage.removeItem("fundora_loan_" + address);
  }, [loan, address]);

  const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "Not connected");
  const fmt = (n, max = 6) =>
    Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });

  const maxBorrow = useMemo(() => Math.max(0, Number(vault.balance) * 0.6), [vault.balance]);

  const now = Date.now();
  const lockEnds = vault?.timelockEndsAt ? new Date(vault.timelockEndsAt).getTime() : null;
  const remainingDays = useMemo(() => {
    if (!lockEnds) return 0;
    return Math.max(0, Math.floor((lockEnds - now) / (1000 * 60 * 60 * 24)));
  }, [lockEnds, now]);
  const progressPct = useMemo(() => {
    if (!lockEnds) return 0;
    const total = 30 * 24 * 60 * 60 * 1000; 
    const passed = Math.min(total, Math.max(0, total - (lockEnds - now)));
    return Math.max(0, Math.min(100, (passed / total) * 100));
  }, [lockEnds, now]);

  const apr = 0.045;
  const dailyRate = apr / 365;
  const estDailyLoanInterest = loan ? Number(loan.amount) * dailyRate : 0;
  const poolContribution = walletUSDC + Number(vault.balance || 0);
  const saverScore = Math.min(100, Math.round((vault.balance / 50000) * 100) || 0);

  const Stat = ({ label, value, sub }) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-5"
    >
      <div className="text-[13px] text-zinc-300">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-400">{sub}</div>}
    </motion.div>
  );

  const Row = ({ label, value, strong }) => (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-sm text-zinc-300">{label}</div>
      <div className={`text-sm ${strong ? "font-semibold text-white" : "text-zinc-200"}`}>
        {value}
      </div>
    </div>
  );

  const handleOpenDeposit = () => {
    if (!vault.timelockEndsAt) {
      setShowTimelock(true);
      return;
    }
    setShowDeposit(true);
  };

  const handleSaveTimelock = (endsAt /* ms */, daysChosen) => {
    const updated = { ...vault, timelockEndsAt: endsAt };
    setVault(updated);
    setShowTimelock(false);
  };

  return (
    <div>
      <Head>
        <title>Fundora — Dashboard</title>
      </Head>

      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white px-6 pt-28 pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Title + address */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back, {username || "Guest"}
            </h1>
            <div className="mt-1 text-sm text-zinc-400">{shortAddr(address)}</div>
          </div>

          {/* KPI rows */}
          <div className="grid gap-5 md:grid-cols-4">
            <Stat label="Vault Balance" value={`${fmt(vault.balance)} USDC`} />
            <Stat label="Active Loan" value={`${fmt(loan?.amount || 0)} USDC`} />
            <Stat label="Pool Contribution" value={`${fmt(poolContribution)} USDC`} />
            <Stat label="Saver Score" value={`${saverScore}`} sub="/100" />
          </div>

          {/* Vault & Loans row */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Vault */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Vault</span>
                </div>
                <button
                  onClick={() => setShowTimelock(true)} 
                  className="text-sm text-pvteal hover:underline"
                >
                  Manage →
                </button>
              </div>

              <div className="space-y-3">
                <Row label="Balance" value={`${fmt(vault.balance)} USDC`} strong />
                <Row
                  label="Timelock"
                  value={
                    lockEnds
                      ? `${remainingDays} day${remainingDays === 1 ? "" : "s"}`
                      : "Not set"
                  }
                />
                <Row label="Max Borrow" value={`${fmt(maxBorrow)} USDC`} />
              </div>

              {/* Progress to unlock */}
              {lockEnds && (
                <div className="mt-5">
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                    <span>Time to unlock</span>
                    <span>
                      {remainingDays} day{remainingDays === 1 ? "" : "s"} left
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                    <div className="h-full bg-pvteal/80" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleOpenDeposit} 
                  className="inline-flex items-center justify-center rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b]"
                >
                  Deposit
                </button>
                <button
                  disabled={!vault.balance}
                  onClick={() => setShowLoan(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Loan
                </button>
              </div>

              {!vault.timelockEndsAt && (
                <p className="mt-3 text-xs text-amber-300/90">
                  Set a timelock before depositing. Click <span className="text-pvteal">Manage</span>.
                </p>
              )}
            </motion.div>

            {/* Loans */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">$ Loans</span>
                <button className="text-sm text-pvteal hover:underline">View all →</button>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-zinc-400">Active Loan</div>
                <div className="mt-1 text-2xl font-bold text-white">
                  {fmt(loan?.amount || 0)} USDC
                </div>
                <div className="mt-1 text-sm text-zinc-300">
                  {loan ? `Due: ${new Date(loan.dueAt).toLocaleDateString()}` : "No active loan"}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <div className="text-zinc-400">Interest ({(apr * 100).toFixed(1)}% APR)</div>
                <div className="mt-1 font-medium text-emerald-200">
                  +{fmt(estDailyLoanInterest, 6)} USDC{" "}
                  <span className="text-zinc-400">/ day (est.)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lending & Quick Actions */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Lending */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Lending</span>
                <button className="text-sm text-pvteal hover:underline">Manage →</button>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">Your Contribution</div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {fmt(poolContribution)} USDC
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-zinc-400">Earning (6.2% APY)</div>
                  <div className="mt-1 text-emerald-200">
                    +{fmt((poolContribution * 0.062) / 365, 6)} USDC{" "}
                    <span className="text-zinc-400">/ day (est.)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6"
            >
              <div className="mb-4 text-lg font-semibold">⚡ Quick Actions</div>

              <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <button
                  onClick={handleOpenDeposit}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal"
                >
                  <div>
                    <div className="text-sm font-medium text-white">Deposit to Vault</div>
                    <div className="text-xs text-zinc-400">
                      {vault.timelockEndsAt ? "Add funds to your savings" : "Set timelock first"}
                    </div>
                  </div>
                  <span>›</span>
                </button>

                <button
                  onClick={() => setShowLoan(true)}
                  disabled={!vault.balance}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pvteal disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div>
                    <div className="text-sm font-medium text-white">Request a Loan</div>
                    <div className="text-xs text-zinc-400">
                      Borrow against your vault (max {fmt(maxBorrow)} USDC)
                    </div>
                  </div>
                  <span>›</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {showDeposit && (
        <DepositModal
          timelockEndsAt={vault.timelockEndsAt}   
          onClose={() => setShowDeposit(false)}
          onDeposit={(amount) => {
            setVault((prev) => ({
              ...prev,
              balance: Number(prev.balance) + Number(amount), 
            }));
            setShowDeposit(false);
          }}
        />
      )}

      {showLoan && (
        <LoanModal
          onClose={() => setShowLoan(false)}
          vault={vault}
          onCreateLoan={(loanObj) => {
            setLoan(loanObj);
            setShowLoan(false);
          }}
        />
      )}

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
