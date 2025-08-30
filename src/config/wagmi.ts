// Wagmi configuration for wallet connections

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect, injected } from 'wagmi/connectors'

// WalletConnect project ID (using a test project ID for development)
const projectId = '2f05a7cde9bb9f1bb93b26c3f91b6a6c' // This is a public test project ID

// Configure wagmi with multiple wallet connectors
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    // Simple injected connector (auto-detects MetaMask and other wallets)
    injected(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Token Portfolio',
        description: 'A comprehensive token portfolio management application',
        url: 'http://localhost:5173',
        icons: ['http://localhost:5173/homepageImages/logo.png']
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'Token Portfolio',
      appLogoUrl: 'http://localhost:5173/homepageImages/logo.png'
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
