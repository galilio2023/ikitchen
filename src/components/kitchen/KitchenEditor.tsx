'use client';

import React, { useMemo, useState } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_OBSTACLE_DIMENSIONS } from '@/lib/constants';

import SpatialCanvas from "@/components/kitchen/SpatialCanvas";
import UnifiedSidebar from "@/components/kitchen/UnifiedSidebar";
import { updateKitchen } from '@/actions/projectActions';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function KitchenEditor() {
    const store = useKitchenStore(state => state);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const currentWall = useMemo(() => {
        if (!store.currentKitchen || !store.currentKitchen.walls) return null;
        return store.currentKitchen.walls[store.activeWallIndex] || null;
    }, [store.currentKitchen, store.activeWallIndex]);

    const renderableNodes = useMemo(() => {
        if (!store.currentKitchen) return []; // Ensure it's always an array
        const obstacles = (store.currentKitchen.obstacles ?? []).map((obs, index) => ({
            ...obs, isAppliance: false, id: obs.id || (obs as any)._id?.toString() || `obs-${index}`
        }));
        const appliances = (store.currentKitchen.appliances ?? []).map((app, index) => ({
            ...app, type: 'appliance' as const, isAppliance: true, id: (app as any)._id?.toString() || (app as any).id || `app-${index}`
        }));
        return [...obstacles, ...appliances];
    }, [store.currentKitchen]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType") as any;
        const container = e.currentTarget as HTMLDivElement;

        if (!container || !currentWall) return;

        const rect = container.getBoundingClientRect();
        const scale = parseFloat(container.style.transform.replace('scale(', '').replace(')', '')) || 1;
        
        const offsetX = (container.offsetWidth - (currentWall.length * scale)) / 2;
        const offsetY = (container.offsetHeight - (currentWall.height * scale)) / 2;

        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;

        const unscaledX = (dropX - offsetX) / scale;
        const unscaledY = (dropY - offsetY) / scale;

        if (typeString) {
            const defaultDims = DEFAULT_OBSTACLE_DIMENSIONS[typeString] || { width: 60, height: 60, depth: 20 };
            store.addObstacle({
                id: uuidv4(),
                type: typeString,
                wallIndex: store.activeWallIndex,
                position: { x: unscaledX, y: unscaledY, z: 0, ...defaultDims }
            });
        } else if (draggingId) {
            store.updateObstaclePosition(draggingId, unscaledX, unscaledY);
            setDraggingId(null);
        }
    };
    
    if (!store.currentKitchen) {
        return <div className="flex items-center justify-center h-full">Loading Editor...</div>;
    }

    return (
        <div className="flex-1 flex lg:flex-row gap-0 min-h-0 overflow-hidden">
            <main className="flex-1 relative min-w-0 h-full">
                <SpatialCanvas
                    currentKitchen={store.currentKitchen}
                    currentWall={currentWall}
                    renderableObstacles={renderableNodes}
                    selectedObstacleId={store.selectedObstacleId}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onCanvasClick={() => store.setSelectedObstacle(null)}
                    onNodeClick={(id) => store.setSelectedObstacle(id)}
                    onNodeDragStart={(id) => setDraggingId(id)}
                />
            </main>
            <UnifiedSidebar />
        </div>
    );
}
