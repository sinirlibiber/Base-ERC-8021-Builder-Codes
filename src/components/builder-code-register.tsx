'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { saveBuilderCode } from '@/lib/erc8021-storage';
import type { BuilderCode } from '@/app/types/erc8021';
import { toast } from 'sonner';
import type { Address } from 'viem';

export function BuilderCodeRegister(): JSX.Element {
  const { address, status } = useAccount();
  const [code, setCode] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleRegister = async (): Promise<void> => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    if (!code.trim()) {
      toast.error('Please enter a builder code');
      return;
    }

    if (!wallet.trim() || !wallet.startsWith('0x')) {
      toast.error('Enter a valid wallet address');
      return;
    }

    setIsRegistering(true);

    try {
      const newBuilderCode: BuilderCode = {
        code: code.trim(),
        owner: address,
        wallet: wallet.trim() as Address,
        registeredAt: Date.now(),
        totalVolume: 0n,
        totalRevenue: 0n,
        active: true,
      };

      saveBuilderCode(newBuilderCode);
      
      toast.success(`Builder code "${code}" successfully registered! 🎉`);
      
      setCode('');
      setWallet('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Register Builder Code</CardTitle>
          <CardDescription>Connecting wallet...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Register Builder Code</CardTitle>
          <CardDescription>Connect your wallet to register a builder code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Open from Warpcast to continue with Base smart wallet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Builder Code</CardTitle>
        <CardDescription>
          Create a builder code for your app and start earning from revenue sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Builder Code</Label>
          <Input
            id="code"
            placeholder="my-awesome-app"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            disabled={isRegistering}
          />
          <p className="text-sm text-muted-foreground">
            Use lowercase, numbers, and hyphens. Examples: phantom, uniswap-mobile
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet">Revenue Wallet</Label>
          <Input
            id="wallet"
            placeholder="0x..."
            value={wallet}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWallet(e.target.value)}
            disabled={isRegistering}
          />
          <p className="text-sm text-muted-foreground">
            Wallet address where revenue shares will be sent
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Connected Wallet</h4>
          <p className="text-sm font-mono break-all">{address}</p>
        </div>

        <Button
          onClick={handleRegister}
          disabled={isRegistering || !code.trim() || !wallet.trim()}
          className="w-full"
        >
          {isRegistering ? 'Registering...' : 'Register Builder Code'}
        </Button>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-sm mb-2">💡 How ERC-8021 Works?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Builder code is your app's unique identifier</li>
            <li>• Activity tracking by adding builder code to transactions</li>
            <li>• Earn a percentage of platform revenues</li>
            <li>• Transparent and automatic revenue distribution</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
