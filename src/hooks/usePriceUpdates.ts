// Hook for managing price updates (periodic and manual)
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { updatePrices, setLoading, setError } from '../store/slices/portfolioSlice';
import { coinGeckoApi } from '../services/coinGeckoApi';

// Fetch updated prices from CoinGecko API
const fetchUpdatedPrices = async (tokenIds: string[]) => {
  if (tokenIds.length === 0) return [];
  
  try {
    // Get current market data for all tokens in watchlist
    const marketData = await coinGeckoApi.getMarketData(tokenIds, true);
    
    // Format the data for our store
    const updates = marketData.map(token => ({
      id: token.id,
      current_price: token.current_price,
      price_change_percentage_24h: token.price_change_percentage_24h,
      sparkline_in_7d: token.sparkline_in_7d || { price: [] },
      last_updated: token.last_updated,
    }));
    
    return updates;
  } catch (error) {
    console.error('Failed to fetch price updates:', error);
    throw new Error('Failed to fetch updated prices from CoinGecko');
  }
};

export const usePriceUpdates = () => {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector(state => state.portfolio.watchlist);
  const isLoading = useAppSelector(state => state.portfolio.isLoading);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Manual refresh function
  const refreshPrices = async () => {
    if (watchlist.length === 0) return;
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const tokenIds = watchlist.map(token => token.id);
      const updatedPrices = await fetchUpdatedPrices(tokenIds);
      
      dispatch(updatePrices(updatedPrices));
    } catch (error: any) {
      console.error('Price refresh failed:', error);
      dispatch(setError(error.message || 'Failed to refresh prices'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Setup periodic updates (every 60 seconds)
  useEffect(() => {
    const startPeriodicUpdates = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Only start if we have tokens to update
      if (watchlist.length > 0) {
        // Initial update
        refreshPrices();
        
        // Setup interval for periodic updates
        intervalRef.current = setInterval(() => {
          if (watchlist.length > 0) {
            refreshPrices();
          }
        }, 60000); // 60 seconds
      }
    };

    startPeriodicUpdates();

    // Cleanup interval on unmount or when watchlist changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [watchlist.length]); // Re-run when watchlist length changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    refreshPrices,
    isLoading,
  };
};