'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, CheckCircle2, AlertCircle, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useContractDeployer } from '@/hooks/useContractDeployer';
import { isContractDeployed, ERC8021_CONTRACT_ADDRESS } from '@/lib/contract-config';
import type { Address } from 'viem';

export function BrowserContractDeployer() {
  const { address, isConnected, chain } = useAccount();
  const [platformWallet, setPlatformWallet] = useState<string>('');
  const { deployContract, isDeploying, deployedAddress, txHash } = useContractDeployer();

  const contractDeployed = isContractDeployed();
  const isBaseNetwork = chain?.id === 8453;

  useEffect(() => {
    if (address && !platformWallet) {
      setPlatformWallet(address);
    }
  }, [address, platformWallet]);

  const handleDeploy = async (): Promise<void> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isBaseNetwork) {
      toast.error('Please switch to Base network');
      return;
    }

    const result = await deployContract(platformWallet as Address);
    
    if (result) {
      toast.success(
        <>
          Contract deployed! Add this to your .env.local:
          <br />
          <code className="text-xs">NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS={result.address}</code>
        </>,
        { duration: 10000 }
      );
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getDisplayAddress = (): string => {
    if (deployedAddress) return deployedAddress;
    if (contractDeployed) return ERC8021_CONTRACT_ADDRESS;
    return '';
  };

  const displayAddress = getDisplayAddress();

  if (contractDeployed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">Contract Deployed</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            ERC-8021 contract is live on Base mainnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
            <div className="flex-1 font-mono text-sm truncate">
              {ERC8021_CONTRACT_ADDRESS}
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(ERC8021_CONTRACT_ADDRESS)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(`https://basescan.org/address/${ERC8021_CONTRACT_ADDRESS}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Contract is ready to use. You can now register builder codes and record transactions on-chain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-600" />
          <CardTitle>Deploy ERC-8021 Contract</CardTitle>
        </div>
        <CardDescription>
          Deploy the builder codes contract directly to Base mainnet from your browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isBaseNetwork && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Base network (Chain ID: 8453) to deploy the contract
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="platformWallet">Platform Wallet Address</Label>
          <Input
            id="platformWallet"
            placeholder="0x..."
            value={platformWallet}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlatformWallet(e.target.value)}
            disabled={isDeploying}
          />
          <p className="text-sm text-gray-500">
            This wallet will receive platform fees (10% of builder fees) from transactions
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold">Contract Features:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Builder code registration on-chain</li>
              <li>Automatic revenue distribution (0.5% fee)</li>
              <li>Transaction tracking and history</li>
              <li>Platform fee management (owner only)</li>
              <li>Emergency withdrawal (owner only)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button 
            onClick={handleDeploy}
            disabled={!isConnected || isDeploying || !platformWallet || !isBaseNetwork}
            className="w-full"
          >
            {isDeploying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy to Base Mainnet
              </>
            )}
          </Button>

          {txHash && (
            <Alert className="bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="space-y-2">
                <p className="font-semibold text-blue-900">Transaction Submitted</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-blue-100 px-2 py-1 rounded flex-1 truncate">
                    {txHash}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://basescan.org/tx/${txHash}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {displayAddress && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="space-y-2">
                <p className="font-semibold text-green-900">Contract Deployed Successfully!</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                    <code className="text-xs font-mono flex-1 truncate">{displayAddress}</code>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(displayAddress)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://basescan.org/address/${displayAddress}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                    <li>Add to <code className="bg-green-100 px-1 rounded">.env.local</code>:</li>
                    <code className="block bg-green-100 px-2 py-1 rounded text-xs mt-1">
                      NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS={displayAddress}
                    </code>
                    <li className="mt-2">Restart your development server</li>
                    <li>Your dapp will automatically connect to the deployed contract</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!isConnected && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to deploy the contract
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-1 text-sm">
            <p className="font-semibold">Deployment Cost:</p>
            <p>~0.002-0.005 ETH on Base network (gas fees may vary)</p>
            <p className="text-xs text-gray-500 mt-2">
              Make sure you have enough ETH in your wallet to cover deployment costs
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
