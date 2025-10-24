import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

export default function LoanModal({ onClose, vault, onCreateLoan }) {
  const [amount, setAmount] = useState(0)
  const [repayDays, setRepayDays] = useState(30)
  const { address } = useAccount()

  function submit() {
    const a = Number(amount)
    if (!a || a <= 0) return alert('Enter a valid amount')

    const maxLoan = vault.balance * 0.6
    if (a > maxLoan) return alert(`Loan too large. Max allowed is ${maxLoan} USDC (60% of vault).`)

    if (!vault.timelockEndsAt) return alert('You must have a timelocked vault to borrow.')
    const remainingMs = new Date(vault.timelockEndsAt).getTime() - Date.now()
    const remainingDays = Math.floor(remainingMs / (1000*60*60*24))
    if (repayDays > remainingDays) return alert(`Loan repayment must be within your vault timelock (max ${remainingDays} days).`)

    const dueAt = Date.now() + repayDays * 24*60*60*1000
    // credit mock wallet with loan amount
    const balKey = 'fundora_balance_' + address
    const b = Number(localStorage.getItem(balKey) || '0')
    localStorage.setItem(balKey, String(b + a))
    onCreateLoan({ amount: a, dueAt })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative bg-white text-black rounded-lg p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-semibold">Request a Loan</h3>
        <p className="text-sm text-gray-600 mt-2">Loans allowed up to 60% of your vault balance and must be repaid before your vault unlocks.</p>

        <div className="mt-4">
          <label className="block text-sm">Amount (USDC)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />

          <label className="block text-sm mt-3">Repayment (days)</label>
          <input type="number" value={repayDays} onChange={e => setRepayDays(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-pvteal text-pvdark rounded">Request Loan</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
