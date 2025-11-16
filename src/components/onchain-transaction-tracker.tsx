'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Receipt, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useERC8021Contract, useBuilderInfo } from '@/hooks/useERC8021Contract';
import { isContractDeployed } from '@/lib/contract-config';

export function OnchainTransactionTracker() {
  const { isConnected } = useAccount();
  const [builderCode, setBuilderCode] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.001');
  const [txHash, setTxHash] = useState<string>('');
  
  const { recordTransaction, isWriting, isConfirming } = useERC8021Contract();
  const { builderInfo } = useBuilderInfo(builderCode);
  
  const contractDeployed = isContractDeployed();
  const isProcessing = isWriting || isConfirming;

  const handleRecordTransaction = async (): Promise<void> => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!builderCode.trim()) {
      toast.error('Please enter a builder code');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!txHash.trim()) {
      toast.error('Please enter a transaction hash');
      return;
    }

    try {
      await recordTransaction(builderCode.trim(), txHash.trim(), amount);
      
      // Reset form
      setTxHash('');
      toast.success('Transaction recorded on-chain!');
    } catch (error) {
      console.error('Transaction recording error:', error);
    }
  };

  if (!contractDeployed) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-900">Contract Not Deployed</CardTitle>
          </div>
          <CardDescription className="text-yellow-700">
            Please deploy the ERC-8021 contract first
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-green-600" />
          <CardTitle>Record Transaction On-Chain</CardTitle>
        </div>
        <CardDescription>
          Record a transaction and distribute revenue on Base mainnet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="builderCodeTx">Builder Code</Label>
          <Input
            id="builderCodeTx"
            placeholder="e.g., builder_abc123"
            value={builderCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuilderCode(e.target.value)}
            disabled={isProcessing}
          />
          {builderInfo && builderInfo.isActive && (
            <p className="text-sm text-green-600">
              ✓ Builder code verified on-chain
            </p>
          )}
          {builderCode && builderInfo && !builderInfo.isActive && (
            <p className="text-sm text-red-600">
              ✗ Builder code not found on-chain
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            placeholder="0.001"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            disabled={isProcessing}
          />
          <p className="text-sm text-gray-500">
            Builder will receive 0.5% of this amount
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="txHash">Transaction Hash</Label>
          <Input
            id="txHash"
            placeholder="0x..."
            value={txHash}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTxHash(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-1">
            <p className="font-semibold">Revenue Distribution:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Builder receives: {(parseFloat(amount || '0') * 0.0045).toFixed(6)} ETH (0.45%)</li>
              <li>Platform receives: {(parseFloat(amount || '0') * 0.0005).toFixed(6)} ETH (0.05%)</li>
              <li>Total fee: {(parseFloat(amount || '0') * 0.005).toFixed(6)} ETH (0.5%)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleRecordTransaction}
          disabled={!isConnected || isProcessing || !builderCode || !amount || !txHash || !builderInfo?.isActive}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isWriting ? 'Recording...' : 'Confirming...'}
            </>
          ) : (
            <>
              <Receipt className="h-4 w-4 mr-2" />
              Record Transaction
            </>
          )}
        </Button>

        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to record transactions
            </AlertDescription>
          </Alert>
        )}

        {builderInfo && builderInfo.isActive && (
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p className="font-semibold mb-1">Builder Stats:</p>
              <ul className="text-sm space-y-1">
                <li>Total Revenue: {(Number(builderInfo.totalRevenue) / 1e18).toFixed(6)} ETH</li>
                <li>Total Transactions: {builderInfo.totalTransactions.toString()}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
