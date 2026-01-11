import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projects/projectSlice';
import kitchenReducer from './features/kitchens/kitchenSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            projects: projectReducer,
            kitchen: kitchenReducer, // Matches Dashboard Selector
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false, // Useful for handling Mongo Date objects
            }),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];