// Local Storage utility for persisting portfolio data

import type { WatchlistToken } from '../store/slices/portfolioSlice';

const STORAGE_KEYS = {
  WATCHLIST: 'token-portfolio-watchlist',
  HOLDINGS: 'token-portfolio-holdings',
  LAST_UPDATED: 'token-portfolio-last-updated',
  PORTFOLIO_TOTAL: 'token-portfolio-total',
} as const;

// Save watchlist to localStorage
export const saveWatchlistToStorage = (watchlist: WatchlistToken[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Failed to save watchlist to localStorage:', error);
  }
};

// Load watchlist from localStorage
export const loadWatchlistFromStorage = (): WatchlistToken[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Failed to load watchlist from localStorage:', error);
    return null;
  }
};

// Save individual holdings to localStorage
export const saveHoldingsToStorage = (holdings: Record<string, number>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
  } catch (error) {
    console.error('Failed to save holdings to localStorage:', error);
  }
};

// Load holdings from localStorage
export const loadHoldingsFromStorage = (): Record<string, number> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HOLDINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Failed to load holdings from localStorage:', error);
    return null;
  }
};

// Save last updated timestamp
export const saveLastUpdatedToStorage = (timestamp: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, timestamp);
  } catch (error) {
    console.error('Failed to save last updated to localStorage:', error);
  }
};

// Load last updated timestamp
export const loadLastUpdatedFromStorage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
  } catch (error) {
    console.error('Failed to load last updated from localStorage:', error);
    return null;
  }
};

// Save portfolio total
export const savePortfolioTotalToStorage = (total: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO_TOTAL, total.toString());
  } catch (error) {
    console.error('Failed to save portfolio total to localStorage:', error);
  }
};

// Load portfolio total
export const loadPortfolioTotalFromStorage = (): number | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO_TOTAL);
    if (stored) {
      return parseFloat(stored);
    }
    return null;
  } catch (error) {
    console.error('Failed to load portfolio total from localStorage:', error);
    return null;
  }
};

// Clear all stored data
export const clearAllStoredData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
};

// Check if localStorage is available
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
