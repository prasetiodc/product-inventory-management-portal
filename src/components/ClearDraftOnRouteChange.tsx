"use client";
import { useClearWizardDraftOnRouteChange } from '@/hooks/useClearWizardDraftOnRouteChange';

/**
 * Client‑side component that runs the clear‑draft hook.
 * It renders nothing but ensures the hook is executed on every route change.
 */
export default function ClearDraftOnRouteChange() {
  useClearWizardDraftOnRouteChange();
  return null;
}
