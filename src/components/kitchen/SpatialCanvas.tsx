'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { IKitchen, IObstacle, ObstacleType } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';
import ContextualToolbar from './ContextualToolbar';
import { PlusCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface SpatialCanvasProps {
    currentKitchen: IKitchen | null;
    currentWall?: any;
    renderableObstacles: any[];
    selectedObstacleId: string | null;
    activeTool: ObstacleType | null;
    onCanvasClick: () => void;
    onNodeClick: (id: string) => void;
    onNodeDragStart: (id: string) => void;
    onAddObstacle: (obstacle: IObstacle) => void;
    onToolUsed: () => void;
}

export default function SpatialCanvas({
                                          currentKitchen,
                                          currentWall,
                                          renderableObstacles,
                                          selectedObstacleId,
                                          activeTool,
                                          onCanvasClick,
                                          onNodeClick,
                                          onNodeDragStart,
                                          onAddObstacle,
                                          onToolUsed
                                      }: SpatialCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Viewport State
    const [scale, setScale] = useState(1); // Base scale to fit wall in container
    const [zoom, setZoom] = useState(1);   // User zoom level (1 = 100%)
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState<{ x: number, y: number } | null>(null);

    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
    const [currentPoint, setCurrentPoint] = useState<{ x: number, y: number } | null>(null);

    // Calculate base scale on resize
    useLayoutEffect(() => {
        const handleResize = () => {
            if (containerRef.current && currentWall) {
                const padding = 40;
                const availableWidth = containerRef.current.offsetWidth - (padding * 2);
                const wallWidth = currentWall.length;
                const newScale = Math.min(availableWidth / wallWidth, 1.5);
                setScale(newScale);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentWall]);

    // Helper to convert mouse coordinates to wall coordinates
    const getWallCoordinates = (e: React.MouseEvent) => {
        if (!containerRef.current || !currentWall) return { x: 0, y: 0 };

        const rect = containerRef.current.getBoundingClientRect();
        const totalScale = scale * zoom;
        
        // Calculate the center of the container
        const containerCenterX = rect.width / 2;
        const containerCenterY = rect.height / 2;

        // Calculate the dimensions of the scaled wall
        const scaledWallWidth = currentWall.length * totalScale;
        const scaledWallHeight = currentWall.height * totalScale;

        // Calculate the top-left corner of the wall in the container's coordinate space, including pan
        const wallLeft = containerCenterX - (scaledWallWidth / 2) + pan.x;
        const wallTop = containerCenterY - (scaledWallHeight / 2) + pan.y;

        // Calculate the mouse position relative to the wall's top-left corner
        const mouseXRelative = e.clientX - rect.left - wallLeft;
        const mouseYRelative = e.clientY - rect.top - wallTop;

        // Convert back to unscaled wall coordinates
        return {
            x: mouseXRelative / totalScale,
            y: mouseYRelative / totalScale
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Middle mouse button or Space key (simulated) for panning
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            setLastPanPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        if (!activeTool || !currentWall) return;
        
        e.preventDefault();
        const coords = getWallCoordinates(e);
        setIsDrawing(true);
        setStartPoint(coords);
        setCurrentPoint(coords);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning && lastPanPoint) {
            const dx = e.clientX - lastPanPoint.x;
            const dy = e.clientY - lastPanPoint.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastPanPoint({ x: e.clientX, y: e.clientY });
            return;
        }

        if (!isDrawing || !startPoint) return;
        
        const coords = getWallCoordinates(e);
        setCurrentPoint(coords);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isPanning) {
            setIsPanning(false);
            setLastPanPoint(null);
            return;
        }

        if (!isDrawing || !startPoint || !currentPoint || !activeTool || !currentWall) {
            setIsDrawing(false);
            setStartPoint(null);
            setCurrentPoint(null);
            return;
        }

        const width = Math.abs(currentPoint.x - startPoint.x);
        const height = Math.abs(currentPoint.y - startPoint.y);
        const x = Math.min(startPoint.x, currentPoint.x);
        const y = Math.min(startPoint.y, currentPoint.y);

        if (width > 5 && height > 5) {
            onAddObstacle({
                id: uuidv4(),
                type: activeTool,
                wallIndex: 0,
                position: { x, y, z: 0, width, height, depth: 20 }
            });
            onToolUsed();
        }

        setIsDrawing(false);
        setStartPoint(null);
        setCurrentPoint(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.min(Math.max(0.5, prev + delta), 3));
        } else {
            // Pan with wheel
            setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    };

    const showEmptyState = renderableObstacles.length === 0 && !isDrawing;

    const drawingDims = isDrawing && startPoint && currentPoint ? {
        width: Math.round(Math.abs(currentPoint.x - startPoint.x)),
        height: Math.round(Math.abs(currentPoint.y - startPoint.y)),
        x: Math.min(startPoint.x, currentPoint.x),
        y: Math.min(startPoint.y, currentPoint.y)
    } : null;

    return (
        <div
            ref={containerRef}
            onClick={onCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                setIsDrawing(false);
                setIsPanning(false);
                setStartPoint(null);
                setCurrentPoint(null);
            }}
            onWheel={handleWheel}
            className={`relative w-full h-full bg-background overflow-hidden border-t flex items-center justify-center bg-grid-pattern 
                ${isPanning ? 'cursor-grabbing' : activeTool ? 'cursor-crosshair' : 'cursor-default'}`}
        >
            {/* Contextual Toolbar */}
            {selectedObstacleId && (
                <ContextualToolbar 
                    selectedId={selectedObstacleId} 
                    onClose={onCanvasClick} 
                />
            )}

            <div
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale * zoom})`,
                    width: currentWall?.length || '100%',
                    height: currentWall?.height || '100%',
                    position: 'relative',
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                }}
            >
                {currentWall && (
                    <div
                        className="absolute border-2 border-dashed border-border bg-muted/20 pointer-events-none"
                        style={{ left: 0, top: 0, width: '100%', height: '100%' }}
                    >
                        <div className="absolute -top-6 left-0 text-xs font-mono text-muted-foreground uppercase">
                            {currentWall.label} ({currentWall.length} x {currentWall.height} cm)
                        </div>
                    </div>
                )}

                {/* Drawing Preview */}
                {drawingDims && (
                    <>
                        <div
                            className="absolute border-2 border-primary bg-primary/20 z-50"
                            style={{
                                left: drawingDims.x,
                                top: drawingDims.y,
                                width: drawingDims.width,
                                height: drawingDims.height,
                            }}
                        />
                        <div 
                            className="absolute z-[60] bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap"
                            style={{
                                left: drawingDims.x + drawingDims.width / 2,
                                top: drawingDims.y - 30,
                                transform: 'translateX(-50%) scale(1)' // Counter-scale tooltip if needed, but keeping simple for now
                            }}
                        >
                            {drawingDims.width}cm × {drawingDims.height}cm
                        </div>
                    </>
                )}

                <AnimatePresence>
                    {renderableObstacles.map((obs) => (
                        <SpatialNode
                            key={obs.id}
                            id={obs.id}
                            type={obs.type}
                            x={obs.position.x}
                            y={obs.position.y}
                            width={obs.position.width}
                            height={obs.position.height}
                            isSelected={selectedObstacleId === obs.id}
                            onDragStart={() => onNodeDragStart(obs.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (obs.id) onNodeClick(obs.id);
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {showEmptyState && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <PlusCircle size={48} className="mb-4" />
                    <p className="text-sm font-bold">Your canvas is ready!</p>
                    <p className="text-xs mt-2">Select a tool from the sidebar and draw on the wall.</p>
                    <p className="text-[10px] mt-4 opacity-50">Middle-click or Alt+Drag to pan • Ctrl+Scroll to zoom</p>
                </div>
            )}

            <SpatialControls 
                isOffline={!currentKitchen} 
                zoom={zoom}
                onZoomChange={setZoom}
                onResetView={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                }}
            />
        </div>
    );
}
