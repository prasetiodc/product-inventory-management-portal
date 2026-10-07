// src/app/products/new/Step2Form.tsx
"use client"

import React from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { step2Schema } from "./validation/schema"
import { Button, Input } from "@/components/ui"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateFormData, setCurrentStep } from "@/features/wizard/wizardSlice"

interface Step2FormValues {
  basePrice: number
  stockQuantity: number
  discountPercentage?: number | null
  variations?: {
    color: string
    size: string
    skuCode: string
    extraPrice?: number | null
  }[]
}

export default function Step2Form() {
  const dispatch = useAppDispatch()
  const savedData = useAppSelector((state) =>
    state.wizard.formData as Partial<Step2FormValues>
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(step2Schema),
    mode: "onTouched",
    defaultValues: {
      discountPercentage: null,
      variations: [],
    },
  })

  // Restore draft if exists
  React.useEffect(() => {
    if (savedData) {
      ;(Object.keys(savedData) as (keyof Step2FormValues)[]).forEach((key) => {
        const val = savedData[key]
        if (val !== undefined) {
          setValue(key, val as Step2FormValues[keyof Step2FormValues])
        }
      })
    }
  }, [savedData, setValue])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  })

  const onSubmit: SubmitHandler<Step2FormValues> = (data) => {
    dispatch(updateFormData(data as unknown as Record<string, unknown>))
    dispatch(setCurrentStep(3)) // proceed to next step
  }

  const addVariation = () => {
    append({ color: "", size: "", skuCode: "", extraPrice: null })
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk – Langkah 2</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Base Price"
          type="number"
          step="0.1"
          {...register("basePrice")}
          error={errors.basePrice?.message}
        />
        <Input
          label="Stock Quantity"
          type="number"
          {...register("stockQuantity")}
          error={errors.stockQuantity?.message}
        />
        <Input
          label="Discount Percentage"
          type="number"
          {...register("discountPercentage")}
          error={errors.discountPercentage?.message}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Variations</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mb-2">
              <Input
                label="Color"
                {...register(`variations.${index}.color` as const)}
                error={errors?.variations?.[index]?.color?.message}
              />
              <Input
                label="Size"
                {...register(`variations.${index}.size` as const)}
                error={errors?.variations?.[index]?.size?.message}
              />
              <Input
                label="SKU Code"
                {...register(`variations.${index}.skuCode` as const)}
                error={errors?.variations?.[index]?.skuCode?.message}
              />
              <Input
                label="Extra Price"
                type="number"
                step="0.01"
                {...register(`variations.${index}.extraPrice` as const)}
                error={errors?.variations?.[index]?.extraPrice?.message}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(index)}
                className="mt-2"
              >
                Remove Variation
              </Button>
            </div>
          ))}
          <Button type="button" variant="primary" onClick={addVariation}>
            Add Variation
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => dispatch(setCurrentStep(1))}
          >
            Kembali ke Langkah 1
          </Button>
          <Button type="submit" variant="primary">
            Lanjut ke Langkah 3
          </Button>
        </div>
      </form>
    </div>
  )
}

