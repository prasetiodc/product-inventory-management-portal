// src/app/products/new/validation/step2Schema.ts

import * as yup from "yup";

export const step1Schema = yup.object({
  title: yup.string().trim().required("Judul produk wajib diisi").min(3).max(100),
  brand: yup.string().trim().required("Merek wajib diisi"),
  category: yup.string().required("Kategori wajib dipilih"),
  description: yup.string().trim().required("Deskripsi wajib diisi").min(20, "Minimal 20 karakter"),
});

export const step2Schema = yup.object({
  basePrice: yup
    .number()
    .typeError("Base Price must be a number")
    .required("Base Price is required")
    .positive("Base Price must be greater than 0"),
  stockQuantity: yup
    .number()
    .typeError("Stock Quantity must be an integer")
    .required("Stock Quantity is required")
    .integer("Stock Quantity must be an integer")
    .min(0, "Stock Quantity cannot be negative"),
  discountPercentage: yup
    .number()
    .typeError("Discount must be a number")
    .nullable()
    .transform((value, original) => (original === "" ? null : value))
    .min(0, "Discount cannot be less than 0")
    .max(99, "Discount cannot exceed 99"),
  variations: yup
    .array()
    .of(
      yup.object({
        color: yup.string().required("Color is required"),
        size: yup.string().required("Size is required"),
        skuCode: yup
          .string()
          .trim()
          .required("SKU Code is required")
          .matches(
            /^SKU-[A-Z]{3}-[0-9]{4}$/,
            "SKU Code must follow format SKU-AAA-1234"
          ),
        extraPrice: yup
          .number()
          .typeError("Extra Price must be a number")
          .nullable()
          .transform((value, original) => (original === "" ? null : value))
          .min(0, "Extra Price cannot be negative"),
      })
    )
    .test("unique-sku", function (variations) {
      if (!variations) return true;

      const seen = new Set<string>();
      const duplicateIndex = variations.findIndex((variation) => {
        const sku = variation.skuCode?.trim().toUpperCase();
        if (!sku) return false;
        if (seen.has(sku)) return true;
        seen.add(sku);
        return false;
      });

      return duplicateIndex === -1
        ? true
        : this.createError({
            path: `variations[${duplicateIndex}].skuCode`,
            message: "SKU Code must be unique",
          });
    }),
});

export const step3Schema = yup.object({
  weight: yup
    .number()
    .typeError("Weight must be a number")
    .required("Weight is required")
    .positive("Weight must be greater than 0"),
  dimensions: yup
    .object({
      width: yup
        .number()
        .typeError("Width must be a number")
        .required("Width is required")
        .positive("Width must be greater than 0"),
      height: yup
        .number()
        .typeError("Height must be a number")
        .required("Height is required")
        .positive("Height must be greater than 0"),
      depth: yup
        .number()
        .typeError("Depth must be a number")
        .required("Depth is required")
        .positive("Depth must be greater than 0"),
    })
    .required("Dimensions are required"),
  isFragile: yup.boolean().required(),
  hazardousDisclaimer: yup.boolean().when("isFragile", {
    is: true,
    then: (schema) =>
      schema
        .oneOf([true], "Hazardous material disclaimer is required")
        .required("Hazardous material disclaimer is required"),
    otherwise: (schema) => schema.strip(),
  }),
  shippingNotes: yup.string().when("isFragile", {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .required("Special shipping notes are required")
        .min(10, "Special shipping notes must be at least 10 characters"),
    otherwise: (schema) => schema.strip(),
  }),
});
