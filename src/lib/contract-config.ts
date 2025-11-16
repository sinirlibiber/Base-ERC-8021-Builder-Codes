import type { Address } from 'viem';
import contractABI from '@/contracts/ERC8021BuilderCodes.json';

export const ERC8021_CONTRACT_ADDRESS: Address = (process.env.NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;

export const ERC8021_ABI = contractABI.abi;

export const CONTRACT_CONFIG = {
  address: ERC8021_CONTRACT_ADDRESS,
  abi: ERC8021_ABI,
} as const;

export const PLATFORM_FEE_RATE = 50; // 0.5% in basis points
export const MAX_FEE_RATE = 1000; // 10% max

export function isContractDeployed(): boolean {
  return ERC8021_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}
