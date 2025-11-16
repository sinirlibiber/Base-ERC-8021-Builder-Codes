'use client';

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet, walletConnect, injected, metaMask } from 'wagmi/connectors';
import { base } from 'wagmi/chains';
import { ONCHAINKIT_API_KEY, ONCHAINKIT_PROJECT_ID } from './config/onchainkit';
import { WALLETCONNECT_PROJECT_ID } from './config/walletconnect';

const projectId = WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'ERC-8021 Builder Codes',
      preference: 'all',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'ERC-8021 Builder Codes',
        description: 'Decentralized builder revenue sharing platform on Base',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://erc8021.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'light',
      },
    }),
    metaMask({
      shimDisconnect: true,
      dappMetadata: {
        name: 'ERC-8021 Builder Codes',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://erc8021.app',
      },
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5_000,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ONCHAINKIT_API_KEY}
          projectId={ONCHAINKIT_PROJECT_ID}
          chain={base}
          config={{
            appearance: {
              name: 'ERC-8021 Builder Codes',
              logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84',
              mode: 'light',
              theme: 'base',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
