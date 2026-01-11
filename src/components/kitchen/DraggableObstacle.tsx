'use client';

import { motion } from 'framer-motion';
import { IObstacle, IWall } from '@/types/kitchen';
import { useAppDispatch } from '@/lib/hooks';
import { moveObstacle } from '@/lib/features/projects/projectSlice';

interface Props {
    obstacle: IObstacle;
    obstacleIndex: number;
    wall: IWall;
    isSelected: boolean;
}

export default function DraggableObstacle({
                                              obstacle,
                                              wall,
                                              isSelected
                                          }: Props) {
    const dispatch = useAppDispatch();

    // 1. Local Percentage Calculation
    // We calculate position as a percentage of the wall length (cm)
    const leftPercent = (obstacle.position.x / wall.length) * 100;
    // For Y, we assume height is standard (e.g., 240cm)
    const topPercent = (1 - (obstacle.position.y / 240)) * 100;

    const handleDragEnd = (event: any, info: any) => {
        // Here you would convert the pixel offset back to CM
        // and dispatch(moveObstacle({ id: obstacle.id, x: newX, y: newY }))
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            // Use percentages for responsive placement on the wall surface
            style={{
                left: `${leftPercent}%`,
                top: `${obstacle.position.y}px`, // Or use a Y mapping
                position: 'absolute'
            }}
            className={`
                w-10 h-10 -ml-5 -mt-5 rounded-xl border-2 flex items-center justify-center transition-colors z-50 cursor-grab active:cursor-grabbing
                ${isSelected
                ? 'bg-magic-purple border-white shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                : 'bg-cyan-500 border-white/50 shadow-lg'}
            `}
        >
            <span className="text-[10px] font-black text-white uppercase italic">
                {obstacle.type.substring(0, 2)}
            </span>

            {/* Visual indicator of the "anchor" point */}
            <div className="absolute -bottom-6 bg-black/80 px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[7px] font-mono text-magic-cyan">{obstacle.position.x}cm</span>
            </div>
        </motion.div>
    );
}