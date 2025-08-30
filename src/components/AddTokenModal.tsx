import React, { useState, useEffect } from 'react';
import { Check, Loader2, Star } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { addToWatchlist } from '../store/slices/portfolioSlice';
import { coinGeckoApi, formatTokenData } from '../services/coinGeckoApi';

interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  sparkline_in_7d?: {
    price: number[];
  };
  market_cap_rank?: number;
}

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTokens(new Set());
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
      fetchTrendingTokens();
    }
  }, [isOpen]);

  // Search tokens when query changes (with debounce)
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchTokens(searchQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const fetchTrendingTokens = async () => {
    try {
      setIsLoadingTrending(true);
      setError(null);
      
      // Get trending tokens from CoinGecko
      const trendingResponse = await coinGeckoApi.getTrendingTokens();
      const trendingIds = trendingResponse.coins.slice(0, 5).map(coin => coin.item.id);
      
      // Get market data for trending tokens
      const marketData = await coinGeckoApi.getMarketData(trendingIds, true);
      const formattedTokens = marketData.map(formatTokenData);
      
      setTrendingTokens(formattedTokens);
    } catch (error) {
      console.error('Failed to fetch trending tokens:', error);
      setError('Failed to load trending tokens. Please try again.');
      
      // Fallback to some popular tokens if trending fails
      const fallbackIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon'];
      try {
        const fallbackData = await coinGeckoApi.getMarketData(fallbackIds, true);
        setTrendingTokens(fallbackData.map(formatTokenData));
        setError(null);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const searchTokens = async (query: string) => {
    try {
      setIsSearching(true);
      setError(null);
      
      const searchResponse = await coinGeckoApi.searchTokens(query);
      const topResults = searchResponse.coins.slice(0, 10);
      
      if (topResults.length > 0) {
        // Get market data for search results
        const tokenIds = topResults.map(token => token.id);
        const marketData = await coinGeckoApi.getMarketData(tokenIds, true);
        const formattedResults = marketData.map(formatTokenData);
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTokenSelect = (tokenId: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(tokenId)) {
      newSelected.delete(tokenId);
    } else {
      newSelected.add(tokenId);
    }
    setSelectedTokens(newSelected);
  };

  const handleAddToWatchlist = () => {
    const tokensToDisplay = searchQuery.trim() ? searchResults : trendingTokens;
    const selectedTokenData = tokensToDisplay.filter(token => selectedTokens.has(token.id));
    
    // Convert to the format expected by the API
    const formattedTokens = selectedTokenData.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      image: token.image,
      current_price: token.current_price || 0,
      price_change_percentage_24h: token.price_change_percentage_24h || 0,
      sparkline_in_7d: token.sparkline_in_7d || { price: [] },
      market_cap_rank: token.market_cap_rank || 0,
    }));
    
    // Dispatch with array of tokens (as expected by the reducer)
    dispatch(addToWatchlist(formattedTokens));
    
    onClose();
  };

  if (!isOpen) return null;

  const tokensToDisplay = searchQuery.trim() ? searchResults : trendingTokens;
  const isLoading = (searchQuery.trim() && isSearching) || (!searchQuery.trim() && isLoadingTrending);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      style={{ backgroundColor: '#212124D9' }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '640px',
          height: '480px',
          borderRadius: '12px',
          backgroundColor: '#212124',
          boxShadow: '0 0 16px 0 rgba(0, 0, 0, 0.32), 0 0 8px 0 rgba(0, 0, 0, 0.32)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div 
          style={{
            width: '100%',
            height: '52px',
            padding: '12px 16px',
            borderBottom: '1px solid #3F3F46',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <input
            type="text"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              height: '20px',
              backgroundColor: 'transparent',
              color: '#71717A',
              fontFamily: 'font/family/body',
              fontWeight: 400,
              fontSize: 'medium',
              lineHeight: '20px',
              letterSpacing: '0%',
              outline: 'none',
              border: 'none',
              margin: 0,
              padding: 0
            }}
          />
          {isSearching && (
            <Loader2 size={16} style={{ color: '#71717A' }} className="animate-spin" />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 bg-red-600/10 border-l-4 border-red-600">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Section Header */}
          <div className="px-6 py-4">
            <h3 
              style={{
                fontFamily: 'font/family/body',
                fontWeight: 500,
                fontSize: 'xsmall',
                lineHeight: '20px',
                letterSpacing: '0%',
                color: '#71717A',
                margin: 0
              }}
            >
              {searchQuery.trim() ? `Search Results (${tokensToDisplay.length})` : 'Trending'}
            </h3>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={24} className="text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-400">
                {searchQuery.trim() ? 'Searching...' : 'Loading trending tokens...'}
              </span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tokensToDisplay.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">
                {searchQuery.trim() ? 'No tokens found for your search' : 'No trending tokens available'}
              </p>
            </div>
          )}

          {/* Token List */}
          {!isLoading && tokensToDisplay.length > 0 && (
            <div className="flex-1 px-6 pt-0">
              <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
                {tokensToDisplay.map((token) => (
                  <div
                    key={token.id}
                    onClick={() => handleTokenSelect(token.id)}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '6px',
                      padding: '8px 8px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedTokens.has(token.id) 
                        ? 'rgba(169,232,81,0.06)' 
                        : '#212124',
                      border: selectedTokens.has(token.id) 
                        ? '1px solid rgba(169, 232, 81, 0.2)' 
                        : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Token Info - Simplified */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={token.image} 
                          alt={token.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/homepageImages/logo.png';
                          }}
                        />
                        <div>
                          <div style={{
                            color: '#F4F4F5',
                            fontFamily: 'font/family/body',
                            fontWeight: 400,
                            fontSize: 'medium',
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            whiteSpace: 'nowrap'
                          }}>
                            {token.name} ({token.symbol})
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Star Icon and Checkbox Grouped Together */}
                    <div className="flex items-center gap-4">
                      {/* Star Icon - Positioned left of checkbox */}
                      <Star 
                        size={15} 
                        style={{
                          width: '15px',
                          height: '15px',
                          color: selectedTokens.has(token.id) ? '#A9E851' : 'transparent',
                          fill: selectedTokens.has(token.id) ? '#A9E851' : 'none'
                        }}
                      />

                      {/* Selection Checkbox */}
                      <div 
                        style={{
                          width: '12.5px',
                          height: '12.5px',
                          borderRadius: '50%',
                          border: selectedTokens.has(token.id) ? 'none' : '2px solid #52525B',
                          backgroundColor: selectedTokens.has(token.id) ? '#A9E851' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        {selectedTokens.has(token.id) && (
                          <Check 
                            size={8} 
                            style={{
                              color: '#000000'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          style={{
            width: '640px',
            height: '56px',
            padding: '12px 16px',
            borderTop: '1px solid #3F3F46',
            backgroundColor: '#27272A',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.size === 0}
            style={{
              width: '114px',
              height: '32px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: selectedTokens.size > 0 ? 'pointer' : 'not-allowed',
              backgroundColor: selectedTokens.size > 0 ? '#A9E851' : '#27272A',
              color: selectedTokens.size > 0 ? '#000000' : '#71717A',
              border: 'none',
              outline: 'none',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: selectedTokens.size > 0 
                ? '0 0 0 1px #1F6619, 0 0 2px 0 rgba(31, 102, 25, 0.4)' 
                : 'none'
            }}
          >
            <span 
              style={{
                width: '94px',
                height: '20px',
                fontFamily: 'font/family/body',
                fontWeight: 500,
                fontSize: 'small',
                lineHeight: '20px',
                letterSpacing: '0%',
                color: selectedTokens.size > 0 ? '#000000' : '#52525B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Add to Wishlist
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenModal;