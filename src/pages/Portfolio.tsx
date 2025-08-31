import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PortfolioTotal from '../components/PortfolioTotal';
import PortfolioChart from '../components/PortfolioChart';
import WatchlistActions from '../components/WatchlistActions';
import WatchlistTable from '../components/WatchlistTable';

import AddTokenModal from '../components/AddTokenModal';

import { usePriceUpdates } from '../hooks/usePriceUpdates';
import { useWalletPersistence } from '../hooks/useWalletPersistence';
import { useAppSelector } from '../hooks/redux';

const Portfolio: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);
  const itemsPerPage = 6;
  
  // Get watchlist data for pagination
  const { watchlist } = useAppSelector(state => state.portfolio);
  const totalItems = watchlist.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Reset to first page if current page is beyond total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Initialize price updates hook
  const { refreshPrices, isLoading } = usePriceUpdates();

  // Initialize wallet persistence verification
  useWalletPersistence();

  const handleRefresh = async () => {
    await refreshPrices();
  };

  const handleAddToken = () => {
    setIsAddTokenModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddTokenModalOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#212124' }}>
      <Header />
      
      <main className="portfolio-container container mx-auto px-6 py-8" style={{ maxWidth: '1440px', minHeight: '920px' }}>

        {/* Portfolio Overview - Frame 14 */}
        <div 
          className="portfolio-overview mb-8"
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            maxWidth: '1384px',
            borderRadius: '12px',
            padding: '24px',
            gap: '19px',
            backgroundColor: '#27272A'
          }}
        >
          <PortfolioTotal />
          <PortfolioChart />
        </div>

        {/* Watchlist Section - Frame 13 */}
        <div 
          className="portfolio-watchlist"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '1384px',
            gap: '16px'
          }}
        >
          <WatchlistActions 
            onRefresh={handleRefresh}
            onAddToken={handleAddToken}
            isLoading={isLoading}
          />
          
          <WatchlistTable 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* Add Token Modal */}
      <AddTokenModal 
        isOpen={isAddTokenModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Portfolio;
