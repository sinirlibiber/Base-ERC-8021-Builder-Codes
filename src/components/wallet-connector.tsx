'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { base } from 'wagmi/chains';

export function WalletConnector(): JSX.Element {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();

  const handleConnect = async (connectorToUse: typeof connectors[0]): Promise<void> => {
    try {
      connect({ connector: connectorToUse });
      toast.success(`Connecting with ${connectorToUse.name}`);
    } catch (err) {
      console.error('Connection error:', err);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = (): void => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const handleSwitchToBase = async (): Promise<void> => {
    try {
      if (switchChain) {
        switchChain({ chainId: base.id });
        toast.success('Switching to Base network');
      }
    } catch (err) {
      console.error('Network switch error:', err);
      toast.error('Failed to switch network');
    }
  };

  const isCorrectNetwork = chainId === base.id;

  if (isConnected && address) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">Wallet Connected</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Connected with {connector?.name || 'wallet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
              <div className="flex-1 font-mono text-sm truncate">
                {address}
              </div>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {!isCorrectNetwork && (
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Wrong Network - Please switch to Base
                  </p>
                </div>
                <Button
                  onClick={handleSwitchToBase}
                  variant="outline"
                  className="w-full border-yellow-300 hover:bg-yellow-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch to Base Network
                </Button>
              </div>
            )}

            {isCorrectNetwork && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ Connected to Base Network
                </p>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          <CardTitle>Connect Wallet</CardTitle>
        </div>
        <CardDescription>
          Choose your preferred wallet to interact with ERC-8021 on Base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Wallet Connector Buttons */}
        {connectors
          .filter((conn) => {
            // Show all connectors except duplicate injected
            if (conn.id === 'injected' && connectors.some(c => c.id === 'metaMask')) {
              return false;
            }
            return true;
          })
          .map((connectorItem) => {
            const getConnectorInfo = (name: string, id: string): { icon: JSX.Element | string; label: string } => {
              if (name.toLowerCase().includes('coinbase') || id === 'coinbaseWalletSDK') {
                return { icon: '🔵', label: 'Coinbase Wallet' };
              }
              if (name.toLowerCase().includes('metamask') || id === 'metaMask') {
                return { icon: '🦊', label: 'MetaMask' };
              }
              if (name.toLowerCase().includes('walletconnect') || id === 'walletConnect') {
                return { icon: '🔗', label: 'WalletConnect' };
              }
              if (name.toLowerCase().includes('injected') || id === 'injected') {
                return { icon: <Wallet className="h-4 w-4 mr-2" />, label: 'Browser Wallet' };
              }
              return { icon: <Wallet className="h-4 w-4 mr-2" />, label: name };
            };

            const { icon, label } = getConnectorInfo(connectorItem.name, connectorItem.id);

            return (
              <Button
                key={connectorItem.uid}
                onClick={() => handleConnect(connectorItem)}
                disabled={isPending}
                variant="outline"
                className="w-full justify-start hover:bg-blue-50"
              >
                {typeof icon === 'string' ? (
                  <span className="text-lg mr-2">{icon}</span>
                ) : (
                  icon
                )}
                {label}
                {isPending && <span className="ml-auto text-xs">Connecting...</span>}
              </Button>
            );
          })}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ {error.message || 'Failed to connect. Please try again.'}
            </p>
          </div>
        )}

        <div className="pt-2 space-y-2">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Works in both browser and Farcaster MiniApp
            </p>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            <p>Supports Coinbase Wallet, MetaMask, WalletConnect & more</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
