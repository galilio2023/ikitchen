'use client';

import React from 'react';

export function SidebarGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section>
            <p className="px-4 text-[9px] uppercase tracking-[0.5em] !text-foreground/30 font-black mb-5">
                {title}
            </p>
            <div className="space-y-1">{children}</div>
        </section>
    );
}