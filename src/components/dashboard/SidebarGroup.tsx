'use client';

import React from 'react';

export function SidebarGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {title}
            </h3>
            <div className="space-y-1">{children}</div>
        </section>
    );
}
