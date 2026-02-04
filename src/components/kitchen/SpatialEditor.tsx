'use client';

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addObstacle, setSelectedObstacle, updateObstaclePosition } from '@/lib/features/kitchens/kitchenSlice';
import { ObstacleType } from "@/types/kitchen";
import SpatialCanvas from './SpatialCanvas';
import SpatialRegistry from './SpatialRegistry';
import SpatialInspector from './SpatialInspector';
import ObstacleToolbox from './ObstacleToolbox';
import WallManager from './WallManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Hammer } from 'lucide-react';
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';

export default function SpatialEditor() {
    const dispatch = useAppDispatch();
    const { currentKitchen, selectedObstacleId, activeWallIndex } = useAppSelector((state) => state.kitchen);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [mobileTab, setMobileTab] = useState<'nodes' | 'tools' | 'none'>('none');

    const GRID_SIZE = 20;
    const currentWall = useMemo(() => currentKitchen?.walls[activeWallIndex] || null, [currentKitchen?.walls, activeWallIndex]);

    const renderableNodes = useMemo(() => {
        const obstacles = (currentKitchen?.obstacles ?? []).filter(obs => obs.wallIndex === activeWallIndex).map((obs, index) => ({
            ...obs, isAppliance: false, id: obs.id || obs._id?.toString() || `obs-${index}`,
            renderKey: obs._id?.toString() || obs.id || `obs-${index}-${obs.position.x}`
        }));
        interface ApplianceWithId {
            _id?: { toString: () => string };
            id?: string;
            [key: string]: unknown;
        }

        const appliances = (currentKitchen?.appliances ?? []).filter(app => app.wallIndex === activeWallIndex).map((app, index) => {
            const appWithId = app as unknown as ApplianceWithId;
            return {
                ...app,
                type: 'appliance' as const,
                isAppliance: true,
                id: appWithId._id?.toString() || appWithId.id || `app-${index}`,
                renderKey: appWithId._id?.toString() || appWithId.id || `app-${index}-${app.position.x}`
            };
        });
        return [...obstacles, ...appliances];
    }, [currentKitchen?.obstacles, currentKitchen?.appliances, activeWallIndex]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType");
        const container = e.currentTarget as HTMLDivElement;

        // Safety check for Wall and Container
        if (!container || !currentWall) return;

        // 1. Re-calculate scale and offset (Must match SpatialCanvas logic)
        const padding = window.innerWidth < 1024 ? 20 : 40;
        const availableWidth = container.offsetWidth - (padding * 2);
        const scale = Math.min(availableWidth / currentWall.length, 1.5);

        const scaledWidth = currentWall.length * scale;
        const scaledHeight = currentWall.height * scale;
        const offsetX = (container.offsetWidth - scaledWidth) / 2;
        const offsetY = (container.offsetHeight - scaledHeight) / 2;

        const rect = container.getBoundingClientRect();

        // 2. Get relative mouse position
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;

        // 3. Translate screen pixels back to architectural CM
        const unscaledX = (dropX - offsetX) / scale;
        const unscaledY = (dropY - offsetY) / scale;

        // 4. Snap to grid
        const x = Math.round(unscaledX / GRID_SIZE) * GRID_SIZE;
        const y = Math.round(unscaledY / GRID_SIZE) * GRID_SIZE;

        if (typeString) {
            const type = typeString as ObstacleType;
            dispatch(addObstacle({
                id: uuidv4(),
                type,
                wallIndex: activeWallIndex,
                position: {
                    x,
                    y,
                    z: 0,
                    width: 60,
                    height: 60,
                    depth: 20
                }
            }));
        } else if (draggingId) {
            dispatch(updateObstaclePosition({
                id: draggingId,
                x,
                y
            }));
            setDraggingId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-background text-foreground overflow-hidden">

            {/* MOBILE TOP BAR (Wall Switcher) */}
            <div className="lg:hidden flex-none p-4 border-b border-border bg-background/50 backdrop-blur-md">
                <WallManager />
            </div>

            {/* LEFT PANEL: Desktop Fixed / Mobile Hidden */}
            <aside className="hidden lg:flex w-64 flex-none flex-col border-r border-border bg-background/5 backdrop-blur-xl overflow-hidden">
                <div className="flex-none p-4 border-b border-border">
                    <WallManager />
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <SpatialRegistry nodes={renderableNodes} selectedId={selectedObstacleId} onSelect={(id) => dispatch(setSelectedObstacle(id))} />
                </div>
                <div className="flex-1 border-t border-border overflow-y-auto p-4 custom-scrollbar">
                    <ObstacleToolbox wallIndex={activeWallIndex} />
                </div>
            </aside>

            {/* CENTER PANEL: THE CANVAS */}
            <main className="flex-1 relative min-w-0 h-full">
                <SpatialCanvas
                    currentKitchen={currentKitchen}
                    currentWall={currentWall}
                    renderableObstacles={renderableNodes}
                    selectedObstacleId={selectedObstacleId}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onCanvasClick={() => { dispatch(setSelectedObstacle(null)); setMobileTab('none'); }}
                    onNodeClick={(id) => dispatch(setSelectedObstacle(id))}
                    onNodeDragStart={(id) => setDraggingId(id)}
                />

                {/* MOBILE FLOATING ACTIONS */}
                <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
                    <button
                        onClick={() => setMobileTab(mobileTab === 'nodes' ? 'none' : 'nodes')}
                        className={cn("p-4 rounded-full border shadow-2xl backdrop-blur-xl transition-all", mobileTab === 'nodes' ? "bg-primary text-primary-foreground" : "bg-card/80 text-primary border-primary/20")}
                    >
                        <Layers size={20} />
                    </button>
                    <button
                        onClick={() => setMobileTab(mobileTab === 'tools' ? 'none' : 'tools')}
                        className={cn("p-4 rounded-full border shadow-2xl backdrop-blur-xl transition-all", mobileTab === 'tools' ? "bg-primary text-primary-foreground" : "bg-card/80 text-primary border-primary/20")}
                    >
                        <Hammer size={20} />
                    </button>
                </div>
            </main>

            {/* MOBILE OVERLAYS */}
            <AnimatePresence>
                {mobileTab !== 'none' && (
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        className="lg:hidden fixed inset-x-0 bottom-0 z-50 h-[50vh] bg-popover/95 backdrop-blur-2xl border-t border-border p-6 rounded-t-[3rem] shadow-2xl overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-6" />
                        {mobileTab === 'nodes' ? (
                            <SpatialRegistry nodes={renderableNodes} selectedId={selectedObstacleId} onSelect={(id) => { dispatch(setSelectedObstacle(id)); setMobileTab('none'); }} />
                        ) : (
                            <ObstacleToolbox wallIndex={activeWallIndex} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RIGHT PANEL: Inspector (Handles mobile visibility internally) */}
            <div className={cn("flex-none", selectedObstacleId ? "block" : "hidden lg:block")}>
                <SpatialInspector
                    selectedNode={renderableNodes.find(n => n.id === selectedObstacleId) || null}
                    currentKitchen={currentKitchen}
                    onVisualize={() => setIsRendering(true)}
                    isRendering={isRendering}
                />
            </div>
        </div>
    );
}
