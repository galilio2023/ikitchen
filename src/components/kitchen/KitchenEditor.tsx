'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { updateKitchen } from '@/actions/projectActions';
import { toast } from 'sonner';
import { DEFAULT_OBSTACLE_DIMENSIONS } from '@/lib/constants';
import { ObstacleType } from '@/types/kitchen';

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

    const currentWall = useMemo(() => {
        if (!store.currentKitchen || !store.currentKitchen.walls) return null;
        return store.currentKitchen.walls[store.activeWallIndex] || null;
    }, [store.currentKitchen, store.activeWallIndex]);

    const renderableNodes = useMemo(() => {
        if (!store.currentKitchen) return [];
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
        // CORRECTED: Cast to the specific ObstacleType, not 'any'
        const typeString = e.dataTransfer.getData("obstacleType") as ObstacleType;
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
            <div className="absolute top-4 right-4 z-10">
                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary gap-2">
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
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
