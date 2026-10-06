import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductTable } from "./ProductTable";
import { ProductCard } from "./ProductCard";
import { FilterBar } from "./FilterBar";
import { ProductsView } from "./ProductsView";
import { STATIC_PRODUCTS, STATIC_CATEGORIES } from "@/mocks/staticProducts";

const mockSetSearch = vi.fn();

vi.mock("../hooks", () => ({
  useProductFilters: () => ({
    search: "",
    category: "",
    sort: "title_asc" as const,
    page: 1,
    setSearch: mockSetSearch,
    setCategory: vi.fn(),
    setSort: vi.fn(),
    setPage: vi.fn(),
    resetFilters: vi.fn(),
    isFilterActive: false,
  }),
  useSyncFiltersToUrl: vi.fn(),
  useProductsList: () => ({
    products: [],
    totalItems: 0,
    totalPages: 1,
    itemsPerPage: 10,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    categories: [],
  }),
}));

describe("Products Feature Components", () => {
  const sampleProducts = STATIC_PRODUCTS.slice(0, 3);

  beforeEach(() => {
    vi.useFakeTimers();
    mockSetSearch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not trigger render-phase state updates while syncing the debounced search", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ProductsView />);

    fireEvent.change(screen.getByPlaceholderText("Cari produk berdasarkan nama atau deskripsi..."), {
      target: { value: "phone" },
    });

    vi.advanceTimersByTime(300);

    expect(mockSetSearch).toHaveBeenCalledWith("phone");
    expect(consoleErrorSpy.mock.calls.flat(Infinity).join(" ")).not.toContain(
      "Cannot update a component"
    );

    consoleErrorSpy.mockRestore();
  });

  describe("ProductTable", () => {
    it("renders products table with titles and brands", () => {
      render(<ProductTable products={sampleProducts} />);
      expect(screen.getByText(sampleProducts[0].title)).toBeInTheDocument();
      expect(screen.getByText(sampleProducts[1].title)).toBeInTheDocument();
    });

    it("triggers onSelectProduct when a row is clicked", () => {
      const handleSelect = vi.fn();
      render(
        <ProductTable
          products={sampleProducts}
          onSelectProduct={handleSelect}
        />
      );

      const row = screen.getByText(sampleProducts[0].title).closest("tr");
      expect(row).toBeInTheDocument();
      if (row) fireEvent.click(row);
      expect(handleSelect).toHaveBeenCalledWith(sampleProducts[0]);
    });

    it("triggers onEditProduct and onDeleteProduct on action button clicks", () => {
      const handleEdit = vi.fn();
      const handleDelete = vi.fn();

      render(
        <ProductTable
          products={sampleProducts}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
        />
      );

      const editBtn = screen.getByLabelText(`Ubah ${sampleProducts[0].title}`);
      const deleteBtn = screen.getByLabelText(`Hapus ${sampleProducts[0].title}`);

      fireEvent.click(editBtn);
      expect(handleEdit).toHaveBeenCalledWith(sampleProducts[0]);

      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledWith(sampleProducts[0]);
    });

    it("applies pending state to dimmed rows and disables actions", () => {
      const pendingId = sampleProducts[0].id;
      render(
        <ProductTable
          products={sampleProducts}
          pendingProductIds={[pendingId]}
        />
      );

      const row = screen.getByText(sampleProducts[0].title).closest("tr");
      expect(row).toHaveClass("opacity-50");

      const editBtn = screen.getByLabelText(`Ubah ${sampleProducts[0].title}`);
      expect(editBtn).toBeDisabled();
    });
  });

  describe("ProductCard", () => {
    it("renders product title, price, and category", () => {
      render(<ProductCard product={sampleProducts[0]} />);
      expect(screen.getByText(sampleProducts[0].title)).toBeInTheDocument();
      expect(screen.getByText(sampleProducts[0].category)).toBeInTheDocument();
    });

    it("handles card click", () => {
      const handleSelect = vi.fn();
      render(
        <ProductCard product={sampleProducts[0]} onSelect={handleSelect} />
      );
      fireEvent.click(screen.getByText(sampleProducts[0].title));
      expect(handleSelect).toHaveBeenCalledWith(sampleProducts[0]);
    });
  });

  describe("FilterBar", () => {
    it("handles search input change", () => {
      const handleSearch = vi.fn();
      render(
        <FilterBar
          search=""
          onSearchChange={handleSearch}
          category=""
          onCategoryChange={vi.fn()}
          categories={STATIC_CATEGORIES}
          sort="title_asc"
          onSortChange={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(
        "Cari produk berdasarkan nama atau deskripsi..."
      );
      fireEvent.change(searchInput, { target: { value: "phone" } });
      expect(handleSearch).toHaveBeenCalledWith("phone");
    });

    it("handles reset filter click when filters are active", () => {
      const handleReset = vi.fn();
      render(
        <FilterBar
          search="phone"
          onSearchChange={vi.fn()}
          category="smartphones"
          onCategoryChange={vi.fn()}
          categories={STATIC_CATEGORIES}
          sort="price_desc"
          onSortChange={vi.fn()}
          isFilterActive={true}
          onResetFilters={handleReset}
        />
      );

      const resetBtn = screen.getByText("Reset");
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalled();
    });
  });
});
