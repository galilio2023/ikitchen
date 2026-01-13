'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/lib/store';
import { SessionProvider } from "next-auth/react";

export default function StoreProvider({children,}: {
    children: React.ReactNode;
}) {
    const [store] = useState<AppStore>(() => makeStore());

    return (
        <SessionProvider>
            <Provider store={store}>{children}</Provider>
        </SessionProvider>
    );
}