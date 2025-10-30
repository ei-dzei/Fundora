import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeatureCard from '../components/FeatureCard'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Fundora — Onchain Pension</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-pvdeep via-pvdark to-[#071a1b] text-white pt-20">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Invest in
                <br />
                the future with
                <br />
                <span className="text-pvteal">Fundora</span>
              </h1>

              <p className="mt-6 text-gray-300 max-w-xl">
                Earn, Save, Borrow, Retire — all on one chain. Simple timelocked vaults let you save securely and borrow responsibly against locked funds.
              </p>

              <div className="mt-8">
                <a href="/home" className="inline-block bg-pvteal text-pvdark px-5 py-2 rounded-md font-medium shadow hover:opacity-95 transition">Get started</a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="h-64 md:h-72 bg-gradient-to-br from-[#0e3a3b] to-[#042425] rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">Fundora</div>
                  <p className="mt-2 text-gray-300">Onchain Pension, Savings & Credit</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-center text-xl md:text-2xl font-semibold">Onchain Pension, Savings & Credit</h2>
          <p className="text-center text-gray-400 mt-2">Fundora helps you lock savings, earn, and borrow responsibly.</p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <FeatureCard title="Lock & Save" description="Create timelocked vaults for future withdrawals." />
            <FeatureCard title="Borrow" description="Borrow stablecoins up to 60% of your vault." />
            <FeatureCard title="Faucet" description="Mint mock USDC on the faucet for testing." />
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 py-10 text-center">
          <h3 className="text-2xl font-semibold">How <span className="text-pvteal">Fundora</span> works?</h3>
          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-pvteal text-pvdark flex items-center justify-center font-bold">1</div>
              <div className="text-left">
                <div className="font-semibold">Connect Wallet</div>
                <div className="text-gray-400 text-sm">Use your web3 wallet to sign in — your address becomes your Fundora account.</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-pvteal text-pvdark flex items-center justify-center font-bold">2</div>
              <div className="text-left">
                <div className="font-semibold">Deposit & Lock</div>
                <div className="text-gray-400 text-sm">Create a timelocked vault with mock USDC deposits.</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-pvteal text-pvdark flex items-center justify-center font-bold">3</div>
              <div className="text-left">
                <div className="font-semibold">Borrow & Repay</div>
                <div className="text-gray-400 text-sm">Borrow within limits and repay before your vault unlocks.</div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
