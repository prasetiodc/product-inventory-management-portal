import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { setCurrentStep, updateFormData } from "@/features/wizard/wizardSlice";
import { WIZARD_DRAFT_KEY } from "@/features/wizard/draft";
import Step4Review from "./Step4Review";

describe("Step4Review", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("shows saved values including zero and navigates to the selected step for editing", () => {
    const store = makeStore();
    store.dispatch(setCurrentStep(4));
    store.dispatch(
      updateFormData({
        title: "Test product",
        stockQuantity: 0,
        isFragile: false,
      })
    );

    render(
      <Provider store={store}>
        <Step4Review />
      </Provider>
    );

    expect(screen.getByText("Test product")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Edit Pricing, Stock & Variations" })
    );
    expect(store.getState().wizard.currentStep).toBe(2);
    expect(store.getState().wizard.formData.title).toBe("Test product");
  });

  it("submits the mapped product payload and clears the draft on success", async () => {
    const store = makeStore();
    const productData = {
      title: "Test product",
      brand: "Test brand",
      category: "smartphones",
      description: "A sufficiently detailed product description.",
      basePrice: 29.5,
      stockQuantity: 0,
      dimensions: { width: 10, height: 20, depth: 5 },
      weight: 1.5,
      isFragile: false,
      variations: [],
    };
    store.dispatch(setCurrentStep(4));
    store.dispatch(updateFormData(productData));
    localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify({ version: 1 }));

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ...productData, id: 201 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Provider store={store}>
        <Step4Review />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit Product" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Product submitted successfully (ID 201)"
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    const [request] = fetchMock.mock.calls[0] as [Request];
    expect(new URL(request.url).pathname).toBe("/products/add");
    expect(request.method).toBe("POST");
    await expect(request.json()).resolves.toMatchObject({
      price: 29.5,
      stock: 0,
      title: "Test product",
      dimensions: productData.dimensions,
    });
    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toBeNull();
  });
});
