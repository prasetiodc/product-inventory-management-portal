"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useAddProductMutation } from "@/services/productsApi";
import type { Product } from "@/types";
import { Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentStep } from "@/features/wizard/wizardSlice";
import { clearWizardDraft } from "@/features/wizard/draft";

interface ReviewData {
  title?: string;
  brand?: string;
  category?: string;
  description?: string;
  basePrice?: number;
  stockQuantity?: number;
  discountPercentage?: number | null;
  variations?: {
    color: string;
    size: string;
    skuCode: string;
    extraPrice?: number | null;
  }[];
  weight?: number;
  dimensions?: { width?: number; height?: number; depth?: number };
  isFragile?: boolean;
  hazardousDisclaimer?: boolean;
  shippingNotes?: string;
}

interface ReviewSectionProps {
  title: string;
  step: number;
  rows: { label: string; value: ReactNode }[];
  onEdit: (step: number) => void;
}

function ReviewSection({ title, step, rows, onEdit }: ReviewSectionProps) {
  return (
    <section className="border-b border-zinc-200 py-5 last:border-b-0 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(step)}
          aria-label={`Edit ${title}`}
        >
          Edit
        </Button>
      </div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">{row.label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap wrap-break-word text-sm text-zinc-900 dark:text-zinc-100">
              {row.value ?? "-"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function Step4Review() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.wizard.formData) as ReviewData;
  const [addProductMutation, { isLoading }] = useAddProductMutation();
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionFailed, setSubmissionFailed] = useState(false);
  const variations = data.variations ?? [];

  const editStep = (step: number) => dispatch(setCurrentStep(step));

  const submitProduct = async () => {
    setSubmissionMessage("");
    setSubmissionFailed(false);

    if (typeof addProductMutation !== "function") {
      setSubmissionFailed(true);
      setSubmissionMessage("Product submission is temporarily unavailable. Please refresh the page and try again.");
      return;
    }

    try {
      const createdProduct = await addProductMutation({
        title: data.title ?? "",
        brand: data.brand ?? "",
        category: data.category ?? "",
        description: data.description ?? "",
        price: data.basePrice ?? 0,
        stock: data.stockQuantity ?? 0,
        discountPercentage: data.discountPercentage ?? undefined,
        variations: variations.map((variation) => ({
          ...variation,
          extraPrice: variation.extraPrice ?? 0,
        })),
        weight: data.weight,
        dimensions: data.dimensions as Product["dimensions"],
        isFragile: data.isFragile ?? false,
        hazardousDisclaimer: data.isFragile ? data.hazardousDisclaimer : undefined,
        shippingNotes: data.isFragile ? data.shippingNotes : undefined,
        isLocal: true,
      }).unwrap();

      clearWizardDraft();
      setSubmissionMessage(
        `Product submitted successfully (ID ${createdProduct.id}). DummyJSON simulates creation and does not save it permanently.`
      );
    } catch (error) {
      console.error(error);
      setSubmissionFailed(true);
      setSubmissionMessage("Product submission failed. Your draft is still saved; try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Review Produk
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Periksa informasi yang sudah dimasukkan. Gunakan Edit untuk kembali ke bagian terkait.
      </p>

      <div className="mt-5">
        <ReviewSection
          title="Basic Product Information"
          step={1}
          onEdit={editStep}
          rows={[
            { label: "Product Title", value: data.title },
            { label: "Brand", value: data.brand },
            { label: "Category", value: data.category },
            { label: "Description", value: data.description },
          ]}
        />
        <ReviewSection
          title="Pricing, Stock & Variations"
          step={2}
          onEdit={editStep}
          rows={[
            { label: "Base Price", value: data.basePrice },
            { label: "Stock Quantity", value: data.stockQuantity },
            { label: "Discount Percentage", value: data.discountPercentage },
            {
              label: "Variations",
              value: variations.length
                ? variations.map((variation) =>
                    `${variation.color} / ${variation.size} — ${variation.skuCode}`
                  ).join("\n")
                : "No variations",
            },
          ]}
        />
        <ReviewSection
          title="Shipping & Supplier Details"
          step={3}
          onEdit={editStep}
          rows={[
            { label: "Weight (kg)", value: data.weight },
            {
              label: "Dimensions (W × H × D)",
              value: data.dimensions
                ? `${data.dimensions.width ?? "-"} × ${data.dimensions.height ?? "-"} × ${data.dimensions.depth ?? "-"} cm`
                : undefined,
            },
            { label: "Fragile Handling", value: data.isFragile ? "Required" : "Not required" },
            ...(data.isFragile
              ? [
                  { label: "Hazardous Disclaimer", value: data.hazardousDisclaimer ? "Acknowledged" : "Not acknowledged" },
                  { label: "Special Shipping Notes", value: data.shippingNotes },
                ]
              : []),
          ]}
        />
      </div>

      {submissionMessage && (
        <p
          role={submissionFailed ? "alert" : "status"}
          className={`mt-5 text-sm ${submissionFailed ? "text-red-600" : "text-emerald-700 dark:text-emerald-400"}`}
        >
          {submissionMessage}
        </p>
      )}

      {!submissionFailed && submissionMessage ? null : (
        <Button
          type="button"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={submitProduct}
          className="mt-5"
        >
          Submit Product
        </Button>
      )}
    </div>
  );
}
