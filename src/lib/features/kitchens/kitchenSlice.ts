import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// Define the interface based on your Mongoose Schema for better TS support
interface KitchenState {
    currentKitchen: any | null; // You can replace 'any' with your Kitchen interface later
    loading: boolean;
    error: string | null;
}

const initialState: KitchenState = {
    currentKitchen: null,
    loading: false,
    error: null,
};

export const fetchKitchenByProject = createAsyncThunk(
    'kitchen/fetchByProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/kitchen?projectId=${projectId}`);
            if (!res.ok) throw new Error("SYSTEM_LINK_FAILURE");

            const result = await res.json();

            // CRITICAL: Extract the data from your API's { success: true, data: ... } wrapper
            // Since GET returns an array, we take the first matching kitchen
            return result.data && result.data.length > 0 ? result.data[0] : null;

        } catch (err: any) {
            toast.error("NEURAL_SYNC_FAILED", { description: err.message });
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
            });
    },
});

export const { clearCurrentKitchen } = kitchenSlice.actions;
export default kitchenSlice.reducer;