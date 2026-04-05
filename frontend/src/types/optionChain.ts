/**
 * Option chain data types for StrikeIQ
 */

export interface OptionData {
  strike: number;
  call: {
    ltp: number;
    oi: number;
    volume: number;
    bid?: number;
    ask?: number;
    change?: number;
    changePercent?: number;
    impliedVolatility?: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
  };
  put: {
    ltp: number;
    oi: number;
    volume: number;
    bid?: number;
    ask?: number;
    change?: number;
    changePercent?: number;
    impliedVolatility?: number;
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
  };
}

export interface OptionChain {
  symbol: string;
  spot: number;
  atmStrike: number;
  expiry: string;
  timestamp: number;
  strikes: OptionData[];
  summary: {
    totalCallOI: number;
    totalPutOI: number;
    totalCallVolume: number;
    totalPutVolume: number;
    pcr: number; // Put-Call Ratio
    maxPain?: number;
  };
}

export interface OptionChainSnapshot {
  symbol: string;
  spot: number;
  spot_price?: number; // Alternative field name
  atm_strike: number;
  expiry: string;
  timestamp: number;
  strikes: OptionData[];
  metadata?: {
    source: string;
    latency: number;
    updateCount: number;
  };
}

export interface OptionTick {
  symbol: string;
  strike: number;
  right: 'call' | 'put';
  ltp: number;
  oi: number;
  volume: number;
  timestamp: number;
  change?: number;
  changePercent?: number;
}

export interface OptionChainStore {
  optionChainConnected: boolean;
  optionChainError: string | null;
  optionChainData: OptionChain | null;
  optionChainLastUpdate: number;

  setOptionChainConnected: (connected: boolean) => void;
  setOptionChainError: (error: string | null) => void;
  setOptionChainData: (data: OptionChain | null) => void;
  updateOptionChain: (data: Partial<OptionChain>) => void;
}
