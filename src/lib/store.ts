import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projects/projectSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            projects: projectReducer,
            // You can add more slices here later (e.g., auth, materials)
        },
    });
};

// These types are crucial for TypeScript support
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];