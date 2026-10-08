import { describe, it, expect } from "vitest";
import { makeStore } from "./store";
import {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setView,
  resetFilters,
  filtersHydrated,
} from "@/features/products/filtersSlice";
import {
  setFilterDrawerOpen,
  setSelectedProductId,
  addToast,
  removeToast,
} from "@/features/ui/uiSlice";
import {
  optimisticStarted,
  optimisticSettled,
  optimisticRolledBack,
  clearFailedOperation,
  addProduct,
  deleteProductOptimistic,
  revertProduct,
  updateProductOptimistic,
} from "@/features/products/optimisticSlice";
import {
  setCurrentStep,
  updateFormData,
  resetWizard,
  setHasSavedDraft,
} from "@/features/wizard/wizardSlice";

describe("Redux Store & Slices Setup", () => {
  it("initializes store with default state", () => {
    const store = makeStore();
    const state = store.getState();

    expect(state.filters.search).toBe("");
    expect(state.filters.page).toBe(1);
    expect(state.filters.sort).toBe("title_asc");
    expect(state.filters.view).toBe("table");
    expect(state.optimistic.pendingOperations).toEqual({});
    expect(state.ui.toasts).toEqual([]);
    expect(state.wizard.currentStep).toBe(1);
  });

  it("handles filter actions properly", () => {
    const store = makeStore();

    store.dispatch(setPage(4));
    store.dispatch(setSearch("laptop"));
    expect(store.getState().filters.search).toBe("laptop");
    expect(store.getState().filters.page).toBe(1);

    store.dispatch(setPage(4));
    store.dispatch(setCategory("laptops"));
    expect(store.getState().filters.category).toBe("laptops");
    expect(store.getState().filters.page).toBe(1);

    store.dispatch(setPage(4));
    store.dispatch(setSort("price_desc"));
    expect(store.getState().filters.sort).toBe("price_desc");
    expect(store.getState().filters.page).toBe(1);

    store.dispatch(setPage(3));
    expect(store.getState().filters.page).toBe(3);

    store.dispatch(setView("card"));
    expect(store.getState().filters.view).toBe("card");

    store.dispatch(resetFilters());
    expect(store.getState().filters.search).toBe("");
    expect(store.getState().filters.category).toBe("");
    expect(store.getState().filters.page).toBe(1);

    store.dispatch(filtersHydrated({ search: "phone", page: 2 }));
    expect(store.getState().filters.search).toBe("phone");
    expect(store.getState().filters.page).toBe(2);
  });

  it("handles optimistic slice actions properly", () => {
    const store = makeStore();
    store.dispatch(
      optimisticStarted({
        id: 42,
        type: "delete",
      })
    );
    expect(store.getState().optimistic.pendingOperations[42]).toBeDefined();

    store.dispatch(
      optimisticRolledBack({
        id: 42,
        type: "delete",
        error: "Failed to delete product",
      })
    );
    expect(store.getState().optimistic.pendingOperations[42]).toBeUndefined();
    expect(store.getState().optimistic.failedOperations[42]?.error).toBe(
      "Failed to delete product"
    );

    store.dispatch(clearFailedOperation({ id: 42 }));
    expect(store.getState().optimistic.failedOperations[42]).toBeUndefined();

    store.dispatch(optimisticStarted({ id: 99, type: "update" }));
    store.dispatch(optimisticSettled({ id: 99 }));
    expect(store.getState().optimistic.pendingOperations[99]).toBeUndefined();

    const product = {
      id: 7,
      title: "Phone",
      description: "A phone",
      category: "phones",
      price: 100,
      stock: 4,
    };
    store.dispatch(addProduct(product));
    store.dispatch(deleteProductOptimistic(7));
    expect(store.getState().optimistic.deletedProductIds[7]).toBe(true);
    expect(store.getState().optimistic.products[7]).toBeUndefined();
    store.dispatch(optimisticStarted({ id: 7, type: "delete" }));
    store.dispatch(
      optimisticRolledBack({
        id: 7,
        type: "delete",
        error: "Delete failed",
      })
    );
    expect(store.getState().optimistic.deletedProductIds[7]).toBeUndefined();
    expect(store.getState().optimistic.failedOperations[7]?.error).toBe("Delete failed");
    store.dispatch(addProduct(product));
    expect(store.getState().optimistic.deletedProductIds[7]).toBeUndefined();
    store.dispatch(updateProductOptimistic({ id: 7, title: "Updated phone" }));
    expect(store.getState().optimistic.products[7]?.title).toBe("Updated phone");
    store.dispatch(revertProduct(product));
    expect(store.getState().optimistic.products[7]?.title).toBe("Phone");

    store.dispatch(
      optimisticRolledBack({
        id: 99,
        type: "update",
        error: "Update failed",
        data: { title: "Original phone" },
      })
    );
    expect(store.getState().optimistic.failedOperations[99]?.type).toBe("update");
  });

  it("handles ui slice actions and toast queue limit", () => {
    const store = makeStore();

    store.dispatch(setFilterDrawerOpen(true));
    expect(store.getState().ui.isFilterDrawerOpen).toBe(true);

    store.dispatch(setSelectedProductId(15));
    expect(store.getState().ui.selectedProductId).toBe(15);

    // Add up to 4 toasts to verify max 3 queue behavior
    store.dispatch(addToast({ id: "t1", type: "info", message: "Toast 1" }));
    store.dispatch(addToast({ id: "t2", type: "success", message: "Toast 2" }));
    store.dispatch(addToast({ id: "t3", type: "error", message: "Toast 3" }));
    expect(store.getState().ui.toasts).toHaveLength(3);

    store.dispatch(addToast({ type: "info", message: "Toast 4" }));
    expect(store.getState().ui.toasts).toHaveLength(3);
    expect(store.getState().ui.toasts.map((t) => t.message)).toEqual([
      "Toast 2",
      "Toast 3",
      "Toast 4",
    ]);

    store.dispatch(removeToast("t2"));
    expect(store.getState().ui.toasts).toHaveLength(2);
  });

  it("handles wizard slice actions properly", () => {
    const store = makeStore();

    store.dispatch(setCurrentStep(3));
    expect(store.getState().wizard.currentStep).toBe(3);

    store.dispatch(updateFormData({ title: "New Phone", price: 999 }));
    store.dispatch(updateFormData({ title: "Updated Phone" }));
    expect(store.getState().wizard.formData).toEqual({
      title: "Updated Phone",
      price: 999,
    });

    store.dispatch(setHasSavedDraft(true));
    expect(store.getState().wizard.hasSavedDraft).toBe(true);

    store.dispatch(resetWizard());
    expect(store.getState().wizard.currentStep).toBe(1);
    expect(store.getState().wizard.formData).toEqual({});
    expect(store.getState().wizard.hasSavedDraft).toBe(false);
  });
});
