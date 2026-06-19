import { createStore } from 'zustand';
import { IKitchen, IObstacle, IWall, ObstacleType, IAppliance } from '@/types/kitchen';
import { validateKitchenLayout, ValidationError } from '@/services/validationService';
import { temporal } from 'zundo';

export interface KitchenState {
    currentKitchen: IKitchen | null;
    currentProject: any | null;
    validationErrors: ValidationError[];
    activeWallIndex: number;
    selectedObstacleId: string | null;
    activeTool: ObstacleType | null;
    
    // Actions
    setInitialState: (project: any, kitchen: IKitchen) => void;
    setKitchen: (kitchen: IKitchen) => void;
    addObstacle: (obstacle: IObstacle) => void;
    addAppliance: (appliance: IAppliance) => void; // Added
    updateObstaclePosition: (id: string, x: number, y: number) => void;
    updateObstacleDetails: (id: string, updates: Partial<IObstacle['position']>) => void;
    deleteObstacle: (id: string) => void;
    setSelectedObstacle: (id: string | null) => void;
    setActiveWallIndex: (index: number) => void;
    setActiveTool: (tool: ObstacleType | null) => void;
    
    // Regional & Spec Actions
    updateLayoutShape: (shape: 'I' | 'L' | 'U' | 'Parallel' | 'Island') => void;
    updateKitchenRole: (role: 'show' | 'wet' | 'standard') => void;
    updateRegion: (region: 'Egypt' | 'Gulf') => void;
    updateCabinetMaterial: (material: string) => void;
    updateCountertopMaterial: (material: string) => void;
    updateHardwareTier: (tier: string) => void;
    
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

        addAppliance: (appliance) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    appliances: [...(state.currentKitchen.appliances || []), appliance],
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
                
                // Try to update obstacle first
                let found = false;
                let newObstacles = (state.currentKitchen.obstacles || []).map(obs => {
                    if (obs.id === id) {
                        found = true;
                        return { ...obs, position: { ...obs.position, x, y } };
                    }
                    return obs;
                });

                // If not found in obstacles, try appliances
                let newAppliances = state.currentKitchen.appliances || [];
                if (!found) {
                    newAppliances = newAppliances.map(app => {
                        if (app.id === id) {
                            return { ...app, position: { ...app.position, x, y } };
                        }
                        return app;
                    });
                }

                const newKitchen = { 
                    ...state.currentKitchen, 
                    obstacles: newObstacles,
                    appliances: newAppliances
                };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        updateObstacleDetails: (id, updates) => {
            set(state => {
                if (!state.currentKitchen) return {};
                
                let found = false;
                let newObstacles = (state.currentKitchen.obstacles || []).map(obs => {
                    if (obs.id === id) {
                        found = true;
                        return { ...obs, position: { ...obs.position, ...updates } };
                    }
                    return obs;
                });

                let newAppliances = state.currentKitchen.appliances || [];
                if (!found) {
                    newAppliances = newAppliances.map(app => {
                        if (app.id === id) {
                            return { ...app, position: { ...app.position, ...updates } };
                        }
                        return app;
                    });
                }

                const newKitchen = { 
                    ...state.currentKitchen, 
                    obstacles: newObstacles,
                    appliances: newAppliances
                };
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
                const newAppliances = (state.currentKitchen.appliances || []).filter(app => app.id !== id);
                
                const newKitchen = { 
                    ...state.currentKitchen, 
                    obstacles: newObstacles,
                    appliances: newAppliances
                };
                return {
                    currentKitchen: newKitchen,
                    validationErrors: validateKitchenLayout(newKitchen),
                };
            });
        },

        setSelectedObstacle: (id) => set({ selectedObstacleId: id }),
        setActiveWallIndex: (index) => set({ activeWallIndex: index }),
        setActiveTool: (tool) => set({ activeTool: tool }),

