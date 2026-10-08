import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, it, vi } from "vitest";
import { server } from "@/test/server";
import Page from "./page";

it("submits a product through all wizard steps using the DummyJSON endpoint", async () => {
  const submitted = vi.fn();
  const user = userEvent.setup();
  server.use(
    http.post("https://dummyjson.com/products/add", async ({ request }) => {
      const body = await request.json() as Record<string, unknown>;
      submitted(new URL(request.url).pathname, body);
      return HttpResponse.json({ ...body, id: 201 });
    })
  );

  render(<Page />);

  await user.type(await screen.findByLabelText("Judul Produk"), "Test product");
  await user.type(screen.getByLabelText("Merek"), "Test brand");
  await user.selectOptions(screen.getByLabelText("Kategori"), "Smartphones");
  await user.type(
    screen.getByLabelText("Deskripsi"),
    "A product description with enough characters."
  );
  await user.click(screen.getByRole("button", { name: "Lanjut ke Langkah 2" }));

  await user.type(await screen.findByLabelText("Base Price"), "29.5");
  await user.type(screen.getByLabelText("Stock Quantity"), "4");
  await user.click(screen.getByRole("button", { name: "Lanjut ke Langkah 3" }));

  await user.type(await screen.findByLabelText("Weight (kg)"), "1.5");
  await user.type(screen.getByLabelText("Width"), "10");
  await user.type(screen.getByLabelText("Height"), "20");
  await user.type(screen.getByLabelText("Depth"), "5");
  await user.click(screen.getByRole("button", { name: "Lanjut ke Review" }));

  await user.click(
    await screen.findByRole("button", { name: "Submit Product" })
  );

  expect(await screen.findByRole("status")).toHaveTextContent(
    "Product submitted successfully (ID 201)"
  );
  expect(submitted).toHaveBeenCalledOnce();
  expect(submitted).toHaveBeenCalledWith(
    "/products/add",
    expect.objectContaining({
      title: "Test product",
      brand: "Test brand",
      category: "Smartphones",
      price: 29.5,
      stock: 4,
      weight: 1.5,
      dimensions: { width: 10, height: 20, depth: 5 },
      isFragile: false,
    })
  );
});
