import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IProject } from '@/models/Project';
import { toast } from 'sonner';

interface ProjectState {
    items: IProject[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    items: [],
    loading: false,
    error: null,
};

const mapProject = (p: any): IProject => ({
    ...p,
    id: p._id?.toString() || p.id,
});

export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error("FAILED_TO_PULL_DATA");
        const data = await res.json();
        return data.map(mapProject);
    } catch (err: any) {
        toast.error("SYNC_ERROR", { description: err.message });
        return rejectWithValue(err.message);
    }
});

export const addProjectThunk = createAsyncThunk(
    'projects/addProject',
    async (newProject: { name: string; client: string; status: string; progress: number }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject),
            });
            if (!response.ok) throw new Error("INITIALIZATION_FAILED");
            const data = await response.json();
            return mapProject(data);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => { state.loading = true; })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addProjectThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            });
    },
});

export default projectSlice.reducer;