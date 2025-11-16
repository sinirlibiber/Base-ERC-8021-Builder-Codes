'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BuilderCodeRegister } from '@/components/builder-code-register';
import { TransactionTracker } from '@/components/transaction-tracker';
import { RevenueDashboard } from '@/components/revenue-dashboard';
import { AnalyticsView } from '@/components/analytics-view';
import { WalletBadge } from '@/components/wallet-badge';
import { WalletConnector } from '@/components/wallet-connector';
import { BrowserContractDeployer } from '@/components/browser-contract-deployer';
import { OnchainBuilderRegister } from '@/components/onchain-builder-register';
import { OnchainTransactionTracker } from '@/components/onchain-transaction-tracker';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isContractDeployed } from '@/lib/contract-config';
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function Home(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ERC-8021 Builder Codes
              </h1>
              <p className="text-muted-foreground mt-2">
                Builder code management and revenue sharing platform on Base
              </p>
            </div>
          </div>

          <WalletBadge />

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🚀</span>
                <span>About ERC-8021</span>
              </CardTitle>
              <CardDescription>
                The future of revenue sharing with Ethereum builder code standard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>ERC-8021</strong> is an Ethereum standard that enables developers to earn revenue from application activities. Builder codes are reference codes added to transactions.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Earn 0.5% revenue share from each transaction</li>
                <li>Transparent and automatic revenue distribution</li>
                <li>Proven model on Hyperliquid and Polymarket</li>
                <li>Low gas fees on Base network</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="wallet">
              <span className="hidden md:inline">Wallet </span>🔐
            </TabsTrigger>
            <TabsTrigger value="deploy">
              <span className="hidden md:inline">Deploy </span>🚀
            </TabsTrigger>
            <TabsTrigger value="register">
              <span className="hidden md:inline">Register </span>Code
            </TabsTrigger>
            <TabsTrigger value="track">
              <span className="hidden md:inline">Track </span>Txns
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <span className="hidden md:inline">Revenue </span>Panel
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <span className="hidden md:inline">Platform </span>Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-4">
            <WalletConnector />
          </TabsContent>

          <TabsContent value="deploy" className="space-y-4">
            <BrowserContractDeployer />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <OnchainBuilderRegister />
              <BuilderCodeRegister />
            </div>
          </TabsContent>

          <TabsContent value="track" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <OnchainTransactionTracker />
              <TransactionTracker />
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <RevenueDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsView />
          </TabsContent>
        </Tabs>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Note:</strong> This app is ready to deploy ERC-8021 standard to Base mainnet.
                {isContractDeployed() ? ' Contract is live! ✅' : ' Deploy the contract and start using it! 🚀'}
              </p>
              <p className="text-xs text-muted-foreground">
                For more info:{' '}
                <a
                  href="https://eip.tools/eip/8021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ERC-8021 Documentation
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </main>
  );
}
