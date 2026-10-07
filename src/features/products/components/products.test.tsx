import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductTable } from "./ProductTable";
import { ProductCard } from "./ProductCard";
import { FilterBar } from "./FilterBar";
import { ProductsView } from "./ProductsView";
import EditProductModal from "./EditProductModal";
import { STATIC_PRODUCTS, STATIC_CATEGORIES } from "@/mocks/staticProducts";

const mockSetSearch = vi.fn();
const mockUpdateProduct = vi.fn();

vi.mock("../hooks", () => ({
  useProductFilters: () => ({
    search: "",
    category: "",
    sort: "title_asc" as const,
    page: 1,
    view: "table" as const,
    setSearch: mockSetSearch,
    setCategory: vi.fn(),
    setSort: vi.fn(),
    setPage: vi.fn(),
    setView: vi.fn(),
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
  useDeleteProductOptimistic: () => ({
    deleteProduct: vi.fn(),
    ToastEl: null,
  }),
  useUpdateProductOptimistic: () => ({
    updateProduct: mockUpdateProduct,
    ToastEl: null,
  }),
}));

describe("Products Feature Components", () => {
  const sampleProducts = STATIC_PRODUCTS.slice(0, 3);

  beforeEach(() => {
    vi.useFakeTimers();
    mockSetSearch.mockClear();
    mockUpdateProduct.mockClear();
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

  it("submits original and edited product values from the edit modal", () => {
    const product = sampleProducts[0];
    const setEditingProduct = vi.fn();

    render(
      <EditProductModal
        editingProduct={product}
        setEditingProduct={setEditingProduct}
        editForm={{ title: "Updated product", price: 321, stock: 7 }}
        setEditForm={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(mockUpdateProduct).toHaveBeenCalledWith(product, {
      ...product,
      title: "Updated product",
      price: 321,
      stock: 7,
    });
    expect(setEditingProduct).toHaveBeenCalledWith(null);
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
          view="table"
          onViewChange={vi.fn()}
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
          view="table"
          onViewChange={vi.fn()}
          isFilterActive={true}
          onResetFilters={handleReset}
        />
      );

      const resetBtn = screen.getByText("Reset");
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalled();
    });

    it("changes the selected product layout", () => {
      const handleViewChange = vi.fn();
      render(
        <FilterBar
          search=""
          onSearchChange={vi.fn()}
          category=""
          onCategoryChange={vi.fn()}
          categories={STATIC_CATEGORIES}
          sort="title_asc"
          onSortChange={vi.fn()}
          view="table"
          onViewChange={handleViewChange}
        />
      );

      expect(screen.getByRole("button", { name: "Tampilan tabel" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
      fireEvent.click(screen.getByRole("button", { name: "Tampilan kartu" }));
      expect(handleViewChange).toHaveBeenCalledWith("card");
    });
  });
});
