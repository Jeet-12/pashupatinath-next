"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const useVisitorTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const trackVisitor = async () => {
      if (hasTrackedRef.current) return;
      if (process.env.NODE_ENV === 'development') return; // Optional: disable in dev

      try {
        const fullUrl = `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        const response = await fetch(`https://www.pashupatinathrudraksh.com/api/visitors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal,
          body: JSON.stringify({
            page_url: fullUrl,
            site: 'Pashupatinath Rudraksha',
          }),
        });

        if (response.ok) {
          hasTrackedRef.current = true;
        } else {
          console.error(`❌ Visitor tracking failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Failed to track visitor:', error);
      }
    };

    trackVisitor();

    // Reset tracking when route changes
    return () => {
      abortController.abort();
    };
  }, [pathname, searchParams]);
};