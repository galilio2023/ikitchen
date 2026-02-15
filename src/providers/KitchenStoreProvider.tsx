'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type TemporalState } from 'zundo';

import { type KitchenState, createKitchenStore } from '@/lib/store/kitchenStore';

// Define the store type including temporal middleware
type KitchenStore = StoreApi<KitchenState> & {
  temporal: StoreApi<TemporalState<KitchenState>>;
};

export const KitchenStoreContext = createContext<KitchenStore | null>(null);

export interface KitchenStoreProviderProps {
  children: ReactNode;
  initialState: Partial<KitchenState>;
}

export const KitchenStoreProvider = ({ children, initialState }: KitchenStoreProviderProps) => {
  const storeRef = useRef<KitchenStore>(null);
  if (!storeRef.current) {
    // @ts-ignore - zundo adds the temporal property
    storeRef.current = createKitchenStore(initialState);
  }

  return (
    <KitchenStoreContext.Provider value={storeRef.current}>
      {children}
    </KitchenStoreContext.Provider>
  );
};

export const useKitchenStore = <T,>(selector: (store: KitchenState) => T): T => {
  const kitchenStoreContext = useContext(KitchenStoreContext);

  if (!kitchenStoreContext) {
    throw new Error(`useKitchenStore must be used within a KitchenStoreProvider`);
  }

  return useStore(kitchenStoreContext, selector);
};

// Hook to access the temporal store (history)
export const useKitchenHistory = <T,>(selector: (state: TemporalState<KitchenState>) => T): T => {
  const kitchenStoreContext = useContext(KitchenStoreContext);
  if (!kitchenStoreContext) {
    throw new Error(`useKitchenHistory must be used within a KitchenStoreProvider`);
  }
  // @ts-ignore - zundo adds the temporal property
  return useStore(kitchenStoreContext.temporal, selector);
};
