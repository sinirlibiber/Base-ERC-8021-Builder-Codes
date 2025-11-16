
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useERC8021Contract, useBuilderInfo } from '@/hooks/useERC8021Contract';
import { isContractDeployed } from '@/lib/contract-config';
import type { Address } from 'viem';

export function OnchainBuilderRegister() {
  const { address, isConnected } = useAccount();
  const [builderCode, setBuilderCode] = useState<string>('');
  const [revenueWallet, setRevenueWallet] = useState<string>(address || '');
  
  const { registerBuilderCode, isWriting, isConfirming } = useERC8021Contract();
  const { builderInfo, refetch } = useBuilderInfo(builderCode);
  
  const contractDeployed = isContractDeployed();
  const isProcessing = isWriting || isConfirming;

  const handleRegister = async (): Promise<void> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!builderCode.trim()) {
      toast.error('Please enter a builder code');
      return;
    }

    if (!revenueWallet || !revenueWallet.startsWith('0x')) {
      toast.error('Please enter a valid revenue wallet address');
      return;
    }

    try {
      await registerBuilderCode(builderCode.trim(), revenueWallet as Address);
      
      // Refresh builder info
      setTimeout(() => {
        refetch();
      }, 2000);
      
      setBuilderCode('');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const generateRandomCode = (): void => {
    const code = `builder_${Math.random().toString(36).substring(2, 10)}`;
    setBuilderCode(code);
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
          <Code className="h-5 w-5 text-blue-600" />
          <CardTitle>Register Builder Code On-Chain</CardTitle>
        </div>
        <CardDescription>
          Register your builder code directly on Base mainnet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="builderCode">Builder Code</Label>
          <div className="flex gap-2">
            <Input
              id="builderCode"
              placeholder="e.g., builder_abc123"
              value={builderCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuilderCode(e.target.value)}
              disabled={isProcessing}
            />
            <Button
              variant="outline"
              onClick={generateRandomCode}
              disabled={isProcessing}
            >
              Generate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenueWallet">Revenue Wallet Address</Label>
          <Input
            id="revenueWallet"
            placeholder="0x..."
            value={revenueWallet}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevenueWallet(e.target.value)}
            disabled={isProcessing}
          />
          <p className="text-sm text-gray-500">
            This wallet will receive revenue from transactions
          </p>
        </div>

        {builderInfo && builderInfo.isActive && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              This builder code is already registered on-chain
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleRegister}
          disabled={!isConnected || isProcessing || !builderCode || !revenueWallet}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isWriting ? 'Submitting...' : 'Confirming...'}
            </>
          ) : (
            <>
              <Code className="h-4 w-4 mr-2" />
              Register On-Chain
            </>
          )}
        </Button>

        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to register a builder code
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">On-Chain Registration</p>
            <p className="text-sm">This will create a transaction on Base mainnet. You'll need to confirm it in your wallet and pay gas fees.</p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
