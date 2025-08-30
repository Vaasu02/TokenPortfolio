import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { 
  saveWatchlistToStorage, 
  loadWatchlistFromStorage, 
  saveLastUpdatedToStorage,
  savePortfolioTotalToStorage,
  loadLastUpdatedFromStorage,
  loadPortfolioTotalFromStorage
} from '../../utils/localStorage';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  market_cap_rank: number;
}

export interface WatchlistToken extends Token {
  holdings: number;
  value: number;
}

interface PortfolioState {
  watchlist: WatchlistToken[];
  portfolioTotal: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

// Default tokens for initial setup
const defaultWatchlist: WatchlistToken[] = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3250.67,
    price_change_percentage_24h: 2.30,
    sparkline_in_7d: {
      price: [3200, 3180, 3220, 3250, 3240, 3260, 3250, 3280, 3270, 3250]
    },
    market_cap_rank: 2,
    holdings: 0.0500,
    value: 162.53
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 2654.32,
    price_change_percentage_24h: -1.20,
    sparkline_in_7d: {
      price: [2700, 2680, 2650, 2640, 2660, 2670, 2654, 2620, 2640, 2654]
    },
    market_cap_rank: 1,
    holdings: 2.5000,
    value: 6635.80
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 98.45,
    price_change_percentage_24h: 4.70,
    sparkline_in_7d: {
      price: [94, 96, 97, 95, 98, 99, 98, 100, 99, 98]
    },
    market_cap_rank: 5,
    holdings: 2.5000,
    value: 246.13
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    current_price: 0.08,
    price_change_percentage_24h: 2.30,
    sparkline_in_7d: {
      price: [0.075, 0.078, 0.079, 0.081, 0.080, 0.082, 0.08]
    },
    market_cap_rank: 8,
    holdings: 1000.0000,
    value: 80.00
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    current_price: 1.00,
    price_change_percentage_24h: 0.01,
    sparkline_in_7d: {
      price: [1.00, 0.999, 1.001, 1.00, 0.998, 1.001, 1.00]
    },
    market_cap_rank: 6,
    holdings: 2500.0000,
    value: 2500.00
  },
  {
    id: 'stellar',
    symbol: 'XLM',
    name: 'Stellar',
    image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
    current_price: 0.09,
    price_change_percentage_24h: 4.70,
    sparkline_in_7d: {
      price: [0.085, 0.087, 0.089, 0.091, 0.09, 0.092, 0.09]
    },
    market_cap_rank: 15,
    holdings: 15000.0000,
    value: 1350.00
  }
];

// Calculate portfolio total from watchlist
const calculatePortfolioTotal = (watchlist: WatchlistToken[]): number => {
  return watchlist.reduce((total, token) => total + token.value, 0);
};

// Load initial state from localStorage or use defaults
const loadInitialState = (): PortfolioState => {
  const storedWatchlist = loadWatchlistFromStorage();
  const storedLastUpdated = loadLastUpdatedFromStorage();
  const storedPortfolioTotal = loadPortfolioTotalFromStorage();
  
  const watchlist = storedWatchlist || defaultWatchlist;
  const portfolioTotal = storedPortfolioTotal || calculatePortfolioTotal(watchlist);
  const lastUpdated = storedLastUpdated || new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  return {
    watchlist,
    portfolioTotal,
    lastUpdated,
    isLoading: false,
    error: null,
  };
};

const initialState: PortfolioState = loadInitialState();

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateHoldings: (state, action: PayloadAction<{ tokenId: string; holdings: number }>) => {
      const token = state.watchlist.find(t => t.id === action.payload.tokenId);
      if (token) {
        token.holdings = action.payload.holdings;
        token.value = token.holdings * token.current_price;
        state.portfolioTotal = calculatePortfolioTotal(state.watchlist);
        
        // Persist to localStorage
        saveWatchlistToStorage(state.watchlist);
        savePortfolioTotalToStorage(state.portfolioTotal);
      }
    },
    updatePrices: (state, action: PayloadAction<Token[]>) => {
      state.isLoading = true;
      state.error = null;
      
      state.watchlist = state.watchlist.map(watchlistToken => {
        const updatedToken = action.payload.find(t => t.id === watchlistToken.id);
        if (updatedToken) {
          return {
            ...watchlistToken,
            current_price: updatedToken.current_price,
            price_change_percentage_24h: updatedToken.price_change_percentage_24h,
            sparkline_in_7d: updatedToken.sparkline_in_7d,
            value: watchlistToken.holdings * updatedToken.current_price,
          };
        }
        return watchlistToken;
      });
      
      state.portfolioTotal = calculatePortfolioTotal(state.watchlist);
      state.lastUpdated = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
      state.isLoading = false;
      
      // Persist to localStorage
      saveWatchlistToStorage(state.watchlist);
      savePortfolioTotalToStorage(state.portfolioTotal);
      saveLastUpdatedToStorage(state.lastUpdated);
    },
    addToWatchlist: (state, action: PayloadAction<Token[]>) => {
      action.payload.forEach(token => {
        if (!state.watchlist.find(t => t.id === token.id)) {
          const newToken: WatchlistToken = {
            ...token,
            holdings: 0,
            value: 0, // holdings × current_price = 0 × price = 0
          };
          state.watchlist.push(newToken);
        }
      });
      
      state.portfolioTotal = calculatePortfolioTotal(state.watchlist);
      
      // Persist to localStorage
      saveWatchlistToStorage(state.watchlist);
      savePortfolioTotalToStorage(state.portfolioTotal);
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(t => t.id !== action.payload);
      state.portfolioTotal = calculatePortfolioTotal(state.watchlist);
      
      // Persist to localStorage
      saveWatchlistToStorage(state.watchlist);
      savePortfolioTotalToStorage(state.portfolioTotal);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateHoldings,
  updatePrices,
  addToWatchlist,
  removeFromWatchlist,
  setLoading,
  setError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
