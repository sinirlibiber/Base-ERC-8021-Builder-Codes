'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { isContractDeployed, ERC8021_CONTRACT_ADDRESS } from '@/lib/contract-config';

export function ContractDeployer() {
  const { address, isConnected } = useAccount();
  const [platformWallet, setPlatformWallet] = useState<string>(address || '');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedAddress, setDeployedAddress] = useState<string>('');

  const contractDeployed = isContractDeployed();

  const handleDeploy = async (): Promise<void> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!platformWallet || platformWallet === '0x0000000000000000000000000000000000000000') {
      toast.error('Please enter a valid platform wallet address');
      return;
    }

    setIsDeploying(true);

    try {
      // In a real deployment, this would use a deployment script or service
      // For now, we'll show instructions
      toast.info('Contract deployment requires a deployment tool like Hardhat or Foundry');
      
      // Simulated deployment
      setTimeout(() => {
        const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
        setDeployedAddress(mockAddress);
        toast.success('Contract deployment guide ready!');
        setIsDeploying(false);
      }, 2000);
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('Deployment failed');
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

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
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Contract is ready to use. You can now register builder codes and record transactions.
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
          Deploy the builder codes contract to Base mainnet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            This wallet will receive platform fees from transactions
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold">Deployment Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Install Foundry: <code className="bg-gray-100 px-1 rounded">curl -L https://foundry.paradigm.xyz | bash</code></li>
              <li>Initialize project: <code className="bg-gray-100 px-1 rounded">forge init</code></li>
              <li>Copy contract from <code className="bg-gray-100 px-1 rounded">src/contracts/ERC8021BuilderCodes.sol</code></li>
              <li>Install OpenZeppelin: <code className="bg-gray-100 px-1 rounded">forge install OpenZeppelin/openzeppelin-contracts</code></li>
              <li>Deploy: <code className="bg-gray-100 px-1 rounded">forge create --rpc-url base --private-key YOUR_KEY src/ERC8021BuilderCodes.sol:ERC8021BuilderCodes --constructor-args {platformWallet}</code></li>
              <li>Add deployed address to <code className="bg-gray-100 px-1 rounded">.env.local</code>: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ERC8021_CONTRACT_ADDRESS=0x...</code></li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button 
            onClick={handleDeploy}
            disabled={!isConnected || isDeploying || !platformWallet}
            className="w-full"
          >
            {isDeploying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Preparing Deployment...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Generate Deployment Instructions
              </>
            )}
          </Button>

          {deployedAddress && (
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="space-y-2">
                <p className="font-semibold text-blue-900">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Copy the contract address from your deployment</li>
                  <li>Add to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
                  <li>Restart the development server</li>
                  <li>Your dapp will automatically connect to the deployed contract</li>
                </ol>
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
      </CardContent>
    </Card>
  );
}
