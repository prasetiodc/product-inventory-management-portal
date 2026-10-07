// src/pages/products/new.tsx
"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetCategoriesQuery } from "@/services/productsApi";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateFormData, setCurrentStep } from "@/features/wizard/wizardSlice";
import { step1Schema } from "./validation/schema";

interface Step1FormValues {
  title: string;
  brand: string;
  category: string;
  description: string;
}



export default function FormProduct() {
  const dispatch = useAppDispatch();
  const savedData = useAppSelector((state) => state.wizard.formData as Partial<Step1FormValues>);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Step1FormValues>({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      title: "",
      brand: "",
      category: "",
      description: "",
    },
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  // Populate saved draft if exists
  useEffect(() => {
    if (savedData) {
      (Object.keys(savedData) as (keyof Step1FormValues)[]).forEach((key) => {
        const val = savedData[key];
        if (val !== undefined) {
          setValue(key, val);
        }
      });
    }
  }, [savedData, setValue]);

  const onSubmit: SubmitHandler<Step1FormValues> = (data) => {
    dispatch(updateFormData(data as unknown as Record<string, unknown>));
    dispatch(setCurrentStep(2));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk – Langkah 1</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Judul Produk"
          {...register("title")}
          error={errors.title?.message}
        />
        <Input label="Merek" {...register("brand")} error={errors.brand?.message} />
        <Select
          label="Kategori"
          options={[{ value: "", label: "" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
          {...register("category")}
          disabled={isCategoriesLoading}
          error={errors.category?.message}
        />
        <Textarea
          label="Deskripsi"
          rows={4}
          {...register("description")}
          error={errors.description?.message}
        />
        <Button type="submit" variant="primary">
          Lanjut ke Langkah 2
        </Button>
      </form>
    </div>
  );
}

