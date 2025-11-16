'use client';

import type { BuilderCode, Transaction, RevenueShare, AnalyticsData } from '@/app/types/erc8021';
import type { Address } from 'viem';

const STORAGE_KEYS = {
  BUILDER_CODES: 'erc8021_builder_codes',
  TRANSACTIONS: 'erc8021_transactions',
  REVENUE_SHARES: 'erc8021_revenue_shares',
};

export function getBuilderCodes(): BuilderCode[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.BUILDER_CODES);
  return data ? JSON.parse(data, reviver) : [];
}

export function saveBuilderCode(code: BuilderCode): void {
  const codes = getBuilderCodes();
  const existingIndex = codes.findIndex((c: BuilderCode) => c.code === code.code);
  
  if (existingIndex >= 0) {
    codes[existingIndex] = code;
  } else {
    codes.push(code);
  }
  
  localStorage.setItem(STORAGE_KEYS.BUILDER_CODES, JSON.stringify(codes, replacer));
}

export function getBuilderCode(code: string): BuilderCode | undefined {
  const codes = getBuilderCodes();
  return codes.find((c: BuilderCode) => c.code === code);
}

export function getBuilderCodesByOwner(owner: Address): BuilderCode[] {
  const codes = getBuilderCodes();
  return codes.filter((c: BuilderCode) => c.owner.toLowerCase() === owner.toLowerCase());
}

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data, reviver) : [];
}

export function saveTransaction(tx: Transaction): void {
  const transactions = getTransactions();
  transactions.push(tx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions, replacer));
  
  const builderCode = getBuilderCode(tx.builderCode);
  if (builderCode) {
    builderCode.totalVolume = builderCode.totalVolume + tx.value;
    builderCode.totalRevenue = builderCode.totalRevenue + tx.revenue;
    saveBuilderCode(builderCode);
  }
}

export function getTransactionsByBuilderCode(code: string): Transaction[] {
  const transactions = getTransactions();
  return transactions.filter((tx: Transaction) => tx.builderCode === code);
}

export function getRevenueShares(): RevenueShare[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.REVENUE_SHARES);
  return data ? JSON.parse(data, reviver) : [];
}

export function saveRevenueShare(share: RevenueShare): void {
  const shares = getRevenueShares();
  const existingIndex = shares.findIndex(
    (s: RevenueShare) => s.builderCode === share.builderCode && s.platform === share.platform
  );
  
  if (existingIndex >= 0) {
    shares[existingIndex] = share;
  } else {
    shares.push(share);
  }
  
  localStorage.setItem(STORAGE_KEYS.REVENUE_SHARES, JSON.stringify(shares, replacer));
}

export function getAnalytics(): AnalyticsData {
  const codes = getBuilderCodes();
  const transactions = getTransactions();
  
  return {
    totalBuilders: codes.length,
    totalVolume: codes.reduce((sum: bigint, c: BuilderCode) => sum + c.totalVolume, 0n),
    totalRevenue: codes.reduce((sum: bigint, c: BuilderCode) => sum + c.totalRevenue, 0n),
    activeBuilders: codes.filter((c: BuilderCode) => c.active).length,
    transactionCount: transactions.length,
  };
}

function replacer(key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return { __type: 'bigint', value: value.toString() };
  }
  return value;
}

function reviver(key: string, value: unknown): unknown {
  if (
    value &&
    typeof value === 'object' &&
    '__type' in value &&
    value.__type === 'bigint' &&
    'value' in value &&
    typeof value.value === 'string'
  ) {
    return BigInt(value.value);
  }
  return value;
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.BUILDER_CODES);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.REVENUE_SHARES);
}
