import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { IKitchen, IObstacle, IWall } from "@/types/kitchen";
import { kitchenAiService } from "@/services/aiService";
import { GeneratedDesign } from "@/lib/validations";

// --- ASYNC THUNKS ---

export const fetchKitchenById = createAsyncThunk<
  any, // Returns { project: IProject, kitchen: IKitchen }
  string,
  { rejectValue: string }
>("kitchen/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to fetch kitchen");
    }
    return response.json();
  } catch (error: any) {
    return rejectWithValue("Network error occurred");
  }
});

export const fetchAllKitchens = createAsyncThunk<
  IKitchen[],
  void,
  { rejectValue: string }
>("kitchen/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to fetch kitchens");
    }
    return response.json();
  } catch (error: any) {
    return rejectWithValue("Network error occurred");
  }
});

export const addProjectThunk = createAsyncThunk<
  IKitchen,
  Partial<IKitchen>,
  { rejectValue: string }
>("kitchen/addProject", async (kitchenData, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kitchenData),
    });

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to add project");
    }

    return response.json();
  } catch (error: any) {
    return rejectWithValue("Network error occurred");
  }
});

export const updateKitchenThunk = createAsyncThunk<
  IKitchen,
  { id: string; data: Partial<IKitchen> },
  { rejectValue: string }
>("kitchen/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to update kitchen");
    }

    return response.json();
  } catch (error: any) {
    return rejectWithValue("Network error occurred");
  }
});

export const deleteKitchenThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("kitchen/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to delete kitchen");
    }

    return id;
  } catch (error: any) {
    return rejectWithValue("Network error occurred");
  }
});

export const generateAiLayout = createAsyncThunk<
  GeneratedDesign,
  string, // projectId
  { state: RootState; rejectValue: string }
>("kitchen/generateAiLayout", async (projectId, { getState, rejectWithValue }) => {
  const state = getState();
  const kitchen = state.kitchen.currentKitchen;

  if (!kitchen) {
    return rejectWithValue("No kitchen data available");
  }

  try {
    const design = await kitchenAiService.generateLayout(kitchen);
    return design;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to generate AI layout");
  }
});

export const acceptAiLayout = createAsyncThunk<
  void,
  GeneratedDesign,
  { state: RootState; rejectValue: string }
>(
  "kitchen/acceptAiLayout",
  async (generatedDesign, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const kitchenId =
      state.kitchen.currentKitchen?._id || state.kitchen.currentKitchen?.id;

    if (!kitchenId) return rejectWithValue("No kitchen selected");

    try {
      const response = await fetch(`/api/projects/${kitchenId}/design`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedDesign,
          applyUnitsAsObstacles: true,
          force: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to accept AI design");
      }

      dispatch(fetchKitchenById(kitchenId));
    } catch (error: any) {
      console.error("Error accepting AI design:", error);
      return rejectWithValue(error.message || "Network error occurred");
    }
  },
);

