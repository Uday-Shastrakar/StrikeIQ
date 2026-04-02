import React, { memo, useEffect, useMemo } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface SpotPriceWidgetProps {
  symbol: string;
}

export const SpotPriceWidget = React.memo<SpotPriceWidgetProps>(({ symbol }) => {
  const { spot, connected } = useDashboardData();
  
  // Memoize display values to prevent unnecessary re-renders
  const displayValues = useMemo(() => ({
    spotDisplay: spot > 0 ? `₹${spot.toFixed(2)}` : 'Waiting for data',
    statusText: connected ? 'Connected' : 'Disconnected'
  }), [spot, connected]);

  // Render profiling only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.count("SpotPriceWidget render");
    }
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white font-mono">
            {displayValues.spotDisplay}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <span className="text-xs text-white/60 font-mono uppercase tracking-wider">
            {displayValues.statusText}
          </span>
        </div>
      </div>
    </div>
  );
});

export default SpotPriceWidget;
