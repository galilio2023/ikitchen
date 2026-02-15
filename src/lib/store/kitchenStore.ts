import { createStore } from 'zustand';
import { IKitchen, IObstacle, IWall, ObstacleType } from '@/types/kitchen';
import { validateKitchenLayout, ValidationError } from '@/services/validationService';
import { temporal } from 'zundo';

export interface KitchenState {
    currentKitchen: IKitchen | null;
    currentProject: any | null;
    validationErrors: ValidationError[];
    activeWallIndex: number;
    selectedObstacleId: string | null;
    activeTool: ObstacleType | null; // New state for the active drawing tool
    
    // Actions
    setInitialState: (project: any, kitchen: IKitchen) => void;
    setKitchen: (kitchen: IKitchen) => void;
    addObstacle: (obstacle: IObstacle) => void;
    updateObstaclePosition: (id: string, x: number, y: number) => void;
    updateObstacleDetails: (id: string, updates: Partial<IObstacle['position']>) => void;
    deleteObstacle: (id: string) => void;
    setSelectedObstacle: (id: string | null) => void;
    setActiveWallIndex: (index: number) => void;
    setActiveTool: (tool: ObstacleType | null) => void; // Action to set the active tool
    
    // Wall Actions
    addWall: (wall: IWall) => void;
    updateWall: (index: number, updates: Partial<IWall>) => void;
    deleteWall: (index: number) => void;
}

export const createKitchenStore = (initialState: Partial<KitchenState> = {}) => {
  return createStore<KitchenState>()(
    temporal(
      (set, get) => ({
        currentKitchen: null,
        currentProject: null,
        validationErrors: [],
        activeWallIndex: 0,
        selectedObstacleId: null,
        activeTool: null,
        ...initialState,

        setInitialState: (project, kitchen) => {
            set({ 
                currentProject: project, 
                currentKitchen: kitchen,
                validationErrors: validateKitchenLayout(kitchen),
            });
        },

        setKitchen: (kitchen) => {
            set({
                currentKitchen: kitchen,
                validationErrors: validateKitchenLayout(kitchen),
            });
        },

        addObstacle: (obstacle) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    obstacles: [...(state.currentKitchen.obstacles || []), obstacle],
                };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        updateObstaclePosition: (id, x, y) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newObstacles = (state.currentKitchen.obstacles || []).map(obs => 
                    obs.id === id ? { ...obs, position: { ...obs.position, x, y } } : obs
                );
                const newKitchen = { ...state.currentKitchen, obstacles: newObstacles };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        updateObstacleDetails: (id, updates) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newObstacles = (state.currentKitchen.obstacles || []).map(obs => 
                    obs.id === id ? { ...obs, position: { ...obs.position, ...updates } } : obs
                );
                const newKitchen = { ...state.currentKitchen, obstacles: newObstacles };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        deleteObstacle: (id) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newObstacles = (state.currentKitchen.obstacles || []).filter(obs => obs.id !== id);
                const newKitchen = { ...state.currentKitchen, obstacles: newObstacles };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        setSelectedObstacle: (id) => set({ selectedObstacleId: id }),
        setActiveWallIndex: (index) => set({ activeWallIndex: index }),
        setActiveTool: (tool) => set({ activeTool: tool }),

        // Wall Actions Implementation
        addWall: (wall) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    walls: [...(state.currentKitchen.walls || []), wall],
                };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        updateWall: (index, updates) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newWalls = [...(state.currentKitchen.walls || [])];
                if (index >= 0 && index < newWalls.length) {
                    newWalls[index] = { ...newWalls[index], ...updates };
                }
                const newKitchen = { ...state.currentKitchen, walls: newWalls };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        deleteWall: (index) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newWalls = (state.currentKitchen.walls || []).filter((_, i) => i !== index);
                
                // Adjust activeWallIndex if necessary
                let newActiveIndex = state.activeWallIndex;
                if (newActiveIndex >= newWalls.length) {
                    newActiveIndex = Math.max(0, newWalls.length - 1);
                }

                const newKitchen = { ...state.currentKitchen, walls: newWalls };
                return {
                    currentKitchen: newKitchen,
                    activeWallIndex: newActiveIndex,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },
      }),
      {
        limit: 100, // Limit history to 100 steps
        partialize: (state) => ({
            currentKitchen: state.currentKitchen, // Only track changes to the kitchen data
        }),
        equality: (a, b) => JSON.stringify(a) === JSON.stringify(b), // Deep comparison
      }
    )
  );
}

// Selectors
export const selectRenderableNodes = (state: KitchenState) => {
    if (!state.currentKitchen) return [];
    const obstacles = (state.currentKitchen.obstacles ?? []).map((obs, index) => ({
        ...obs, 
        isAppliance: false, 
        id: obs.id || `obs-${index}`
    }));
    const appliances = (state.currentKitchen.appliances ?? []).map((app, index) => ({
        ...app, 
        type: 'appliance' as const, 
        isAppliance: true, 
        id: app.id || `app-${index}`
    }));
    return [...obstacles, ...appliances];
};
