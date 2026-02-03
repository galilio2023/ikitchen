import{ configureStore }from '@reduxjs/toolkit';
import kitchenReducer from './features/kitchens/kitchenSlice';
import uiReducer from './features/ui/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      kitchen: kitchenReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // If using redux-persist
        },
      }),
  });
};

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;