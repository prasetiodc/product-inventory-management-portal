import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Button,
  Input,
  Select,
  Skeleton,
  EmptyState,
  Pagination,
  Drawer,
  Modal,
} from "./index";

describe("Reusable UI Components", () => {
  describe("Button", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Submit</Button>);
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("displays loading spinner and disables button when isLoading is true", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Saving
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Input", () => {
    it("renders label and associates with input", () => {
      render(<Input label="Product Name" placeholder="Enter title" />);
      const input = screen.getByLabelText("Product Name");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "Enter title");
    });

    it("renders error message with alert role and aria-invalid", () => {
      render(<Input label="SKU" error="Invalid SKU format" />);
      const input = screen.getByLabelText("SKU");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid SKU format");
    });

    it("renders helper text when no error is present", () => {
      render(<Input label="Price" helperText="Include tax in USD" />);
      expect(screen.getByText("Include tax in USD")).toBeInTheDocument();
    });
  });

  describe("Select", () => {
    it("renders options correctly and handles change", () => {
      const handleChange = vi.fn();
      const options = [
        { value: "cat-1", label: "Category 1" },
        { value: "cat-2", label: "Category 2" },
      ];
      render(
        <Select label="Category" options={options} onChange={handleChange} />
      );
      const select = screen.getByLabelText("Category");
      expect(select).toBeInTheDocument();

      fireEvent.change(select, { target: { value: "cat-2" } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe("Skeleton", () => {
    it("renders with proper variant class", () => {
      const { container } = render(<Skeleton variant="circular" width={40} height={40} />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveClass("rounded-full");
      expect(el).toHaveClass("animate-pulse");
    });
  });

  describe("EmptyState", () => {
    it("renders title, description and triggers onAction", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="No products found"
          description="Try changing your search terms"
          actionText="Reset filter"
          onAction={handleAction}
        />
      );
      expect(screen.getByText("No products found")).toBeInTheDocument();
      expect(screen.getByText("Try changing your search terms")).toBeInTheDocument();
      const actionBtn = screen.getByRole("button", { name: "Reset filter" });
      fireEvent.click(actionBtn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Pagination", () => {
    it("renders page info and navigation buttons", () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      );
      expect(screen.getByText("Menampilkan", { exact: false })).toBeInTheDocument();
      const prevBtn = screen.getByRole("button", { name: "Halaman sebelumnya" });
      const nextBtn = screen.getByRole("button", { name: "Halaman berikutnya" });

      expect(prevBtn).not.toBeDisabled();
      expect(nextBtn).not.toBeDisabled();

      fireEvent.click(nextBtn);
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it("disables previous button on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={vi.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "Halaman sebelumnya" })).toBeDisabled();
    });
  });

  describe("Drawer", () => {
    it("renders children when open and handles escape key", () => {
      const handleClose = vi.fn();
      const { rerender } = render(
        <Drawer isOpen={false} onClose={handleClose} title="Filter Drawer">
          <p>Drawer content</p>
        </Drawer>
      );
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();

      rerender(
        <Drawer isOpen={true} onClose={handleClose} title="Filter Drawer">
          <p>Drawer content</p>
        </Drawer>
      );
      expect(screen.getByText("Drawer content")).toBeInTheDocument();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Modal", () => {
    it("renders modal dialog and handles close button click", () => {
      const handleClose = vi.fn();
      render(
        <Modal
          isOpen={true}
          onClose={handleClose}
          title="Delete Confirmation"
          description="Are you sure?"
        >
          <p>Modal Body</p>
        </Modal>
      );
      expect(screen.getByText("Delete Confirmation")).toBeInTheDocument();
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
      expect(screen.getByText("Modal Body")).toBeInTheDocument();

      const closeBtn = screen.getByRole("button", { name: "Tutup dialog" });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
