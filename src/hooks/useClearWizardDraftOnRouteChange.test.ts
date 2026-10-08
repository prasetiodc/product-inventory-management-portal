import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { WIZARD_DRAFT_KEY } from "@/features/wizard/draft";
import { useClearWizardDraftOnRouteChange } from "./useClearWizardDraftOnRouteChange";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("useClearWizardDraftOnRouteChange", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(usePathname).mockReturnValue("/products/new");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("keeps the saved draft while the user stays in the create flow", () => {
    localStorage.setItem(WIZARD_DRAFT_KEY, "saved draft");

    renderHook(() => useClearWizardDraftOnRouteChange());

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toBe("saved draft");
  });

  it("clears the saved draft after navigating away from the create flow", () => {
    vi.mocked(usePathname).mockReturnValue("/products");
    localStorage.setItem(WIZARD_DRAFT_KEY, "saved draft");

    renderHook(() => useClearWizardDraftOnRouteChange());

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toBeNull();
  });
});
