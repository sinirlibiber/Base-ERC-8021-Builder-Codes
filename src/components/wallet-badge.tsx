'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import { Card } from '@/components/ui/card';

export function WalletBadge(): JSX.Element {
  const { address, status } = useAccount();
  const [farcasterUsername, setFarcasterUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFarcasterContext(): Promise<void> {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (!cancelled) {
          setFarcasterUsername(context?.user?.username ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setFarcasterUsername(null);
        }
      }
    }

    loadFarcasterContext();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'connecting' || status === 'reconnecting') {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="space-y-2">
          <p className="text-sm font-medium">🔐 Wallet Connection Required</p>
          <p className="text-xs text-muted-foreground">
            Open this app in Warpcast to continue with Base smart wallet, or connect manually
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
          {farcasterUsername ? farcasterUsername[0].toUpperCase() : '👤'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
              Connected
            </span>
          </div>
          {farcasterUsername && (
            <p className="text-xs text-muted-foreground">@{farcasterUsername}</p>
          )}
          <p className="text-xs text-blue-600 font-medium">Base Network</p>
        </div>
      </div>
    </Card>
  );
}
