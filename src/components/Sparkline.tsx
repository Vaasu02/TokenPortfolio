// Sparkline chart component for showing 7-day price trends with real API data

import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { coinGeckoApi } from '../services/coinGeckoApi';

interface SparklineProps {
  data?: number[];
  tokenId?: string;
  color: string;
  width?: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  tokenId,
  color, 
  width = 80, 
  height = 30 
}) => {
  const [sparklineData, setSparklineData] = useState<number[]>(data || []);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sparkline data if tokenId is provided and no data is passed
  useEffect(() => {
    if (tokenId && (!data || data.length === 0)) {
      fetchSparklineData();
    } else if (data && data.length > 0) {
      setSparklineData(data);
    }
  }, [tokenId, data]);

  const fetchSparklineData = async () => {
    if (!tokenId) return;
    
    try {
      setIsLoading(true);
      const priceHistory = await coinGeckoApi.getPriceHistory(tokenId, 7);
      const prices = priceHistory.prices.map(([_, price]) => price);
      setSparklineData(prices);
    } catch (error) {
      console.error('Failed to fetch sparkline data for', tokenId, ':', error);
      // Use fallback data if API fails
      setSparklineData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center"
      >
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Show empty state if no data
  if (sparklineData.length === 0) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center"
      >
        <div className="text-gray-500 text-xs">—</div>
      </div>
    );
  }

  
  const chartData = sparklineData.map((value, index) => ({
    index,
    value
  }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;