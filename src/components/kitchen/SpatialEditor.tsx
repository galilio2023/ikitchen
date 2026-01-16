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
import { X, Sparkles, Layers, Hammer } from 'lucide-react';
import {cn} from "@/lib/utils";

export default function SpatialEditor() {
    const dispatch = useAppDispatch();
    const { currentKitchen, selectedObstacleId, activeWallIndex } = useAppSelector((state) => state.kitchen);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [neuralPreview, setNeuralPreview] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [mobileTab, setMobileTab] = useState<'nodes' | 'tools' | 'none'>('none');

    const GRID_SIZE = 20;
    const currentWall = useMemo(() => currentKitchen?.walls[activeWallIndex] || null, [currentKitchen?.walls, activeWallIndex]);

    // Same memoized logic as before...
    const renderableNodes = useMemo(() => {
        const obstacles = (currentKitchen?.obstacles ?? []).filter(obs => obs.wallIndex === activeWallIndex).map((obs, index) => ({
            ...obs, isAppliance: false, id: obs.id || obs._id?.toString() || `obs-${index}`,
            renderKey: obs._id?.toString() || obs.id || `obs-${index}-${obs.position.x}`
        }));
        const appliances = (currentKitchen?.appliances ?? []).filter(app => app.wallIndex === activeWallIndex).map((app, index) => ({
            ...app, type: 'appliance' as any, isAppliance: true, id: (app as any)._id?.toString() || (app as any).id || `app-${index}`,
            renderKey: (app as any)._id?.toString() || (app as any).id || `app-${index}-${app.position.x}`
        }));
        return [...obstacles, ...appliances];
    }, [currentKitchen?.obstacles, currentKitchen?.appliances, activeWallIndex]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType");
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
        const y = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

        if (typeString) {
            dispatch(addObstacle({ type: typeString as ObstacleType, wallIndex: activeWallIndex, x, y }));
        } else if (draggingId) {
            dispatch(updateObstaclePosition({ id: draggingId, x, y }));
            setDraggingId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-transparent overflow-hidden">

            {/* MOBILE TOP BAR (Wall Switcher) */}
            <div className="lg:hidden flex-none p-4 border-b border-border bg-background/50 backdrop-blur-md">
                <WallManager />
            </div>

            {/* LEFT PANEL: Desktop Fixed / Mobile Hidden */}
            <aside className="hidden lg:flex w-64 flex-none flex-col border-r border-border bg-accent/5 backdrop-blur-xl overflow-hidden">
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
                        className={cn("p-4 rounded-full border shadow-2xl backdrop-blur-xl transition-all", mobileTab === 'nodes' ? "bg-magic-cyan text-black" : "bg-black/80 text-magic-cyan border-magic-cyan/20")}
                    >
                        <Layers size={20} />
                    </button>
                    <button
                        onClick={() => setMobileTab(mobileTab === 'tools' ? 'none' : 'tools')}
                        className={cn("p-4 rounded-full border shadow-2xl backdrop-blur-xl transition-all", mobileTab === 'tools' ? "bg-magic-purple text-white" : "bg-black/80 text-magic-purple border-magic-purple/20")}
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
                        className="lg:hidden fixed inset-x-0 bottom-0 z-50 h-[50vh] bg-background/95 backdrop-blur-2xl border-t border-border p-6 rounded-t-[3rem] shadow-2xl overflow-y-auto"
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
                    selectedNode={renderableNodes.find(n => n.id === selectedObstacleId) as any}
                    currentKitchen={currentKitchen}
                    onVisualize={() => setIsRendering(true)}
                    isRendering={isRendering}
                />
            </div>
        </div>
    );
}