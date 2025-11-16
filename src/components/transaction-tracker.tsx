'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBuilderCodesByOwner, saveTransaction, getBuilderCode } from '@/lib/erc8021-storage';
import type { Transaction } from '@/app/types/erc8021';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import type { Address } from 'viem';

export function TransactionTracker(): JSX.Element {
  const { address } = useAccount();
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const builderCodes = address ? getBuilderCodesByOwner(address) : [];

  const handleTrack = async (): Promise<void> => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    if (!selectedCode) {
      toast.error('Select a builder code');
      return;
    }

    if (!txHash.trim() || !txHash.startsWith('0x')) {
      toast.error('Enter a valid transaction hash');
      return;
    }

    if (!toAddress.trim() || !toAddress.startsWith('0x')) {
      toast.error('Enter a valid address');
      return;
    }

    if (!value.trim() || isNaN(parseFloat(value))) {
      toast.error('Enter a valid amount');
      return;
    }

    setIsTracking(true);

    try {
      const txValue = parseEther(value);
      const revenuePercentage = 0.005;
      const revenueAmount = (txValue * BigInt(Math.floor(revenuePercentage * 10000))) / 10000n;

      const transaction: Transaction = {
        hash: txHash.trim(),
        builderCode: selectedCode,
        from: address,
        to: toAddress.trim() as Address,
        value: txValue,
        timestamp: Date.now(),
        revenue: revenueAmount,
      };

      saveTransaction(transaction);
      
      const builderCodeData = getBuilderCode(selectedCode);
      const revenueInEth = Number(revenueAmount) / 1e18;
      
      toast.success(
        `Transaction recorded! ${revenueInEth.toFixed(6)} ETH revenue added for builder "${selectedCode}" 💰`
      );
      
      setTxHash('');
      setToAddress('');
      setValue('');
      setSelectedCode('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction recording failed';
      toast.error(message);
    } finally {
      setIsTracking(false);
    }
  };

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Track Transactions</CardTitle>
          <CardDescription>Connect your wallet to track transactions</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (builderCodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Track Transactions</CardTitle>
          <CardDescription>Register a builder code first to track transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No registered builder codes found. Create a builder code first.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Transactions</CardTitle>
        <CardDescription>
          Record transactions with builder code and earn from revenue sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="builder-code">Builder Code</Label>
          <Select value={selectedCode} onValueChange={setSelectedCode} disabled={isTracking}>
            <SelectTrigger id="builder-code">
              <SelectValue placeholder="Select builder code" />
            </SelectTrigger>
            <SelectContent>
              {builderCodes.map((bc) => (
                <SelectItem key={bc.code} value={bc.code}>
                  {bc.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tx-hash">Transaction Hash</Label>
          <Input
            id="tx-hash"
            placeholder="0x..."
            value={txHash}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTxHash(e.target.value)}
            disabled={isTracking}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-address">To Address</Label>
          <Input
            id="to-address"
            placeholder="0x..."
            value={toAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToAddress(e.target.value)}
            disabled={isTracking}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Amount (ETH)</Label>
          <Input
            id="value"
            type="text"
            placeholder="0.1"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            disabled={isTracking}
          />
          <p className="text-sm text-muted-foreground">
            Transaction amount in ETH
          </p>
        </div>

        <Button
          onClick={handleTrack}
          disabled={isTracking || !selectedCode || !txHash.trim() || !toAddress.trim() || !value.trim()}
          className="w-full"
        >
          {isTracking ? 'Recording Transaction...' : 'Record Transaction'}
        </Button>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-sm mb-2">📊 Revenue Share</h4>
          <p className="text-sm text-muted-foreground">
            You earn 0.5% revenue share from each transaction. For example, a 1 ETH transaction earns you 0.005 ETH.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
