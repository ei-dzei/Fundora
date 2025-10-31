import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import FaucetABI from "../contracts/FaucetModule#Faucet.json";
import TokenABI from "../contracts/FaucetModule#MockUSDC.json";

export default function Faucet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState("0");
  const [decimals, setDecimals] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState({ type: null, text: "" });

  const [dripUi, setDripUi] = useState(null);
  const [cooldownSec, setCooldownSec] = useState(null);

  const faucetAddr = process.env.NEXT_PUBLIC_FAUCET_ADDRESS;
  const tokenAddr = process.env.NEXT_PUBLIC_USDC_ADDRESS;

  const TARGET = {
    chainIdDec: 11155111n,
    chainIdHex: "0xaa36a7",
    chainName: "Sepolia",
    rpcUrls: ["https://rpc.sepolia.org"],
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  };

  const short = (addr) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—");

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setBanner({ type: "success", text: "Copied to clipboard." });
      setTimeout(() => setBanner({ type: null, text: "" }), 1800);
    } catch {
      setBanner({ type: "error", text: "Copy failed." });
      setTimeout(() => setBanner({ type: null, text: "" }), 2000);
    }
  };

  const fmtCooldown = (sec) => {
    if (sec == null) return "";
    if (sec >= 3600) return `${(sec / 3600).toFixed(1)} hours`;
    if (sec >= 60) return `${Math.floor(sec / 60)} minutes`;
    return `${sec} seconds`;
  };

  const ensureEnv = () => {
    if (!faucetAddr || !tokenAddr) {
      throw new Error("Missing NEXT_PUBLIC_FAUCET_ADDRESS or NEXT_PUBLIC_USDC_ADDRESS");
    }
  };

  const getProvider = () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("No injected wallet found. Please install MetaMask.");
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  const requestAccounts = async () => {
    await window.ethereum.request?.({ method: "eth_requestAccounts" });
  };

  const ensureSepolia = async (provider) => {
    const net = await provider.getNetwork();
    setChainId(net.chainId);
    if (net.chainId === TARGET.chainIdDec) return false;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET.chainIdHex }],
      });
    } catch (err) {
      if (err && err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: TARGET.chainIdHex,
              chainName: TARGET.chainName,
              rpcUrls: TARGET.rpcUrls,
              nativeCurrency: TARGET.nativeCurrency,
            },
          ],
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: TARGET.chainIdHex }],
        });
      } else {
        throw err;
      }
    }
    return true;
  };

  const readContracts = async (provider, signer) => {
    ensureEnv();

    await ensureSepolia(provider);
    const currentNetwork = await provider.getNetwork();
    setChainId(currentNetwork.chainId);

    const tokenCode = await provider.getCode(tokenAddr);
    if (tokenCode === "0x") {
      throw new Error(
        `No contract bytecode at USDC address ${tokenAddr} on chain ${currentNetwork.chainId}`
      );
    }
    const faucetCode = await provider.getCode(faucetAddr);
    if (faucetCode === "0x") {
      throw new Error(
        `No contract bytecode at Faucet address ${faucetAddr} on chain ${currentNetwork.chainId}`
      );
    }

    const token = new ethers.Contract(tokenAddr, TokenABI.abi, signer);
    const faucet = new ethers.Contract(faucetAddr, FaucetABI.abi, signer);

    try {
      const d = await token.decimals();
      setDecimals(Number(d));
    } catch {
      setDecimals(6);
    }

    return { token, faucet };
  };

  const loadFaucetMeta = useCallback(async (provider, signer) => {
    try {
      const token = new ethers.Contract(tokenAddr, TokenABI.abi, signer);
      const faucet = new ethers.Contract(faucetAddr, FaucetABI.abi, signer);

      let d = 6;
      try {
        d = await token.decimals();
      } catch {}
      const dec = Number(d);

      try {
        const drip = await faucet.dripAmount();
        setDripUi(ethers.formatUnits(drip, dec));
      } catch (e) {
        setDripUi(null);
        console.warn("dripAmount() read failed:", e);
      }

      try {
        const cd = await faucet.cooldown();
        setCooldownSec(Number(cd));
      } catch (e) {
        setCooldownSec(null);
        console.warn("cooldown() read failed:", e);
      }
    } catch (err) {
      console.warn("loadFaucetMeta error:", err);
    }
  }, [faucetAddr, tokenAddr]);

  const connectWallet = useCallback(async () => {
    try {
      setBanner({ type: null, text: "" });
      setIsLoading(true);

      let provider = getProvider();
      await requestAccounts();

      const switched = await ensureSepolia(provider);
      if (switched) {
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);

      const { token } = await readContracts(provider, signer);
      const rawBal = await token.balanceOf(addr);
      setBalance(ethers.formatUnits(rawBal, decimals));

      await loadFaucetMeta(provider, signer);
    } catch (err) {
      console.error(err);
      setBanner({ type: "error", text: err.message ?? String(err) });
    } finally {
      setIsLoading(false);
    }
  }, [decimals, loadFaucetMeta]);

  const refreshBalance = useCallback(async () => {
    try {
      setBanner({ type: null, text: "" });
      let provider = getProvider();

      const switched = await ensureSepolia(provider);
      if (switched) provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      const { token } = await readContracts(provider, signer);
      const rawBal = await token.balanceOf(addr);
      setBalance(ethers.formatUnits(rawBal, decimals));

      await loadFaucetMeta(provider, signer);
    } catch (err) {
      console.error(err);
      setBanner({ type: "error", text: err.message ?? String(err) });
    }
  }, [decimals, loadFaucetMeta]);

  const claimTokens = useCallback(async () => {
    try {
      setIsLoading(true);

      let provider = getProvider();
      const switched = await ensureSepolia(provider);
      if (switched) provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      const { faucet, token } = await (async () => {
        ensureEnv();
        await ensureSepolia(provider);

        const net = await provider.getNetwork();
        setChainId(net.chainId);

        const tCode = await provider.getCode(tokenAddr);
        if (tCode === "0x")
          throw new Error(`No contract bytecode at USDC address ${tokenAddr} on chain ${net.chainId}`);

        const fCode = await provider.getCode(faucetAddr);
        if (fCode === "0x")
          throw new Error(`No contract bytecode at Faucet address ${faucetAddr} on chain ${net.chainId}`);

        const token = new ethers.Contract(tokenAddr, TokenABI.abi, signer);
        const faucet = new ethers.Contract(faucetAddr, FaucetABI.abi, signer);

        try {
          const d = await token.decimals();
          setDecimals(Number(d));
        } catch { setDecimals(6); }

        return { token, faucet };
      })();

      const tx = await faucet.requestTokens();
      await tx.wait();

      const raw = await token.balanceOf(addr);
      const ui = ethers.formatUnits(raw, decimals);
      setBalance(ui);
      localStorage.setItem("fundora_balance_" + addr, String(Number(ui)));

      setBanner({ type: "success", text: "Tokens claimed successfully!" });
      setTimeout(() => setBanner({ type: null, text: "" }), 1800);
    } catch (err) {
      console.error(err);
      setBanner({ type: "error", text: `Claim failed: ${err.message ?? String(err)}` });
    } finally {
      setIsLoading(false);
    }
  }, [decimals]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      connectWallet();
    }
  }, [connectWallet]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accs) => {
      if (accs && accs.length > 0) {
        setAccount(accs[0]);
        refreshBalance();
      } else {
        setAccount(null);
        setBalance("0");
      }
    };
    const handleChainChanged = async () => {
      setTimeout(() => connectWallet(), 200);
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [connectWallet, refreshBalance]);

  const networkLabel = useMemo(() => {
    if (!chainId) return "Not connected";
    return chainId === TARGET.chainIdDec ? "Sepolia (11155111)" : `Chain ${String(chainId)}`;
  }, [chainId]);

  return (
    <div>
      <Head>
        <title>Fundora — Faucet</title>
      </Head>
      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white px-6 pt-28 pb-20">
        <div className="mx-auto max-w-3xl">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Mock USDC Faucet</h1>
              <p className="mt-1 text-sm text-zinc-300">Claim test tokens to try deposits and loans.</p>

              {/* Faucet info */}
              {dripUi && (
                <div className="mt-2 text-sm text-zinc-300">
                  Faucet gives{" "}
                  <span className="font-semibold text-pvteal">{dripUi} USDC</span> per claim
                  {typeof cooldownSec === "number" && (
                    <> • Cooldown: {fmtCooldown(cooldownSec)}</>
                  )}
                </div>
              )}
            </div>

            {/* Network badge */}
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              {networkLabel}
            </div>
          </header>

          {/* Banner */}
          {banner.type && (
            <div
              className={[
                "mt-5 rounded-xl px-4 py-3 text-sm",
                banner.type === "error"
                  ? "border border-red-500/30 bg-red-500/10 text-red-200"
                  : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
              ].join(" ")}
            >
              {banner.text}
            </div>
          )}

          {/* Card */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#113334] to-[#0b2b2b] p-6 shadow">
            {/* Account row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-zinc-300">
                {account ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Connected:</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      {short(account)}
                    </span>
                    <button
                      onClick={() => copy(account)}
                      className="text-xs text-pvteal hover:underline focus:outline-none focus:ring-2 focus:ring-pvteal rounded"
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  "No wallet connected"
                )}
              </div>

              <div className="text-right">
                <div className="text-xs text-zinc-400">USDC Balance</div>
                <div className="text-lg font-semibold">
                  {Number.isNaN(Number(balance)) ? "0" : balance} USDC
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-pvteal px-4 py-2 text-sm font-semibold text-pvdark shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Loading…" : "Connect / Refresh"}
              </button>

              <button
                onClick={claimTokens}
                disabled={isLoading || !account}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-pvteal focus:ring-offset-2 focus:ring-offset-[#071a1b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Claiming…" : "Claim Tokens"}
              </button>
            </div>

            {/* Addresses */}
            <div className="mt-6 grid gap-3 text-xs text-zinc-400 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-zinc-400">Faucet contract</div>
                <div className="mt-1 break-all font-mono text-[11px] text-zinc-300">
                  {faucetAddr ?? "—"}
                </div>
                {faucetAddr && (
                  <div className="mt-2">
                    <button
                      onClick={() => copy(faucetAddr)}
                      className="text-[11px] text-pvteal hover:underline focus:outline-none focus:ring-2 focus:ring-pvteal rounded"
                    >
                      Copy address
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-zinc-400">USDC (mock) contract</div>
                <div className="mt-1 break-all font-mono text-[11px] text-zinc-300">
                  {tokenAddr ?? "—"}
                </div>
                {tokenAddr && (
                  <div className="mt-2">
                    <button
                      onClick={() => copy(tokenAddr)}
                      className="text-[11px] text-pvteal hover:underline focus:outline-none focus:ring-2 focus:ring-pvteal rounded"
                    >
                      Copy address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Help text */}
            <p className="mt-4 text-xs text-zinc-400">
              If you see “No contract bytecode… on chain 1”, switch your wallet to{" "}
              <span className="text-pvteal">Sepolia</span>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
