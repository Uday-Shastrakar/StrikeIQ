/**
 * useLiveMarketData - READ ONLY hook for live market data.
 */

import { useState, useEffect, useMemo } from 'react';
import { useWSStore } from '../core/ws/wsStore';
import { useShallow } from 'zustand/shallow';
import throttle from "lodash/throttle";
import { ChartAnalysis, AIPrediction, PerformanceMetrics } from '@/types/analytics';

export interface LiveMarketData {
  symbol: string;
  spot: number;
  timestamp: string;
  intelligence?: Record<string, unknown>;
  dataQuality?: Record<string, unknown>;
  aiReady?: boolean;
  atmStrike?: number;
  chartAnalysis?: ChartAnalysis;
  analytics?: Record<string, unknown>;
}

export function useLiveMarketData(symbol: string, expiry?: string) {
  // Use granular selectors with useShallow for absolute performance
  const marketData = useWSStore(
    useShallow((s) => ({
      spot: s.spot,
      spotPrice: s.spotPrice,
      liveSpot: s.liveSpot,
      currentSpot: s.currentSpot,
      atmStrike: s.atmStrike,
      aiIntelligence: s.aiIntelligence,
      dataQuality: s.dataQuality,
      aiReady: s.aiReady,
      lastUpdate: s.lastUpdate,
      connected: s.connected,
      error: s.error,
      chartAnalysis: s.chartAnalysis,
      analytics: s.analytics,
    }))
  );

  const [data, setData] = useState<LiveMarketData | null>(null);

  // Throttled update function with dependency optimization
  const throttledUpdate = useMemo(
    () =>
      throttle((updatedData: LiveMarketData) => {
        setData(prev => {
          // Deep comparison to prevent unnecessary updates
          if (!prev) return updatedData;
          if (prev.symbol === updatedData.symbol && 
              prev.spot === updatedData.spot && 
              prev.timestamp === updatedData.timestamp) {
            return prev;
          }
          return updatedData;
        });
      }, 200), // Further reduced for better responsiveness
    []
  );

  useEffect(() => {
    // Construct the UI data object
    const transformed: LiveMarketData = {
      symbol,
      spot: marketData.spot || marketData.spotPrice || 0,
      timestamp: new Date(marketData.lastUpdate || 0).toISOString(),
      intelligence: marketData.aiIntelligence,
      dataQuality: marketData.dataQuality,
      aiReady: marketData.aiReady,
      atmStrike: marketData.atmStrike,
      chartAnalysis: marketData.chartAnalysis,
      analytics: marketData.analytics,
    };

    throttledUpdate(transformed);
  }, [marketData.spot, marketData.lastUpdate, symbol, throttledUpdate]); // More specific dependencies

  useEffect(() => {
    return () => {
      throttledUpdate.cancel();
    };
  }, [throttledUpdate]);

  // Derive mode
  const mode = marketData.connected ? 'live' : (data?.spot ? 'snapshot' : 'offline');

  return {
    data,
    connected: marketData.connected,
    symbol,
    lastUpdate: data?.timestamp || new Date().toISOString(),
    loading: !data && !marketData.error,
    error: marketData.error,
    mode
  };
}
