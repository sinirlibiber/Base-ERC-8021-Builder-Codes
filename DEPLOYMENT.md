# ERC-8021 Builder Codes - Deployment Guide

## 📋 Overview

This guide will walk you through deploying the ERC-8021 smart contract to Base mainnet using Foundry.

## 🔧 Prerequisites

- **Foundry**: Install from https://book.getfoundry.sh/getting-started/installation
- **Base RPC URL**: Get from https://base.org
- **Private Key**: Your deployer wallet private key
- **ETH on Base**: For gas fees (get from bridge or exchange)

## 📦 Contract Files

The smart contract is located at:
```
src/contracts/ERC8021BuilderCodes.sol
```

## 🚀 Deployment Steps

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Create Foundry Project

```bash
mkdir erc8021-contracts
cd erc8021-contracts
forge init
```

### 3. Install OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### 4. Configure Dependencies

Create `remappings.txt`:
```
@openzeppelin/=lib/openzeppelin-contracts/
```

### 5. Copy Contract

Copy `src/contracts/ERC8021BuilderCodes.sol` to your Foundry project:
```bash
cp ../src/contracts/ERC8021BuilderCodes.sol src/
```

### 6. Set Environment Variables

Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
PLATFORM_WALLET=your_platform_wallet_address
```

Load environment:
```bash
source .env
```

### 7. Deploy Contract

```bash
forge create \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args $PLATFORM_WALLET \
  src/ERC8021BuilderCodes.sol:ERC8021BuilderCodes \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### 8. Save Contract Address

After deployment, you'll see output like:
```
Deployer: 0x...
Deployed to: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Transaction hash: 0x...
```

### 9. Update Next.js App

Add the deployed contract address to your `.env.local`:
```env
NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### 10. Restart Development Server

```bash
npm run dev
```

## 🔐 WalletConnect Configuration

To enable multi-wallet support, add your WalletConnect Project ID:

1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy your Project ID
4. Add to `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 📝 Contract Features

The deployed contract includes:

- **Builder Code Registration**: Register unique builder codes with revenue wallets
- **Transaction Recording**: Record transactions and distribute revenue automatically
- **Revenue Tracking**: Track total revenue and transaction counts per builder
- **Fee Management**: Platform fee management (default 0.5%)
- **Ownership Controls**: Update revenue wallets and platform settings

## 🧪 Testing on Testnet

To test first on Base Sepolia:

1. Use Base Sepolia RPC: `https://sepolia.base.org`
2. Get testnet ETH from https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
3. Deploy following the same steps above

## 🔒 Security Considerations

- ✅ ReentrancyGuard protection
- ✅ Ownable access control
- ✅ Input validation
- ✅ Emergency withdrawal function
- ✅ Upgradeable fee rates

## 📊 Contract Verification

After deployment, verify on BaseScan:

```bash
forge verify-contract \
  --chain-id 8453 \
  --num-of-optimizations 200 \
  --constructor-args $(cast abi-encode "constructor(address)" $PLATFORM_WALLET) \
  --etherscan-api-key $BASESCAN_API_KEY \
  $CONTRACT_ADDRESS \
  src/ERC8021BuilderCodes.sol:ERC8021BuilderCodes
```

## 🎯 Next Steps

After deployment:

1. ✅ Test builder code registration
2. ✅ Test transaction recording
3. ✅ Verify revenue distribution
4. ✅ Monitor gas costs
5. ✅ Set up event monitoring
6. ✅ Configure platform wallet

## 📚 Resources

- **ERC-8021 Spec**: https://eip.tools/eip/8021
- **Base Docs**: https://docs.base.org
- **Foundry Book**: https://book.getfoundry.sh
- **OpenZeppelin**: https://docs.openzeppelin.com

## 💬 Support

For deployment issues:
- Check Foundry logs: `forge --help`
- Verify Base RPC: `cast chain-id --rpc-url $BASE_RPC_URL`
- Check balance: `cast balance $YOUR_ADDRESS --rpc-url $BASE_RPC_URL`

## 🎉 Success!

Once deployed, your ERC-8021 dapp is live on Base mainnet with:
- ✅ Multi-wallet support (Coinbase, WalletConnect, MetaMask)
- ✅ On-chain builder code registration
- ✅ Automated revenue distribution
- ✅ Real-time transaction tracking
- ✅ Analytics and reporting

Happy building! 🚀
