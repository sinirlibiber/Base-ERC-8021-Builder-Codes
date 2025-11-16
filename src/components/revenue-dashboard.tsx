'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuilderCodesByOwner, getTransactionsByBuilderCode } from '@/lib/erc8021-storage';
import type { BuilderCode, Transaction } from '@/app/types/erc8021';
import { formatEther } from 'viem';

export function RevenueDashboard(): JSX.Element {
  const { address } = useAccount();
  const [builderCodes, setBuilderCodes] = useState<BuilderCode[]>([]);
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});

  useEffect(() => {
    if (!address) return;

    const codes = getBuilderCodesByOwner(address);
    setBuilderCodes(codes);

    const txMap: Record<string, Transaction[]> = {};
    codes.forEach((code: BuilderCode) => {
      txMap[code.code] = getTransactionsByBuilderCode(code.code);
    });
    setTransactions(txMap);
  }, [address]);

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Dashboard</CardTitle>
          <CardDescription>Connect your wallet to view revenue dashboard</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (builderCodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Dashboard</CardTitle>
          <CardDescription>No registered builder codes yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You can view your revenue statistics here after registering a builder code.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = builderCodes.reduce((sum: bigint, code: BuilderCode) => sum + code.totalRevenue, 0n);
  const totalVolume = builderCodes.reduce((sum: bigint, code: BuilderCode) => sum + code.totalVolume, 0n);
  const totalTransactions = Object.values(transactions).reduce(
    (sum: number, txList: Transaction[]) => sum + txList.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatEther(totalRevenue)} ETH</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Earned from all builder codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Transaction Volume</CardDescription>
            <CardTitle className="text-3xl">{formatEther(totalVolume)} ETH</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Transactions with builder code
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transaction Count</CardDescription>
            <CardTitle className="text-3xl">{totalTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total recorded transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Builder Code Details</CardTitle>
          <CardDescription>Revenue and transaction stats for each builder code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {builderCodes.map((code: BuilderCode) => {
              const codeTxs = transactions[code.code] || [];
              return (
                <div key={code.code} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{code.code}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        code.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {code.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">{formatEther(code.totalRevenue)} ETH</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">{formatEther(code.totalVolume)} ETH</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transactions</p>
                      <p className="font-medium">{codeTxs.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Registered</p>
                      <p className="font-medium">
                        {new Date(code.registeredAt).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono break-all">
                    Wallet: {code.wallet}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {totalTransactions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Recent transactions with builder code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(transactions).flatMap(([code, txList]: [string, Transaction[]]) =>
                txList
                  .slice()
                  .sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp)
                  .slice(0, 5)
                  .map((tx: Transaction) => (
                    <div key={tx.hash} className="flex items-center justify-between border-b pb-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {code}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString('en-US')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatEther(tx.value)} ETH</p>
                        <p className="text-xs text-green-600">
                          +{formatEther(tx.revenue)} ETH revenue
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
