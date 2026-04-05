/**
 * Analytics and AI signal types for StrikeIQ
 */

export interface AISignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  strength: number;
  confidence: number;
  timestamp: number;
  symbol: string;
  strategy: string;
  price?: number;
  expiry?: string;
  strike?: number;
}

export interface ChartAnalysis {
  trend: 'bullish' | 'bearish' | 'sideways';
  strength: number;
  support: number[];
  resistance: number[];
  pattern?: string;
  targets?: number[];
  stopLoss?: number;
  timestamp: number;
}

export interface AIPrediction {
  direction: 'up' | 'down' | 'neutral';
  probability: number;
  timeHorizon: string;
  priceTarget?: number;
  confidence: number;
  reasoning: string;
  timestamp: number;
}

export interface EarlyWarning {
  id: string;
  type: 'volatility' | 'volume' | 'price' | 'sentiment';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface NewsAlert {
  id: string;
  headline: string;
  source: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: number;
  url?: string;
}

export interface PaperTrading {
  enabled: boolean;
  portfolio: {
    cash: number;
    positions: TradingPosition[];
    totalValue: number;
    pnl: number;
  };
  orders: Order[];
}

export interface TradingPosition {
  symbol: string;
  type: 'call' | 'put' | 'stock';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: number;
}

export interface HeatmapDataPoint {
  strike: number;
  callOI: number;
  putOI: number;
  callVolume: number;
  putVolume: number;
  intensity: number;
}

export interface OIHeatmap {
  symbol: string;
  spot: number;
  data: HeatmapDataPoint[];
  timestamp: number;
}

export interface PerformanceMetrics {
  winRate: number;
  avgReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  profitableTrades: number;
  lastUpdated: number;
}
