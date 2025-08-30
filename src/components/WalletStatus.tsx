// Component to display wallet connection status information

import React from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletStatusProps {
  showInPortfolio?: boolean;
}

const WalletStatus: React.FC<WalletStatusProps> = ({ showInPortfolio = false }) => {
  const { address, isConnected, displayName, chain } = useWallet();

  if (!showInPortfolio) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <div>
            <div className="text-white text-sm font-medium">Wallet Not Connected</div>
            <div className="text-gray-400 text-xs">
              Your watchlist data is saved locally and will persist across sessions
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-green-500">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        <div>
          <div className="text-white text-sm font-medium">Wallet Connected</div>
          <div className="text-gray-400 text-xs">
            {displayName} • {chain?.name || 'Unknown Network'}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Your watchlist data remains saved regardless of wallet connection
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
