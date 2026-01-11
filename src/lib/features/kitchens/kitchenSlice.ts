import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { IKitchen, IObstacle, IWall, ObstacleType } from "@/types";

interface KitchenState {
    currentKitchen: IKitchen | null;
    loading: boolean;
    error: string | null;
    selectedObstacleIndex: number | null;
}

const initialState: KitchenState = {
    currentKitchen: null,
    loading: false,
    error: null,
    selectedObstacleIndex: null
};

export const fetchKitchenByProject = createAsyncThunk(
    'kitchen/fetchByProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/kitchens?projectId=${projectId}`);
            if (!res.ok) throw new Error("SYSTEM_LINK_FAILURE");
            const result = await res.json();
            return result.data && result.data.length > 0 ? result.data[0] : null;
        } catch (err: any) {
            toast.error("NEURAL_SYNC_FAILED", { description: err.message });
            return rejectWithValue(err.message);
        }
    }
);

export const updateKitchenThunk = createAsyncThunk(
    'kitchen/update',
    async (kitchen: IKitchen, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/kitchens`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitchen),
            });
            if (!res.ok) throw new Error("CLOUD_SYNC_REJECTED");
            const result = await res.json();
            toast.success("NODE_SYNCHRONIZED");
            return result.data;
        } catch (err: any) {
            toast.error("SYNC_ERROR", { description: err.message });
            return rejectWithValue(err.message);
        }
    }
);

export const kitchenSlice = createSlice({
    name: 'kitchen',
    initialState,
    reducers: {
        clearCurrentKitchen: (state) => {
            state.currentKitchen = null;
        },

        addWall: (state, action: PayloadAction<{ projectId: string }>) => {
            if (!state.currentKitchen) {
                state.currentKitchen = {
                    projectId: action.payload.projectId,
                    clientName: "New Project",
                    phone: "Pending...",
                    status: 'draft',
                    walls: [],
                    obstacles: [],
                    appliances: [],
                    totalPrice: 0,
                    standards: {
                        baseCabinetDepth: 60,
                        wallCabinetDepth: 35,
                        countertopThickness: 4,
                        kickplateHeight: 10,
                    }
                } as IKitchen;
            }
            state.currentKitchen.walls.push({
                label: `Wall ${String.fromCharCode(65 + state.currentKitchen.walls.length)}`,
                length: 250,
                height: 240,
                thickness: 10
            });
        },

        updateWallLength: (state, action: PayloadAction<{ index: number; length: number }>) => {
            if (state.currentKitchen?.walls[action.payload.index]) {
                state.currentKitchen.walls[action.payload.index].length = action.payload.length;
            }
        },

        removeWall: (state, action: PayloadAction<number>) => {
            if (state.currentKitchen) {
                state.currentKitchen.walls.splice(action.payload, 1);
                // Clean up obstacles associated with this wall
                state.currentKitchen.obstacles = state.currentKitchen.obstacles.filter(
                    obs => obs.wallIndex !== action.payload
                );
            }
        },

        addObstacle: (state, action: PayloadAction<{ wallIndex: number; type: ObstacleType }>) => {
            if (state.currentKitchen) {
                const countOnWall = state.currentKitchen.obstacles.filter(o => o.wallIndex === action.payload.wallIndex).length;

                state.currentKitchen.obstacles.push({
                    type: action.payload.type,
                    wallIndex: action.payload.wallIndex,
                    position: {
                        x: 20 + (countOnWall * 15),
                        y: 100,
                        z: 0,
                        width: 60,
                        height: 90,
                        depth: 5
                    }
                });
            }
        },

        updateObstaclePosition: (state, action: PayloadAction<{
            obstacleIndex: number;
            x: number;
            y: number;
        }>) => {
            const { obstacleIndex, x, y } = action.payload;
            // FIXED: Accessing obstacles via state.currentKitchen
            if (state.currentKitchen && state.currentKitchen.obstacles[obstacleIndex]) {
                state.currentKitchen.obstacles[obstacleIndex].position.x = x;
                state.currentKitchen.obstacles[obstacleIndex].position.y = y;
            }
        },

        updateObstacleDetails: (state, action: PayloadAction<{ index: number; updates: Partial<IObstacle['position']> }>) => {
            const obs = state.currentKitchen?.obstacles[action.payload.index];
            if (obs) {
                obs.position = { ...obs.position, ...action.payload.updates };
            }
        },

        setSelectedObstacle: (state, action: PayloadAction<number | null>) => {
            state.selectedObstacleIndex = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKitchenByProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKitchenByProject.fulfilled, (state, action) => {
                state.loading = false;
                state.currentKitchen = action.payload;
            })
            .addCase(fetchKitchenByProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateKitchenThunk.fulfilled, (state, action) => {
                state.currentKitchen = action.payload;
            });
    }
});

export const {
    clearCurrentKitchen,
    addWall,
    updateWallLength,
    removeWall,
    addObstacle,
    updateObstaclePosition,
    updateObstacleDetails,
    setSelectedObstacle
} = kitchenSlice.actions;

export default kitchenSlice.reducer;