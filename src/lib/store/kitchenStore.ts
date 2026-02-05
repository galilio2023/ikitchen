import { createStore } from 'zustand';
import { IKitchen, IObstacle } from '@/types/kitchen';
import { validateKitchenLayout, ValidationError } from '@/services/validationService';

export interface KitchenState {
    currentKitchen: IKitchen | null;
    currentProject: any | null;
    validationErrors: ValidationError[];
    activeWallIndex: number;
    selectedObstacleId: string | null;
    previewDesign?: any;
    previewObstacles?: any[];
    
    // Actions
    setInitialState: (project: any, kitchen: IKitchen) => void;
    addObstacle: (obstacle: IObstacle) => void;
    updateObstaclePosition: (id: string, x: number, y: number) => void;
    updateObstacleDetails: (id: string, updates: Partial<IObstacle['position']>) => void;
    deleteObstacle: (id: string) => void;
    setSelectedObstacle: (id: string | null) => void;
    setActiveWallIndex: (index: number) => void;
    setPreviewDesign: (design: any) => void;
    setPreviewObstacles: (obstacles: any[]) => void;
    applyDesign: (designData: { obstacles: any[], appliances: any[] }) => void;
    updateKitchen: (kitchen: IKitchen) => void;
}

export const createKitchenStore = (initialState: Partial<KitchenState> = {}) => {
  return createStore<KitchenState>((set) => ({
    currentKitchen: null,
    currentProject: null,
    validationErrors: [],
    activeWallIndex: 0,
    selectedObstacleId: null,
    ...initialState,

    setInitialState: (project, kitchen) => {
        set({ 
            currentProject: project, 
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
    setPreviewDesign: (design) => set({ previewDesign: design }),
    setPreviewObstacles: (obstacles) => set({ previewObstacles: obstacles }),
    applyDesign: (designData) => set(state => {
      if (!state.currentKitchen) return {};
      const newKitchen = {
        ...state.currentKitchen,
        obstacles: designData.obstacles,
        appliances: designData.appliances,
      };
      return {
        currentKitchen: newKitchen,
        validationErrors: validateKitchenLayout(newKitchen),
      };
    }),
    updateKitchen: (kitchen) => set({
      currentKitchen: kitchen,
      validationErrors: validateKitchenLayout(kitchen),
    }),
  }));
}
