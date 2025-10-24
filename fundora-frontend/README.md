# Fundora — Next.js Frontend (Pages Router)

This is a demo frontend for **Fundora** — an on-chain pension vault UI. It uses Next.js (Pages Router), Tailwind CSS, Wagmi, and RainbowKit for wallet connections. Vaults, loans and the faucet are **client-side mocks** persisted in `localStorage` so you can demo the full flow without a backend.

## Features
- Multi-chain wallet connection (RainbowKit).
- Username creation modal on first connect (username tied to wallet address).
- Dashboard shows main username + shortened wallet address below.
- Deposit modal — deposits mock USDC from the user wallet balance into a timelocked vault.
- Loan modal — borrow up to 60% of the vault; loan is credited to mock balance; must be repaid within vault timelock.
- Faucet to mint mock USDC to your connected wallet (client-side).
- Logout button in navbar clears wallet-specific mock data and disconnects.

## Quick start
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

> Notes:
> - Wallet connection is multi-chain (Mainnet, Polygon, Optimism, Arbitrum). If you want to add Base network, update `pages/_app.js` and include `base` from `wagmi/chains` (and ensure your wagmi version supports it).
> - All token and vault operations are simulated with `localStorage` keys prefixed with `fundora_` to keep data scoped by wallet address.

## Files of interest
- `pages/index.js` — Landing/Hero.
- `pages/home.js` — Dashboard (after connect).
- `pages/faucet.js` — Mock token faucet.
- `components/Navbar.js` — Navbar + ConnectButton + Logout + username flow.
- `components/UsernameModal.js` — create username on first connect.
- `components/DepositModal.js` — deposit flow.
- `components/LoanModal.js` — loan flow.

Good luck with your submission — if you want, I can also add a short feature paragraph you can paste into your project report.
