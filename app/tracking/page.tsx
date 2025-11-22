import { Suspense } from 'react';
import TrackingDetails from './TrackingDetails';
import { Truck } from 'lucide-react';

// A fallback to show while the client component is loading
function TrackingSkeleton() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-4 h-4 bg-gray-200 rounded-full mt-1"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Truck className="mx-auto h-12 w-12 text-amber-600" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-lg text-gray-600">Enter your tracking ID to see the latest updates.</p>
        </div>
        <Suspense fallback={<TrackingSkeleton />}>
          <TrackingDetails />
        </Suspense>
      </div>
    </div>
  );
}