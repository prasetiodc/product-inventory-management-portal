import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  retryAction?: {
    type: "delete" | "update";
    id: number;
    data?: unknown;
  };
}

export interface UIState {
  isFilterDrawerOpen: boolean;
  selectedProductId: number | null;
  toasts: ToastItem[];
}

export const initialUIState: UIState = {
  isFilterDrawerOpen: false,
  selectedProductId: null,
  toasts: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    setFilterDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isFilterDrawerOpen = action.payload;
    },
    setSelectedProductId(state, action: PayloadAction<number | null>) {
      state.selectedProductId = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<ToastItem, "id"> & { id?: string }>) {
      const id =
        action.payload.id ||
        `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { ...action.payload, id };
      state.toasts.push(newToast);
      if (state.toasts.length > 3) {
        state.toasts.shift();
      }
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setFilterDrawerOpen,
  setSelectedProductId,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
