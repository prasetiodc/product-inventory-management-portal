import { beforeEach, describe, expect, it } from "vitest";
import {
  clearWizardDraft,
  parseWizardDraft,
  readWizardDraft,
  saveWizardDraft,
  WIZARD_DRAFT_KEY,
} from "./draft";

describe("wizard draft persistence", () => {
  beforeEach(() => {
    localStorage.clear();
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
    expect(
      parseWizardDraft(JSON.stringify({ version: 2, currentStep: 1, formData: {} }))
    ).toBeNull();
    expect(
      parseWizardDraft(JSON.stringify({ version: 1, currentStep: 5, formData: {} }))
    ).toBeNull();
  });

  it("clears a discarded draft", () => {
    saveWizardDraft(1, { title: "Phone" });
    clearWizardDraft();

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toBeNull();
  });
});
