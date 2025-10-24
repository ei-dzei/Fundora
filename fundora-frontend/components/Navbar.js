import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import UsernameModal from './UsernameModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Navbar() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [username, setUsername] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (!address) {
      setUsername(null)
      return
    }
    const u = localStorage.getItem('fundora_username_' + address)
    if (!u) {
      setShowUsernameModal(true)
    } else {
      setUsername(u)
    }
  }, [address])

  function handleLogout() {
    if (!address) {
      router.push('/')
      return
    }
    // clear user-specific mock data
    localStorage.removeItem('fundora_username_' + address)
    localStorage.removeItem('fundora_vault_' + address)
    localStorage.removeItem('fundora_loan_' + address)
    localStorage.removeItem('fundora_balance_' + address)
    // disconnect wallet
    try { disconnect() } catch (e) {}
    router.push('/')
    window.location.reload()
  }

  return (
    <nav className="bg-transparent px-6 py-4 fixed top-0 left-0 right-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white font-bold">Fundora</Link>

          <div className="hidden md:flex gap-6 text-gray-200">
            <Link href="/">Home</Link>
            <Link href="/faucet">Faucet</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {address && username && (
            <div className="hidden sm:block text-right mr-4">
              <div className="text-sm font-medium text-white">{username}</div>
              <div className="text-xs text-gray-300">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            </div>
          )}
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          <button
            onClick={handleLogout}
            className="ml-3 px-3 py-2 bg-transparent border border-gray-600 text-gray-200 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {showUsernameModal && (
        <UsernameModal
          address={address}
          onClose={() => setShowUsernameModal(false)}
          onSave={(name) => {
            setUsername(name)
            setShowUsernameModal(false)
          }}
        />
      )}
    </nav>
  )
}
