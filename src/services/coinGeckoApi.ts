// CoinGecko API service layer
import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Types for API responses
export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export interface TrendingResponse {
  coins: {
    item: {
      id: string;
      coin_id: number;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      small: string;
      large: string;
      slug: string;
      price_btc: number;
      score: number;
    };
  }[];
}

export interface SearchResponse {
  coins: SearchResult[];
}

export interface PriceHistoryResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

// API service functions
export const coinGeckoApi = {
  // Get market data for multiple tokens
  async getMarketData(tokenIds: string[], includeSparkline = true): Promise<CoinGeckoToken[]> {
    try {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: tokenIds.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: includeSparkline,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  },

  // Get trending tokens
  async getTrendingTokens(): Promise<TrendingResponse> {
    try {
      const response = await api.get('/search/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw new Error('Failed to fetch trending tokens');
    }
  },

  // Search tokens by query
  async searchTokens(query: string): Promise<SearchResponse> {
    try {
      const response = await api.get('/search', {
        params: {
          query: query.trim(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw new Error('Failed to search tokens');
    }
  },

  // Get detailed token information
  async getTokenDetails(tokenId: string): Promise<any> {
    try {
      const response = await api.get(`/coins/${tokenId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token details:', error);
      throw new Error('Failed to fetch token details');
    }
  },

  // Get price history for sparkline
  async getPriceHistory(tokenId: string, days = 7): Promise<PriceHistoryResponse> {
    try {
      const response = await api.get(`/coins/${tokenId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
          interval: days <= 1 ? 'hourly' : 'daily',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw new Error('Failed to fetch price history');
    }
  },

  // Get multiple tokens' current prices (for price updates)
  async getCurrentPrices(tokenIds: string[]): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
    try {
      const response = await api.get('/simple/price', {
        params: {
          ids: tokenIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current prices:', error);
      throw new Error('Failed to fetch current prices');
    }
  },

  // Get token list (for validation and mapping)
  async getTokenList(): Promise<{ id: string; symbol: string; name: string }[]> {
    try {
      const response = await api.get('/coins/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching token list:', error);
      throw new Error('Failed to fetch token list');
    }
  },
};

// Utility functions
export const formatTokenData = (apiData: CoinGeckoToken) => {
  return {
    id: apiData.id,
    name: apiData.name,
    symbol: apiData.symbol.toUpperCase(),
    image: apiData.image,
    current_price: apiData.current_price,
    price_change_percentage_24h: apiData.price_change_percentage_24h,
    market_cap_rank: apiData.market_cap_rank,
    sparkline_in_7d: apiData.sparkline_in_7d,
    market_cap: apiData.market_cap,
    total_volume: apiData.total_volume,
    last_updated: apiData.last_updated,
  };
};

export const formatSearchResult = (searchResult: SearchResult) => {
  return {
    id: searchResult.id,
    name: searchResult.name,
    symbol: searchResult.symbol.toUpperCase(),
    image: searchResult.large,
    market_cap_rank: searchResult.market_cap_rank,
  };
};

// Rate limiting and caching utilities
let lastRequestTime = 0;
const REQUEST_INTERVAL = 1000; // 1 second between requests

export const rateLimitedRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return requestFn();
};
