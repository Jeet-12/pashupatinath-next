"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Circle, Truck, XCircle } from 'lucide-react';

// This would be your actual API call
const fetchTrackingData = async (trackingId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (trackingId.toUpperCase() === 'PR12345') {
    return {
      success: true,
      data: {
        id: 'PR12345',
        status: 'Out for Delivery',
        updates: [
          { date: '2023-10-28', status: 'Out for Delivery', location: 'Bangalore, IN' },
          { date: '2023-10-27', status: 'Arrived at Hub', location: 'Bangalore, IN' },
          { date: '2023-10-26', status: 'In Transit', location: 'Nagpur, IN' },
          { date: '2023-10-25', status: 'Shipped', location: 'Raipur, IN' },
        ],
        estimatedDelivery: '2023-10-28',
      }
    };
  }
  return { success: false, message: 'Tracking ID not found.' };
};

export default function TrackingDetails() {
  const searchParams = useSearchParams();
  const trackingId = searchParams.get('id');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trackingId) {
      setIsLoading(true);
      setError('');
      fetchTrackingData(trackingId)
        .then(result => {
          if (result.success) {
            setTrackingData(result.data);
          } else {
            setError(result.message || 'Failed to fetch tracking data.');
          }
        })
        .catch(() => setError('An error occurred.'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [trackingId]);

  if (!trackingId) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Tracking ID Provided</h3>
        <p className="mt-1 text-sm text-gray-500">Please provide a tracking ID in the URL. Example: /tracking?id=PR12345</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for tracking ID: <strong>{trackingId}</strong></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-red-900">Error</h3>
        <p className="mt-1 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (trackingData) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tracking ID: {trackingData.id}</h2>
        <p className="text-lg font-semibold text-green-600 mb-6 flex items-center">
          <Truck className="mr-2" /> Status: {trackingData.status}
        </p>
        <ul className="space-y-4 border-l-2 border-gray-200 ml-2 pl-6">
          {trackingData.updates.map((update: any, index: number) => (
            <li key={index} className="relative">
              <div className="absolute -left-[34px] top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
              <p className="font-semibold text-gray-800">{update.status}</p>
              <p className="text-sm text-gray-500">{update.location}</p>
              <p className="text-xs text-gray-400">{update.date}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}