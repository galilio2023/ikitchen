import { ObstacleType } from "@/types/kitchen";

export const DEFAULT_OBSTACLE_DIMENSIONS: { [key in ObstacleType]: { width: number; height: number; depth: number } } = {
    window: { width: 120, height: 100, depth: 20 },
    door: { width: 90, height: 210, depth: 20 },
    socket: { width: 10, height: 10, depth: 5 },
    vent: { width: 30, height: 30, depth: 10 },
    pipe: { width: 10, height: 240, depth: 10 },
    pillar: { width: 40, height: 240, depth: 40 },
    radiator: { width: 100, height: 60, depth: 15 },
    clearance: { width: 60, height: 60, depth: 60 },
};