// --- SLICE DEFINITION ---

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState: {
    items: [] as IKitchen[],
    currentKitchen: null as IKitchen | null,
    currentProject: null as any | null, // Store metadata here
    previewDesign: null as any,
    previewObstacles: [] as IObstacle[],
    loading: false,
    error: null as string | null,
    activeWallIndex: 0,
    selectedObstacleId: null as string | null,
  },
  reducers: {
    setCurrentKitchen: (state, action: PayloadAction<IKitchen | null>) => {
      state.currentKitchen = action.payload;
    },
    setActiveWallIndex: (state, action: PayloadAction<number>) => {
      state.activeWallIndex = action.payload;
    },
    setSelectedObstacle: (state, action: PayloadAction<string | null>) => {
      state.selectedObstacleId = action.payload;
    },
    addObstacle: (state, action: PayloadAction<IObstacle>) => {
      if (state.currentKitchen) {
        if (!state.currentKitchen.obstacles)
          state.currentKitchen.obstacles = [];
        state.currentKitchen.obstacles.push(action.payload);
      }
    },
    updateObstacleDetails: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<IObstacle["position"]>;
      }>,
    ) => {
      if (state.currentKitchen && state.currentKitchen.obstacles) {
        const obstacle = state.currentKitchen.obstacles.find(
          (obs) => obs.id === action.payload.id,
        );
        if (obstacle) Object.assign(obstacle.position, action.payload.updates);
      }
    },
    updateObstaclePosition: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>,
    ) => {
      if (state.currentKitchen && state.currentKitchen.obstacles) {
        const obstacle = state.currentKitchen.obstacles.find(
          (obs) => obs.id === action.payload.id,
        );
        if (obstacle) {
          obstacle.position.x = action.payload.x;
          obstacle.position.y = action.payload.y;
        }
      }
    },
    deleteObstacle: (state, action: PayloadAction<string>) => {
      if (state.currentKitchen && state.currentKitchen.obstacles) {
        state.currentKitchen.obstacles = state.currentKitchen.obstacles.filter(
          (obs) => obs.id !== action.payload,
        );
      }
    },
    addWall: (state, action: PayloadAction<IWall>) => {
      if (state.currentKitchen) {
        if (!state.currentKitchen.walls) state.currentKitchen.walls = [];
        state.currentKitchen.walls.push(action.payload);
      }
    },
    removeWall: (state, action: PayloadAction<string>) => {
      if (state.currentKitchen && state.currentKitchen.walls) {
        state.currentKitchen.walls = state.currentKitchen.walls.filter(
          (wall) => wall.id !== action.payload
        );
        // Reset active wall index if deleted
        if (state.activeWallIndex >= state.currentKitchen.walls.length) {
          state.activeWallIndex = Math.max(0, state.currentKitchen.walls.length - 1);
        }
      }
    },
    updateWall: (state, action: PayloadAction<{ id: string; updates: Partial<IWall> }>) => {
      if (state.currentKitchen && state.currentKitchen.walls) {
        const wall = state.currentKitchen.walls.find((w) => w.id === action.payload.id);
        if (wall) {
          Object.assign(wall, action.payload.updates);
        }
      }
    },
    setPreviewDesign: (state, action: PayloadAction<any>) => {
      state.previewDesign = action.payload;
    },
    setPreviewObstacles: (state, action: PayloadAction<IObstacle[]>) => {
      state.previewObstacles = action.payload;
    },
    clearPreview: (state) => {
      state.previewDesign = null;
      state.previewObstacles = [];
    },
    applyDesign: (
      state,
      action: PayloadAction<{ obstacles?: IObstacle[]; appliances?: any[] }>,
    ) => {
      if (state.currentKitchen && action.payload.obstacles) {
        state.currentKitchen.obstacles = action.payload.obstacles;
      }
    },
    discardAiLayout: (state) => {
      if (state.currentKitchen) {
        state.currentKitchen.generatedDesign = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Kitchen By ID (Corrected for {project, kitchen})
      .addCase(fetchKitchenById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchKitchenById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          // Check if API response is nested or flat
          if (action.payload.project && action.payload.kitchen) {
            state.currentProject = action.payload.project;
            state.currentKitchen = action.payload.kitchen;
          } else {
            state.currentKitchen = action.payload;
            state.currentProject = action.payload;
          }
        },
      )
      .addCase(fetchKitchenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All
      .addCase(fetchAllKitchens.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllKitchens.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllKitchens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Project
      .addCase(addProjectThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentKitchen = action.payload;
      })

      // Generate AI Layout
      .addCase(generateAiLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAiLayout.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentKitchen) {
          // Cast to any to avoid strict type checking if interface mismatch, though I updated interface
          (state.currentKitchen as any).generatedDesign = action.payload;
        }
      })
      .addCase(generateAiLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Accept AI Layout
      .addCase(acceptAiLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptAiLayout.fulfilled, (state) => {
        state.loading = false;
        if (state.currentKitchen) {
          state.currentKitchen.generatedDesign = undefined; // Clear design after acceptance
        }
      })
      .addCase(acceptAiLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentKitchen,
  setActiveWallIndex,
  setSelectedObstacle,
  addObstacle,
  updateObstacleDetails,
  updateObstaclePosition,
  deleteObstacle,
  addWall,
  removeWall,
  updateWall,
  setPreviewDesign,
  setPreviewObstacles,
  clearPreview,
  applyDesign,
  discardAiLayout,
} = kitchenSlice.actions;

export default kitchenSlice.reducer;