        updateLayoutShape: (shape) => {
            set(state => {
                if (!state.currentKitchen) return {};
                
                const timestamp = Date.now();
                let defaultWalls: IWall[] = [];
                switch (shape) {
                    case 'I':
                        defaultWalls = [
                            { id: `wall-${timestamp}-1`, label: 'Wall A (Straight)', length: 300, height: 240, thickness: 10 }
                        ];
                        break;
                    case 'L':
                        defaultWalls = [
                            { id: `wall-${timestamp}-1`, label: 'Wall A (Left)', length: 300, height: 240, thickness: 10 },
                            { id: `wall-${timestamp}-2`, label: 'Wall B (Right)', length: 240, height: 240, thickness: 10 }
                        ];
                        break;
                    case 'U':
                        defaultWalls = [
                            { id: `wall-${timestamp}-1`, label: 'Wall A (Left)', length: 300, height: 240, thickness: 10 },
                            { id: `wall-${timestamp}-2`, label: 'Wall B (Center)', length: 240, height: 240, thickness: 10 },
                            { id: `wall-${timestamp}-3`, label: 'Wall C (Right)', length: 300, height: 240, thickness: 10 }
                        ];
                        break;
                    case 'Parallel':
                        defaultWalls = [
                            { id: `wall-${timestamp}-1`, label: 'Wall A (Main)', length: 300, height: 240, thickness: 10 },
                            { id: `wall-${timestamp}-2`, label: 'Wall B (Opposite)', length: 300, height: 240, thickness: 10 }
                        ];
                        break;
                    case 'Island':
                        defaultWalls = [
                            { id: `wall-${timestamp}-1`, label: 'Wall A (Main)', length: 350, height: 240, thickness: 10 },
                            { id: `wall-${timestamp}-2`, label: 'Island Unit', length: 180, height: 90, thickness: 90 }
                        ];
                        break;
                }
                
                const numWalls = defaultWalls.length;
                const newObstacles = (state.currentKitchen.obstacles || []).filter(o => o.wallIndex < numWalls);
                const newAppliances = (state.currentKitchen.appliances || []).filter(a => a.wallIndex < numWalls);
                
                const newKitchen = {
                    ...state.currentKitchen,
                    layoutShape: shape,
                    walls: defaultWalls,
                    obstacles: newObstacles,
                    appliances: newAppliances
                };
                
                return {
                    currentKitchen: newKitchen,
                    activeWallIndex: 0,
                    selectedObstacleId: null,
                    validationErrors: validateKitchenLayout(newKitchen)
                };
            });
        },

        updateKitchenRole: (role) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    kitchenRole: role
                };
                return {
                    currentKitchen: newKitchen
                };
            });
        },

        updateRegion: (region) => {
            set(state => {
                if (!state.currentKitchen) return {};
                
                // Adjust default materials based on region
                const defaultCab = region === 'Egypt' ? 'Alumetal Standard' : 'Acrylic Turkish/Spanish';
                const defaultCount = region === 'Egypt' ? 'Local Granite' : 'Premium Quartz';
                
                const newKitchen = {
                    ...state.currentKitchen,
                    region: region,
                    cabinetMaterial: defaultCab,
                    countertopMaterial: defaultCount
                };
                return {
                    currentKitchen: newKitchen
                };
            });
        },

        updateCabinetMaterial: (material) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    cabinetMaterial: material
                };
                return {
                    currentKitchen: newKitchen
                };
            });
        },

        updateCountertopMaterial: (material) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    countertopMaterial: material
                };
                return {
                    currentKitchen: newKitchen
                };
            });
        },

        updateHardwareTier: (tier) => {
            set(state => {
                if (!state.currentKitchen) return {};
                const newKitchen = {
                    ...state.currentKitchen,
                    hardwareTier: tier
                };
                return {
                    currentKitchen: newKitchen
                };
            });
        },

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
        limit: 100,
        partialize: (state) => ({
            currentKitchen: state.currentKitchen,
        }),
        equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      }
    )
  );
}

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
