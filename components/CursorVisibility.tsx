"use client";

import { createContext, useContext, useState } from "react";

type CursorVisibilityValue = {
  suppressed: boolean;
  setSuppressed: (value: boolean) => void;
};

const CursorVisibilityContext = createContext<CursorVisibilityValue | null>(
  null,
);

export function CursorVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [suppressed, setSuppressed] = useState(false);
  return (
    <CursorVisibilityContext.Provider value={{ suppressed, setSuppressed }}>
      {children}
    </CursorVisibilityContext.Provider>
  );
}

export function useCursorVisibility() {
  const ctx = useContext(CursorVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useCursorVisibility must be used within CursorVisibilityProvider",
    );
  }
  return ctx;
}
