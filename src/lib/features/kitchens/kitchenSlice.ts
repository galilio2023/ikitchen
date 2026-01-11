import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { IKitchen, IWall } from "@/types";

interface KitchenState {
    currentKitchen: IKitchen | null;
    loading: boolean;
    error: string | null;
}

const initialState: KitchenState = {
    currentKitchen: null,
    loading: false,
    error: null,
};

/**
 * FETCH: Pulls kitchen data based on the Project ID link
 */
export const fetchKitchenByProject = createAsyncThunk(
    'kitchen/fetchByProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/kitchens?projectId=${projectId}`);
            if (!res.ok) throw new Error("SYSTEM_LINK_FAILURE");

            const result = await res.json();

            // Your API returns { success: true, data: [...] }
            // Since GET returns an array, we take the first matching kitchen node
            return result.data && result.data.length > 0 ? result.data[0] : null;

        } catch (err: any) {
            toast.error("NEURAL_SYNC_FAILED", { description: err.message });
            return rejectWithValue(err.message);
        }
    }
);

/**
 * UPDATE: Pushes the current local state back to MongoDB
 */
export const updateKitchenThunk = createAsyncThunk(
    'kitchen/update',
    async (kitchen: IKitchen, { rejectWithValue }) => {
        try {
            // Assumes your API handles PUT at /api/kitchens or /api/kitchens/[id]
            const res = await fetch(`/api/kitchens`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kitchen),
            });

            if (!res.ok) throw new Error("CLOUD_SYNC_REJECTED");
            const result = await res.json();

            toast.success("NODE_SYNCHRONIZED", { description: "Spatial data locked to cloud." });
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
            state.error = null;
        },
        // Logic for the Wall Editor
        addWall: (state) => {
            if (state.currentKitchen) {
                const newWall: IWall = {
                    label: `Wall ${String.fromCharCode(65 + state.currentKitchen.walls.length)}`,
                    length: 200,
                    height: 240,
                    thickness: 10
                };
                state.currentKitchen.walls.push(newWall);
            }
        },
        updateWallLength: (state, action: PayloadAction<{ index: number; length: number }>) => {
            if (state.currentKitchen) {
                const { index, length } = action.payload;
                state.currentKitchen.walls[index].length = length;
            }
        },
        removeWall: (state, action: PayloadAction<number>) => {
            if (state.currentKitchen) {
                state.currentKitchen.walls.splice(action.payload, 1);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Handlers
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
            // Update Handlers
            .addCase(updateKitchenThunk.fulfilled, (state, action) => {
                state.currentKitchen = action.payload;
            });
    },
});



export const {
    clearCurrentKitchen,
    addWall,
    updateWallLength,
    removeWall
} = kitchenSlice.actions;

export default kitchenSlice.reducer;