import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../hooks/redux';

const PortfolioChart: React.FC = () => {
  const { watchlist, portfolioTotal } = useAppSelector(state => state.portfolio);

  // Calculate portfolio data for the chart
  const chartData = watchlist.map(token => ({
    name: token.name,
    symbol: token.symbol,
    value: token.value,
    percentage: ((token.value / portfolioTotal) * 100).toFixed(1),
  }));

  // Colors for different tokens (matching the Figma design exactly)
  const COLORS = {
    'Bitcoin': '#f97316', // orange
    'Ethereum': '#A78BFA', // purple (exact from Figma)
    'Solana': '#06b6d4', // cyan/light blue
    'Dogecoin': '#10b981', // green
    'USDC': '#f59e0b', // amber
    'Stellar': '#ec4899', // pink (exact from Figma)
  };

  const getColor = (tokenName: string) => {
    return COLORS[tokenName as keyof typeof COLORS] || '#6b7280';
  };

  return (
    <div 
      className="portfolio-chart-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '658.5px',
        gap: '20px'
      }}
    >
      <h2 
        className="portfolio-chart-title"
        style={{
          width: '658.5px',
          height: '20px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: '20px',
          letterSpacing: '0%',
          color: '#A1A1AA',
          marginBottom: '-12px'
        }}
      >
        Portfolio Total
      </h2>
      
      <div className="portfolio-chart-wrapper flex items-center" style={{ gap: '40px' }}>
        {/* Chart */}
        <div 
          className="portfolio-chart"
          style={{
            width: '160px',
            height: '160px',
            border: '1px solid #FFFFFF',
            borderRadius: '50%',
            overflow: 'hidden'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.name)} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div 
          className="portfolio-chart-legend"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '229.25px',
            gap: '20px'
          }}
        >
          {chartData.map((token) => (
            <div key={token.symbol} className="portfolio-chart-legend-item flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div 
                  className="portfolio-chart-color-dot w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColor(token.name) }}
                />
                <span className="portfolio-chart-token-name text-white text-sm">
                  {token.name} ({token.symbol})
                </span>
              </div>
              <span 
                className="portfolio-chart-percentage text-white text-sm -mr-56"
                style={{
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#A1A1AA'
                }}
              >
                {token.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
