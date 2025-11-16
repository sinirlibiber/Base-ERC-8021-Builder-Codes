'use client';

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, type Address } from 'viem';
import { CONTRACT_CONFIG } from '@/lib/contract-config';
import { toast } from 'sonner';

export function useERC8021Contract() {
  const { writeContractAsync, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Register builder code
  const registerBuilderCode = async (builderCode: string, revenueWallet: Address): Promise<string | undefined> => {
    try {
      const txHash = await writeContractAsync({
        ...CONTRACT_CONFIG,
        functionName: 'registerBuilderCode',
        args: [builderCode, revenueWallet],
      });
      
      toast.success('Builder code registration submitted');
      return txHash;
    } catch (error) {
      console.error('Error registering builder code:', error);
      toast.error('Failed to register builder code');
      throw error;
    }
  };

  // Record transaction
  const recordTransaction = async (
    builderCode: string,
    transactionHash: string,
    amount: string
  ): Promise<string | undefined> => {
    try {
      const txHash = await writeContractAsync({
        ...CONTRACT_CONFIG,
        functionName: 'recordTransaction',
        args: [builderCode, transactionHash],
        value: parseEther(amount),
      });
      
      toast.success('Transaction recorded on-chain');
      return txHash;
    } catch (error) {
      console.error('Error recording transaction:', error);
      toast.error('Failed to record transaction');
      throw error;
    }
  };

  // Update revenue wallet
  const updateRevenueWallet = async (builderCode: string, newWallet: Address): Promise<string | undefined> => {
    try {
      const txHash = await writeContractAsync({
        ...CONTRACT_CONFIG,
        functionName: 'updateRevenueWallet',
        args: [builderCode, newWallet],
      });
      
      toast.success('Revenue wallet updated');
      return txHash;
    } catch (error) {
      console.error('Error updating revenue wallet:', error);
      toast.error('Failed to update revenue wallet');
      throw error;
    }
  };

  return {
    registerBuilderCode,
    recordTransaction,
    updateRevenueWallet,
    isWriting,
    isConfirming,
    isSuccess,
    hash,
  };
}

// Hook to read builder info
export function useBuilderInfo(builderCode: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getBuilderInfo',
    args: [builderCode],
  });

  const builderInfo = data ? {
    revenueWallet: data[0] as Address,
    totalRevenue: data[1] as bigint,
    totalTransactions: data[2] as bigint,
    isActive: data[3] as boolean,
    registeredAt: data[4] as bigint,
  } : null;

  return {
    builderInfo,
    isLoading,
    error,
    refetch,
  };
}

// Hook to read transaction count
export function useTransactionCount(builderCode: string) {
  const { data, isLoading, error } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getTransactionCount',
    args: [builderCode],
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

// Hook to read builder codes by wallet
export function useBuilderCodesByWallet(wallet: Address | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'getBuilderCodesByWallet',
    args: wallet ? [wallet] : undefined,
    query: {
      enabled: !!wallet,
    },
  });

  return {
    builderCodes: (data as string[]) || [],
    isLoading,
    error,
    refetch,
  };
}
