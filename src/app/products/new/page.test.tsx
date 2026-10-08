import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "./page";
import { WIZARD_DRAFT_KEY } from "@/features/wizard/draft";

describe("product wizard draft resume", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("asks before restoring a saved draft and resumes at its saved step", async () => {
    localStorage.setItem(
      WIZARD_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        currentStep: 4,
        formData: { title: "Saved product", stockQuantity: 0 },
      })
    );

    render(<Page />);

    expect(
      await screen.findByRole("heading", { name: "Resume saved product draft?" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Resume" }));

    expect(
      await screen.findByRole("heading", { name: "Review Produk" })
    ).toBeInTheDocument();
    expect(screen.getByText("Saved product")).toBeInTheDocument();
  });

  it("closes the resume dialog without discarding the saved draft", async () => {
    localStorage.setItem(
      WIZARD_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        currentStep: 2,
        formData: { title: "Will stay saved" },
      })
    );

    render(<Page />);

    expect(
      await screen.findByRole("heading", { name: "Resume saved product draft?" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));

    expect(
      screen.queryByRole("heading", { name: "Resume saved product draft?" })
    ).not.toBeInTheDocument();
    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toContain("Will stay saved");
  });

  it("does not reopen the resume dialog after the user moves to the next step", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      WIZARD_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        currentStep: 1,
        formData: { title: "Old draft" },
      })
    );

    render(<Page />);

    expect(
      await screen.findByRole("heading", { name: "Resume saved product draft?" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Discard" }));
    await user.type(screen.getByLabelText("Judul Produk"), "New title");
    await user.type(screen.getByLabelText("Merek"), "New brand");
    await user.selectOptions(screen.getByLabelText("Kategori"), "Smartphones");
    await user.type(
      screen.getByLabelText("Deskripsi"),
      "This is a valid product description for the draft flow."
    );
    await user.click(screen.getByRole("button", { name: "Lanjut ke Langkah 2" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Resume saved product draft?" })
      ).not.toBeInTheDocument();
    });
    expect(
      await screen.findByRole("heading", { name: "Tambah Produk – Langkah 2" })
    ).toBeInTheDocument();
  });

  it("keeps the draft when the create-product page unmounts", () => {
    localStorage.setItem(
      WIZARD_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        currentStep: 2,
        formData: { title: "Will be cleared" },
      })
    );

    const { unmount } = render(<Page />);

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).not.toBeNull();

    unmount();

    expect(localStorage.getItem(WIZARD_DRAFT_KEY)).toContain("Will be cleared");
  });
});
