import { useState } from 'react'
import { motion } from 'framer-motion'

export default function UsernameModal({ address, onClose, onSave }) {
  const [name, setName] = useState('')

  function save() {
    if (!name || name.trim().length < 2) return alert('Enter a username (min 2 chars)')
    localStorage.setItem('fundora_username_' + address, name.trim())
    if (onSave) onSave(name.trim())
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative bg-white text-black rounded-lg p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-semibold">Create your Fundora username</h3>
        <p className="text-sm text-gray-600 mt-2">This will be your display name inside the app (tied to your connected wallet).</p>

        <div className="mt-4">
          <label className="block text-sm">Username</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="e.g. angeline" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={save} className="px-4 py-2 bg-pvteal text-pvdark rounded">Save</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
