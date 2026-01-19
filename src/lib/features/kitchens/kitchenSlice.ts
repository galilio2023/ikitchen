import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IKitchen, IObstacle, IAppliance, ObstacleType } from '@/types/kitchen';

interface ApplianceWithId {
    _id?: { toString: () => string };
    id?: string;
    [key: string]: unknown;
}

interface KitchenState {
    items: IKitchen[];
    currentKitchen: IKitchen | null;
    currentProject: any | null; // We'll use any for now or IProject if we can import it
    selectedObstacleId: string | null;
    activeWallIndex: number;
    loading: boolean;
    error: string | null;
}

const initialState: KitchenState = {
    items: [],
    currentKitchen: null,
    currentProject: null,
    selectedObstacleId: null,
    activeWallIndex: 0,
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
            if (response.status === 404) return rejectWithValue('SIGNAL_LOST');
            if (!response.ok) throw new Error('FETCH_SYNC_FAILED');
            
            const data = await response.json();
            if (!data.project) return rejectWithValue('NODE_NOT_FOUND');
            
            return data;
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

/** * THUNK: Deleting a Project */
export const deleteProjectThunk = createAsyncThunk(
    'kitchen/deleteProject',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('TERMINATION_FAILED');
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/** * THUNK: Patching Project Metadata */
export const patchProjectThunk = createAsyncThunk(
    'kitchen/patchProject',
    async ({ id, data }: { id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('UPDATE_SYNC_FAILED');
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
        setActiveWallIndex: (state, action: PayloadAction<number>) => {
            state.activeWallIndex = action.payload;
            state.selectedObstacleId = null;
        },
        addWall: (state) => {
            if (!state.currentKitchen) return;
            const newWall = {
                id: `wall-${Date.now()}`,
                label: `Wall ${state.currentKitchen.walls.length + 1}`,
                length: 300,
                height: 240,
                thickness: 10
            };
            state.currentKitchen.walls.push(newWall);
            state.activeWallIndex = state.currentKitchen.walls.length - 1;
        },
        updateWall: (state, action: PayloadAction<{ index: number; updates: Partial<IKitchen['walls'][0]> }>) => {
            if (!state.currentKitchen || !state.currentKitchen.walls[action.payload.index]) return;
            state.currentKitchen.walls[action.payload.index] = {
                ...state.currentKitchen.walls[action.payload.index],
                ...action.payload.updates
            };
        },
        removeWall: (state, action: PayloadAction<number>) => {
            if (!state.currentKitchen || state.currentKitchen.walls.length <= 1) return;
            state.currentKitchen.walls.splice(action.payload, 1);
            if (state.activeWallIndex >= state.currentKitchen.walls.length) {
                state.activeWallIndex = state.currentKitchen.walls.length - 1;
            }
        },
        applyDesign: (state, action: PayloadAction<{ obstacles: IObstacle[]; appliances: IAppliance[] }>) => {
            if (!state.currentKitchen) return;
            // For now, we'll append or replace. Let's replace appliances and append obstacles.
            state.currentKitchen.appliances = action.payload.appliances;
            // Filter out existing AI-generated obstacles if we had a way to identify them, 
            // but for now let's just append new ones that aren't already there.
            action.payload.obstacles.forEach(newObs => {
                state.currentKitchen!.obstacles.push({
                    ...newObs,
                    id: `obs-ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
                });
            });
            state.currentKitchen.updatedAt = new Date().toISOString();
        },
        updateObstaclePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
            if (!state.currentKitchen) return;
            const obs = state.currentKitchen.obstacles.find(o => (o._id?.toString() || o.id) === action.payload.id);
            if (obs) {
                obs.position.x = action.payload.x;
                obs.position.y = action.payload.y;
            } else {
                const app = state.currentKitchen.appliances.find(a => ((a as unknown as ApplianceWithId)._id?.toString() || (a as unknown as ApplianceWithId).id) === action.payload.id);
                if (app) {
                    app.position.x = action.payload.x;
                    app.position.y = action.payload.y;
                }
            }
            state.currentKitchen.updatedAt = new Date().toISOString();
        },
        updateObstacleDetails: (state, action: PayloadAction<{ id: string; updates: Partial<IObstacle['position']> }>) => {
            if (!state.currentKitchen) return;
            const obs = state.currentKitchen.obstacles.find(o => (o._id?.toString() || o.id) === action.payload.id);
            if (obs) {
                obs.position = { ...obs.position, ...action.payload.updates };
            } else {
                const app = state.currentKitchen.appliances.find(a => ((a as unknown as ApplianceWithId)._id?.toString() || (a as unknown as ApplianceWithId).id) === action.payload.id);
                if (app) {
                    app.position = { ...app.position, ...action.payload.updates };
                }
            }
            state.currentKitchen.updatedAt = new Date().toISOString();
        },
        addObstacle: (state, action: PayloadAction<{ type: ObstacleType; wallIndex: number; x: number; y: number }>) => {
            if (!state.currentKitchen) return;
            const newObstacle: IObstacle = {
                id: `obs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
                state.error = null;

                // Ensure payload is an array to prevent .map() from hitting an undefined object
                const payload = Array.isArray(action.payload) ? action.payload : [];

                state.items = payload.map((item: IKitchen) => ({
                    ...item, // Keeps all fields for TS compliance
                    id: item._id || item.id, // Standardizes ID for the Link keys
                    clientName: item.clientName // Use clientName directly
                })) as IKitchen[];
            })
            .addCase(fetchAllKitchens.rejected, (state, action) => {
                state.loading = false;
                state.items = []; // Clear projects to stop the lock
                state.error = null; // SILENT_FAILURE: Allow UI to render Empty State gracefully
            })
            .addCase(fetchKitchenById.pending, (state) => {
                state.loading = true;
                state.currentKitchen = null;
                state.currentProject = null;
            })
            .addCase(fetchKitchenById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.currentProject = action.payload.project;
                state.currentKitchen = action.payload.kitchen;
            })
            .addCase(fetchKitchenById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // 3. Save / Add Handlers (Robust error handling)
            .addCase(saveKitchen.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveKitchen.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(saveKitchen.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'SAVE_FAILURE';
            })
            .addCase(addProjectThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProjectThunk.fulfilled, (state, action) => {
                state.loading = false;
                const newProject = { ...action.payload, id: action.payload._id || action.payload.id };
                state.currentKitchen = newProject;
                state.items.unshift(newProject);
            })
            .addCase(addProjectThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'ADD_FAILURE';
            })
            .addCase(deleteProjectThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProjectThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => (item._id || item.id) !== action.payload);
            })
            .addCase(deleteProjectThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'DELETE_FAILURE';
            })
            .addCase(patchProjectThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex(item => (item._id || item.id) === (updated._id || updated.id));
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updated };
                }
                if (state.currentProject && (state.currentProject._id || state.currentProject.id) === (updated._id || updated.id)) {
                    state.currentProject = { ...state.currentProject, ...updated };
                }
            });
    }
});

export const { 
    setSelectedObstacle, 
    updateObstaclePosition, 
    updateObstacleDetails, 
    addObstacle,
    setActiveWallIndex,
    addWall,
    updateWall,
    removeWall,
    applyDesign
} = kitchenSlice.actions;
export default kitchenSlice.reducer;