import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers';
import FaucetABI from '../contracts/FaucetModule#Faucet.json';
import TokenABI from '../contracts/FaucetModule#MockUSDC.json';

export default function Faucet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [decimals, setDecimals] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const faucetAddr = process.env.NEXT_PUBLIC_FAUCET_ADDRESS;
  const tokenAddr  = process.env.NEXT_PUBLIC_USDC_ADDRESS;

  const ensureEnv = () => {
    if (!faucetAddr || !tokenAddr) {
      throw new Error('Missing NEXT_PUBLIC_FAUCET_ADDRESS or NEXT_PUBLIC_USDC_ADDRESS');
    }
  };

  const getProvider = () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No injected wallet found. Please install MetaMask.');
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  const requestAccounts = async () => {
    // Ask the wallet to connect (idempotent if already connected)
    await window.ethereum.request?.({ method: 'eth_requestAccounts' });
  };

  const readContracts = async (provider, signer) => {
    ensureEnv();

    // Make sure both addresses really are contracts on the current chain
    const currentNetwork = await provider.getNetwork();
    setChainId(currentNetwork.chainId);

    const tokenCode = await provider.getCode(tokenAddr);
    if (tokenCode === '0x') {
      throw new Error(`No contract bytecode at USDC address ${tokenAddr} on chain ${currentNetwork.chainId}`);
    }
    const faucetCode = await provider.getCode(faucetAddr);
    if (faucetCode === '0x') {
      throw new Error(`No contract bytecode at Faucet address ${faucetAddr} on chain ${currentNetwork.chainId}`);
    }

    const token  = new ethers.Contract(tokenAddr,  TokenABI.abi,  signer);
    const faucet = new ethers.Contract(faucetAddr, FaucetABI.abi, signer);

    // Try to get decimals from the token (fallback to 6 if the token is non-standard)
    try {
      const d = await token.decimals();
      setDecimals(Number(d));
    } catch {
      setDecimals(6);
    }

    return { token, faucet };
  };

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = getProvider();
      await requestAccounts(); // trigger connection prompt if needed

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);

      const { token } = await readContracts(provider, signer);

      const rawBal = await token.balanceOf(addr);        // BigInt
      setBalance(ethers.formatUnits(rawBal, decimals));  // string
    } catch (err) {
      console.error(err);
      alert(err.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  }, [decimals]); // re-run if decimals changes

  const refreshBalance = useCallback(async () => {
    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      const { token } = await readContracts(provider, signer);
      const rawBal = await token.balanceOf(addr);
      setBalance(ethers.formatUnits(rawBal, decimals));
    } catch (err) {
      console.error(err);
      alert(err.message ?? String(err));
    }
  }, [decimals]);

  const claimTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      const provider = getProvider();
      const signer = await provider.getSigner();

      const { faucet } = await readContracts(provider, signer);

      const tx = await faucet.claimTokens();
      await tx.wait();
      alert('Tokens claimed successfully!');
      await refreshBalance();
    } catch (err) {
      console.error(err);
      // Common revert reasons: per-address cooldown, faucet drained, not whitelisted, etc.
      alert(`Claim failed: ${err.message ?? String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [refreshBalance]);

  // Auto-connect on first load
  useEffect(() => {
    // Only attempt in the browser
    if (typeof window !== 'undefined' && window.ethereum) {
      connectWallet();
    }
  }, [connectWallet]);

  // React to account / network changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accs) => {
      if (accs && accs.length > 0) {
        setAccount(accs[0]);
        refreshBalance();
      } else {
        setAccount(null);
        setBalance('0');
      }
    };
    const handleChainChanged = async () => {
      // EIP-1193 recommends reloading or reinitializing on chain change
      setTimeout(() => connectWallet(), 200);
    };

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [connectWallet, refreshBalance]);

  return (
    <div>
      <Head><title>Fundora — Faucet</title></Head>
      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Mock USDC Faucet</h2>

          <div className="mt-8 p-6 bg-[#0b2b2b] rounded">
            <div className="text-sm opacity-80">
              {chainId ? `Connected chainId: ${String(chainId)}` : 'Not connected'}
            </div>

            <div className="mt-2 text-xl font-bold">
              Connected account: {account ?? '—'}
            </div>
            <div className="text-xl font-bold">
              Balance: {balance} USDC
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="px-4 py-2 bg-pvteal text-pvdark rounded disabled:opacity-60"
              >
                {isLoading ? 'Loading…' : 'Connect / Refresh'}
              </button>

              <button
                onClick={claimTokens}
                disabled={isLoading || !account}
                className="px-4 py-2 bg-pvteal text-pvdark rounded disabled:opacity-60"
              >
                {isLoading ? 'Claiming…' : 'Claim Tokens'}
              </button>
            </div>

            <div className="mt-4 text-xs opacity-70">
              Using Faucet: {faucetAddr ?? '—'} <br />
              Using Token: {tokenAddr ?? '—'}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
