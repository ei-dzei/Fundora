import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

export default function DepositModal({ onClose, onDeposit }) {
  const [amount, setAmount] = useState(0)
  const [unlockDays, setUnlockDays] = useState(30)
  const { address } = useAccount()

  function submit() {
    const a = Number(amount)
    if (!a || a <= 0) return alert('Enter a valid amount')
    const now = Date.now()
    const due = now + unlockDays * 24 * 60 * 60 * 1000
    // deduct from mock wallet balance
    const balKey = 'fundora_balance_' + address
    const b = Number(localStorage.getItem(balKey) || '0')
    if (a > b) return alert('Insufficient mock USDC in your wallet. Visit Faucet to mint.')
    localStorage.setItem(balKey, String(b - a))
    onDeposit(a, due)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative bg-white text-black rounded-lg p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-semibold">Deposit to Vault</h3>
        <p className="text-sm text-gray-600 mt-2">Enter the amount of mock USDC to deposit and set how long it should be locked.</p>

        <div className="mt-4">
          <label className="block text-sm">Amount (USDC)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />

          <label className="block text-sm mt-3">Timelock (days)</label>
          <input type="number" value={unlockDays} onChange={e => setUnlockDays(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-pvteal text-pvdark rounded">Deposit</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
