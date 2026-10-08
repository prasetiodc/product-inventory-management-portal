import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("Step1Form draft saving", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves valid form data and advances to step 2 on submit", async () => {
    const store = makeStore();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <Step1Form />
      </Provider>
    );

    await user.type(screen.getByLabelText("Judul Produk"), "Saved on submit");
    await user.type(screen.getByLabelText("Merek"), "Test brand");
    await user.selectOptions(screen.getByLabelText("Kategori"), "Smartphones");
    await user.type(
      screen.getByLabelText("Deskripsi"),
      "A product description with enough characters."
    );
    await user.click(screen.getByRole("button", { name: "Lanjut ke Langkah 2" }));

    expect(JSON.parse(localStorage.getItem(WIZARD_DRAFT_KEY) ?? "null")).toMatchObject({
      currentStep: 1,
      formData: {
        title: "Saved on submit",
        brand: "Test brand",
        category: "Smartphones",
      },
    });
    expect(store.getState().wizard.currentStep).toBe(2);
  });
});
