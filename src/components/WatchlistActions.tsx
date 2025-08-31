import React from 'react';

interface WatchlistActionsProps {
  onRefresh: () => void;
  onAddToken: () => void;
  isLoading?: boolean;
}

const WatchlistActions: React.FC<WatchlistActionsProps> = ({ onRefresh, onAddToken, isLoading = false }) => {
  return (
    <div 
      className="watchlist-actions-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '1384px',
        height: '36px',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div className="flex items-center gap-2">
        <img 
          src="/homepageImages/star.png" 
          alt="Star" 
          className="watchlist-star-icon"
          style={{
            width: '19.98px',
            height: '19.08px',
            marginLeft: '4.01px'
          }}
        />
        <h2 
          className="watchlist-title"
          style={{
            width: '105px',
            height: '30px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '125%',
            letterSpacing: '-0.96%',
            color: '#F4F4F5'
          }}
        >
          Watchlist
        </h2>
      </div>
      
      <div className="watchlist-buttons flex items-center gap-3">
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="refresh-button"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '142px',
            height: '36px',
            borderRadius: '6px',
            padding: '8px 12px',
            gap: '6px',
            alignItems: 'center',
            backgroundColor: isLoading ? '#374151' : 'rgba(255, 255, 255, 0.04)',
            color: isLoading ? '#9CA3AF' : '#FFFFFF',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.08), 0 0 2px 0 rgba(0, 0, 0, 0.08)'
          }}
        >
          <img 
            src="/homepageImages/refreahPricesicon.png" 
            alt="Refresh" 
            className={`refresh-button-icon ${isLoading ? 'animate-spin' : ''}`}
            style={{
              width: '16px',
              height: '16px'
            }}
          />
          <span className="refresh-button-text" style={{ fontSize: '14px' }}>
            {isLoading ? 'Refreshing...' : 'Refresh Prices'}
          </span>
        </button>
        
        <button 
          onClick={onAddToken}
          className="add-token-button"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '117px',
            height: '36px',
            borderRadius: '6px',
            padding: '8px 12px',
            gap: '6px',
            alignItems: 'center',
            backgroundColor: '#A9E851',
            color: '#000000',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 0 1px #1F6619, 0 0 2px 0 #1F6619'
          }}
        >
          <img 
            src="/homepageImages/plusforAddtokenbutton.png" 
            alt="Add" 
            className="add-token-button-icon"
            style={{
              width: '16px',
              height: '16px'
            }}
          />
          <span className="add-token-button-text" style={{ fontSize: '14px' }}>Add Token</span>
        </button>
      </div>
    </div>
  );
};

export default WatchlistActions;
