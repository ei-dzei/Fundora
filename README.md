# 🏦 Fundora — On-chain Pension Vaults
> _“Save, lock, and borrow — all in a transparent on-chain vault.”_

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![wagmi](https://img.shields.io/badge/wagmi-React_Hooks_for_Ethereum-2A5ADA?style=for-the-badge&logo=ethereum)](https://wagmi.sh/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)

---

## 🧭 Overview

**Fundora** is a decentralized **pension and savings simulation app** built on the **Ethereum Sepolia Testnet**.  
It lets users experience **DeFi vault mechanics** — including **timelocked deposits**, **mock USDC faucets**,  
and **loan simulations** — all directly from their connected wallet.

This project demonstrates how future-proof, **on-chain pension systems** can be built with intuitive UX and  
transparent vault logic.

---

## 🎯 Features

| Category | Description |
|-----------|-------------|
| 💰 **Timelocked Vaults** | Automatically create a personal vault on wallet connect and set your savings lock period. |
| 🔒 **Deposit Simulation** | Deposit mock USDC from the Faucet — withdraw only after the timelock ends. |
| 🪙 **Faucet Integration** | Claim test USDC tokens on Sepolia to simulate vault deposits. |
| 💸 **Loan Requests** | Borrow up to 60% of your vault balance with a due date before unlock. |
| 📊 **Dynamic Dashboard** | View balances, loans, unlock progress, and daily earning estimates. |
| ⚡ **Quick Actions** | Deposit, borrow, or manage your timelock directly from the dashboard. |
| 👛 **Wallet Integration** | Seamless MetaMask connection and automatic network switching (Sepolia). |

---

## 🚀 Getting Started

### ✅ Prerequisites
- **Node.js** v18+
- **MetaMask** wallet (connected to Sepolia Testnet)
- **SepoliaETH** for gas (get some from [sepoliafaucet.com](https://sepoliafaucet.com/))

---

### ⚙️ Installation

```bash
git clone https://github.com/yourusername/fundora-frontend.git
cd fundora-frontend
npm install
````

---

### 🧪 Development

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 🧱 Production Build

To build and run Fundora in production mode:

```bash
npm run build
npm run start
```

Your app will run at **[http://localhost:3000](http://localhost:3000)** using the optimized Next.js build.

---

## 🎮 How to Use

1. **Connect Wallet** — Click the **Connect Wallet** button in the navbar.
2. **Auto Vault Creation** — Your vault is created automatically on first connect.
3. **Set Timelock** — Choose how long your funds will be locked (e.g., 30 days).
4. **Claim Test USDC** — Visit the **Faucet** page and click “Claim Tokens.”
5. **Deposit Funds** — Add mock USDC to your vault (inherits your current timelock).
6. **Borrow Against Vault** — Request a simulated loan up to 60% of your vault balance.
7. **Track Progress** — View vault stats, remaining lock days, and earning estimates.

---

## 🏗️ Technology Stack

| Layer               | Technologies                                  |
| ------------------- | --------------------------------------------- |
| **Frontend**        | Next.js 15 (React 19) + Tailwind CSS 3        |
| **Blockchain**      | Base Sepolia Testnet, wagmi, ethers.js    |
| **UI/UX**           | Framer Motion (animations), ShadCN Components |
| **Persistence**     | LocalStorage (simulated state)                |
| **Smart Contracts** | FaucetModule.sol + MockUSDC.sol               |

---

## 🔧 Environment Configuration

Create a `.env.local` file in your root directory:

```bash
NEXT_PUBLIC_FAUCET_ADDRESS=0xYourFaucetContractAddress
NEXT_PUBLIC_USDC_ADDRESS=0xYourMockUSDCContractAddress
```

Both addresses should correspond to deployed contracts on the **Sepolia** network.

| Contract     | Description                     | Env Variable                 |
| ------------ | ------------------------------- | ---------------------------- |
| FaucetModule | Dispenses mock USDC for testing | `NEXT_PUBLIC_FAUCET_ADDRESS` |
| MockUSDC     | ERC20-compatible mock token     | `NEXT_PUBLIC_USDC_ADDRESS`   |

---

## 🧩 Current Status

Fundora currently operates in **demo mode**, using mock contract data on Sepolia and persisting
vault states via localStorage.

A full version could integrate:

* On-chain vault creation and real USDC token management
* Decentralized timelock enforcement through smart contracts
* Lending pools and automatic yield routing

---

## 🛠️ Commands Summary

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm install`   | Install dependencies               |
| `npm run dev`   | Start the local development server |
| `npm run build` | Build production-ready app         |
| `npm run start` | Run the app in production mode     |

---

## ❤️ Built With

Built with ❤️ for the **Web3 Builder Community**
and inspired by the goal of making **DeFi tools simple, transparent, and empowering**.

---
