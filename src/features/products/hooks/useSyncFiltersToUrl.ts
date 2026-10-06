"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { parseFilters, serializeFilters } from "@/lib/url/filtersUrl";
import { useProductFilters } from "./useProductFilters";

export function useSyncFiltersToUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, hydrateFilters } = useProductFilters();

  // Keep refs so Effect 1 can read latest values without them as dependencies
  const filtersRef = useRef(filters);
  const hydrateFiltersRef = useRef(hydrateFilters);
  const prevPageRef = useRef(filters.page);
  // Tracks the last URL query string WE set (Redux->URL direction)
  // so Effect 1 does not hydrate Redux back when WE changed the URL
  const lastSetQueryRef = useRef<string | null>(null);

  useEffect(() => {
    filtersRef.current = filters;
    hydrateFiltersRef.current = hydrateFilters;
  }, [filters, hydrateFilters]);

  // Effect 1: URL -> Redux
  // Runs ONLY when searchParams changes (browser Back/Forward or direct URL visit).
  // Must NOT have "filters" as a dep — that would cause it to fire on every user
  // action and undo the change before Effect 2 updates the URL.
  useEffect(() => {
    const currentUrlQuery = searchParams.toString();

    // Skip if WE just set this URL (Redux->URL direction already handled)
    if (currentUrlQuery === lastSetQueryRef.current) return;

    const serializedRedux = serializeFilters(filtersRef.current);

    // Only hydrate if the URL actually differs from current Redux state
    if (currentUrlQuery !== serializedRedux) {
      hydrateFiltersRef.current(parseFilters(searchParams));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Effect 2: Redux -> URL
  // Runs whenever Redux filters change from user actions (setSearch, setCategory, etc.)
  useEffect(() => {
    const targetQuery = serializeFilters(filters);
    const currentUrlQuery = searchParams.toString();

    if (targetQuery === currentUrlQuery) {
      prevPageRef.current = filters.page;
      return;
    }

    // Mark this query as "set by us" so Effect 1 skips it
    lastSetQueryRef.current = targetQuery;

    const targetUrl = targetQuery ? `${pathname}?${targetQuery}` : pathname;

    // Page-only change -> push (preserve browser back for pagination)
    // Everything else -> replace (filter changes should not pollute history)
    const isPageOnlyChange =
      filters.page !== prevPageRef.current &&
      filters.search === parseFilters(searchParams).search &&
      filters.category === parseFilters(searchParams).category &&
      filters.sort === parseFilters(searchParams).sort;

    if (isPageOnlyChange) {
      router.push(targetUrl, { scroll: false });
    } else {
      router.replace(targetUrl, { scroll: false });
    }

    prevPageRef.current = filters.page;
  }, [filters, pathname, router, searchParams]);
}
