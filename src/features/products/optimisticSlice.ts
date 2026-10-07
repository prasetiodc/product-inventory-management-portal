import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

export interface PendingOperation {
  id: number;
  type: "delete" | "update";
  data?: unknown;
}

export interface FailedOperation {
  id: number;
  type: "delete" | "update";
  data?: unknown;
  error: string;
}

export interface OptimisticState {
  pendingOperations: Record<number, PendingOperation>;
  failedOperations: Record<number, FailedOperation>;
  products: Record<number, Partial<Product>>;
  deletedProductIds: Record<number, boolean>;
}

export const initialOptimisticState: OptimisticState = {
  pendingOperations: {},
  failedOperations: {},
  products: {},
  deletedProductIds: {},
};

export const optimisticSlice = createSlice({
  name: "optimistic",
  initialState: initialOptimisticState,
  reducers: {
    optimisticStarted(state, action: PayloadAction<PendingOperation>) {
      state.pendingOperations[action.payload.id] = action.payload;
      delete state.failedOperations[action.payload.id];
    },
    optimisticSettled(state, action: PayloadAction<{ id: number }>) {
      delete state.pendingOperations[action.payload.id];
    },
    optimisticRolledBack(state, action: PayloadAction<FailedOperation>) {
      delete state.pendingOperations[action.payload.id];
      state.failedOperations[action.payload.id] = action.payload;

      if (action.payload.type === "delete") {
        delete state.deletedProductIds[action.payload.id];
      }
    },
    clearFailedOperation(state, action: PayloadAction<{ id: number }>) {
      delete state.failedOperations[action.payload.id];
    },
    deleteProductOptimistic(state, action: PayloadAction<number>) {
      delete state.products[action.payload];
      state.deletedProductIds[action.payload] = true;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products[action.payload.id] = action.payload;
      delete state.deletedProductIds[action.payload.id];
    },
    updateProductOptimistic(
      state,
      action: PayloadAction<Partial<Product> & Pick<Product, "id">>,
    ) {
      const p = action.payload;
      state.products[p.id] = { ...state.products[p.id], ...p };
    },
    revertProduct(state, action: PayloadAction<Product>) {
      const p = action.payload;
      state.products[p.id] = p;
    },
  },
});

export const {
  optimisticStarted,
  optimisticSettled,
  optimisticRolledBack,
  clearFailedOperation,
  deleteProductOptimistic,
  addProduct,
  updateProductOptimistic,
  revertProduct,
} = optimisticSlice.actions;

export default optimisticSlice.reducer;
