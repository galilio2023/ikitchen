import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IKitchen, IObstacle, ObstacleType } from '@/types/kitchen';

interface KitchenState {
    items: IKitchen[];
    currentKitchen: IKitchen | null;
    selectedObstacleId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: KitchenState = {
    items: [],
    currentKitchen: null,
    selectedObstacleId: null,
    loading: false,
    error: null,
};

/** * THUNK: Fetch All Projects (For Dashboard)
 * Renamed to fetchAllKitchens to fix Next.js TS71002 error
 */
export const fetchAllKitchens = createAsyncThunk(
    'kitchen/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Ensure this matches your actual API folder name!
            const response = await fetch('/api/projects');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'REGISTRY_FETCH_FAILURE');
            }
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/** * THUNK: Fetch Single Kitchen by ID */
export const fetchKitchenById = createAsyncThunk(
    'kitchen/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`);
            if (!response.ok) throw new Error('FETCH_SYNC_FAILED');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/** * THUNK: Save/Persist Kitchen Changes */
export const saveKitchen = createAsyncThunk(
    'kitchen/save',
    async (kitchen: IKitchen, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${kitchen.id || kitchen._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitchen),
            });
            if (!response.ok) throw new Error('DATABASE_SAVE_FAILURE');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/** * THUNK: Initializing a New Node */
export const addProjectThunk = createAsyncThunk(
    'kitchen/addProject',
    async (kitchenData: Partial<IKitchen>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitchenData),
            });
            if (!response.ok) throw new Error('UPLINK_INITIALIZATION_FAILED');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const kitchenSlice = createSlice({
    name: 'kitchen',
    initialState,
    reducers: {
        setSelectedObstacle: (state, action: PayloadAction<string | null>) => {
            state.selectedObstacleId = action.payload;
        },
        updateObstaclePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
            if (!state.currentKitchen) return;
            const obs = state.currentKitchen.obstacles.find(o => o.id === action.payload.id);
            if (obs) {
                obs.position.x = action.payload.x;
                obs.position.y = action.payload.y;
                state.currentKitchen.updatedAt = new Date().toISOString();
            }
        },
        updateObstacleDetails: (state, action: PayloadAction<{ id: string; updates: Partial<IObstacle['position']> }>) => {
            if (!state.currentKitchen) return;
            const obs = state.currentKitchen.obstacles.find(o => o.id === action.payload.id);
            if (obs) {
                obs.position = { ...obs.position, ...action.payload.updates };
                state.currentKitchen.updatedAt = new Date().toISOString();
            }
        },
        addObstacle: (state, action: PayloadAction<{ type: ObstacleType; wallIndex: number; x: number; y: number }>) => {
            if (!state.currentKitchen) return;
            const newObstacle: IObstacle = {
                id: crypto.randomUUID(),
                type: action.payload.type,
                wallIndex: action.payload.wallIndex,
                position: { x: action.payload.x, y: action.payload.y, z: 0, width: 60, height: 60, depth: 5 }
            };
            state.currentKitchen.obstacles.push(newObstacle);
            state.selectedObstacleId = newObstacle.id;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllKitchens.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllKitchens.fulfilled, (state, action) => {
                state.loading = false;
                // Standardize MongoDB _id to Frontend id
                state.items = action.payload.map((item: any) => ({
                    ...item,
                    id: item._id || item.id
                }));
                state.error = null;
            })
            .addCase(fetchAllKitchens.rejected, (state, action) => {
                state.loading = false;
                // This is the ONLY place this action should be handled
                state.error = action.payload as string || 'Connection Lost';
            })
            .addCase(fetchKitchenById.pending, (state) => {
                state.loading = true;
                state.currentKitchen = null;
            })
            .addCase(fetchKitchenById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentKitchen = { ...action.payload, id: action.payload._id || action.payload.id };
            })
            .addCase(fetchKitchenById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 3. Save / Add Handlers (Only define each .fulfilled ONCE)
            .addCase(saveKitchen.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addProjectThunk.fulfilled, (state, action) => {
                state.loading = false;
                const newProject = { ...action.payload, id: action.payload._id || action.payload.id };
                state.currentKitchen = newProject;
                state.items.unshift(newProject);
            });
    }
});

export const { setSelectedObstacle, updateObstaclePosition, updateObstacleDetails, addObstacle } = kitchenSlice.actions;
export default kitchenSlice.reducer;