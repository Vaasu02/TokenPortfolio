import React from 'react';
import { useAppSelector } from '../hooks/redux';

const PortfolioTotal: React.FC = () => {
  const { portfolioTotal, lastUpdated } = useAppSelector(state => state.portfolio);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '20px'
      }}
    >
      <h2 
        style={{
          width: '658.5px',
          height: '20px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: '20px',
          letterSpacing: '0%',
          color: '#A1A1AA'
        }}
      >
        Portfolio Total
      </h2>
      <div 
        style={{
          width: '658.5px',
          height: '62px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '48px',
          lineHeight: '110%',
          letterSpacing: '-2.24%',
          color: '#F4F4F5'
        }}
      >
        {formatCurrency(portfolioTotal)}
      </div>
      <p 
        style={{
          width: '658.5px',
          height: '20px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '20px',
          letterSpacing: '0%',
          color: '#A1A1AA',
          marginTop: 'auto'
        }}
      >
        Last updated: {lastUpdated}
      </p>
    </div>
  );
};

export default PortfolioTotal;
