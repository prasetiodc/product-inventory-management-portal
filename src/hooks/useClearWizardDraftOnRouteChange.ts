import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { WIZARD_DRAFT_KEY } from '@/features/wizard/draft';

/**
 * Hook that clears the wizard draft stored in localStorage when the user navigates
 * away from the product creation flow (`/products/new`).
 *
 * It runs on the client side and checks the current pathname. If the pathname does
 * not start with `/products/new` and a draft exists, the draft entry is removed.
 */
export function useClearWizardDraftOnRouteChange(): void {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure we are in a browser environment.
    if (typeof window === 'undefined') return;

    // If we are not on the new product page, clear any saved draft.
    const onNewPage = pathname?.startsWith('/products/new');
    if (!onNewPage) {
      try {
        if (window.localStorage.getItem(WIZARD_DRAFT_KEY)) {
          window.localStorage.removeItem(WIZARD_DRAFT_KEY);
        }
      } catch {
        // Silently ignore storage errors (e.g., private mode).
      }
    }
  }, [pathname]);
}
