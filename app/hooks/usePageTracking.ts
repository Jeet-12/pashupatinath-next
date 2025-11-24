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
    
    const tokenSources = [
      localStorage.getItem('auth_token'),
      localStorage.getItem('token'),
      sessionStorage.getItem('auth_token'),
      sessionStorage.getItem('token'),
      localStorage.getItem('session_token'),
      sessionStorage.getItem('session_token'),
    ];
    
    return tokenSources.find(token => token !== null) || null;
  }, []);

  const sendTrackingData = useCallback(async (timeSpent: number) => {
    if (hasSentDataRef.current) return;

    // Get the complete full URL including domain, path, and query parameters
    const fullUrl = window.location.href;

    const trackingData: TrackingData = {
      url: fullUrl,
      timeSpent,
      pageTitle: document.title,
    };

    try {
      const authToken = getAuthToken();
      
      // Use the full API URL
      const apiUrl = 'https://pashupatinathrudraksh.com/api/track-page-public';
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      console.log('📊 Sending tracking data:', {
        url: fullUrl,
        timeSpent,
        hasToken: !!authToken
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(trackingData),
        credentials: 'include'
      });

      if (response.ok) {
        hasSentDataRef.current = true;
        const result = await response.json();
        console.log(`📊 Page tracked successfully as ${result.user_type || 'guest'} user`);
      } else {
        console.warn('⚠️ Page tracking request failed:', response.status, response.statusText);
        try {
          const errorText = await response.text();
          console.warn('Error response:', errorText);
        } catch (e) {
          console.warn('Could not read error response');
        }
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
    // Use the complete full URL including domain
    const fullUrl = window.location.href;
    
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