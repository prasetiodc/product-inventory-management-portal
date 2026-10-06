"use client";

import { useState, ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, RootState } from "./store";

interface StoreProviderProps {
  children: ReactNode;
  preloadedState?: Partial<RootState>;
}

export default function StoreProvider({
  children,
  preloadedState,
}: StoreProviderProps) {
  const [store] = useState(() => makeStore(preloadedState));

  return <Provider store={store}>{children}</Provider>;
}
