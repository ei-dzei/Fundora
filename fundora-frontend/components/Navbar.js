import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import UsernameModal from './UsernameModal'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

function fmt(n, max = 2) {
  const num = Number(n || 0);
  return Number.isFinite(num)
    ? num.toLocaleString(undefined, { maximumFractionDigits: max })
    : '0';
}

export default function Navbar() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [username, setUsername] = useState(null)
  const [walletUSDC, setWalletUSDC] = useState(0)
  const [vault, setVault] = useState({ balance: 0, timelockEndsAt: null })
  const router = useRouter()

  const short = useMemo(() => (
    address ? `${address.slice(0, 6)}…${address.slice(-4)}` : null
  ), [address])

  const lockEnds = vault?.timelockEndsAt ? new Date(vault.timelockEndsAt).getTime() : null
  const remainingDays = useMemo(() => {
    if (!lockEnds) return 0
    const d = Math.max(0, Math.floor((lockEnds - Date.now()) / (1000*60*60*24)))
    return d
  }, [lockEnds])

  useEffect(() => {
    if (!address) {
      setUsername(null)
      setWalletUSDC(0)
      setVault({ balance: 0, timelockEndsAt: null })
      return
    }
    const u = localStorage.getItem('fundora_username_' + address)
    if (!u) {
      setShowUsernameModal(true)
    } else {
      setUsername(u)
    }

    const b = Number(localStorage.getItem('fundora_balance_' + address) || '0')
    setWalletUSDC(b)

    const v = localStorage.getItem('fundora_vault_' + address)
    setVault(v ? JSON.parse(v) : { balance: 0, timelockEndsAt: null })
  }, [address])

  function handleLogout() {
    if (!address) {
      router.push('/')
      return
    }
    localStorage.removeItem('fundora_username_' + address)
    localStorage.removeItem('fundora_vault_' + address)
    localStorage.removeItem('fundora_loan_' + address)
    localStorage.removeItem('fundora_balance_' + address)
    try { disconnect() } catch (e) {}
    router.push('/')
    window.location.reload()
  }

  const WalletChip = () => {
    if (!address) return null
    const locked = Boolean(lockEnds && lockEnds > Date.now())
    const lockBadge = locked
      ? `${remainingDays}d left`
      : (vault.timelockEndsAt ? 'Unlocked' : 'No timelock')

    return (
      <div className="relative group">
        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white hover:bg-white/10"
          title="Wallet"
        >
          <div className="flex items-center gap-3">
            {/* identicon-lite: colored dot */}
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                background:
                  `hsl(${parseInt(address.slice(2, 6), 16) % 360} 80% 50%)`
              }}
            />
            <div>
              <div className="font-medium">{username || short}</div>
              <div className="text-[11px] text-zinc-400">{short}</div>
            </div>
          </div>
        </button>

        {/* Dropdown */}
        <div className="invisible absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0b2b2b] p-4 text-sm text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
          <div className="mb-2 font-semibold">Wallet</div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-zinc-300">Mock USDC</span>
              <span className="font-semibold">{fmt(walletUSDC)} USDC</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-zinc-300">Vault</span>
              <span className="font-semibold">
                {fmt(vault.balance)} USDC
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-zinc-300">Timelock</span>
              <span className={`font-semibold ${lockEnds ? 'text-emerald-200' : 'text-zinc-200'}`}>
                {lockBadge}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/faucet"
              className="rounded-lg bg-pvteal px-3 py-2 text-center font-semibold text-pvdark hover:opacity-90"
            >
              Faucet
            </Link>
            <Link
              href="/home?action=deposit"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center font-semibold text-zinc-200 hover:bg-white/10"
            >
              Deposit
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-center text-zinc-200 hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <nav className="bg-transparent px-6 py-4 fixed top-0 left-0 right-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white font-bold">Fundora</Link>
          <div className="hidden md:flex gap-6 text-gray-200">
            <Link href="/">Home</Link>
            <Link href="/faucet">Faucet</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini dashboard chip */}
          <WalletChip />

          {/* RainbowKit button */}
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
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
