import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WizardState {
  currentStep: number;
  formData: Record<string, unknown>;
  hasSavedDraft: boolean;
}

export const initialWizardState: WizardState = {
  currentStep: 1,
  formData: {},
  hasSavedDraft: false,
};

export const wizardSlice = createSlice({
  name: "wizard",
  initialState: initialWizardState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    updateFormData(state, action: PayloadAction<Record<string, unknown>>) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetWizard(state) {
      state.currentStep = 1;
      state.formData = {};
      state.hasSavedDraft = false;
    },
    setHasSavedDraft(state, action: PayloadAction<boolean>) {
      state.hasSavedDraft = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  updateFormData,
  resetWizard,
  setHasSavedDraft,
} = wizardSlice.actions;

export default wizardSlice.reducer;
