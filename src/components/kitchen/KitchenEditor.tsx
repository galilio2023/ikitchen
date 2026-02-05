'use client';

import React, { useMemo, useState } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';

import SpatialCanvas from "@/components/kitchen/SpatialCanvas";
import UnifiedSidebar from "@/components/kitchen/UnifiedSidebar";

export default function KitchenEditor() {
    const { 
        currentKitchen, 
        activeWallIndex, 
        selectedObstacleId,
        addObstacle, 
        updateObstaclePosition,
        setSelectedObstacle 
    } = useKitchenStore(state => state);

    const [draggingId, setDraggingId] = useState<string | null>(null);

    const currentWall = useMemo(() => currentKitchen?.walls[activeWallIndex] || null, [currentKitchen?.walls, activeWallIndex]);

    const renderableNodes = useMemo(() => {
        const obstacles = (currentKitchen?.obstacles ?? []).map((obs, index) => ({
            ...obs, isAppliance: false, id: obs.id || (obs as any)._id?.toString() || `obs-${index}`
        }));
        const appliances = (currentKitchen?.appliances ?? []).map((app, index) => ({
            ...app, type: 'appliance' as const, isAppliance: true, id: (app as any)._id?.toString() || (app as any).id || `app-${index}`
        }));
        return [...obstacles, ...appliances];
    }, [currentKitchen]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType");
        const container = e.currentTarget as HTMLDivElement;

        if (!container || !currentWall) return;

        const padding = 40;
        const availableWidth = container.offsetWidth - (padding * 2);
        const scale = Math.min(availableWidth / currentWall.length, 1.5);
        const scaledWidth = currentWall.length * scale;
        const scaledHeight = currentWall.height * scale;
        const offsetX = (container.offsetWidth - scaledWidth) / 2;
        const offsetY = (container.offsetHeight - scaledHeight) / 2;
        const rect = container.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        const unscaledX = (dropX - offsetX) / scale;
        const unscaledY = (dropY - offsetY) / scale;
        const GRID_SIZE = 1;
        const x = Math.round(unscaledX / GRID_SIZE) * GRID_SIZE;
        const y = Math.round(unscaledY / GRID_SIZE) * GRID_SIZE;

        if (typeString) {
            addObstacle({
                id: uuidv4(),
                type: typeString as any,
                wallIndex: activeWallIndex,
                position: { x, y, z: 0, width: 60, height: 60, depth: 20 }
            });
        } else if (draggingId) {
            updateObstaclePosition(draggingId, x, y);
            setDraggingId(null);
        }
    };

    if (!currentKitchen) {
        return <div className="flex items-center justify-center h-full">Loading Editor...</div>;
    }

    return (
        <div className="flex-1 flex lg:flex-row gap-0 min-h-0 overflow-hidden">
            <main className="flex-1 relative min-w-0 h-full">
                <SpatialCanvas
                    currentKitchen={currentKitchen}
                    currentWall={currentWall}
                    renderableObstacles={renderableNodes}
                    selectedObstacleId={selectedObstacleId}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onCanvasClick={() => setSelectedObstacle(null)}
                    onNodeClick={(id) => setSelectedObstacle(id)}
                    onNodeDragStart={(id) => setDraggingId(id)}
                />
            </main>
            <UnifiedSidebar />
        </div>
    );
}
