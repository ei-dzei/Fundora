import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import DepositModal from '../components/DepositModal'
import LoanModal from '../components/LoanModal'
import { useAccount } from 'wagmi'

export default function HomePage() {
  const { address } = useAccount()
  const [vault, setVault] = useState({ balance: 0, timelockEndsAt: null })
  const [loan, setLoan] = useState(null)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showLoan, setShowLoan] = useState(false)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    if (!address) return
    const u = localStorage.getItem('fundora_username_' + address)
    setUsername(u)
    const s = localStorage.getItem('fundora_vault_' + address)
    if (s) setVault(JSON.parse(s))
    const l = localStorage.getItem('fundora_loan_' + address)
    if (l) setLoan(JSON.parse(l))
  }, [address])

  useEffect(() => {
    if (!address) return
    localStorage.setItem('fundora_vault_' + address, JSON.stringify(vault))
  }, [vault, address])

  useEffect(() => {
    if (!address) return
    if (loan) localStorage.setItem('fundora_loan_' + address, JSON.stringify(loan))
    else localStorage.removeItem('fundora_loan_' + address)
  }, [loan, address])

  return (
    <div>
      <Head><title>Fundora — Dashboard</title></Head>
      <Navbar />

      <main className="min-h-screen bg-[#071a1b] text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{username || 'Guest'}</h2>
              <div className="text-gray-400 mt-1 text-sm">Address: {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected'}</div>
            </div>
          </div>

          <p className="text-gray-400 mt-4">Welcome — this dashboard shows your vault and loans.</p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#0b2b2b] rounded-lg">
              <h3 className="font-semibold">Vault</h3>
              <div className="mt-4">
                <div className="text-3xl font-bold">{vault.balance} USDC</div>
                <div className="text-gray-400 mt-2">Timelock ends: {vault.timelockEndsAt ? new Date(vault.timelockEndsAt).toLocaleString() : 'Not set'}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowDeposit(true)} className="px-4 py-2 bg-pvteal text-pvdark rounded">Deposit</button>
                <button disabled={!vault.balance} onClick={() => setShowLoan(true)} className="px-4 py-2 border border-gray-600 rounded disabled:opacity-50">Loan</button>
              </div>
            </div>

            <div className="p-6 bg-[#0b2b2b] rounded-lg">
              <h3 className="font-semibold">Active Loan</h3>
              {loan ? (
                <div className="mt-4">
                  <div className="text-2xl font-bold">{loan.amount} USDC</div>
                  <div className="text-gray-400 mt-2">Due by: {new Date(loan.dueAt).toLocaleString()}</div>
                </div>
              ) : (
                <div className="mt-4 text-gray-400">No active loan</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} onDeposit={(amount, timelockEndsAt) => {
        setVault(prev => ({ balance: prev.balance + amount, timelockEndsAt }))
        setShowDeposit(false)
      }} />}

      {showLoan && <LoanModal onClose={() => setShowLoan(false)} vault={vault} onCreateLoan={(loanObj) => {
        setLoan(loanObj)
        setShowLoan(false)
      }} />}

    </div>
  )
}
