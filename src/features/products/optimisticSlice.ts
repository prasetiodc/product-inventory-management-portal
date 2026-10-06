import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

export const initialOptimisticState: OptimisticState = {
  pendingOperations: {},
  failedOperations: {},
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
    },
    clearFailedOperation(state, action: PayloadAction<{ id: number }>) {
      delete state.failedOperations[action.payload.id];
    },
  },
});

export const {
  optimisticStarted,
  optimisticSettled,
  optimisticRolledBack,
  clearFailedOperation,
} = optimisticSlice.actions;

export default optimisticSlice.reducer;
