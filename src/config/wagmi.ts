import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors'


const projectId = '2f05a7cde9bb9f1bb93b26c3f91b6a6c' // This is a public test project ID


export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [

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
