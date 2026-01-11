import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IProject } from '@/models/Project';
import { toast } from 'sonner';
import { IObstacle, ObstacleType } from '@/types/kitchen';



// export interface Obstacle {
//     id: string;
//     type: string;
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     wallIndex: number;
// }
export interface Obstacle extends IObstacle {}

interface ProjectState {
    items: IProject[];
    currentProject: IProject | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    items: [],
    currentProject: null,
    loading: false,
    error: null,
};

const mapProject = (p: any): IProject => ({
    ...p,
    id: p._id?.toString() || p.id,
});

// THUNKS
export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error("DATABASE_OFFLINE");
        const data = await res.json();
        return data.map(mapProject);
    } catch (err: any) {
        // FALLBACK: Return a local mock project so the UI doesn't break
        console.warn("Database offline. Loading Mock_Sequence_01.");
        return [{
            id: 'mock_project_01',
            projectId: 'PROJ-001',
            clientName: "Trial User",
            status: 'draft',
            walls: [{ label: 'Main Wall', length: 400, height: 240, thickness: 20 }],
            obstacles: [],
            totalPrice: 0,
            standards: { baseCabinetDepth: 60, wallCabinetDepth: 35, countertopThickness: 4, kickplateHeight: 10 }
        }];
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
    reducers: {
        // LOAD PROJECT INTO EDITOR
        setCurrentProject: (state, action: PayloadAction<string>) => {
            const project = state.items.find(p => p.id === action.payload);
            if (project) {
                // Deep clone to prevent direct mutation of the list
                state.currentProject = JSON.parse(JSON.stringify(project));
            }
        },

        // src/lib/features/projects/projectSlice.ts

        moveObstacle: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
            const project = state.currentProject;
            // Use optional chaining and ensure obstacles exists
            if (project?.obstacles) {
                const obstacle = project.obstacles.find(o => o.id === action.payload.id);
                if (obstacle) {
                    obstacle.position.x = action.payload.x;
                    obstacle.position.y = action.payload.y;
                }
            }
        },

        deleteObstacle: (state, action: PayloadAction<string>) => {
            if (state.currentProject?.obstacles) {
                state.currentProject.obstacles = state.currentProject.obstacles.filter(
                    o => o.id !== action.payload
                );
                toast.error("NODE_DECOMMISSIONED");
            }
        },

// Inside kitchens/kitchenSlice.ts or projectSlice.ts
        // Replace your addObstacle reducer with this exact version
        addObstacle: (state, action: PayloadAction<{
            type: ObstacleType;
            wallIndex: number;
            x: number;
            y: number;
        }>) => {
            if (state.currentProject) {
                if (!state.currentProject.obstacles) state.currentProject.obstacles = [];

                const newObstacle: IObstacle = {
                    id: `node_${Math.random().toString(36).substring(2, 9)}`,
                    type: action.payload.type,
                    wallIndex: action.payload.wallIndex,
                    position: {
                        x: action.payload.x,
                        y: action.payload.y,
                        z: 0,
                        width: 60,  // Standard default
                        height: 60, // Standard default
                        depth: 2
                    }
                };

                state.currentProject.obstacles.push(newObstacle);
            }
        },
        clearCurrentProject: (state) => {
            state.currentProject = null;
        }
    },
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

export const { setCurrentProject, addObstacle, clearCurrentProject,deleteObstacle,moveObstacle } = projectSlice.actions;
export default projectSlice.reducer;