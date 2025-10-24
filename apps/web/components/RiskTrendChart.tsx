'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RiskTrendData {
  date: string;
  critical: number;
  legal: number;
  total: number;
}

interface RiskTrendChartProps {
  propertyId?: string;
  timeframe?: '7d' | '30d' | '90d' | '1y';
}

export function RiskTrendChart({ propertyId, timeframe = '30d' }: RiskTrendChartProps) {
  const [trendData, setTrendData] = useState<RiskTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [trendPercentage, setTrendPercentage] = useState(0);

  useEffect(() => {
    fetchTrendData();
  }, [propertyId, timeframe]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/risk-trend?propertyId=${propertyId || 'all'}&timeframe=${timeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setTrendData(data.data);
        calculateTrend(data.data);
      }
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data: RiskTrendData[]) => {
    if (data.length < 2) return;
    
    const first = data[0].total;
    const last = data[data.length - 1].total;
    const percentage = ((last - first) / first) * 100;
    
    setTrendPercentage(Math.abs(percentage));
    
    if (percentage > 5) {
      setTrend('up');
    } else if (percentage < -5) {
      setTrend('down');
    } else {
      setTrend('stable');
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-red-600 bg-red-50';
      case 'down':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendMessage = () => {
    switch (trend) {
      case 'up':
        return `Risiko um ${trendPercentage.toFixed(1)}% gestiegen`;
      case 'down':
        return `Risiko um ${trendPercentage.toFixed(1)}% gesunken`;
      default:
        return 'Risiko stabil';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📈 Risiko-Trend
          </h3>
          <p className="text-sm text-gray-600">
            Entwicklung der kritischen Wartungen über Zeit
          </p>
        </div>
        
        {/* Trend Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            {getTrendMessage()}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end gap-2">
        {trendData.map((data, index) => {
          const maxValue = Math.max(...trendData.map(d => d.total));
          const height = (data.total / maxValue) * 100;
          
          return (
            <div key={data.date} className="flex-1 flex flex-col items-center">
              {/* Bar */}
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                <div 
                  className="bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg w-full transition-all duration-500 hover:from-red-600 hover:to-red-500"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                    {data.total}
                  </div>
                </div>
              </div>
              
              {/* Date Label */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                {new Date(data.date).toLocaleDateString('de-AT', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Kritische Wartungen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Zeitraum: {timeframe}</span>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Erkenntnisse
        </h4>
        <div className="text-sm text-blue-800">
          {trend === 'up' && (
            <p>⚠️ Ihr Risiko steigt. Überprüfen Sie dringende Wartungen und planen Sie Handwerker ein.</p>
          )}
          {trend === 'down' && (
            <p>✅ Ihr Risiko sinkt. Sie sind auf dem richtigen Weg! Weiter so!</p>
          )}
          {trend === 'stable' && (
            <p>📊 Ihr Risiko bleibt stabil. Regelmäßige Wartungen halten das Niveau.</p>
          )}
        </div>
      </div>
    </div>
  );
}

