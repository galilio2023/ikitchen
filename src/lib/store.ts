import { configureStore, combineReducers } from '@reduxjs/toolkit';
import kitchenReducer from './features/kitchens/kitchenSlice';

// 1. Create a root reducer first
const rootReducer = combineReducers({
    kitchen: kitchenReducer,
});

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });
};

// 2. Derive types from the rootReducer directly, NOT the store instance
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];