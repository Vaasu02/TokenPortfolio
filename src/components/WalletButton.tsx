import React, { useState, useEffect } from 'react';
import { ChevronDown, Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const WalletButton: React.FC = () => {
  const {
    address,
    isConnected,
    isConnecting,
    displayName,
    formattedAddress,
    connectWallet,
    disconnectWallet,
    availableConnectors,
    error,
  } = useWallet();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleConnect = () => {
    if (availableConnectors.length === 1) {
      connectWallet(availableConnectors[0].id);
    } else {
      setShowConnectors(true);
    }
  };

  const handleConnectorSelect = (connectorId: string) => {
    connectWallet(connectorId);
    setShowConnectors(false);
    setIsDropdownOpen(false);
  };

  const handleDisconnect = async () => {
    try {
      setIsDropdownOpen(false);
      await new Promise(resolve => setTimeout(resolve, 100));
      disconnectWallet();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000); 

      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`wallet-button flex items-center justify-center font-semibold transition-colors ${
            isConnecting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90'
          }`}
          style={{
            width: '160px',
            height: '32px',
            gap: '6px',
            backgroundColor: '#A9E851',
            borderRadius: '100px',
            padding: '6px 10px'
          }}
        >
          <img 
            src="/homepageImages/wallet.png" 
            alt="Wallet" 
            className="wallet-icon w-4 h-4"
          />
          {isConnecting ? (
            <span className="wallet-button-text"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0%',
                color: '#18181B',
                whiteSpace: 'nowrap'
              }}>
              Connecting...
            </span>
          ) : (
            <span className="wallet-button-text"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0%',
                color: '#18181B',
                whiteSpace: 'nowrap'
              }}>
              Connect Wallet
            </span>
          )}
        </button>

        
        {showConnectors && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: '#212124D9' }}
          >
                         <div 
               style={{
                 backgroundColor: '#212124',
                 borderRadius: '12px',
                 padding: '24px',
                 maxWidth: '448px',
                 width: '100%',
                 margin: '0 16px',
                 boxShadow: '0 0 16px 0 rgba(0, 0, 0, 0.32), 0 0 8px 0 rgba(0, 0, 0, 0.32)'
               }}
             >
              <h3 className="text-white text-lg font-semibold mb-4">Connect Wallet</h3>
              <div className="space-y-3">
                {availableConnectors.map((connector, index) => (
                  <button
                    key={`${connector.id}-${index}`}
                    onClick={() => handleConnectorSelect(connector.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span>{connector.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {connector.ready ? (
                        <span className="text-xs text-green-400">Available</span>
                      ) : (
                        <span className="text-xs text-gray-400">Install Required</span>
                      )}
                    </div>
                  </button>
                ))}
                
                
                {availableConnectors.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-gray-400 mb-2">No wallet connectors available</div>
                    <div className="text-xs text-gray-500">Make sure MetaMask is installed and try refreshing the page</div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowConnectors(false)}
                className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        
        {error && showError && (
          <div className="absolute top-full mt-2 right-0 bg-red-600 text-white p-3 rounded-lg text-sm max-w-xs shadow-lg border border-red-500 z-50">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="font-medium mb-1">Connection Failed</div>
                <div className="text-xs opacity-90">
                  {error.message.includes('User rejected') 
                    ? 'Connection was cancelled by user' 
                    : error.message}
                </div>
              </div>
              <button
                onClick={() => setShowError(false)}
                className="text-red-200 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="mt-2 h-1 bg-red-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-300 rounded-full animate-pulse"
                style={{
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="wallet-button flex items-center justify-center font-semibold transition-colors hover:opacity-90"
        style={{
          width: '160px',
          height: '32px',
          gap: '6px',
          backgroundColor: '#A9E851',
          borderRadius: '100px',
          padding: '6px 10px'
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="wallet-button-text text-sm font-medium">{displayName}</span>
        </div>
        <ChevronDown size={16} />
      </button>

      
      {isDropdownOpen && (
        <div className="wallet-dropdown absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-xl border border-gray-600 py-2 z-10 min-w-[200px]">
          <div className="px-4 py-2 border-b border-gray-600">
            <div className="wallet-dropdown-text text-gray-400 text-xs mb-1">Connected Wallet</div>
            <div className="flex items-center gap-2">
              <span className="wallet-address text-white text-sm font-mono">{formattedAddress}</span>
              <button
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDisconnect}
            className="wallet-dropdown-text flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-600 w-full text-left text-sm transition-colors"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;