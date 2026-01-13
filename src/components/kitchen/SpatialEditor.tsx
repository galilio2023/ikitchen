'use client';

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    addObstacle,
    setSelectedObstacle,
    updateObstaclePosition
} from '@/lib/features/kitchens/kitchenSlice';
import { ObstacleType } from "@/types/kitchen";
import SpatialCanvas from './SpatialCanvas';
import SpatialRegistry from './SpatialRegistry';
import SpatialInspector from './SpatialInspector';
import ObstacleToolbox from './ObstacleToolbox';
import WallManager from './WallManager';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export default function SpatialEditor() {
    const dispatch = useAppDispatch();

    // SELECTOR: Use the unified kitchen state
    const { currentKitchen, selectedObstacleId, activeWallIndex } = useAppSelector((state) => state.kitchen);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [neuralPreview, setNeuralPreview] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);

    const GRID_SIZE = 20;

    const currentWall = useMemo(() => {
        return currentKitchen?.walls[activeWallIndex] || null;
    }, [currentKitchen?.walls, activeWallIndex]);

    const handleVisualize = async () => {
        setIsRendering(true);
        try {
            const res = await fetch('/api/generate/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kitchenData: currentKitchen })
            });
            const data = await res.json();
            if (data.imageUrl) {
                setNeuralPreview(data.imageUrl);
            }
        } catch (error) {
            console.error("NEURAL_VISUALIZATION_FAILURE", error);
        } finally {
            setIsRendering(false);
        }
    };

    // Find the selected node for the inspector
    const selectedNode = useMemo(() => {
        const obs = currentKitchen?.obstacles.find(o => (o._id?.toString() || o.id) === selectedObstacleId);
        if (obs) return { ...obs, isAppliance: false };
        
        const app = currentKitchen?.appliances.find(a => ((a as any)._id?.toString() || (a as any).id) === selectedObstacleId);
        if (app) return { 
            ...app, 
            id: (app as any)._id?.toString() || (app as any).id,
            type: (app as any).name || 'appliance', 
            isAppliance: true 
        };

        return null;
    }, [currentKitchen?.obstacles, currentKitchen?.appliances, selectedObstacleId]);

    // OPTIMIZED: Memoize the obstacles list to stabilize the rendering loop
    const renderableNodes = useMemo(() => {
        const obstacles = (currentKitchen?.obstacles ?? [])
            .filter(obs => obs.wallIndex === activeWallIndex)
            .map((obs, index) => ({
                ...obs,
                isAppliance: false,
                id: obs.id || obs._id?.toString() || `spatial-obs-${index}`,
                renderKey: obs._id?.toString() || obs.id || `spatial-obs-${index}-${obs.position.x}-${obs.position.y}`
            }));

        const appliances = (currentKitchen?.appliances ?? [])
            .filter(app => app.wallIndex === activeWallIndex)
            .map((app, index) => ({
                ...app,
                type: 'appliance' as any,
                isAppliance: true,
                id: (app as any)._id?.toString() || (app as any).id || `spatial-app-${index}`,
                renderKey: (app as any)._id?.toString() || (app as any).id || `spatial-app-${index}-${app.position.x}-${app.position.y}`
            }));

        return [...obstacles, ...appliances];
    }, [currentKitchen?.obstacles, currentKitchen?.appliances, activeWallIndex]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType");
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Calculate snapped coordinates
        const x = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
        const y = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

        if (typeString) {
            const type = typeString as ObstacleType;
            dispatch(addObstacle({
                type,
                wallIndex: activeWallIndex,
                x,
                y
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
        <div className="flex h-full w-full bg-transparent overflow-hidden">
            {/* Left Panel: Registry & Toolbox */}
            <div className="w-48 lg:w-64 flex-none flex flex-col border-r border-border bg-accent/5 backdrop-blur-xl overflow-hidden">
                <div className="flex-none p-4 border-b border-border">
                    <WallManager />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <SpatialRegistry 
                        nodes={renderableNodes}
                        selectedId={selectedObstacleId}
                        onSelect={(id) => dispatch(setSelectedObstacle(id))}
                    />
                </div>
                <div className="flex-1 border-t border-border overflow-y-auto p-4">
                    <ObstacleToolbox wallIndex={activeWallIndex} />
                </div>
            </div>

            {/* Center Panel: Canvas */}
            <div className="flex-1 relative min-w-0">
                <SpatialCanvas 
                    currentKitchen={currentKitchen}
                    currentWall={currentWall}
                    renderableObstacles={renderableNodes}
                    selectedObstacleId={selectedObstacleId}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onCanvasClick={() => dispatch(setSelectedObstacle(null))}
                    onNodeClick={(id) => dispatch(setSelectedObstacle(id))}
                    onNodeDragStart={(id) => setDraggingId(id)}
                />
            </div>

            {/* Right Panel: Inspector */}
            <SpatialInspector 
                selectedNode={selectedNode} 
                currentKitchen={currentKitchen}
                onVisualize={handleVisualize}
                isRendering={isRendering}
            />

            {/* Neural Preview Modal */}
            <AnimatePresence>
                {neuralPreview && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setNeuralPreview(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl glass-brilliant rounded-[3rem] overflow-hidden border border-border shadow-2xl"
                        >
                            <div className="p-8 border-b border-border flex items-center justify-between bg-accent/5">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-magic-cyan animate-pulse" size={18} />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/80">Neural_Preview::3D_Materialization</h2>
                                </div>
                                <button 
                                    onClick={() => setNeuralPreview(null)}
                                    className="p-2 rounded-xl hover:bg-accent text-foreground/20 hover:text-foreground transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-8 aspect-video relative">
                                <img 
                                    src={neuralPreview} 
                                    alt="Neural Preview" 
                                    className="w-full h-full object-cover rounded-2xl border border-border"
                                />
                                <div className="absolute bottom-12 left-12 px-4 py-2 bg-background/60 backdrop-blur-md rounded-full border border-border">
                                    <p className="text-[8px] font-mono text-magic-cyan uppercase tracking-widest">Gemini_Nano_Banana_Engine::High_Fidelity_Render</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}