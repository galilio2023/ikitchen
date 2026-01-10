'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';

export default function StoreProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    // We pass a function to useState (Lazy Initializer).
    // React will only call this function ONCE during the initial mount.
    // This is safe for SSR and Client-side hydration.
    const [store] = useState<AppStore>(() => makeStore());

    return <Provider store={store}>{children}</Provider>;
}