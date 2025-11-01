// libs/performance.ts
export const trackPageLoad = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      console.log('Page load time:', navigation.loadEventEnd - navigation.fetchStart);
    }
  }
};

export const trackApiPerformance = (endpoint: string, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`API ${endpoint} took ${duration}ms`);
  // Send to analytics service
};