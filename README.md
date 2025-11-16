# 🚀 ERC-8021 Builder Codes Platform

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF)](https://www.base.org)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.x-purple)](https://wagmi.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized platform for builder code management and revenue sharing on Base network, implementing the [ERC-8021 standard](https://eip.tools/eip/8021).

![ERC-8021 Platform](https://github.com/sinirlibiber/erc8021-builder-codes/blob/main/screenshot.png?raw=true)

## 🌟 Features

### 🔐 Multi-Wallet Support
- **Web3Modal** - Universal wallet selector with QR code support
- **Coinbase Wallet** - Native Base integration (smart wallets + EOA)
- **WalletConnect** - Connect any wallet via QR code
- **MetaMask** - Browser extension support  
- **Injected Wallets** - Support for all Web3 wallets
- **Farcaster MiniApp** - Automatic wallet connection in Warpcast

### 📝 Builder Code Management
- **On-Chain Registration** - Register builder codes directly on Base mainnet
- **Local Storage** - Quick testing with local storage fallback
- **Ownership Verification** - Cryptographic proof of builder code ownership
- **Revenue Wallet Configuration** - Specify where to receive earnings

### 💰 Automatic Revenue Distribution
- **0.5% Transaction Fee** - Automated fee collection
- **0.45% to Builders** - Revenue share for builders
- **0.05% Platform Fee** - Sustainable platform operation
- **Real-Time Tracking** - Live revenue updates

### 📊 Analytics Dashboard
- **Revenue Metrics** - Track total earnings across all builder codes
- **Transaction History** - Detailed transaction logs
- **Builder Leaderboard** - See top earning builders
- **Platform Statistics** - Network-wide performance metrics

### ⚡ Built for Base
- **Low Gas Fees** - Optimized for Base L2 network
- **Fast Transactions** - Sub-second confirmation times
- **OnchainKit Integration** - Official Base toolkit
- **Farcaster MiniApp** - Ready to deploy on Warpcast

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Wagmi 2.x, Viem 2.x, OnchainKit 1.1
- **Styling**: Tailwind CSS, shadcn/ui components
- **Wallets**: WalletConnect, Coinbase Wallet, Injected providers
- **Network**: Base Mainnet (Chain ID: 8453)
- **Smart Contracts**: Solidity, OpenZeppelin

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- A Base wallet (Coinbase Wallet recommended)
- (Optional) WalletConnect Project ID

### Installation

```bash
# Clone the repository
git clone https://github.com/sinirlibiber/erc8021-builder-codes.git
cd erc8021-builder-codes

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```bash
# OnchainKit (required for Base integration)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CDP_PROJECT_ID=your_coinbase_project_id

# WalletConnect (optional, for WalletConnect modal)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Address (after deployment)
NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS=0x...
```

**Get your API keys:**
- OnchainKit: [OnchainKit Dashboard](https://www.coinbase.com/cloud/products/onchainkit)
- WalletConnect: [WalletConnect Cloud](https://cloud.walletconnect.com)

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Smart Contract Deployment

### Using Foundry (Recommended)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Create new project
forge init erc8021-contracts
cd erc8021-contracts

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Copy contract
cp ../src/contracts/ERC8021BuilderCodes.sol src/

# Update foundry.toml
echo "[profile.default]
src = 'src'
out = 'out'
libs = ['lib']
remappings = ['@openzeppelin/=lib/openzeppelin-contracts/']" > foundry.toml

# Deploy to Base Mainnet
forge create \
  --rpc-url https://mainnet.base.org \
  --private-key YOUR_PRIVATE_KEY \
  --constructor-args YOUR_PLATFORM_WALLET \
  src/ERC8021BuilderCodes.sol:ERC8021BuilderCodes \
  --verify \
  --etherscan-api-key YOUR_BASESCAN_API_KEY

# Add deployed address to .env.local
echo "NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS=0x..." >> ../.env.local
```

### Using Hardhat (Alternative)

```bash
# Install Hardhat
pnpm add --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Copy contract to contracts/
cp src/contracts/ERC8021BuilderCodes.sol contracts/

# Deploy script
npx hardhat run scripts/deploy.js --network base

# Add address to .env.local
echo "NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS=0x..." >> .env.local
```

## 📱 Deploy as Farcaster MiniApp

This app is ready to deploy as a Farcaster MiniApp:

1. **Publish to Vercel or your hosting platform**
2. **Configure Farcaster manifest** in `public/.well-known/farcaster.json`
3. **Test in Warpcast** by opening your app URL
4. **Share on Farcaster** and let users add to their MiniApp drawer

The app automatically detects Farcaster context and enables:
- Base Smart Wallet integration
- Quick Auth for seamless login
- Farcaster SDK features

## 🎯 Usage Guide

### 1. Connect Wallet

**Option A: Web3Modal (Recommended)**
1. Open the **Wallet** tab
2. Click "Connect with Web3Modal" button
3. Choose from any supported wallet
4. Scan QR code (mobile) or connect directly (browser)
5. Approve the connection

**Option B: Direct Connection**
1. Open the **Wallet** tab  
2. Select your preferred wallet from the list:
   - 🔵 **Coinbase Wallet** - Best for Base users
   - 🦊 **MetaMask** - Browser extension
   - 🔗 **WalletConnect** - Mobile wallets via QR
   - **Injected** - Any browser wallet
3. Approve the connection in your wallet

**Option C: Farcaster MiniApp (Auto-connect)**
1. Open app in Warpcast
2. Wallet connects automatically
3. Start using immediately

**Troubleshooting:**
- Make sure you're on Base network (Chain ID: 8453)
- If using MetaMask, add Base network first
- Clear browser cache if connection fails
- Try Web3Modal if direct connection doesn't work

### 2. Register Builder Code
- Navigate to **Register Code** tab
- Choose between **On-Chain** (permanent) or **Local** (testing)
- Enter your builder code (e.g., `my-app-v1`)
- Specify revenue wallet address
- Confirm transaction (on-chain only)

### 3. Track Transactions
- Go to **Track Txns** tab
- Select your builder code
- Enter transaction hash and amount
- Record transaction on-chain

### 4. View Revenue
- Check **Revenue Panel** for earnings
- See per-builder-code statistics
- View transaction history

### 5. Platform Analytics
- **Platform Analytics** tab shows network-wide stats
- See top earning builders
- Monitor platform activity

## 🧪 Testing

```bash
# Run tests (when available)
pnpm test

# Check TypeScript
pnpm build

# Lint
pnpm lint
```

## 📊 ERC-8021 Standard

The ERC-8021 standard enables builders to earn revenue from application activities:

- **Builder Codes**: Unique identifiers for applications
- **Transparent Tracking**: All transactions recorded on-chain
- **Automatic Distribution**: Smart contracts handle revenue sharing
- **Proven Model**: Used successfully by Hyperliquid and Polymarket

Learn more: [ERC-8021 Documentation](https://eip.tools/eip/8021)

## 🛠️ Project Structure

```
erc8021-builder-codes/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main page
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # Web3 providers
│   │   ├── config/            # Configuration
│   │   └── types/             # TypeScript types
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── wallet-connector.tsx
│   │   ├── builder-code-register.tsx
│   │   ├── transaction-tracker.tsx
│   │   ├── revenue-dashboard.tsx
│   │   ├── analytics-view.tsx
│   │   └── footer.tsx
│   ├── contracts/             # Smart contracts
│   │   ├── ERC8021BuilderCodes.sol
│   │   └── ERC8021BuilderCodes.json
│   ├── hooks/                 # Custom React hooks
│   │   └── useERC8021Contract.ts
│   └── lib/                   # Utilities
│       ├── contract-config.ts
│       └── erc8021-storage.ts
└── public/                    # Static assets
    └── .well-known/
        └── farcaster.json     # Farcaster manifest
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Live Demo**: [Coming Soon]
- **ERC-8021 Spec**: [eip.tools/eip/8021](https://eip.tools/eip/8021)
- **Base Network**: [base.org](https://www.base.org)
- **OnchainKit**: [OnchainKit Docs](https://www.coinbase.com/cloud/products/onchainkit)
- **Farcaster**: [farcaster.xyz](https://www.farcaster.xyz)

## 👤 Author

**Built by [@sinirlibiber](https://github.com/sinirlibiber)**

- GitHub: [@sinirlibiber](https://github.com/sinirlibiber)
- Farcaster: [@gumusbey](https://farcaster.xyz/gumusbey)

## 🙏 Acknowledgments

- Built on [Base](https://www.base.org) - Ethereum L2 network
- Powered by [OnchainKit](https://www.coinbase.com/cloud/products/onchainkit)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Wallet integration via [Wagmi](https://wagmi.sh) and [WalletConnect](https://walletconnect.com)
- Inspired by the [ERC-8021](https://eip.tools/eip/8021) standard

---

**⭐ Star this repo if you find it useful!**

**💙 Built with ❤️ on Base**
