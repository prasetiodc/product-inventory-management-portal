// src/app/products/new/page.tsx
"use client";
"use client"

import StoreProvider from "@/store/StoreProvider"
import Step1Form from "./Step1Form"
import Step2Form from "./Step2Form"
import Step3Form from "./Step3Form"
import { useAppSelector } from "@/store/hooks"

function WizardSteps() {
  const step = useAppSelector((state) => state.wizard.currentStep)
  return (
    <>
      {step === 1 && <Step1Form />}
      {step === 2 && <Step2Form />}
      {step === 3 && <Step3Form />}
    </>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <WizardSteps />
    </StoreProvider>
  );
}
