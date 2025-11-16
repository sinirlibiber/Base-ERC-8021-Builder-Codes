import type { Address } from 'viem';

export type BuilderCode = {
  code: string;
  owner: Address;
  wallet: Address;
  registeredAt: number;
  totalVolume: bigint;
  totalRevenue: bigint;
  active: boolean;
};

export type Transaction = {
  hash: string;
  builderCode: string;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  revenue: bigint;
};

export type RevenueShare = {
  builderCode: string;
  platform: string;
  percentage: number;
  totalEarned: bigint;
};

export type AnalyticsData = {
  totalBuilders: number;
  totalVolume: bigint;
  totalRevenue: bigint;
  activeBuilders: number;
  transactionCount: number;
};
