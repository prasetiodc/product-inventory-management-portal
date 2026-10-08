import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { WIZARD_DRAFT_KEY } from "@/features/wizard/draft";
import Step1Form from "./Step1Form";

vi.mock("@/services/productsApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/productsApi")>();
  return {
    ...actual,
    useGetCategoriesQuery: () => ({
      data: [{ slug: "smartphones", name: "Smartphones", url: "" }],
      isLoading: false,
    }),
  };
});

describe("Step1Form draft autosave", () => {
  it("persists in-progress field values without submitting the step", async () => {
    localStorage.clear();
    const store = makeStore();

    render(
      <Provider store={store}>
        <Step1Form />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("Judul Produk"), {
      target: { value: "Saved while typing" },
    });

    await waitFor(() => {
      const draft = JSON.parse(localStorage.getItem(WIZARD_DRAFT_KEY) ?? "null");
      expect(draft.formData.title).toBe("Saved while typing");
    });
    expect(store.getState().wizard.currentStep).toBe(1);
  });
});
