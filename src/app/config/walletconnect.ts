export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '5b7ba23c5a5f4b0d9e7c1f2a3b4c5d6e';

export const walletConnectConfig = {
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: {
    name: 'ERC-8021 Builder Codes',
    description: 'Decentralized builder revenue sharing platform on Base',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://erc8021.app',
    icons: ['https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84'],
  },
};
