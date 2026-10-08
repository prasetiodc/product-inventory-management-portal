"use client";

import { useClearWizardDraftOnRouteChange } from "@/hooks/useClearWizardDraftOnRouteChange";

export default function RouteChangeEffects() {
  useClearWizardDraftOnRouteChange();
  return null;
}