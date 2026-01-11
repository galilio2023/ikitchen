import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IKitchen } from '@/types/kitchen';

export const fetchProjects = createAsyncThunk(
    'projects/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            // Simulated fetch for your Dashboard
            await new Promise(res => setTimeout(res, 500));
            return [] as IKitchen[];
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

interface ProjectState {
    items: IKitchen[]; // The list of projects for the dashboard
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    items: [],
    loading: false,
    error: null,
};

export const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => { state.loading = true; })
            .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<IKitchen[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default projectSlice.reducer;