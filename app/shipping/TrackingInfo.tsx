"use client";

import { useSearchParams } from 'next/navigation';

export default function TrackingInfo() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('tracking_id');

  if (!trackingId) {
    return null; // Render nothing if no tracking_id is found
  }

  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
      <p>
        Showing tracking information for order: <span className="font-bold">{trackingId}</span>
      </p>
    </div>
  );
}