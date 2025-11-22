
"use client";

import { usePageTracking } from "./hooks/usePageTracking";

export default function PageTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePageTracking();
  return <>{children}</>;
}