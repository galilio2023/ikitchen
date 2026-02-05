'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import { type KitchenState, createKitchenStore } from '@/lib/store/kitchenStore';

export const KitchenStoreContext = createContext<StoreApi<KitchenState> | null>(null);

export interface KitchenStoreProviderProps {
  children: ReactNode;
  initialState: Partial<KitchenState>;
}

export const KitchenStoreProvider = ({ children, initialState }: KitchenStoreProviderProps) => {
  const storeRef = useRef<StoreApi<KitchenState>>();
  if (!storeRef.current) {
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
