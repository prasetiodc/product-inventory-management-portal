import { configureStore, combineReducers } from "@reduxjs/toolkit";
import filtersReducer from "@/features/products/filtersSlice";
import optimisticReducer from "@/features/products/optimisticSlice";
import uiReducer from "@/features/ui/uiSlice";
import wizardReducer from "@/features/wizard/wizardSlice";
import { productsApi } from "@/services/productsApi";

const rootReducer = combineReducers({
  filters: filtersReducer,
  optimistic: optimisticReducer,
  ui: uiReducer,
  wizard: wizardReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
