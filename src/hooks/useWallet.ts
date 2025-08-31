

import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { useCallback, useEffect } from 'react'

export const useWallet = () => {
  const { address, isConnected, isConnecting, isDisconnected, chain } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  
  const formatAddress = useCallback((addr: string | undefined) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  // Get display name (ENS name or formatted address)
  const displayName = ensName || formatAddress(address)

  // Connect to a specific wallet
  const connectWallet = useCallback((connectorId?: string) => {
    const connector = connectorId 
      ? connectors.find(c => c.id === connectorId)
      : connectors[0] 
    
    if (connector) {
      connect({ connector })
    }
  }, [connect, connectors])

  // Disconnect wallet (silently, without opening MetaMask)
  const disconnectWallet = useCallback(() => {
    try {
      
      localStorage.removeItem('lastConnectedWallet')
      
      
      disconnect()
    } catch (error) {
      console.error('Disconnect error:', error)
      
      localStorage.removeItem('lastConnectedWallet')
    }
  }, [disconnect])

  // Get available wallet connectors and remove duplicates
  const rawConnectors = connectors.map(connector => ({
    id: connector.id,
    name: connector.name,
    icon: connector.icon,
    ready: true, // Assume connector is ready if it exists
  }))
  
  // Create a unique set of connectors, removing duplicates
  const uniqueConnectors = new Map();
  
  rawConnectors.forEach(connector => {
    // Normalize MetaMask connectors
    if (connector.id === 'injected' || connector.id === 'metaMaskSDK' || connector.name.includes('MetaMask')) {
      if (!uniqueConnectors.has('metamask')) {
        uniqueConnectors.set('metamask', {
          id: connector.id,
          name: 'MetaMask',
          icon: connector.icon,
          ready: connector.ready || (typeof window !== 'undefined' && !!(window as unknown as { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask),
        });
      }
    } else if (connector.name === 'WalletConnect') {
      uniqueConnectors.set('walletconnect', connector);
    } else if (connector.name === 'Coinbase Wallet') {
      uniqueConnectors.set('coinbase', connector);
    } else {
      uniqueConnectors.set(connector.id, connector);
    }
  });
  
  const availableConnectors = Array.from(uniqueConnectors.values())

  // Auto-connect to previously connected wallet
  useEffect(() => {
    const autoConnect = async () => {
      // Only auto-connect if we're not already connected and there's a previously connected wallet
      if (!isConnected && !isConnecting && connectors.length > 0) {
        try {
          const lastConnectedWallet = localStorage.getItem('lastConnectedWallet')
          if (lastConnectedWallet) {
            const connector = connectors.find(c => c.id === lastConnectedWallet)
            if (connector) {
              connect({ connector })
            }
          }
        } catch (error) {
          console.error('Auto-connect failed:', error)
        }
      }
    }

    autoConnect()
  }, [isConnected, isConnecting, connectors, connect])

  // Save last connected wallet to localStorage
  useEffect(() => {
    if (isConnected && address) {
      const activeConnector = connectors.find(c => c.id)
      if (activeConnector) {
        localStorage.setItem('lastConnectedWallet', activeConnector.id)
      }
    }
  }, [isConnected, address, connectors])

  
  useEffect(() => {
    if (isDisconnected) {
      localStorage.removeItem('lastConnectedWallet')
    }
  }, [isDisconnected])

  return {
    
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    isPending,
    chain,
    
    
    displayName,
    formattedAddress: formatAddress(address),
    ensName,
    
    
    connectWallet,
    disconnectWallet,
    availableConnectors,
    
    
    error,
  }
}
