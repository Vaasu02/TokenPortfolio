
import { useEffect } from 'react';
import { useWallet } from './useWallet';
import { useAppSelector } from './redux';
import { 
  loadWatchlistFromStorage,
  isLocalStorageAvailable 
} from '../utils/localStorage';

export const useWalletPersistence = () => {
  const { isConnected, address } = useWallet();
  const { watchlist, portfolioTotal } = useAppSelector(state => state.portfolio);

  
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. Portfolio data will not persist.');
      return;
    }

    
    const persistenceStatus = {
      walletConnected: isConnected,
      walletAddress: address,
      watchlistCount: watchlist.length,
      portfolioTotal,
      localStorageWorking: true,
      message: isConnected 
        ? `Portfolio data persists for wallet ${address?.slice(0, 6)}...${address?.slice(-4)}`
        : 'Portfolio data persists without wallet connection'
    };

    console.log('Wallet Persistence Status:', persistenceStatus);

    
    try {
      const testData = loadWatchlistFromStorage();
      if (testData) {
        console.log(`✅ Portfolio data successfully persisted (${testData.length} tokens)`);
      }
    } catch (error) {
      console.error('❌ Portfolio persistence error:', error);
    }

  }, [isConnected, address, watchlist.length, portfolioTotal]);

  return {
    isConnected,
    address,
    persistenceWorking: isLocalStorageAvailable(),
    message: isConnected 
      ? 'Wallet connected - data still persists in localStorage'
      : 'No wallet connected - data persists in localStorage'
  };
};
