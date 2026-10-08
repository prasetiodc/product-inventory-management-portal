import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearWizardDraft,
  getWizardDraftSnapshot,
  parseWizardDraft,
  readWizardDraft,
  saveWizardDraft,
  subscribeToWizardDraft,
  WIZARD_DRAFT_KEY,
} from "./draft";

describe("wizard draft persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("merges step values and restores the current step", () => {
    saveWizardDraft(2, { title: "Phone", stockQuantity: 3 });
    saveWizardDraft(3, { weight: 1.5 });

    expect(readWizardDraft()).toEqual({
      version: 1,
      currentStep: 3,
      formData: { title: "Phone", stockQuantity: 3, weight: 1.5 },
    });
  });

  it("ignores malformed or unsupported drafts", () => {
    expect(parseWizardDraft("not-json")).toBeNull();
    expect(parseWizardDraft(null)).toBeNull();
    expect(parseWizardDraft("1")).toBeNull();
    expect(parseWizardDraft("null")).toBeNull();
    expect(parseWizardDraft(JSON.stringify([]))).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 2, currentStep: 1, formData: {} }))
    ).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 1, currentStep: 0, formData: {} }))
    ).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 1, currentStep: 5, formData: {} }))
    ).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 1, currentStep: 1, formData: null }))
    ).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 1, currentStep: 1, formData: [] }))
    ).toBeNull();
  });

  it("clears a discarded draft", () => {
    saveWizardDraft(1, { title: "Phone" });
    clearWizardDraft();

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toBeNull();
  });

  it("reads the external-store snapshot and notifies storage subscribers", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToWizardDraft(onChange);

    localStorage.setItem(WIZARD_DRAFT_KEY, "saved");
    window.dispatchEvent(new StorageEvent("storage", { key: WIZARD_DRAFT_KEY }));

    expect(getWizardDraftSnapshot()).toBe("saved");
    expect(onChange).toHaveBeenCalledOnce();

    unsubscribe();
    window.dispatchEvent(new StorageEvent("storage", { key: WIZARD_DRAFT_KEY }));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("returns no snapshot when browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    expect(getWizardDraftSnapshot()).toBeNull();
    expect(readWizardDraft()).toBeNull();
  });

  it("keeps the active form usable when saving or clearing storage fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });
    expect(() => saveWizardDraft(1, { title: "Phone" })).not.toThrow();

    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });
    expect(() => clearWizardDraft()).not.toThrow();
  });
});
