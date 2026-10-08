"use client";

import { useEffect } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Textarea } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentStep, setHasSavedDraft, updateFormData } from "@/features/wizard/wizardSlice";
import { step3Schema } from "./validation/schema";
import { saveWizardDraft } from "@/features/wizard/draft";
import type { InferType } from "yup";

type Step3FormValues = InferType<typeof step3Schema>;

export default function Step3Form() {
  const dispatch = useAppDispatch();
  const savedData = useAppSelector((state) => state.wizard.formData);
  const {
    register,
    handleSubmit,
    subscribe,
    setValue,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<Step3FormValues>({
    resolver: yupResolver(step3Schema),
    mode: "onTouched",
    defaultValues: {
      isFragile: false,
      hazardousDisclaimer: false,
      shippingNotes: "",
    },
  });

  useEffect(() => {
    const data = savedData as Partial<Step3FormValues>;
    if (data.weight !== undefined) setValue("weight", data.weight);
    if (data.dimensions) setValue("dimensions", data.dimensions);
    if (data.isFragile !== undefined) setValue("isFragile", data.isFragile);
    if (data.hazardousDisclaimer !== undefined) {
      setValue("hazardousDisclaimer", data.hazardousDisclaimer);
    }
    if (data.shippingNotes !== undefined) setValue("shippingNotes", data.shippingNotes);
  }, [savedData, setValue]);

  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          dispatch(setHasSavedDraft(true));
          saveWizardDraft(3, values as unknown as Record<string, unknown>);
        },
      }),
    [dispatch, subscribe]
  );

  const isFragile = useWatch({ control, name: "isFragile", defaultValue: false });
  const fragileRegistration = register("isFragile");

  const onSubmit: SubmitHandler<Step3FormValues> = (data) => {
    dispatch(
      updateFormData({
        ...data,
        hazardousDisclaimer: data.isFragile ? data.hazardousDisclaimer : false,
        shippingNotes: data.isFragile ? data.shippingNotes : "",
      })
    );
    dispatch(setCurrentStep(4));
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Tambah Produk – Langkah 3</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Weight (kg)"
          type="number"
          min="0"
          step="any"
          {...register("weight", { valueAsNumber: true })}
          error={errors.weight?.message}
        />

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Dimensions (cm)
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="Width"
              type="number"
              min="0"
              step="any"
              {...register("dimensions.width", { valueAsNumber: true })}
              error={errors.dimensions?.width?.message}
            />
            <Input
              label="Height"
              type="number"
              min="0"
              step="any"
              {...register("dimensions.height", { valueAsNumber: true })}
              error={errors.dimensions?.height?.message}
            />
            <Input
              label="Depth"
              type="number"
              min="0"
              step="any"
              {...register("dimensions.depth", { valueAsNumber: true })}
              error={errors.dimensions?.depth?.message}
            />
          </div>
        </fieldset>

        <label className="flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            {...fragileRegistration}
            onChange={(event) => {
              fragileRegistration.onChange(event);
              if (!event.target.checked) {
                setValue("hazardousDisclaimer", false, { shouldDirty: true });
                setValue("shippingNotes", "", { shouldDirty: true });
                clearErrors(["hazardousDisclaimer", "shippingNotes"]);
              }
            }}
          />
          Requires Special Fragile Handling
        </label>

        {isFragile && (
          <div className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <div>
              <label className="flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  {...register("hazardousDisclaimer")}
                />
                I acknowledge the hazardous material disclaimer
              </label>
              {errors.hazardousDisclaimer?.message && (
                <p role="alert" className="mt-1 text-xs text-red-600">
                  {errors.hazardousDisclaimer.message}
                </p>
              )}
            </div>

            <Textarea
              label="Special Shipping Notes"
              rows={4}
              {...register("shippingNotes")}
              error={errors.shippingNotes?.message}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => dispatch(setCurrentStep(2))}
          >
            Kembali ke Langkah 2
          </Button>
          <Button type="submit" variant="primary">
            Lanjut ke Review
          </Button>
        </div>
      </form>
    </div>
  );
}