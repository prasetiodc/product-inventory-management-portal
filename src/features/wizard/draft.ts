export interface WizardDraft {
  version: 1;
  currentStep: number;
  formData: Record<string, unknown>;
}

export const WIZARD_DRAFT_KEY = "product-wizard-draft:v1";

export function subscribeToWizardDraft(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function getWizardDraftSnapshot(): string | null {
  try {
    return window.localStorage.getItem(WIZARD_DRAFT_KEY);
  } catch {
    return null;
  }
}

export function parseWizardDraft(serialized: string | null): WizardDraft | null {
  if (!serialized) return null;

  try {
    const value: unknown = JSON.parse(serialized);
    if (typeof value !== "object" || value === null) return null;

    const draft = value as Partial<WizardDraft>;
    if (
      draft.version !== 1 ||
      !Number.isInteger(draft.currentStep) ||
      draft.currentStep! < 1 ||
      draft.currentStep! > 4 ||
      typeof draft.formData !== "object" ||
      draft.formData === null ||
      Array.isArray(draft.formData)
    ) {
      return null;
    }

    return draft as WizardDraft;
  } catch {
    return null;
  }
}

export function readWizardDraft(): WizardDraft | null {
  try {
    return parseWizardDraft(window.localStorage.getItem(WIZARD_DRAFT_KEY));
  } catch {
    return null;
  }
}

export function saveWizardDraft(
  currentStep: number,
  values: Record<string, unknown>
): void {
  try {
    const previous = readWizardDraft();
    const draft: WizardDraft = {
      version: 1,
      currentStep,
      formData: { ...previous?.formData, ...values },
    };
    window.localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore unavailable or full browser storage; the active Redux form still works.
  }
}

export function clearWizardDraft(): void {
  try {
    window.localStorage.removeItem(WIZARD_DRAFT_KEY);
  } catch {
    // Ignore unavailable browser storage.
  }
}
