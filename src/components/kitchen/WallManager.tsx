'use client';

import React from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from '@/lib/utils';

export default function WallManager() {
    // CORRECTED: Destructure setActiveWallIndex from the store
    const { currentKitchen, activeWallIndex, setActiveWallIndex } = useKitchenStore(state => state);

    if (!currentKitchen || !currentKitchen.walls || currentKitchen.walls.length === 0) {
        return (
            <div>
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Walls</h3>
                <p className="text-sm text-muted-foreground">No walls defined for this project.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Walls</h3>
            <div className="flex items-center gap-2">
                {currentKitchen.walls.map((wall, index) => (
                    <button
                        key={wall.id}
                        onClick={() => setActiveWallIndex(index)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                            activeWallIndex === index
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-accent"
                        )}
                    >
                        {wall.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
