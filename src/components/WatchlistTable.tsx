import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { updateHoldings, removeFromWatchlist } from '../store/slices/portfolioSlice';
import Sparkline from './Sparkline';

interface WatchlistTableProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ currentPage, itemsPerPage, totalItems, totalPages, onPageChange }) => {
  const { watchlist } = useAppSelector(state => state.portfolio);
  const dispatch = useAppDispatch();
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWatchlist = watchlist.slice(startIndex, endIndex);
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Note: This function is now replaced by handleEditFromMenu but kept for potential future use
  // const handleHoldingsEdit = (tokenId: string, currentHoldings: number) => {
  //   setEditingTokenId(tokenId);
  //   setEditingValue(currentHoldings.toString());
  // };

  const handleHoldingsSave = (tokenId: string) => {
    const newHoldings = parseFloat(editingValue) || 0;
    dispatch(updateHoldings({ tokenId, holdings: newHoldings }));
    setEditingTokenId(null);
    setEditingValue('');
  };

  const handleHoldingsCancel = () => {
    setEditingTokenId(null);
    setEditingValue('');
  };

  const handleMenuToggle = (tokenId: string) => {
    setOpenMenuId(openMenuId === tokenId ? null : tokenId);
  };

  const handleEditFromMenu = (tokenId: string, currentHoldings: number) => {
    setEditingTokenId(tokenId);
    setEditingValue(currentHoldings.toString());
    setOpenMenuId(null);
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch(removeFromWatchlist(tokenId));
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1384px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr 
              style={{
                borderBottom: '1px solid rgba(244, 244, 245, 0.2)',
                backgroundColor: '#27272A'
              }}
            >
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                Token
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                Price
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                24h %
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                Sparkline (7d)
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                Holdings
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                Value
              </th>
              <th 
                style={{
                  width: '38px',
                  height: '20px',
                  textAlign: 'left',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#A1A1AA'
                }}
              >
                
              </th>
            </tr>
          </thead>
          <tbody>
                         {paginatedWatchlist.map((token) => (
              <tr key={token.id} className="hover:bg-gray-750">
                {/* Token */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <img 
                      src={token.image} 
                      alt={token.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        border: '0.5px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span className="text-white font-medium">{token.name}</span>
                      <span className="text-gray-400 text-sm">({token.symbol.toUpperCase()})</span>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '71px',
                      height: '20px',
                      fontFamily: 'font/family/body',
                      fontWeight: 400,
                      fontSize: 'small',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      color: '#A1A1AA'
                    }}
                  >
                    {formatCurrency(token.current_price)}
                  </div>
                </td>

                {/* 24h % */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '71px',
                      height: '20px',
                      fontFamily: 'font/family/body',
                      fontWeight: 400,
                      fontSize: 'small',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      color: '#A1A1AA'
                    }}
                  >
                    {formatPercentage(token.price_change_percentage_24h)}
                  </div>
                </td>

                {/* Sparkline */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  <Sparkline 
                    data={token.sparkline_in_7d?.price || []} 
                    tokenId={token.id}
                    color={token.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444'}
                  />
                </td>

                {/* Holdings */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  {editingTokenId === token.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        style={{
                          width: '109px',
                          height: '32px',
                          borderRadius: '6px',
                          padding: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          outline: 'none',
                          boxShadow: '0 0 0 4px rgba(169, 232, 81, 0.2)'
                        }}
                        step="0.0001"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleHoldingsSave(token.id);
                          } else if (e.key === 'Escape') {
                            handleHoldingsCancel();
                          }
                        }}
                      />
                      <button
                        onClick={() => handleHoldingsSave(token.id)}
                        style={{
                          width: '51px',
                          height: '32px',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          backgroundColor: '#A9E851',
                          color: '#000000',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: '0 0 0 1px #1F6619, 0 0 2px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '44px',
                        height: '20px',
                        fontFamily: 'font/family/body',
                        fontWeight: 400,
                        fontSize: 'small',
                        lineHeight: '20px',
                        letterSpacing: '0%',
                        color: '#F4F4F5'
                      }}
                    >
                      {token.holdings.toFixed(4)}
                    </div>
                  )}
                </td>

                {/* Value */}
                <td 
                  style={{
                    width: '206px',
                    height: '48px',
                    padding: '12px 24px',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '20px',
                      fontFamily: 'font/family/body',
                      fontWeight: 400,
                      fontSize: 'small',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      color: '#F4F4F5'
                    }}
                  >
                    {formatCurrency(token.value)}
                  </div>
                </td>

                {/* Menu */}
                <td className="py-4 px-6 relative">
                  <button 
                    onClick={() => handleMenuToggle(token.id)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  
                  {openMenuId === token.id && (
                    <div 
                      ref={menuRef}
                      style={{
                        position: 'absolute',
                        right: '44px',
                        top: '40px',
                        width: '144px',
                        height: '72px',
                        borderRadius: '8px',
                        padding: '4px',
                        backgroundColor: '#27272A',
                        boxShadow: '0 0 16px 0 rgba(0, 0, 0, 0.08), 0 0 8px 0 rgba(0, 0, 0, 0.08)',
                        zIndex: 50
                      }}
                    >
                      <button
                        onClick={() => handleEditFromMenu(token.id, token.holdings)}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '136px',
                          height: '28px',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          backgroundColor: '#27272A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          outline: 'none',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <img 
                          src="/homepageImages/pencil-square.png" 
                          alt="Edit" 
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'font/family/body',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            color: '#A1A1AA'
                          }}
                        >
                          Edit Holdings
                        </span>
                      </button>
                      <button
                        onClick={() => handleRemoveToken(token.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '136px',
                          height: '28px',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          backgroundColor: '#27272A',
                          color: '#F87171',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          outline: 'none',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <img 
                          src="/homepageImages/trash.png" 
                          alt="Remove" 
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'font/family/body',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            color: '#FDA4AF'
                          }}
                        >
                          Remove
                        </span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer - Pagination Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '60px',
          padding: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(244, 244, 245, 0.08)',
          marginTop: 'auto'
        }}
      >
        {/* Left side: Results count */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0%',
            color: '#A1A1AA'
          }}
        >
          {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} results`}
        </span>

        {/* Right side: Pagination controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: '#A1A1AA'
            }}
          >
            {`${currentPage} of ${totalPages} pages`}
          </span>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '32px',
              borderRadius: '6px',
              padding: '6px 10px',
              gap: '6px',
              backgroundColor: '#27272A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: currentPage === 1 ? 'rgba(161, 161, 170, 0.5)' : '#A1A1AA',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '32px',
              borderRadius: '6px',
              padding: '6px 10px',
              gap: '6px',
              backgroundColor: '#27272A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: currentPage === totalPages ? 'rgba(161, 161, 170, 0.5)' : '#A1A1AA',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistTable;
