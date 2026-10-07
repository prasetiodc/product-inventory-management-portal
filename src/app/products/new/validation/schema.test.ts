import { describe, expect, it } from "vitest";
import { step2Schema, step3Schema } from "./schema";

describe("step2Schema SKU validation", () => {
  it("reports a normalized duplicate on the later SKU field", async () => {
    const values = {
      basePrice: 10,
      stockQuantity: 2,
      variations: [
        {
          color: "red",
          size: "S",
          skuCode: "SKU-ABC-1234",
          extraPrice: 0,
        },
        {
          color: "blue",
          size: "M",
          skuCode: " sku-abc-1234 ",
          extraPrice: 0,
        },
      ],
    };

    await expect(step2Schema.validate(values, { abortEarly: false })).rejects.toMatchObject({
      inner: expect.arrayContaining([
        expect.objectContaining({
          path: "variations[1].skuCode",
          message: "SKU Code must be unique",
        }),
      ]),
    });
  });

  it("requires stock quantity but accepts zero", async () => {
    const values = { basePrice: 10, variations: [] };

    await expect(
      step2Schema.validate(values, { abortEarly: false })
    ).rejects.toMatchObject({
      inner: expect.arrayContaining([
        expect.objectContaining({ path: "stockQuantity" }),
      ]),
    });

    await expect(
      step2Schema.validate({ ...values, stockQuantity: 0 })
    ).resolves.toMatchObject({ stockQuantity: 0 });
  });
});

describe("step3Schema shipping validation", () => {
  const validShippingDetails = {
    weight: 1.5,
    dimensions: { width: 10, height: 20, depth: 5 },
    isFragile: false,
  };

  it("requires positive weight and dimensions", async () => {
    await expect(
      step3Schema.validate(
        {
          ...validShippingDetails,
          weight: 0,
          dimensions: { width: 10, height: -1, depth: 5 },
        },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      inner: expect.arrayContaining([
        expect.objectContaining({ path: "weight" }),
        expect.objectContaining({ path: "dimensions.height" }),
      ]),
    });
  });

  it("requires the disclaimer and 10-character notes for fragile products", async () => {
    await expect(
      step3Schema.validate(
        {
          ...validShippingDetails,
          isFragile: true,
          hazardousDisclaimer: false,
          shippingNotes: "Handle me",
        },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      inner: expect.arrayContaining([
        expect.objectContaining({ path: "hazardousDisclaimer" }),
        expect.objectContaining({ path: "shippingNotes" }),
      ]),
    });
  });

  it("accepts fragile shipping details with a checked disclaimer and 10-character note", async () => {
    await expect(
      step3Schema.validate({
        ...validShippingDetails,
        isFragile: true,
        hazardousDisclaimer: true,
        shippingNotes: "Fragile 01",
      })
    ).resolves.toMatchObject({
      hazardousDisclaimer: true,
      shippingNotes: "Fragile 01",
    });
  });

  it("does not retain fragile-only fields when fragile handling is off", async () => {
    await expect(
      step3Schema.validate({
        ...validShippingDetails,
        hazardousDisclaimer: true,
        shippingNotes: "Old fragile note",
      })
    ).resolves.not.toHaveProperty("hazardousDisclaimer");
  });
});