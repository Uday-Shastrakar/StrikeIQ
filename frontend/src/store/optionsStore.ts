import { create } from 'zustand';
import { OptionChain } from '@/types/optionChain';

interface OptionsStore {
  optionChain: OptionChain | null;
  symbol: string;
  expiry: string;
  spot: number;
  marketStatus: string;
  isMarketOpen: boolean;
  lastUpdate: number;
  setOptionChain: (data: OptionChain) => void;
  setSymbol: (sym: string) => void;
  setExpiry: (exp: string) => void;
  setSpot: (price: number) => void;
  setMarketStatus: (status: string) => void;
  setIsMarketOpen: (isOpen: boolean) => void;
  setLastUpdate: (timestamp: number) => void;
}

export const useOptionsStore = create<OptionsStore>((set) => ({
  optionChain: null,
  symbol: "",
  expiry: "",
  spot: 0,
  marketStatus: "UNKNOWN",
  isMarketOpen: false,
  lastUpdate: 0,
  setOptionChain: (data) => set({ optionChain: data }),
  setSymbol: (sym) => set({ symbol: sym }),
  setExpiry: (exp) => set({ expiry: exp }),
  setSpot: (price) => set({ spot: price }),
  setMarketStatus: (status) => set({ marketStatus: status }),
  setIsMarketOpen: (isOpen) => set({ isMarketOpen: isOpen }),
  setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
}))
