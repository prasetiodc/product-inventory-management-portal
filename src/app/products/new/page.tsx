"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Button, Modal } from "@/components/ui"
import StoreProvider from "@/store/StoreProvider"
import Step1Form from "./Step1Form"
import Step2Form from "./Step2Form"
import Step3Form from "./Step3Form"
import Step4Review from "./Step4Review"
import { clearWizardDraft, getWizardDraftSnapshot, parseWizardDraft, saveWizardDraft, subscribeToWizardDraft } from "@/features/wizard/draft"
import { resetWizard, setCurrentStep, setHasSavedDraft, updateFormData } from "@/features/wizard/wizardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

function WizardSteps() {
  const dispatch = useAppDispatch()
  const step = useAppSelector((state) => state.wizard.currentStep)
  const formData = useAppSelector((state) => state.wizard.formData)
  const draftSnapshot = useSyncExternalStore(
    subscribeToWizardDraft,
    getWizardDraftSnapshot,
    () => null
  )
  const draft = parseWizardDraft(draftSnapshot)
  const [hasResolvedDraft, setHasResolvedDraft] = useState(false)
  const hasActiveFormData = Object.keys(formData).length > 0
  const isPromptOpen = Boolean(draft) && !hasResolvedDraft && !hasActiveFormData

  useEffect(() => {
    if (!hasResolvedDraft && hasActiveFormData) {
      dispatch(setHasSavedDraft(true))
    }
  }, [dispatch, hasActiveFormData, hasResolvedDraft])

  useEffect(() => {
    if (isPromptOpen || Object.keys(formData).length === 0) return
    saveWizardDraft(step, formData)
  }, [formData, isPromptOpen, step])

  const dismissDraftPrompt = () => {
    setHasResolvedDraft(true)
    dispatch(setHasSavedDraft(true))
  }

  const resumeDraft = () => {
    if (!draft) return
    dispatch(updateFormData(draft.formData))
    dispatch(setCurrentStep(draft.currentStep))
    dispatch(setHasSavedDraft(true))
    setHasResolvedDraft(true)
  }

  const discardDraft = () => {
    clearWizardDraft()
    dispatch(resetWizard())
    dispatch(setHasSavedDraft(true))
    setHasResolvedDraft(true)
  }

  return (
    <>
      {isPromptOpen && draft ? (
        <Modal
          isOpen
          onClose={dismissDraftPrompt}
          title="Resume saved product draft?"
          description="Draft produk tersimpan ditemukan. Lanjutkan dari step terakhir atau mulai ulang."
          footer={
            <>
              <Button variant="outline" onClick={discardDraft}>Discard</Button>
              <Button variant="primary" onClick={resumeDraft}>Resume</Button>
            </>
          }
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Draft terakhir berada di Step {draft.currentStep}.
          </p>
        </Modal>
      ) : (
        <>
          {step === 1 && <Step1Form />}
          {step === 2 && <Step2Form />}
          {step === 3 && <Step3Form />}
          {step === 4 && <Step4Review />}
        </>
      )}
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
