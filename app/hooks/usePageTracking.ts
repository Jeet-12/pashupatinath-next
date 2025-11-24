
"use client";

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TrackingData {
  url: string;
  timeSpent: number;
  pageTitle?: string;
}

export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const startTimeRef = useRef<number>(Date.now());
  const hasSentDataRef = useRef<boolean>(false);
  const currentUrlRef = useRef<string>('');

  const getAuthToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Try multiple possible token storage locations (same as your other API calls)
    const tokenSources = [
      localStorage.getItem('auth_token'),
      localStorage.getItem('token'),
      sessionStorage.getItem('auth_token'),
      sessionStorage.getItem('token'),
      // Also check for session_token which might be used in your app
      localStorage.getItem('session_token'),
      sessionStorage.getItem('session_token'),
    ];
    
    return tokenSources.find(token => token !== null) || null;
  }, []);

  const sendTrackingData = useCallback(async (timeSpent: number) => {
    if (hasSentDataRef.current) return;

    const trackingData: TrackingData = {
      url: currentUrlRef.current,
      timeSpent,
      pageTitle: document.title,
    };

    try {
      const authToken = getAuthToken();
      
      // Always use the same endpoint - the controller will handle authentication
      const endpoint = '/api/track-page-public';
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // If user has auth token, include it in the request
      // The controller will extract and validate it
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`https://pashupatinathrudraksh.com/api/track-page-public`, {
        method: 'POST',
        headers,
        body: JSON.stringify(trackingData),
      });

      if (response.ok) {
        hasSentDataRef.current = true;
        const result = await response.json();
        console.log(`📊 Page tracked as ${result.user_type || 'guest'} user`);
      } else {
        console.warn('⚠️ Page tracking request failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Failed to send page tracking data:', error);
    }
  }, [getAuthToken]);

  const trackTimeSpent = useCallback(() => {
    if (hasSentDataRef.current) return;
    
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Only track if user spent at least 3 seconds on the page
    if (timeSpent >= 3) {
      sendTrackingData(timeSpent);
      hasSentDataRef.current = true;
    }
  }, [sendTrackingData]);

  // Set up event listeners for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackTimeSpent();
      }
    };

    const handleBeforeUnload = () => {
      trackTimeSpent();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      
      // Track time when component unmounts (route change)
      trackTimeSpent();
    };
  }, [trackTimeSpent]);

  // Reset tracking when route changes
  useEffect(() => {
    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // If URL changed, track previous page and reset for new page
    if (currentUrlRef.current && currentUrlRef.current !== fullUrl) {
      trackTimeSpent();
    }

    // Reset for new page
    currentUrlRef.current = fullUrl;
    startTimeRef.current = Date.now();
    hasSentDataRef.current = false;

  }, [pathname, searchParams, trackTimeSpent]);
};