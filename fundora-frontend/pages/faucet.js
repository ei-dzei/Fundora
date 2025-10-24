import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function Faucet() {
  const { address } = useAccount()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (!address) return
    const s = localStorage.getItem('fundora_balance_' + address)
    if (s) setBalance(Number(s))
  }, [address])

  function mint(amount) {
    if (!address) return alert('Connect wallet first')
    const n = balance + amount
    setBalance(n)
    localStorage.setItem('fundora_balance_' + address, String(n))
    alert(`${amount} mock USDC minted to your wallet (simulated).`)
  }

  return (
    <div>
      <Head><title>Fundora — Faucet</title></Head>
      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold">Mock USDC Faucet</h2>
          <p className="text-gray-400 mt-2">Use this page to mint mock USDC for testing deposits and loans.</p>

          <div className="mt-8 p-6 bg-[#0b2b2b] rounded">
            <div className="text-xl font-bold">Balance: {balance} USDC</div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => mint(100)} className="px-4 py-2 bg-pvteal text-pvdark rounded">Mint 100</button>
              <button onClick={() => mint(500)} className="px-4 py-2 bg-pvteal text-pvdark rounded">Mint 500</button>
            </div>

            <div className="mt-4 text-gray-400 text-sm">Note: this is a client-side mock to simulate token faucet. Your backend teammate can replace this with a real testnet mint endpoint.</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
