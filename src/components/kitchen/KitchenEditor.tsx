'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { updateKitchen } from '@/actions/projectActions';
import { toast } from 'sonner';
import { DEFAULT_OBSTACLE_DIMENSIONS } from '@/lib/constants';

import SpatialCanvas from "@/components/kitchen/SpatialCanvas";
import UnifiedSidebar from "@/components/kitchen/UnifiedSidebar";
import { Save } from 'lucide-react';

export default function KitchenEditor() {
    const store = useKitchenStore(state => state);
    const [isSaving, startSaveTransition] = useTransition();
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const handleSave = () => {
        if (store.currentKitchen) {
            startSaveTransition(async () => {
                const result = await updateKitchen(store.currentKitchen.id, store.currentKitchen);
                if (result.success) {
                    toast.success("Project Saved!");
                } else {
                    toast.error(result.error);
                }
            });
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType") as any;
        // ... (rest of the drop logic)

        if (typeString) {
            const defaultDims = DEFAULT_OBSTACLE_DIMENSIONS[typeString] || { width: 60, height: 60, depth: 20 };
            store.addObstacle({
                id: uuidv4(),
                type: typeString,
                wallIndex: store.activeWallIndex,
                position: { x: 50, y: 50, z: 0, ...defaultDims }
            });
        } else if (draggingId) {
            // ... (update position logic)
        }
    };

    // ... other component logic

    return (
        <div className="flex-1 flex lg:flex-row gap-0 min-h-0 overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary gap-2">
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
            <main className="flex-1 relative min-w-0 h-full">
                <SpatialCanvas
                    currentKitchen={store.currentKitchen}
                    onDrop={handleDrop}
                    // ... other props
                />
            </main>
            <UnifiedSidebar />
        </div>
    );
}
