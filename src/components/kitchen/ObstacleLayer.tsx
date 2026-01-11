'use client';

import { IObstacle, IWall } from '@/types';

interface Props {
    obstacles: IObstacle[];
    wallIndex: number;
    wall: IWall;
}

export default function ObstacleLayer({ obstacles, wallIndex, wall }: Props) {
    // Filter obstacles that belong to this specific wall
    const wallObstacles = obstacles.filter(obs => obs.wallIndex === wallIndex);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {wallObstacles.map((obs, i) => {
                const { x, y, width, height } = obs.position;

                // Calculate percentage-based positioning
                const left = (x / wall.length) * 100;
                const bottom = (y / wall.height) * 100; // y=0 is floor
                const wPct = (width / wall.length) * 100;
                const hPct = (height / wall.height) * 100;

                return (
                    <div
                        key={i}
                        className="absolute border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center overflow-hidden"
                        style={{
                            left: `${left}%`,
                            bottom: `${bottom}%`,
                            width: `${wPct}%`,
                            height: `${hPct}%`,
                        }}
                    >
                        <span className="text-[7px] font-black uppercase text-cyan-400 rotate-90 md:rotate-0">
                            {obs.type}
                        </span>

                        {/* Technical Glow for the "Voyager" look */}
                        <div className="absolute inset-0 bg-cyan-400/5 animate-pulse" />
                    </div>
                );
            })}
        </div>
    );
}