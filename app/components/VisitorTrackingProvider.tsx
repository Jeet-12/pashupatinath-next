// components/VisitorTrackingProvider.tsx
"use client";

import { useVisitorTracking } from "../hooks/useVisitorTracking";

export default function VisitorTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // This silently tracks visitors without any UI
  useVisitorTracking();

  return <>{children}</>;
}