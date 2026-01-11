'use client';

import { motion } from 'framer-motion';
import { IObstacle, IWall, ObstacleType } from '@/types';
import { useAppDispatch } from '@/lib/hooks';
import { updateObstaclePosition } from '@/lib/features/kitchens/kitchenSlice';

export default function DraggableObstacle({
                                              obstacle,
                                              obstacleIndex,
                                              wall,
                                              isSelected
                                          }: {
    obstacle: IObstacle;
    obstacleIndex: number;
    wall: IWall;
    isSelected: boolean;
}) {
    const dispatch = useAppDispatch();

    // 1. CONVERT CM TO PERCENTAGE FOR DISPLAY
    // If x = 120cm and wall = 240cm, left = 50%
    const leftPercent = (obstacle.position.x / wall.length) * 100;
    const bottomPercent = (obstacle.position.y / wall.height) * 100;
    const widthPercent = (obstacle.position.width / wall.length) * 100;
    const heightPercent = (obstacle.position.height / wall.height) * 100;

    const getTheme = (type: ObstacleType) => {
        const themes: Record<ObstacleType, string> = {
            pipe: 'bg-cyan-400/20 border-cyan-400',
            pillar: 'bg-emerald-400/20 border-emerald-400',
            window: 'bg-blue-400/20 border-blue-400',
            door: 'bg-orange-400/20 border-orange-400',
            socket: 'bg-yellow-400/20 border-yellow-400',
            radiator: 'bg-red-400/20 border-red-400',
            clearance: 'bg-purple-400/20 border-purple-400',
        };
        return themes[type] || 'bg-white/10 border-white/20';
    };

    const handleDragEnd = (event: any, info: any) => {
        const wallElement = document.getElementById(`wall-panel-0`)?.querySelector('.wall-surface');
        if (!wallElement) return;

        const wallRect = wallElement.getBoundingClientRect();

        // 2. CONVERT PIXELS BACK TO CM FOR STORAGE
        const relativeX = info.point.x - wallRect.left;
        const relativeY = wallRect.bottom - info.point.y;

        // Calculate CM: (pixels / totalPixels) * totalCM
        const newX = (relativeX / wallRect.width) * wall.length;
        const newY = (relativeY / wallRect.height) * wall.height;

        dispatch(updateObstaclePosition({
            obstacleIndex: obstacleIndex,
            // Clamping the values so they stay on the wall
            x: Math.max(0, Math.min(newX, wall.length - obstacle.position.width)),
            y: Math.max(0, Math.min(newY, wall.height - obstacle.position.height))
        }));
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                bottom: `${bottomPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                zIndex: isSelected ? 50 : 30,
            }}
            className={`cursor-grab active:cursor-grabbing touch-none ${
                isSelected ? 'ring-2 ring-magic-purple shadow-2xl' : ''
            }`}
        >
            <div className={`w-full h-full border-2 rounded-sm flex items-center justify-center transition-colors ${getTheme(obstacle.type)}`}>
                <div className="flex flex-col items-center select-none">
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                        {obstacle.type}
                    </span>
                    <span className="text-[6px] font-mono text-white/50">
                        {Math.round(obstacle.position.x)}cm
                    </span>
                </div>
            </div>
        </motion.div>
    );
}