'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { IKitchen } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';
import { motion } from 'framer-motion';

interface SpatialCanvasProps {
    currentKitchen: IKitchen | null;
    currentWall?: any;
    renderableObstacles: any[];
    selectedObstacleId: string | null;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onCanvasClick: () => void;
    onNodeClick: (id: string) => void;
    onNodeDragStart: (id: string) => void;
}

export default function SpatialCanvas({
                                          currentKitchen,
                                          currentWall,
                                          renderableObstacles,
                                          selectedObstacleId,
                                          onDrop,
                                          onDragOver,
                                          onCanvasClick,
                                          onNodeClick,
                                          onNodeDragStart
                                      }: SpatialCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // DYNAMIC SCALING LOGIC: Ensures the wall fits any screen width
    useLayoutEffect(() => {
        const handleResize = () => {
            if (containerRef.current && currentWall) {
                const padding = 40; // Desktop padding
                const mobilePadding = 20;
                const activePadding = window.innerWidth < 768 ? mobilePadding : padding;

                const availableWidth = containerRef.current.offsetWidth - (activePadding * 2);
                const wallWidth = currentWall.length;
                const newScale = Math.min(availableWidth / wallWidth, 1.5); // Max scale 1.5x
                setScale(newScale);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentWall]);

    return (
        <div
            ref={containerRef}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onCanvasClick}
            className="relative w-full h-full bg-transparent overflow-hidden cursor-crosshair border border-border shadow-inner flex items-center justify-center"
            style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}
        >
            {/* SCALABLE WRAPPER: Keeps all coordinates connected regardless of screen size */}
            <motion.div
                animate={{ scale }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    width: currentWall?.length || '100%',
                    height: currentWall?.height || '100%',
                    position: 'relative'
                }}
            >
                {/* Wall Boundary */}
                {currentWall && (
                    <div
                        className="absolute border-2 border-primary/20 bg-primary/5 pointer-events-none"
                        style={{
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <div className="absolute -top-6 left-0 text-[8px] font-mono text-primary/40 uppercase tracking-widest">
                            {currentWall.label} :: {currentWall.length}x{currentWall.height} CM
                        </div>
                    </div>
                )}

                {/* Render Hardware Nodes */}
                {renderableObstacles.map((obs) => (
                    <SpatialNode
                        key={obs.renderKey}
                        id={obs.id}
                        type={obs.type}
                        x={obs.position.x}
                        y={obs.position.y}
                        isSelected={selectedObstacleId === obs.id}
                        onDragStart={() => onNodeDragStart(obs.id)}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (obs.id) onNodeClick(obs.id);
                        }}
                    />
                ))}
            </motion.div>

            {/* Offline Guard */}
            <SpatialControls isOffline={!currentKitchen} />
        </div>
    );
}